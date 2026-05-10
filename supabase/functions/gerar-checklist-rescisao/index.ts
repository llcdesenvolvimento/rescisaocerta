import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      tipoDesligamento,
      tempoContrato,
      salario,
      horasExtras,
      adicionais,
      variaveis,
      totalBasicas,
      totalExtras,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formatarMoeda = (valor: number) => {
      return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const prompt = `Gere um checklist personalizado de erros comuns na rescisão trabalhista com base nos dados reais deste trabalhador:

Tipo de desligamento: ${tipoDesligamento || "[não informado]"}
Tempo total de contrato: ${tempoContrato || "[não informado]"}
Salário base: ${formatarMoeda(salario)}
Existência de horas extras: ${horasExtras || "Não informado"}
Existência de adicionais (noturno, insalubridade, periculosidade): ${adicionais || "Nenhum"}
Existência de variáveis (comissões, bônus, etc.): ${variaveis || "Não"}
Valor total calculado das verbas básicas: ${formatarMoeda(totalBasicas)}
Valor total calculado das verbas extras: ${formatarMoeda(totalExtras)}

IMPORTANTE: Este checklist é personalizado para ESTE trabalhador. Use os dados acima para avaliar o risco de cada erro.

O checklist deve:

1. Listar os 15 erros mais comuns em rescisões trabalhistas
2. Para cada erro, usar ⚠️ se for risco ALTO para este caso, ou ✅ se for risco baixo
3. Colocar os de maior risco primeiro
4. Explicar de forma simples onde o trabalhador pode conferir cada valor (ex: "confira no seu holerite", "veja no documento de rescisão", "compare com seu contracheque")
5. NÃO usar termos técnicos como "TRCT", "GRRF", "DARF" — use linguagem do dia a dia
6. Não dar consultoria jurídica, apenas orientação informativa
7. Texto simples, sem markdown

Para cada item, use o formato:
[Emoji] ERRO X: [Título simples e direto]
Risco no seu caso: [Alto/Médio/Baixo] — [explicação curta e personalizada com base nos dados do trabalhador]
Onde conferir: [orientação prática em linguagem simples]
O que verificar: [dica objetiva]

Ao final, inclua um resumo com:
- Quantos itens são de risco alto para este caso específico
- Uma orientação geral simples (sem termos jurídicos)

Gere o texto completo. Lembre-se: este checklist foi feito sob medida para este trabalhador.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em direito trabalhista brasileiro. Gere checklists técnicos, claros e informativos sobre erros comuns em rescisões. Sempre em português do Brasil. Não use markdown, apenas texto simples estruturado. Não dê consultoria jurídica.",
          },
          { role: "user", content: prompt },
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
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar checklist" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const checklist = aiResponse.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ checklist }),
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
