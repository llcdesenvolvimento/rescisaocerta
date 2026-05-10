import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Input validation schema - validates structure without being too strict on resultado fields
const GerarRelatorioSchema = z.object({
  resultado: z.object({
    valor_base: z.number().optional(),
    valor_refinado: z.number().optional(),
    diferenca: z.number().optional(),
    nivel_oportunidade: z.string().max(50).optional(),
    itens: z.array(z.object({
      nome: z.string().max(200),
      valor: z.number(),
    })).optional(),
    principais_fatores: z.array(z.string().max(200)).optional(),
    dados_informados: z.record(z.unknown()).optional(),
  }).passthrough(), // Allow additional fields
  calculoId: z.string().regex(UUID_REGEX, 'ID de cálculo inválido').optional(),
  baseUrl: z.string().url().max(500).optional(),
});

// Generate unique hash for the report
function generateReportHash(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let hash = '';
  for (let i = 0; i < 12; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

// Sanitize string to prevent prompt injection
function sanitizeForPrompt(str: string, maxLength: number = 500): string {
  return str
    .replace(/[<>{}[\]\\]/g, '') // Remove potentially dangerous characters
    .slice(0, maxLength)
    .trim();
}

const PROMPT_FIXO = `Você é um assistente especializado em rescisão CLT.

REGRAS CRÍTICAS:
- Use EXCLUSIVAMENTE os dados do JSON abaixo
- NÃO invente valores ou informações
- NÃO crie verbas novas
- NÃO altere números
- SOMENTE mencione adicionais (insalubridade, periculosidade, noturno, horas extras, comissões, valores por fora) SE eles aparecerem no JSON com valores > 0 ou flags = true

O JSON contém:
- "itens": lista de verbas calculadas (nome + valor)
- "principais_fatores": motivos da diferença identificados
- "dados_informados": respostas do usuário nas perguntas complementares (jornada, valores, tempo)

Sua resposta deve conter EXATAMENTE estas 6 seções, separadas por marcadores:

===RESUMO===
- Valor base: [valor_base do JSON]
- Valor após análise completa: [valor_refinado do JSON]
- Diferença: [diferenca do JSON]
- Nível de oportunidade: [nivel_oportunidade do JSON]

===DE ONDE VEM A DIFERENÇA===
Baseado nos "principais_fatores" do JSON, explique de forma simples. Use linguagem acessível, sem juridiquês.
IMPORTANTE: Só mencione fatores que realmente aparecem no JSON.

===DETALHAMENTO DAS VERBAS===
Liste APENAS as verbas do JSON "itens" que têm valor > 0:
- Nome da verba: R$ valor - breve explicação

===CHECKLIST PRÁTICO===
O que o usuário deve conferir na rescisão (TRCT, holerites, extrato FGTS):
1. [item]
2. [item]
(mínimo 5 itens)

===PRÓXIMOS PASSOS===
Orientações claras e práticas baseadas nos dados informados pelo usuário. Máximo 4 passos.

===DISCLAIMER===
Este relatório apresenta estimativas baseadas nas informações fornecidas. Os valores podem variar conforme documentação oficial. Esta análise não substitui consulta com advogado trabalhista.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check request size limit (1MB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1048576) {
      return new Response(
        JSON.stringify({ error: "Request too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "JSON inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parseResult = GerarRelatorioSchema.safeParse(rawInput);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Dados inválidos",
          details: parseResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { resultado, calculoId, baseUrl } = parseResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "Configuração de API ausente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize resultado for AI prompt to prevent injection
    const sanitizedResultado = {
      valor_base: resultado.valor_base,
      valor_refinado: resultado.valor_refinado,
      diferenca: resultado.diferenca,
      nivel_oportunidade: resultado.nivel_oportunidade ? sanitizeForPrompt(resultado.nivel_oportunidade, 50) : undefined,
      itens: resultado.itens?.slice(0, 50).map(item => ({
        nome: sanitizeForPrompt(item.nome, 100),
        valor: item.valor,
      })),
      principais_fatores: resultado.principais_fatores?.slice(0, 20).map(f => sanitizeForPrompt(f, 200)),
    };

    // Format JSON for the prompt
    const jsonFormatado = JSON.stringify(sanitizedResultado, null, 2);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: PROMPT_FIXO },
          { role: "user", content: `JSON:\n${jsonFormatado}` },
        ],
        max_completion_tokens: 3000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro na API:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar relatório" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse report sections
    const parsedReport = parseRelatorio(content);

    // Generate unique hash and URL for the report
    const reportHash = generateReportHash();
    const siteUrl = baseUrl || "https://portaldotrabalhador.lovable.app";
    const reportUrl = `${siteUrl}/relatorio/${reportHash}`;

    // Save report to database if calculoId is provided
    if (calculoId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: relatorioError } = await supabase
        .from('relatorios')
        .insert({
          calculo_id: calculoId,
          relatorio_ai: parsedReport,
          report_hash: reportHash,
          report_url: reportUrl,
        });

      if (relatorioError) {
        console.error('Erro ao salvar relatório:', relatorioError);
      }
    }

    return new Response(
      JSON.stringify({ ...parsedReport, reportHash, reportUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na edge function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

  // Try to extract each section
  const patterns = [
    { key: "resumo", pattern: /===RESUMO===([\s\S]*?)(?====|$)/i },
    { key: "deOndeVemDiferenca", pattern: /===DE ONDE VEM A DIFERENÇA===([\s\S]*?)(?====|$)/i },
    { key: "detalhamentoVerbas", pattern: /===DETALHAMENTO DAS VERBAS===([\s\S]*?)(?====|$)/i },
    { key: "checklistPratico", pattern: /===CHECKLIST PRÁTICO===([\s\S]*?)(?====|$)/i },
    { key: "proximosPassos", pattern: /===PRÓXIMOS PASSOS===([\s\S]*?)(?====|$)/i },
    { key: "disclaimer", pattern: /===DISCLAIMER===([\s\S]*?)(?====|$)/i },
  ];

  for (const { key, pattern } of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      secoes[key as keyof typeof secoes] = match[1].trim();
    }
  }

  // If couldn't parse, use raw content in resumo
  if (!secoes.resumo && content) {
    secoes.resumo = content;
  }

  return secoes;
}
