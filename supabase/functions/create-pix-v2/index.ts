import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FormularioData {
  tipoDesligamento?: string;
  dataAdmissao?: string;
  dataDesligamento?: string;
  aindaTrabalhando?: boolean;
  salarioFixo?: number;
  mediaVariavel?: number;
  temVariavel?: boolean;
  avisoPrevio?: string;
  feriasVencidas?: string;
  statusPagamento?: string;
  faziaHorasExtras?: string;
  funcoesDiferentes?: string;
  valorPorFora?: string;
  adicionaisTrabalho?: string[];
  erroNaRescisao?: string;
}

interface CreatePixV2Request {
  amount: number;
  email: string;
  formulario?: FormularioData;
  valorBase?: number;
  calculoId?: string;
}

function isValidEmail(email: string): boolean {
  const v = (email || "").trim();
  if (!v || v.length > 254) return false;
  if (/\s/.test(v)) return false;
  const parts = v.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (local.includes("..") || domain.includes("..")) return false;
  if (!domain.includes(".")) return false;
  const basicRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return basicRegex.test(v);
}

function generateUniqueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateRandomCPF(): string {
  const randomDigit = () => Math.floor(Math.random() * 10);
  const digits: number[] = [];
  for (let i = 0; i < 9; i++) {
    digits.push(randomDigit());
  }
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  digits.push(remainder);
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  digits.push(remainder);
  return digits.join("");
}

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 2) {
    const [month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-01`;
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log('[create-pix-v2] Iniciando processamento...');
    
    const { amount, email, formulario, valorBase, calculoId: existingCalculoId } = await req.json() as CreatePixV2Request;

    const emailNormalized = (email || "").trim().toLowerCase();

    if (!amount || !emailNormalized) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: amount, email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(emailNormalized)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido', details: 'Verifique se o email está correto (ex.: sem dois pontos seguidos).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    const userName = emailNormalized;
    const userCPF = generateRandomCPF();
    const randomPhone = String(Math.floor(Math.random() * 900000000) + 100000000);

    console.log(`[create-pix-v2] Validação: ${Date.now() - startTime}ms`);

    const calculoId = existingCalculoId || crypto.randomUUID();
    const codigoUnico = existingCalculoId ? '' : generateUniqueCode();
    const relatorioUrl = `https://rescisaocerta.com.br/relatorio?id=${calculoId}`;

    const orderPayload = {
      items: [
        {
          amount: amount,
          description: "Análise Completa de Rescisão",
          quantity: 1
        }
      ],
      customer: {
        name: userName,
        email: emailNormalized,
        document: userCPF,
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
        relatorio_url: relatorioUrl,
        calculo_id: calculoId,
        email: emailNormalized
      }
    };

    // Start PIX call immediately
    console.log(`[create-pix-v2] Chamando Pagar.me: ${Date.now() - startTime}ms`);
    
    const pixPromise = fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(apiKey + ':')}`
      },
      body: JSON.stringify(orderPayload)
    });

    // Prepare DB operations in parallel with PIX call
    if (existingCalculoId) {
      // Fetch existing calculo's codigo_unico in parallel with PIX
      const [pixResponse, calculoResult] = await Promise.all([
        pixPromise,
        supabase.from('calculos').select('codigo_unico').eq('id', existingCalculoId).single()
      ]);
      
      const existingCodigoUnico = calculoResult.data?.codigo_unico || '';
      
      return await processPixResponse(pixResponse, supabase, existingCalculoId, existingCodigoUnico, emailNormalized, amount, startTime);
    } else {
      // Create new calculo in parallel with PIX
      const insertData: Record<string, unknown> = {
        id: calculoId,
        codigo_unico: codigoUnico,
        nome: userName,
        email: emailNormalized,
        cpf: userCPF,
        valor_base: valorBase || 0,
        status: 'pendente'
      };

      if (formulario) {
        Object.assign(insertData, {
          tipo_desligamento: formulario.tipoDesligamento || null,
          data_admissao: parseDate(formulario.dataAdmissao || ''),
          data_desligamento: parseDate(formulario.dataDesligamento || ''),
          ainda_trabalhando: formulario.aindaTrabalhando || false,
          salario_fixo: formulario.salarioFixo || 0,
          media_variavel: formulario.mediaVariavel || 0,
          tem_variavel: formulario.temVariavel || false,
          aviso_previo: formulario.avisoPrevio || null,
          ferias_vencidas: formulario.feriasVencidas || null,
          status_pagamento: formulario.statusPagamento || null,
          fazia_horas_extras: formulario.faziaHorasExtras || null,
          funcoes_diferentes: formulario.funcoesDiferentes || null,
          valor_por_fora: formulario.valorPorFora || null,
          adicionais_trabalho: formulario.adicionaisTrabalho || [],
          erro_na_rescisao: formulario.erroNaRescisao || null,
        });
      }

      const [pixResponse, calculoInsertResult] = await Promise.all([
        pixPromise,
        supabase.from('calculos').insert(insertData)
      ]);

      if (calculoInsertResult.error) {
        console.error('[create-pix-v2] Erro ao criar cálculo:', calculoInsertResult.error);
        // Continue anyway — PIX was already generated
      }

      return await processPixResponse(pixResponse, supabase, calculoId, codigoUnico, emailNormalized, amount, startTime);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processPixResponse(
  pixResponse: Response, 
  // deno-lint-ignore no-explicit-any
  supabase: any,
  calculoId: string,
  codigoUnico: string,
  email: string,
  amount: number,
  startTime: number,
) {
  const data = await pixResponse.json();

  if (!pixResponse.ok) {
    console.error('Pagar.me error:', data);
    return new Response(
      JSON.stringify({ error: 'Erro ao gerar PIX', details: data }),
      { status: pixResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log(`[create-pix-v2] PIX gerado: ${Date.now() - startTime}ms`);

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
  
  // CRITICAL: Await pedido_pix insert BEFORE returning response
  // Deno edge functions may terminate after response is sent
  if (calculoId) {
    const { error: pixInsertError } = await supabase
      .from('pedidos_pix')
      .insert({
        calculo_id: calculoId,
        order_id_pagarme: data.id,
        charge_id_pagarme: chargeId,
        amount: amount,
        status: 'pending',
        qr_code: qrCodeValue,
        qr_code_url: qrCodeUrlValue,
        expires_at: expiresAt
      });

    if (pixInsertError) {
      console.error('[create-pix-v2] Erro ao inserir pedido_pix:', pixInsertError);
    } else {
      console.log('[create-pix-v2] Pedido PIX inserido');
    }
  }

  // Also update email on existing calculo if needed
  if (calculoId && email) {
    await supabase
      .from('calculos')
      .update({ email })
      .eq('id', calculoId)
      .is('email', null);
  }

  console.log(`[create-pix-v2] Tempo total: ${Date.now() - startTime}ms`);
  
  return new Response(
    JSON.stringify({
      orderId: data.id,
      chargeId: chargeId,
      status: chargeStatus,
      qrCode: qrCodeValue,
      qrCodeUrl: qrCodeUrlValue,
      expiresAt: expiresAt,
      codigoUnico: codigoUnico,
      calculoId: calculoId
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
