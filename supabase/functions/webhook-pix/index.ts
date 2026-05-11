/**
 * webhook-pix — recebe notificações do Pagar.me e atualiza `public.pagamentos`.
 *
 * Cadastre essa URL como webhook no painel do Pagar.me:
 *   https://micfchxnaexdkxngvonb.supabase.co/functions/v1/webhook-pix
 *
 * Eventos relevantes: `order.paid`, `charge.paid`, `charge.failed`,
 * `charge.canceled`, `order.canceled`.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const event = await req.json();
    const type: string = event?.type || "";
    const dataObj = event?.data || {};

    console.log(`[webhook-pix] evento: ${type}`);

    // Identifica o charge_id e novo status
    let chargeId: string | undefined;
    let newStatus: string | undefined;

    if (type.startsWith("order.")) {
      // order.* → traz o array de charges
      const charge = dataObj?.charges?.[0];
      chargeId = charge?.id;
      const chargeStatus = charge?.status || dataObj?.status;
      newStatus = mapStatus(chargeStatus);
    } else if (type.startsWith("charge.")) {
      chargeId = dataObj?.id;
      newStatus = mapStatus(dataObj?.status);
    }

    if (!chargeId || !newStatus) {
      console.log("[webhook-pix] evento ignorado (sem chargeId ou status):", { type, chargeId, newStatus });
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "pago") {
      update.paid_at = new Date().toISOString();
    }

    const { error, data } = await supabase
      .from("pagamentos")
      .update(update)
      .eq("provider_charge_id", chargeId)
      .select("id, calculo_id, quiz_session_id");

    if (error) {
      console.error("[webhook-pix] erro UPDATE:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[webhook-pix] OK: ${data?.length || 0} pagamentos atualizados`);

    // Também registra um evento de telemetria
    if (data && data.length > 0 && newStatus === "pago") {
      const pagamento = data[0];
      await supabase.from("eventos").insert({
        quiz_session_id: pagamento.quiz_session_id,
        calculo_id: pagamento.calculo_id,
        tipo: "pagamento_confirmado",
        metadata: { charge_id: chargeId, source: "webhook" },
      });
    }

    return new Response(JSON.stringify({ ok: true, updated: data?.length || 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[webhook-pix] erro:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function mapStatus(pagarmeStatus: string | undefined): string {
  if (!pagarmeStatus) return "pendente";
  switch (pagarmeStatus) {
    case "paid":
      return "pago";
    case "canceled":
      return "cancelado";
    case "failed":
      return "erro";
    default:
      return "pendente";
  }
}
