/**
 * enviar-email-relatorio — envia o link da análise por e-mail via Brevo.
 *
 * Dispara DOIS e-mails:
 *   1. Notificação interna para `INTERNAL_NOTIFY_EMAIL` (venda aprovada).
 *   2. Confirmação para o pagador, com o link da análise.
 *
 * Chamada pelo `webhook-pix` quando um pagamento é confirmado (status=pago).
 * Idempotente: usa a tabela `eventos` para garantir que os e-mails não sejam
 * reenviados pro mesmo pagamento.
 *
 * Body esperado: { pagamentoId: string }
 *
 * Secrets necessários no Supabase:
 *   - BREVO_API_KEY
 *   - SUPABASE_URL (auto)
 *   - SUPABASE_SERVICE_ROLE_KEY (auto)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

const SITE_URL = "https://rescisaocerta.com.br";
const FROM_NAME = "Rescisão Certa";
const FROM_EMAIL = "suporte@rescisaocerta.com.br";
const REPLY_TO_EMAIL = "suporte@rescisaocerta.com.br";
// Para onde mandar a notificação interna de venda
const INTERNAL_NOTIFY_EMAIL = "aileronsolucoes@gmail.com";

interface RequestBody {
  pagamentoId: string;
  /** Se true, ignora idempotência (use só pra testes manuais). */
  force?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pagamentoId, force } = (await req.json()) as RequestBody;
    if (!pagamentoId) {
      return new Response(
        JSON.stringify({ error: "pagamentoId obrigatório" }),
        { status: 400, headers: jsonHeaders() },
      );
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      console.error("[enviar-email-relatorio] BREVO_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY não configurada" }),
        { status: 500, headers: jsonHeaders() },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Idempotência: se já enviamos email pra esse pagamento, sai cedo.
    //    `force=true` no body permite forçar reenvio (uso manual/teste).
    if (!force) {
      const { data: jaEnviado } = await supabase
        .from("eventos")
        .select("id")
        .eq("tipo", "email_relatorio_enviado")
        .filter("metadata->>pagamento_id", "eq", pagamentoId)
        .limit(1)
        .maybeSingle();

      if (jaEnviado) {
        console.log(`[enviar-email-relatorio] já enviado para ${pagamentoId}`);
        return new Response(
          JSON.stringify({ ok: true, alreadySent: true }),
          { headers: jsonHeaders() },
        );
      }
    }

    // 2. Busca dados do pagamento
    const { data: pagamento, error: pagErr } = await supabase
      .from("pagamentos")
      .select(
        "id, email, nome, calculo_id, quiz_session_id, status, amount_cents, paid_at",
      )
      .eq("id", pagamentoId)
      .maybeSingle();

    if (pagErr || !pagamento) {
      console.error("[enviar-email-relatorio] pagamento não encontrado:", pagErr);
      return new Response(
        JSON.stringify({ error: "pagamento não encontrado" }),
        { status: 404, headers: jsonHeaders() },
      );
    }

    // Se `pagamento.nome` veio vazio (típico em upsells, que não pedem nome),
    // tenta recuperar do pagamento principal anterior pro mesmo cálculo,
    // ou das respostas do quiz.
    let nomePagador = pagamento.nome;
    if (!nomePagador && pagamento.calculo_id) {
      const { data: outroPg } = await supabase
        .from("pagamentos")
        .select("nome")
        .eq("calculo_id", pagamento.calculo_id)
        .not("nome", "is", null)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (outroPg?.nome) nomePagador = outroPg.nome;
    }
    if (!nomePagador && pagamento.quiz_session_id) {
      const { data: quizSession } = await supabase
        .from("quiz_sessions")
        .select("respostas")
        .eq("id", pagamento.quiz_session_id)
        .maybeSingle();
      const respostas = quizSession?.respostas as Record<string, unknown> | null;
      const nomeQuiz = respostas?.["nome"] || respostas?.["nomeCompleto"];
      if (typeof nomeQuiz === "string" && nomeQuiz.trim()) nomePagador = nomeQuiz.trim();
    }

    if (pagamento.status !== "pago") {
      console.warn(
        `[enviar-email-relatorio] pagamento ${pagamentoId} status=${pagamento.status}, ignorando`,
      );
      return new Response(
        JSON.stringify({ ok: true, skipped: true, reason: "status != pago" }),
        { headers: jsonHeaders() },
      );
    }

    if (!pagamento.email) {
      console.error(`[enviar-email-relatorio] pagamento ${pagamentoId} sem email`);
      return new Response(
        JSON.stringify({ error: "pagamento sem email" }),
        { status: 400, headers: jsonHeaders() },
      );
    }

    // 3. Monta link + dados auxiliares
    const link = `${SITE_URL}/relatorio?id=${pagamento.calculo_id}`;
    const primeiroNome = (nomePagador || "").trim().split(/\s+/)[0] || "olá";
    const nomeCapitalizado =
      primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
    const valorBRL = formatarMoeda((pagamento.amount_cents || 0) / 100);
    const dataObj = pagamento.paid_at ? new Date(pagamento.paid_at) : new Date();
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dataPagamento = `${dataFormatada} ${horaFormatada}`;
    // Tipo da compra inferido do valor (R$ 16,90 = análise, R$ 9,90 = carta,
    // R$ 6,90 = checklist, outros = "Análise completa" como fallback).
    const tipoCompra = inferirTipoCompra(pagamento.amount_cents || 0);

    // 4. Envia os 2 emails em paralelo
    const [emailClienteResp, emailInternoResp] = await Promise.allSettled([
      enviarBrevo({
        apiKey: BREVO_API_KEY,
        to: [{ email: pagamento.email, name: nomePagador || undefined }],
        subject: "A Análise Completa da sua Rescisão está pronta",
        htmlContent: renderEmailClienteHtml({ nome: nomeCapitalizado, link }),
        textContent: renderEmailClienteText({ nome: nomeCapitalizado, link }),
        tags: ["relatorio-rescisao", "cliente"],
      }),
      enviarBrevo({
        apiKey: BREVO_API_KEY,
        to: [{ email: INTERNAL_NOTIFY_EMAIL }],
        subject: "Venda Aprovada - Rescisão Certa",
        htmlContent: renderEmailInternoHtml({
          nome: nomePagador || pagamento.email,
          email: pagamento.email,
          valor: valorBRL,
          dataFormatada,
          horaFormatada,
          tipoCompra,
          link,
          pagamentoId: pagamento.id,
        }),
        textContent: renderEmailInternoText({
          nome: nomePagador || pagamento.email,
          email: pagamento.email,
          valor: valorBRL,
          dataPagamento,
          tipoCompra,
          link,
          pagamentoId: pagamento.id,
        }),
        tags: ["relatorio-rescisao", "notificacao-interna"],
      }),
    ]);

    const resultadoCliente = unwrap(emailClienteResp);
    const resultadoInterno = unwrap(emailInternoResp);

    const algumFalhou = !resultadoCliente.ok || !resultadoInterno.ok;

    // 5. Registra eventos
    if (!resultadoCliente.ok) {
      await supabase.from("eventos").insert({
        quiz_session_id: pagamento.quiz_session_id,
        calculo_id: pagamento.calculo_id,
        tipo: "email_relatorio_falhou",
        metadata: {
          pagamento_id: pagamentoId,
          destinatario: "cliente",
          ...resultadoCliente.errorMeta,
        },
      });
    }

    if (!resultadoInterno.ok) {
      await supabase.from("eventos").insert({
        quiz_session_id: pagamento.quiz_session_id,
        calculo_id: pagamento.calculo_id,
        tipo: "email_relatorio_falhou",
        metadata: {
          pagamento_id: pagamentoId,
          destinatario: "interno",
          ...resultadoInterno.errorMeta,
        },
      });
    }

    if (resultadoCliente.ok) {
      // Evento de sucesso (chave da idempotência — só conta se o email do
      // cliente foi enviado, que é o mais crítico)
      await supabase.from("eventos").insert({
        quiz_session_id: pagamento.quiz_session_id,
        calculo_id: pagamento.calculo_id,
        tipo: "email_relatorio_enviado",
        metadata: {
          pagamento_id: pagamentoId,
          email: pagamento.email,
          message_id_cliente: resultadoCliente.messageId,
          message_id_interno: resultadoInterno.ok ? resultadoInterno.messageId : null,
        },
      });
    }

    return new Response(
      JSON.stringify({
        ok: !algumFalhou,
        cliente: resultadoCliente,
        interno: resultadoInterno,
      }),
      {
        status: algumFalhou ? 502 : 200,
        headers: jsonHeaders(),
      },
    );
  } catch (err) {
    console.error("[enviar-email-relatorio] erro:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: jsonHeaders() },
    );
  }
});

// ---------- helpers ----------

function jsonHeaders() {
  return { ...corsHeaders, "Content-Type": "application/json" };
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Inferir o tipo de compra a partir do valor (em centavos). */
function inferirTipoCompra(amountCents: number): string {
  if (amountCents === 1690) return "Análise Completa";
  if (amountCents === 990) return "Upsell Carta RH";
  if (amountCents === 690) return "Upsell Checklist";
  if (amountCents === 1) return "Análise Completa (teste R$ 0,01)";
  return "Análise Completa";
}

interface BrevoArgs {
  apiKey: string;
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
}

interface SendResult {
  ok: boolean;
  messageId?: string;
  errorMeta?: Record<string, unknown>;
}

async function enviarBrevo(args: BrevoArgs): Promise<SendResult> {
  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": args.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      replyTo: { email: REPLY_TO_EMAIL },
      to: args.to,
      subject: args.subject,
      htmlContent: args.htmlContent,
      textContent: args.textContent,
      tags: args.tags,
    }),
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    console.error("[enviar-email-relatorio] Brevo erro:", resp.status, data);
    return {
      ok: false,
      errorMeta: { status: resp.status, response: data, to: args.to },
    };
  }
  return { ok: true, messageId: data?.messageId };
}

function unwrap<T extends SendResult>(p: PromiseSettledResult<T>): T {
  if (p.status === "fulfilled") return p.value;
  console.error("[enviar-email-relatorio] promise rejeitada:", p.reason);
  return {
    ok: false,
    errorMeta: { reason: String(p.reason) },
  } as T;
}

// ---------- templates ----------

function renderEmailClienteHtml({
  nome,
  link,
}: {
  nome: string;
  link: string;
}): string {
  const linkSafe = escapeHtml(link);
  const nomeSafe = escapeHtml(nome);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Sua análise está pronta — Rescisão Certa</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#0F172A;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f6fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">

          <!-- Header azul -->
          <tr>
            <td style="background:linear-gradient(135deg,#3D5AFE 0%,#2541E6 100%);padding:32px 28px;text-align:left;">
              <p style="margin:0;color:#ffffff;font-weight:800;font-size:15px;letter-spacing:0.02em;">
                Rescisão Certa
              </p>
              <p style="margin:18px 0 0 0;">
                <span style="display:inline-block;padding:6px 12px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:999px;color:#ffffff;font-size:11px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;">
                  ✓ Pagamento confirmado
                </span>
              </p>
              <h1 style="margin:14px 0 0 0;color:#ffffff;font-size:24px;line-height:1.25;font-weight:800;">
                Sua Análise Completa<br/>está pronta.
              </h1>
              <p style="margin:10px 0 0 0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.5;">
                Todos os seus direitos calculados pela CLT, prontos pra você conferir.
              </p>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding:28px 28px 0 28px;color:#374151;font-size:15px;line-height:1.55;">
              <p style="margin:0 0 12px 0;">Olá <strong>${nomeSafe}</strong>,</p>
              <p style="margin:0 0 12px 0;">
                Obrigado por confiar na <strong style="color:#0F172A;">Rescisão Certa</strong>. Seu pagamento foi confirmado e o relatório completo da sua rescisão já está disponível.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:20px 28px;text-align:center;">
              <a href="${linkSafe}" style="display:inline-block;padding:14px 28px;background:#3D5AFE;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;white-space:nowrap;">
                Acessar minha análise →
              </a>
              <p style="margin:12px 0 0 0;font-size:11px;color:#94a3b8;line-height:1.5;">
                Acesso vitalício · liberado neste link
              </p>
            </td>
          </tr>

          <!-- O que tem no relatório -->
          <tr>
            <td style="padding:8px 28px 16px 28px;">
              <p style="margin:0 0 12px 0;font-size:11px;font-weight:800;letter-spacing:0.16em;color:#3D5AFE;text-transform:uppercase;">
                O que vem no seu relatório
              </p>
              <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding:10px 0;vertical-align:top;width:36px;">
                    <span style="display:inline-block;width:24px;height:24px;background:#EEF2FF;border-radius:50%;text-align:center;line-height:24px;color:#3D5AFE;font-weight:800;font-size:13px;">1</span>
                  </td>
                  <td style="padding:10px 0;vertical-align:top;font-size:14px;line-height:1.55;color:#0F172A;">
                    <strong>Verbas pela CLT</strong>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">Saldo de salário, 13º, férias, aviso prévio, multa do FGTS — verba por verba.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:inline-block;width:24px;height:24px;background:#EEF2FF;border-radius:50%;text-align:center;line-height:24px;color:#3D5AFE;font-weight:800;font-size:13px;">2</span>
                  </td>
                  <td style="padding:10px 0;vertical-align:top;font-size:14px;line-height:1.55;color:#0F172A;">
                    <strong>Valores extras</strong>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">Horas extras, adicionais e outros valores que costumam ficar de fora da rescisão.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:inline-block;width:24px;height:24px;background:#EEF2FF;border-radius:50%;text-align:center;line-height:24px;color:#3D5AFE;font-weight:800;font-size:13px;">3</span>
                  </td>
                  <td style="padding:10px 0;vertical-align:top;font-size:14px;line-height:1.55;color:#0F172A;">
                    <strong>3 cenários por verba</strong>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">Quanto você pode receber no pior, no provável e no melhor caso de cada valor extra.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:inline-block;width:24px;height:24px;background:#EEF2FF;border-radius:50%;text-align:center;line-height:24px;color:#3D5AFE;font-weight:800;font-size:13px;">4</span>
                  </td>
                  <td style="padding:10px 0;vertical-align:top;font-size:14px;line-height:1.55;color:#0F172A;">
                    <strong>O que fazer agora</strong>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:13px;">Roteiro prático pra cobrar a empresa antes de assinar a rescisão.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card de ajuda -->
          <tr>
            <td style="padding:0 28px 16px 28px;">
              <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#0F172A;">Precisa de ajuda?</p>
                    <p style="margin:0;font-size:13px;line-height:1.55;color:#475569;">
                      Responda este e-mail ou escreva para
                      <a href="mailto:suporterescisaocerta@gmail.com" style="color:#3D5AFE;text-decoration:none;font-weight:600;">suporterescisaocerta@gmail.com</a>.
                      Nosso time responde de segunda a domingo, 8h às 21h.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                Se o botão não funcionar, copie e cole no navegador:
              </p>
              <p style="margin:6px 0 0 0;font-size:11px;line-height:1.6;word-break:break-all;">
                <a href="${linkSafe}" style="color:#3D5AFE;text-decoration:none;">${linkSafe}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px 24px 28px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;line-height:1.5;text-align:center;">
              <strong style="color:#64748b;">Aileron Tecnologia LTDA</strong> · CNPJ 62.911.864/0001-12<br/>
              SHN Quadra 2 Bloco F, Sala 625/626 — Asa Norte, Brasília/DF<br/>
              <br/>
              Você recebeu este e-mail porque concluiu uma compra em <a href="https://rescisaocerta.com.br" style="color:#9ca3af;text-decoration:underline;">rescisaocerta.com.br</a>.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderEmailClienteText({
  nome,
  link,
}: {
  nome: string;
  link: string;
}): string {
  return [
    `Olá ${nome},`,
    "",
    "Seu pagamento foi confirmado e sua Análise Completa da rescisão está liberada.",
    "",
    `Acesse agora: ${link}`,
    "",
    "No relatório você encontra:",
    "- Todas as verbas rescisórias calculadas pela CLT",
    "- Valores extras que costumam ficar de fora",
    "- Cenários pessimista, realista e otimista por verba",
    "- Próximos passos para garantir o que é seu",
    "",
    "Qualquer dúvida, é só responder este e-mail.",
    "Equipe Rescisão Certa",
    "",
    "—",
    "Aileron Tecnologia LTDA · CNPJ 62.911.864/0001-12",
  ].join("\n");
}

function renderEmailInternoHtml(args: {
  nome: string;
  email: string;
  valor: string;
  dataFormatada: string;
  horaFormatada: string;
  tipoCompra: string;
  link: string;
  pagamentoId: string;
}): string {
  const {
    nome,
    email,
    valor,
    dataFormatada,
    horaFormatada,
    tipoCompra,
    link,
    pagamentoId,
  } = args;
  const nomeSafe = escapeHtml(nome);
  const emailSafe = escapeHtml(email);
  const valorSafe = escapeHtml(valor);
  const tipoSafe = escapeHtml(tipoCompra);
  const linkSafe = escapeHtml(link);
  const idSafe = escapeHtml(pagamentoId);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Pagamento Recebido — Rescisão Certa</title>
</head>
<body style="margin:0; padding:0; background-color:#eef2f7;">

<!-- Preheader: aparece como descrição na notificação/inbox, invisível no corpo do email.
     Truques: 1) display:none não funciona em todos clientes; usar combinação;
              2) preenche com espaço NÃO-quebrável invisível pra "empurrar" qualquer
                 conteúdo do body pra fora do snippet. -->
<!-- Preheader: visível só como snippet de preview na inbox/notificação.
     Construído com 1 valor visível + muitos &nbsp;/&zwnj; pra empurrar
     o resto do conteúdo do email pra fora do snippet de 110-150 caracteres.
     Cor do texto = cor do fundo do email pra ficar invisível em clientes
     que ignoram display:none. -->
<div style="display:none !important; visibility:hidden; mso-hide:all; font-size:1px; color:#eef2f7; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;" aria-hidden="true">
💰 ${valorSafe} recebido — Venda aprovada no Rescisão Certa.&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#eef2f7" style="margin:0; padding:0; background-color:#eef2f7; width:100%;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Container principal -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:640px; background-color:#ffffff; border:1px solid #e6ebf2; border-radius:20px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#091747" style="background-color:#091747; padding:28px 24px 24px 24px;">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="font-family:Arial, sans-serif; font-size:24px; line-height:30px; font-weight:800; color:#ffffff; -webkit-text-fill-color:#ffffff;">
                    Venda Aprovada
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px; font-family:Arial, sans-serif; font-size:14px; line-height:20px; font-weight:600; color:#dfe7ff; -webkit-text-fill-color:#dfe7ff;">
                    Rescisão Certa
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 20px 24px 20px; background-color:#ffffff;">

              <!-- Texto introdutório -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:24px; font-family:Arial, sans-serif; font-size:16px; line-height:28px; color:#4a5568;">
                    Recebemos a confirma&ccedil;&atilde;o de um novo pagamento.
                  </td>
                </tr>
              </table>

              <!-- Card Valor -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:14px;">
                <tr>
                  <td bgcolor="#e6efff" style="background-color:#e6efff; border:1px solid #c9d9ff; border-radius:18px; padding:24px 18px; text-align:center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="font-family:Arial, sans-serif; font-size:14px; line-height:18px; font-weight:800; letter-spacing:0.6px; color:#4b5f8a; -webkit-text-fill-color:#4b5f8a; padding-bottom:10px;">
                          💰 VALOR RECEBIDO
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-family:Arial, sans-serif; font-size:34px; line-height:40px; font-weight:900; color:#071334; -webkit-text-fill-color:#071334;">
                          ${valorSafe}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Card Data -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:14px;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e7edf5; border-radius:16px; padding:18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:18px; font-weight:700; color:#6b7280; padding-bottom:8px;">
                          🗓️ DATA
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:17px; line-height:26px; font-weight:700; color:#091747;">
                          ${escapeHtml(dataFormatada)}
                          <span style="color:#9aa4b2; font-weight:500;">&agrave;s</span>
                          ${escapeHtml(horaFormatada)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Card Pagador -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:14px;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e7edf5; border-radius:16px; padding:18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:18px; font-weight:700; color:#6b7280; padding-bottom:8px;">
                          🙍‍♂️ PAGADOR
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:17px; line-height:26px; font-weight:700; color:#091747;">
                          ${nomeSafe}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Card Email -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:14px;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e7edf5; border-radius:16px; padding:18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:18px; font-weight:700; color:#6b7280; padding-bottom:8px;">
                          📧 E-MAIL
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:17px; line-height:26px; font-weight:600; color:#091747; word-break:break-word;">
                          ${emailSafe}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Card Tipo de Compra -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:14px;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e7edf5; border-radius:16px; padding:18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:18px; font-weight:700; color:#6b7280; padding-bottom:8px;">
                          🛒 TIPO DE COMPRA
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:17px; line-height:26px; font-weight:700; color:#091747;">
                          ${tipoSafe}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Card ID Pagamento -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; margin-bottom:22px;">
                <tr>
                  <td bgcolor="#f8fafc" style="background-color:#f8fafc; border:1px solid #e7edf5; border-radius:16px; padding:18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:18px; font-weight:700; color:#6b7280; padding-bottom:8px;">
                          🔖 ID DO PAGAMENTO
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial, sans-serif; font-size:13px; line-height:20px; font-weight:500; color:#091747; word-break:break-all;">
                          ${idSafe}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA texto -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 16px 0; font-family:Arial, sans-serif; font-size:15px; line-height:24px; color:#4a5568;">
                    O relat&oacute;rio deste cliente j&aacute; est&aacute; dispon&iacute;vel.
                  </td>
                </tr>
              </table>

              <!-- CTA botão -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#091747" style="background-color:#091747; border-radius:12px;">
                          <a href="${linkSafe}" target="_blank" style="display:inline-block; padding:14px 24px; font-family:Arial, sans-serif; font-size:15px; line-height:15px; font-weight:700; color:#ffffff; -webkit-text-fill-color:#ffffff; text-decoration:none; background-color:#091747; border:1px solid #091747; border-radius:12px;">
                            Acessar Relat&oacute;rio
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Link fallback -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="font-family:Arial, sans-serif; font-size:12px; line-height:20px; color:#7b8794; word-break:break-word;">
                    Caso o bot&atilde;o n&atilde;o funcione, copie e cole este link no navegador:<br>
                    <span style="color:#16348a;">
                      ${linkSafe}
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#f8fafc" style="background-color:#f8fafc; border-top:1px solid #e6ebf2; padding:20px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="font-family:Arial, sans-serif; font-size:13px; line-height:20px; font-weight:600; color:#4a5568; padding-bottom:6px;">
                    Este &eacute; um e-mail autom&aacute;tico.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:Arial, sans-serif; font-size:12px; line-height:18px; color:#7b8794;">
                    Por favor, n&atilde;o responda esta mensagem.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function renderEmailInternoText(args: {
  nome: string;
  email: string;
  valor: string;
  dataPagamento: string;
  tipoCompra: string;
  link: string;
  pagamentoId: string;
}): string {
  const { nome, email, valor, dataPagamento, tipoCompra, link, pagamentoId } = args;
  // A primeira linha do textContent vira o snippet de preview em vários
  // clientes (Gmail mobile, Apple Mail). Por isso começamos com só o valor.
  return [
    `💰 ${valor}`,
    "",
    "Venda Aprovada - Rescisão Certa",
    "",
    `Valor:   ${valor}`,
    `Data:    ${dataPagamento}`,
    `Pagador: ${nome}`,
    `E-mail:  ${email}`,
    `Tipo:    ${tipoCompra}`,
    `ID:      ${pagamentoId}`,
    "",
    `Acessar relatório: ${link}`,
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
