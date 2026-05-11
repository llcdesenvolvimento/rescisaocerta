import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// ============================================================================
// Geração de Relatório Estruturado de Rescisão — Anthropic Claude
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 3000;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const GerarRelatorioSchema = z.object({
  resultado: z
    .object({
      valor_base: z.number().optional(),
      valor_refinado: z.number().optional(),
      diferenca: z.number().optional(),
      nivel_oportunidade: z.string().max(50).optional(),
      itens: z
        .array(
          z.object({
            nome: z.string().max(200),
            valor: z.number(),
          }),
        )
        .optional(),
      principais_fatores: z.array(z.string().max(200)).optional(),
      dados_informados: z.record(z.unknown()).optional(),
    })
    .passthrough(),
  calculoId: z.string().regex(UUID_REGEX, "ID de cálculo inválido").optional(),
  baseUrl: z.string().url().max(500).optional(),
});

function generateReportHash(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 12; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

function sanitizeForPrompt(str: string, maxLength = 500): string {
  return str
    .replace(/[<>{}[\]\\]/g, "")
    .slice(0, maxLength)
    .trim();
}

const SYSTEM_PROMPT = `Você é um assistente especializado em rescisão CLT brasileira. Sua função é transformar dados estruturados em um relatório claro e útil para o trabalhador.

Regras absolutas:
- Use EXCLUSIVAMENTE os dados do JSON recebido. NUNCA invente verbas, valores, percentuais ou datas.
- NÃO mencione adicionais (insalubridade, periculosidade, noturno, horas extras, "por fora", comissões) se não aparecerem no JSON com valor > 0.
- Português do Brasil. Linguagem acessível, sem juridiquês.
- Texto simples, sem markdown, sem listas com asterisco — use travessões "-" quando precisar listar.
- Estrutura RÍGIDA com marcadores ===NOME=== em maiúsculas (essenciais para parsing — não altere).`;

const USER_INSTRUCTION = `Sua resposta deve ter EXATAMENTE estas 6 seções, separadas pelos marcadores indicados:

===RESUMO===
Em 4 linhas curtas, repita os valores do JSON:
- Valor base: [valor_base]
- Valor após análise completa: [valor_refinado]
- Diferença: [diferenca]
- Nível de oportunidade: [nivel_oportunidade]

===DE ONDE VEM A DIFERENÇA===
Em 2 a 4 parágrafos curtos, explique para o trabalhador o que está por trás da diferença. Use os "principais_fatores" do JSON como base. Linguagem simples, sem jargão jurídico. Só mencione fatores que estão no JSON.

===DETALHAMENTO DAS VERBAS===
Liste APENAS as verbas em "itens" do JSON cujo valor é maior que zero, no formato:
- Nome da verba: R$ valor — explicação curta em 1 frase.

===CHECKLIST PRÁTICO===
Liste de 5 a 8 itens numerados de o que o trabalhador deve conferir nos documentos da rescisão (holerites, extrato do FGTS, documento de rescisão). Use linguagem do dia a dia.

===PRÓXIMOS PASSOS===
De 3 a 4 passos práticos baseados nos dados do JSON. Comece cada passo com um verbo no imperativo (Solicite, Junte, Confira, Procure).

===DISCLAIMER===
Este relatório apresenta estimativas baseadas nas informações fornecidas. Os valores podem variar conforme a documentação oficial. Esta análise não substitui consulta com advogado trabalhista.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1048576) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parseResult = GerarRelatorioSchema.safeParse(rawInput);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.errors);
      return new Response(
        JSON.stringify({
          error: "Dados inválidos",
          details: parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { resultado, calculoId, baseUrl } = parseResult.data;

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "API key da Anthropic não configurada" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const sanitizedResultado = {
      valor_base: resultado.valor_base,
      valor_refinado: resultado.valor_refinado,
      diferenca: resultado.diferenca,
      nivel_oportunidade: resultado.nivel_oportunidade
        ? sanitizeForPrompt(resultado.nivel_oportunidade, 50)
        : undefined,
      itens: resultado.itens?.slice(0, 50).map((item) => ({
        nome: sanitizeForPrompt(item.nome, 100),
        valor: item.valor,
      })),
      principais_fatores: resultado.principais_fatores
        ?.slice(0, 20)
        .map((f) => sanitizeForPrompt(f, 200)),
    };

    const jsonFormatado = JSON.stringify(sanitizedResultado, null, 2);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `${USER_INSTRUCTION}\n\nJSON:\n${jsonFormatado}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error:
              "Limite de requisições excedido. Tente novamente em alguns minutos.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ error: "Erro ao gerar relatório" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content: string =
      aiResponse.content
        ?.filter((b: { type: string }) => b.type === "text")
        ?.map((b: { text: string }) => b.text)
        ?.join("\n") || "";

    const parsedReport = parseRelatorio(content);

    const reportHash = generateReportHash();
    const siteUrl = baseUrl || "https://portaldotrabalhador.lovable.app";
    const reportUrl = `${siteUrl}/relatorio/${reportHash}`;

    if (calculoId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: relatorioError } = await supabase
        .from("relatorios")
        .insert({
          calculo_id: calculoId,
          tipo: "relatorio_ai",
          conteudo: parsedReport,
        });

      if (relatorioError) {
        console.error("Erro ao salvar relatório:", relatorioError);
      }
    }

    return new Response(
      JSON.stringify({ ...parsedReport, reportHash, reportUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro na edge function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

function parseRelatorio(content: string): Record<string, string> {
  const secoes = {
    resumo: "",
    deOndeVemDiferenca: "",
    detalhamentoVerbas: "",
    checklistPratico: "",
    proximosPassos: "",
    disclaimer: "",
  };

  const patterns = [
    { key: "resumo", pattern: /===RESUMO===([\s\S]*?)(?====|$)/i },
    {
      key: "deOndeVemDiferenca",
      pattern: /===DE ONDE VEM A DIFERENÇA===([\s\S]*?)(?====|$)/i,
    },
    {
      key: "detalhamentoVerbas",
      pattern: /===DETALHAMENTO DAS VERBAS===([\s\S]*?)(?====|$)/i,
    },
    {
      key: "checklistPratico",
      pattern: /===CHECKLIST PRÁTICO===([\s\S]*?)(?====|$)/i,
    },
    {
      key: "proximosPassos",
      pattern: /===PRÓXIMOS PASSOS===([\s\S]*?)(?====|$)/i,
    },
    { key: "disclaimer", pattern: /===DISCLAIMER===([\s\S]*?)(?====|$)/i },
  ];

  for (const { key, pattern } of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      secoes[key as keyof typeof secoes] = match[1].trim();
    }
  }

  if (!secoes.resumo && content) {
    secoes.resumo = content;
  }

  return secoes;
}
