import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================================================
// Geração de Checklist de Erros na Rescisão — Anthropic Claude
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Max-Age": "86400",
};

const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 3000;

const SYSTEM_PROMPT = `Você é um especialista em direito trabalhista brasileiro com longa experiência em rescisões.

Sua missão: gerar um checklist PERSONALIZADO de erros comuns na rescisão, em linguagem simples — para um trabalhador comum entender, conferir e agir.

Regras absolutas:
- Português do Brasil. Texto simples, sem markdown, sem cabeçalhos com #, sem bullets *.
- NUNCA use jargão jurídico: nada de "TRCT", "GRRF", "DARF", "FGTS Digital", "homologação". Substitua por termos do dia a dia ("documento de rescisão", "extrato do FGTS", etc.).
- Personalize cada item com base nos dados do trabalhador (salário, tempo, tipo de saída, adicionais).
- NÃO dê consultoria jurídica explícita ("você deve processar", "vai ganhar na justiça"). Apenas oriente onde conferir e o que verificar.
- Use APENAS os dados fornecidos. Não invente valores.`;

interface ChecklistInput {
  tipoDesligamento?: string;
  tempoContrato?: string;
  salario?: number;
  horasExtras?: string;
  adicionais?: string;
  variaveis?: string;
  totalBasicas?: number;
  totalExtras?: number;
}

function formatarMoeda(valor?: number): string {
  return (valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function montarPrompt(input: ChecklistInput): string {
  return `Gere um checklist personalizado dos 15 erros mais comuns em rescisões trabalhistas para este trabalhador específico.

DADOS DO TRABALHADOR (use para personalizar o risco de cada item):
- Tipo de saída: ${input.tipoDesligamento || "[não informado]"}
- Tempo total de empresa: ${input.tempoContrato || "[não informado]"}
- Salário base: ${formatarMoeda(input.salario)}
- Fazia horas extras? ${input.horasExtras || "Não informado"}
- Tinha adicionais (noturno, periculosidade, insalubridade)? ${input.adicionais || "Nenhum"}
- Recebia variáveis (comissões, bônus)? ${input.variaveis || "Não"}
- Valor calculado de verbas básicas: ${formatarMoeda(input.totalBasicas)}
- Valor calculado de verbas extras: ${formatarMoeda(input.totalExtras)}

FORMATO OBRIGATÓRIO (siga À RISCA — qualquer desvio quebra a renderização):

Comece com 1 (uma) frase introdutória curta sobre o que é esse checklist.
Em seguida, deixe UMA LINHA EM BRANCO.

Em seguida, liste EXATAMENTE 15 itens. Cada item TEM que ter exatamente 4 linhas, na ordem:

LINHA 1 — cabeçalho: "[EMOJI] ERRO [N]: [Título direto]"
   Exemplo: "⚠️ ERRO 1: Aviso prévio calculado errado"
LINHA 2 — "Risco no seu caso: [Alto/Médio/Baixo] — [explicação curta personalizada]"
LINHA 3 — "Onde conferir: [orientação prática]"
LINHA 4 — "O que verificar: [dica objetiva]"

Entre um item e o próximo, deixe UMA LINHA EM BRANCO.

REGRAS RÍGIDAS:
- TODA linha 1 começa com emoji + espaço + "ERRO " + número + ":" + espaço + título. NUNCA omita o "ERRO N:".
- O número N vai de 1 a 15, sequencial, sem pular.
- Use ⚠️ para risco ALTO, 🔍 para MÉDIO, ✅ para BAIXO.
- ORDENE: alto primeiro, médio depois, baixo por último.
- Mínimo de 5 itens de risco alto quando houver dados indicando irregularidades (ex.: horas extras "sempre" + tipo de saída sem justa causa).
- Os 15 erros DEVEM cobrir: aviso prévio, 13º proporcional, férias vencidas, férias proporcionais, multa do FGTS, saldo de salário, horas extras, adicional noturno, adicional de periculosidade, adicional de insalubridade, comissões/variáveis, descontos indevidos, salário "por fora", depósitos do FGTS atrasados e seguro-desemprego (quando aplicável).
- NÃO insira títulos extras, separadores, linhas tipo "---", ou markdown (sem #, sem **, sem listas com *).
- NÃO use jargão (TRCT, GRRF, DARF). Sempre "documento de rescisão", "extrato do FGTS".

Após o item 15, deixe UMA LINHA EM BRANCO e escreva um parágrafo de RESUMO com no máximo 3 frases:
- Diga quantos itens são de risco alto neste caso.
- Dê 1 orientação geral simples (sem termos jurídicos).
- Reforce que conferir antes de assinar é o passo mais importante.

EXEMPLO de item bem formatado:

⚠️ ERRO 1: Aviso prévio calculado errado
Risco no seu caso: Alto — você tem 2 anos completos, então o aviso deveria ser de 36 dias e não 30.
Onde conferir: no documento de rescisão, na linha "Aviso Prévio Indenizado".
O que verificar: se o número de dias está correto pelo tempo de empresa (30 dias + 3 dias por ano completo).`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input = (await req.json()) as ChecklistInput;

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

    const userPrompt = montarPrompt(input);

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
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Limite de requisições excedido. Tente novamente em alguns minutos.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(
        JSON.stringify({ error: "Erro ao gerar checklist" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const aiResponse = await response.json();
    const checklist: string = aiResponse.content
      ?.filter((b: { type: string }) => b.type === "text")
      ?.map((b: { text: string }) => b.text)
      ?.join("\n") || "";

    if (!checklist) {
      console.error("Resposta vazia do modelo:", JSON.stringify(aiResponse));
      return new Response(
        JSON.stringify({ error: "Modelo retornou conteúdo vazio" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ checklist }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
