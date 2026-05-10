import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Validation schemas
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const WebhookPayloadSchema = z.object({
  type: z.string().max(50),
  data: z.object({
    id: z.string().min(1).max(100),
    metadata: z.object({
      calculo_id: z.string().regex(UUID_REGEX, 'Invalid UUID format').optional(),
      codigo_unico: z.string().max(50).optional(),
    }).optional(),
    charges: z.array(z.object({
      id: z.string().max(100).optional(),
    })).optional(),
  }),
});

// HMAC signature verification
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    const signatureData = encoder.encode(body);
    const computedSig = await crypto.subtle.sign('HMAC', key, signatureData);
    const computedSigHex = Array.from(new Uint8Array(computedSig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Pagar.me uses sha1=<signature> format
    const expectedSignature = signature.replace('sha1=', '');
    
    // Constant-time comparison to prevent timing attacks
    if (computedSigHex.length !== expectedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < computedSigHex.length; i++) {
      result |= computedSigHex.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return result === 0;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get raw body for signature verification
    const bodyText = await req.text();
    
    // Check request size limit (100KB)
    if (bodyText.length > 102400) {
      console.error('Request body too large');
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get signature from header
    const signature = req.headers.get('x-hub-signature');
    const webhookSecret = Deno.env.get('PAGARME_WEBHOOK_SECRET')?.trim();
    
    // If webhook secret is configured, verify signature
    if (webhookSecret) {
      if (!signature) {
        console.error('Missing webhook signature');
        return new Response(
          JSON.stringify({ error: 'Unauthorized - Missing signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const isValid = await verifySignature(bodyText, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Unauthorized - Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Webhook signature verified successfully');
    } else {
      console.warn('PAGARME_WEBHOOK_SECRET not configured - signature verification skipped');
    }

    // Parse and validate JSON
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      console.error('Invalid JSON in request body');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate payload structure
    const parseResult = WebhookPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const validatedBody = parseResult.data;
    console.log('Webhook received:', validatedBody.type);

    // Only process order.paid events
    if (validatedBody.type !== 'order.paid') {
      console.log('Ignoring event type:', validatedBody.type);
      return new Response(
        JSON.stringify({ message: 'Event ignored' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderId = validatedBody.data.id;
    const calculoId = validatedBody.data.metadata?.calculo_id;
    const codigoUnico = validatedBody.data.metadata?.codigo_unico;
    const chargeId = validatedBody.data.charges?.[0]?.id;

    if (!orderId) {
      console.error('Missing order ID');
      return new Response(
        JSON.stringify({ error: 'Missing order ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Idempotency check: Verify payment hasn't been processed already
    const { data: existingPayment } = await supabase
      .from('pedidos_pix')
      .select('status')
      .eq('order_id_pagarme', orderId)
      .maybeSingle();

    if (existingPayment?.status === 'paid') {
      console.log('Payment already processed (idempotent):', orderId);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Double-check with Pagar.me API if charge ID is available
    const apiKey = Deno.env.get('PAGARME_API_KEY')?.trim();
    if (apiKey && chargeId) {
      try {
        const verifyResponse = await fetch(`https://api.pagar.me/core/v5/charges/${chargeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(apiKey + ':')}`
          }
        });
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          if (verifyData.status !== 'paid') {
            console.error('Payment status mismatch - webhook says paid but API says:', verifyData.status);
            return new Response(
              JSON.stringify({ error: 'Payment status verification failed' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          console.log('Payment verified with Pagar.me API');
        }
      } catch (verifyError) {
        console.warn('Could not verify with Pagar.me API:', verifyError);
        // Continue processing if API verification fails but signature was valid
      }
    }

    // Update pedido_pix status
    const { error: pixUpdateError } = await supabase
      .from('pedidos_pix')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('order_id_pagarme', orderId);

    if (pixUpdateError) {
      console.error('Error updating pedido_pix:', pixUpdateError);
    }

    // Update calculo status
    if (calculoId) {
      const { error: calculoUpdateError } = await supabase
        .from('calculos')
        .update({ status: 'pago' })
        .eq('id', calculoId);

      if (calculoUpdateError) {
        console.error('Error updating calculo:', calculoUpdateError);
      }
    } else if (codigoUnico) {
      // Fallback: update by codigo_unico
      const { error: calculoUpdateError } = await supabase
        .from('calculos')
        .update({ status: 'pago' })
        .eq('codigo_unico', codigoUnico);

      if (calculoUpdateError) {
        console.error('Error updating calculo by codigo_unico:', calculoUpdateError);
      }
    }

    console.log('Payment processed successfully for order:', orderId);

    return new Response(
      JSON.stringify({ success: true, orderId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
