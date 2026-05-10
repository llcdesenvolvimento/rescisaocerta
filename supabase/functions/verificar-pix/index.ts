import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Input validation schema
const VerificarPixSchema = z.object({
  chargeId: z.string().min(10).max(100).optional(),
  calculoId: z.string().regex(UUID_REGEX, 'ID de cálculo inválido').optional(),
}).refine(data => data.chargeId || data.calculoId, {
  message: 'chargeId ou calculoId é obrigatório'
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check request size limit (10KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10240) {
      return new Response(
        JSON.stringify({ error: 'Request too large', paid: false }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'JSON inválido', paid: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parseResult = VerificarPixSchema.safeParse(rawInput);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          paid: false,
          details: parseResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { chargeId, calculoId } = parseResult.data;

    const apiKey = Deno.env.get('PAGARME_API_KEY')?.trim();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured', paid: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let chargeIdToCheck = chargeId;

    // If calculoId is provided, get the charge_id from the database
    if (!chargeIdToCheck && calculoId) {
      const { data: pedidoPix, error: pedidoError } = await supabase
        .from('pedidos_pix')
        .select('charge_id_pagarme, status')
        .eq('calculo_id', calculoId)
        .maybeSingle();

      if (pedidoError || !pedidoPix) {
        return new Response(
          JSON.stringify({ error: 'Pedido não encontrado', paid: false }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If already paid in our database, return immediately
      if (pedidoPix.status === 'paid') {
        return new Response(
          JSON.stringify({ 
            paid: true, 
            status: 'paid',
            message: 'Pagamento já confirmado'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      chargeIdToCheck = pedidoPix.charge_id_pagarme;
    }

    if (!chargeIdToCheck) {
      return new Response(
        JSON.stringify({ error: 'charge_id não encontrado', paid: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate chargeId format before API call
    if (chargeIdToCheck.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(chargeIdToCheck)) {
      return new Response(
        JSON.stringify({ error: 'charge_id inválido', paid: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check payment status with Pagar.me
    const response = await fetch(`https://api.pagar.me/core/v5/charges/${encodeURIComponent(chargeIdToCheck)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(apiKey + ':')}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Pagar.me error:', data);
      return new Response(
        JSON.stringify({ error: 'Erro ao verificar pagamento', paid: false }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isPaid = data.status === 'paid';
    
    // If paid, update the database
    if (isPaid) {
      // Update pedido_pix
      const { error: pixUpdateError } = await supabase
        .from('pedidos_pix')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('charge_id_pagarme', chargeIdToCheck);

      if (pixUpdateError) {
        console.error('Error updating pedido_pix:', pixUpdateError);
      }

      // Update calculo status if calculoId was provided
      if (calculoId) {
        const { error: calculoUpdateError } = await supabase
          .from('calculos')
          .update({ status: 'pago' })
          .eq('id', calculoId);

        if (calculoUpdateError) {
          console.error('Error updating calculo:', calculoUpdateError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        paid: isPaid,
        status: data.status,
        chargeId: chargeIdToCheck,
        paidAt: data.paid_at || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', paid: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
