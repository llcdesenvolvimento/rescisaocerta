import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// CPF validation function with checksum verification
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cpf[10]);
}

// Input validation schema
const CreatePixSchema = z.object({
  amount: z.number().int().positive().min(1).max(100000000), // Max R$ 1M in cents
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  document: z.string().transform(val => val.replace(/\D/g, '')).refine(validarCPF, { message: 'CPF inválido' }),
  calculoId: z.string().regex(UUID_REGEX, 'ID de cálculo inválido'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log('[create-pix] Iniciando processamento...');
    
    // Check request size limit (100KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 102400) {
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'JSON inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parseResult = CreatePixSchema.safeParse(rawInput);
    if (!parseResult.success) {
      console.error('[create-pix] Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: parseResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, name, email, document: cleanDocument, calculoId } = parseResult.data;

    // Sanitize strings
    const sanitizedName = name.slice(0, 100);
    const sanitizedEmail = email.toLowerCase().slice(0, 255);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const apiKey = Deno.env.get('PAGARME_API_KEY')?.trim();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[create-pix] Validação: ${Date.now() - startTime}ms`);

    // Generate random phone for Pagar.me requirement
    const randomPhone = String(Math.floor(Math.random() * 900000000) + 100000000);

    const orderPayload = {
      items: [
        {
          amount: amount,
          description: "Análise Completa de Rescisão",
          quantity: 1
        }
      ],
      customer: {
        name: sanitizedName,
        email: sanitizedEmail,
        document: cleanDocument,
        type: "individual",
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: "11",
            number: randomPhone
          }
        }
      },
      payments: [
        {
          payment_method: "pix",
          pix: {
            expires_in: 3600
          }
        }
      ],
      metadata: {
        source: "calculadora-rescisao",
        calculo_id: calculoId
      }
    };

    // Execute calls in parallel: fetch calculo + create PIX
    console.log(`[create-pix] Iniciando chamadas paralelas: ${Date.now() - startTime}ms`);
    
    const [calculoResult, pixResponse] = await Promise.all([
      supabase
        .from('calculos')
        .select('id, codigo_unico, status')
        .eq('id', calculoId)
        .single(),
      fetch('https://api.pagar.me/core/v5/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(apiKey + ':')}`
        },
        body: JSON.stringify(orderPayload)
      })
    ]);

    console.log(`[create-pix] Chamadas paralelas finalizadas: ${Date.now() - startTime}ms`);

    const { data: calculo, error: calculoError } = calculoResult;

    if (calculoError || !calculo) {
      console.error('[create-pix] Cálculo não encontrado:', calculoError);
      return new Response(
        JSON.stringify({ error: 'Cálculo não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already paid
    if (calculo.status === 'pago') {
      return new Response(
        JSON.stringify({ error: 'Este cálculo já foi pago' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update customer data in calculo (non-blocking)
    (async () => {
      try {
        await supabase
          .from('calculos')
          .update({
            nome: sanitizedName,
            email: sanitizedEmail,
            cpf: cleanDocument,
            status: 'pendente'
          })
          .eq('id', calculoId);
        console.log('[create-pix] Cálculo atualizado');
      } catch (err) {
        console.error('[create-pix] Erro ao atualizar cálculo:', err);
      }
    })();

    const data = await pixResponse.json();

    if (!pixResponse.ok) {
      console.error('Pagar.me error:', data);
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar PIX', details: data }),
        { status: pixResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[create-pix] PIX gerado: ${Date.now() - startTime}ms`);

    const charge = data.charges?.[0];
    const pixCharge = charge?.last_transaction;
    const chargeId = charge?.id;
    const expiresAt = pixCharge?.expires_at;
    const qrCodeValue = pixCharge?.qr_code;
    const qrCodeUrlValue = pixCharge?.qr_code_url;
    const chargeStatus = charge?.status || data.status;

    if (chargeStatus === 'failed' || !qrCodeValue || !qrCodeUrlValue) {
      console.error('PIX generation failed:', { chargeStatus, hasQrCode: !!qrCodeValue, hasQrCodeUrl: !!qrCodeUrlValue });
      return new Response(
        JSON.stringify({ 
          error: 'Falha ao gerar PIX', 
          details: 'O provedor de pagamento não conseguiu gerar o QR Code.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert PIX record in background (non-blocking)
    (async () => {
      try {
        await supabase
          .from('pedidos_pix')
          .insert({
            calculo_id: calculo.id,
            order_id_pagarme: data.id,
            charge_id_pagarme: chargeId,
            amount: amount,
            status: 'pending',
            qr_code: qrCodeValue,
            qr_code_url: qrCodeUrlValue,
            expires_at: expiresAt
          });
        console.log('[create-pix] Pedido PIX inserido');
      } catch (err) {
        console.error('[create-pix] Erro ao inserir pedido_pix:', err);
      }
    })();

    console.log(`[create-pix] Tempo total: ${Date.now() - startTime}ms`);
    
    return new Response(
      JSON.stringify({
        orderId: data.id,
        chargeId: chargeId,
        status: chargeStatus,
        qrCode: qrCodeValue,
        qrCodeUrl: qrCodeUrlValue,
        expiresAt: expiresAt,
        codigoUnico: calculo.codigo_unico,
        calculoId: calculo.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
