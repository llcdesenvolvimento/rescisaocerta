/**
 * create-pix — Edge Function que gera um PIX via Pagar.me e persiste a tentativa
 * de pagamento em `public.pagamentos`.
 *
 * Schema novo (2026-05):
 *   - O cálculo (em `public.calculos`) é criado pelo frontend ANTES de chamar
 *     esta function (via INSERT direto). Ela apenas referencia.
 *   - Esta function APENAS gera o PIX e insere uma linha em `public.pagamentos`.
 *
 * Secrets necessários no Supabase:
 *   - PAGARME_API_KEY (sk_xxxxx)
 *   - SUPABASE_URL          (já provisionado pelo Supabase)
 *   - SUPABASE_SERVICE_ROLE_KEY (já provisionado pelo Supabase)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CreatePixRequest {
  /** ID do cálculo na tabela `public.calculos` (UUID) */
  calculoId: string;
  /** ID da sessão do quiz (UUID) — usado pra ligar o pagamento à sessão */
  quizSessionId?: string;
  /** Valor em centavos (ex.: 1690 = R$ 16,90) */
  amount: number;
  /** Email do comprador */
  email: string;
  /** Nome do comprador */
  nome?: string;
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
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v);
}

/** Gera um CPF aleatório válido (algoritmo de dígitos verificadores) */
function generateRandomCPF(): string {
  const randomDigit = () => Math.floor(Math.random() * 10);
  const digits: number[] = [];
  for (let i = 0; i < 9; i++) digits.push(randomDigit());
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  digits.push(remainder);
  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  digits.push(remainder);
  return digits.join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const body = await req.json() as CreatePixRequest;
    const { calculoId, quizSessionId, amount, email, nome } = body;

    // Validações
    if (!calculoId || !amount || !email) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: calculoId, amount, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const emailNorm = email.trim().toLowerCase();
    if (!isValidEmail(emailNorm)) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Setup
    const apiKey = Deno.env.get("PAGARME_API_KEY")?.trim();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "PAGARME_API_KEY não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Confirma que o cálculo existe (evita criar pagamento órfão)
    const { data: calculoRow, error: calculoErr } = await supabase
      .from("calculos")
      .select("id, codigo_unico")
      .eq("id", calculoId)
      .single();

    if (calculoErr || !calculoRow) {
      return new Response(
        JSON.stringify({ error: "Cálculo não encontrado", calculoId }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Monta payload Pagar.me
    const userName = (nome || emailNorm).trim();
    const userCPF = generateRandomCPF();
    const phone = String(Math.floor(Math.random() * 900000000) + 100000000);

    const orderPayload = {
      items: [
        {
          amount,
          description: "Análise Completa de Rescisão",
          quantity: 1,
        },
      ],
      customer: {
        name: userName,
        email: emailNorm,
        document: userCPF,
        type: "individual",
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: "11",
            number: phone,
          },
        },
      },
      payments: [
        {
          payment_method: "pix",
          pix: { expires_in: 3600 },
        },
      ],
      metadata: {
        source: "rescisao-certa",
        calculo_id: calculoId,
        quiz_session_id: quizSessionId || null,
        email: emailNorm,
      },
    };

    // Chama Pagar.me
    const pixResp = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(apiKey + ":")}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const pixData = await pixResp.json();

    if (!pixResp.ok) {
      console.error("[create-pix] erro Pagar.me:", pixData);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar PIX", details: pixData }),
        { status: pixResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const charge = pixData.charges?.[0];
    const pixCharge = charge?.last_transaction;
    const chargeId = charge?.id;
    const qrCode = pixCharge?.qr_code;
    const qrCodeUrl = pixCharge?.qr_code_url;
    const expiresAt = pixCharge?.expires_at;
    const status = charge?.status || pixData.status;

    if (status === "failed" || !qrCode || !qrCodeUrl) {
      console.error("[create-pix] PIX failed:", { status, hasQr: !!qrCode });
      return new Response(
        JSON.stringify({
          error: "Falha ao gerar PIX",
          details: "O provedor de pagamento não conseguiu gerar o QR Code.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Insere o pagamento na tabela
    const { error: insErr } = await supabase.from("pagamentos").insert({
      calculo_id: calculoId,
      quiz_session_id: quizSessionId || null,
      status: "pendente",
      amount_cents: amount,
      provider: "pagarme",
      provider_order_id: pixData.id,
      provider_charge_id: chargeId,
      qr_code: qrCode,
      qr_code_url: qrCodeUrl,
      email: emailNorm,
      nome: nome || null,
      expires_at: expiresAt || null,
    });

    if (insErr) {
      console.error("[create-pix] erro INSERT pagamentos:", insErr);
      // O PIX foi gerado mesmo assim — retorna o QR pro usuário, mas avisa
    }

    console.log(`[create-pix] OK em ${Date.now() - startTime}ms`);

    return new Response(
      JSON.stringify({
        orderId: pixData.id,
        chargeId,
        status,
        qrCode,
        qrCodeUrl,
        expiresAt,
        calculoId,
        codigoUnico: calculoRow.codigo_unico,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[create-pix] erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
