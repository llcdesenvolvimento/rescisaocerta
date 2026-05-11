/**
 * verificar-pix — consulta status do PIX na Pagar.me e sincroniza
 * `public.pagamentos`. Chamada pelo polling do frontend.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VerificarPixRequest {
  chargeId: string;
  calculoId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chargeId, calculoId } = await req.json() as VerificarPixRequest;

    if (!chargeId) {
      return new Response(
        JSON.stringify({ error: "chargeId obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("PAGARME_API_KEY")?.trim();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "PAGARME_API_KEY não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Consulta Pagar.me
    const resp = await fetch(`https://api.pagar.me/core/v5/charges/${chargeId}`, {
      headers: { Authorization: `Basic ${btoa(apiKey + ":")}` },
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("[verificar-pix] erro Pagar.me:", data);
      return new Response(
        JSON.stringify({ paid: false, status: "error", error: data }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const status = data.status; // 'paid' | 'pending' | 'failed' | 'canceled' | etc.
    const paid = status === "paid";

    // Mapeia pro enum interno
    const statusInterno =
      status === "paid" ? "pago"
        : status === "canceled" ? "cancelado"
        : status === "failed" ? "erro"
        : "pendente";

    // Atualiza `public.pagamentos`
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const updatePayload: Record<string, unknown> = { status: statusInterno };
    if (paid) updatePayload.paid_at = new Date().toISOString();

    const { error } = await supabase
      .from("pagamentos")
      .update(updatePayload)
      .eq("provider_charge_id", chargeId);

    if (error) {
      console.error("[verificar-pix] erro UPDATE:", error);
    }

    return new Response(
      JSON.stringify({
        paid,
        status: statusInterno,
        chargeId,
        calculoId: calculoId || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[verificar-pix] erro:", err);
    return new Response(
      JSON.stringify({ paid: false, status: "error", error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
