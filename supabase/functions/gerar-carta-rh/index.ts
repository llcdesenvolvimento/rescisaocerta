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
      nomeCompleto,
      cpf,
      empresa,
      cnpj,
      cargo,
      infoAdicional,
      dataAdmissao,
      dataDesligamento,
      tipoDesligamento,
      salario,
      tempoContrato,
      totalBasicas,
      totalExtras,
      // Dados do quiz
      freqHorasExtras,
      desvioFuncaoFreq,
      pagamentoPorFora,
      adicionaisSelecionados,
      suspeitaErroEmpregador,
      dependentes,
      saldoFGTS,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formatarData = (data: string) => {
      if (!data) return "[data não informada]";
      try {
        return new Date(data).toLocaleDateString("pt-BR");
      } catch {
        return data;
      }
    };

    const formatarMoeda = (valor: number) => {
      return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    // Construir seção de irregularidades identificadas
    const irregularidades: string[] = [];

    if (freqHorasExtras && freqHorasExtras !== "Nunca" && freqHorasExtras !== "Raramente") {
      irregularidades.push(`- Horas extras habituais (frequência informada: "${freqHorasExtras}") que podem não ter sido incluídas na base de cálculo das verbas rescisórias, em desacordo com o art. 457, §1º da CLT e Súmula 264 do TST`);
    }

    if (desvioFuncaoFreq && desvioFuncaoFreq !== "Nunca" && desvioFuncaoFreq !== "Raramente") {
      irregularidades.push(`- Exercício habitual de funções distintas da contratada (frequência: "${desvioFuncaoFreq}"), configurando possível desvio de função nos termos do art. 468 da CLT, com direito a diferenças salariais e reflexos`);
    }

    if (pagamentoPorFora === "Sim") {
      irregularidades.push("- Pagamentos realizados por fora da folha de pagamento, configurando salário \"por fora\" nos termos do art. 457 da CLT, com integração à remuneração para todos os efeitos legais (FGTS, férias, 13º, INSS)");
    }

    const adicionais = adicionaisSelecionados || [];
    if (adicionais.includes("Periculosidade")) {
      irregularidades.push("- Exposição a condições de periculosidade (art. 193 da CLT), com possível direito ao adicional de 30% sobre o salário-base e reflexos nas verbas rescisórias");
    }
    if (adicionais.includes("Insalubridade")) {
      irregularidades.push("- Exposição a condições insalubres (art. 189 da CLT), com possível direito ao adicional de insalubridade e reflexos nas verbas rescisórias");
    }
    if (adicionais.includes("Trabalho noturno")) {
      irregularidades.push("- Realização de trabalho em horário noturno (art. 73 da CLT), com possível direito ao adicional noturno de 20% e hora noturna reduzida (52min30seg), com reflexos nas verbas rescisórias");
    }

    if (suspeitaErroEmpregador === "Sim" || suspeitaErroEmpregador === "sim") {
      irregularidades.push("- O(a) trabalhador(a) identificou indícios de erro ou irregularidade nos valores pagos pela empresa na rescisão");
    }

    const secaoIrregularidades = irregularidades.length > 0
      ? `\n\nIRREGULARIDADES E DIVERGÊNCIAS IDENTIFICADAS:\nForam identificadas as seguintes situações que impactam diretamente no cálculo correto das verbas rescisórias:\n\n${irregularidades.join("\n\n")}\n\nTodas essas situações geram reflexos diretos no cálculo do 13º salário proporcional, férias proporcionais + 1/3, aviso prévio indenizado, FGTS + multa de 40%, e demais verbas rescisórias.`
      : "";

    const secaoFGTS = saldoFGTS && saldoFGTS > 0
      ? `\nSaldo de FGTS informado pelo trabalhador: ${formatarMoeda(saldoFGTS)}`
      : "";

    const secaoDependentes = dependentes && dependentes > 0
      ? `\nNúmero de dependentes: ${dependentes} (relevante para cálculo de IRRF na rescisão)`
      : "";

    const diferencaTotal = (totalBasicas || 0) + (totalExtras || 0);

    const prompt = `Gere uma carta formal e completa de contestação trabalhista destinada ao setor de Recursos Humanos.

DADOS DO TRABALHADOR:
Nome: ${nomeCompleto || "[Nome não informado]"}
CPF: ${cpf || "[CPF não informado]"}
Cargo/Função: ${cargo || "[não informado]"}
Empresa: ${empresa || "[Empresa não informada]"}
CNPJ: ${cnpj || "[CNPJ não informado]"}
Data de admissão: ${formatarData(dataAdmissao)}
Data de desligamento: ${formatarData(dataDesligamento)}
Tipo de desligamento: ${tipoDesligamento || "[não informado]"}
Salário base registrado: ${formatarMoeda(salario)}
Tempo total de contrato: ${tempoContrato || "[não informado]"}${secaoDependentes}${secaoFGTS}${infoAdicional ? `\n\nINFORMAÇÕES ADICIONAIS RELATADAS PELO TRABALHADOR:\n${infoAdicional}` : ''}

VALORES APURADOS PELA CONFERÊNCIA:
Verbas básicas rescisórias calculadas: ${formatarMoeda(totalBasicas)}
Verbas extras identificadas (adicionais, horas extras, etc.): ${formatarMoeda(totalExtras)}
Valor total estimado correto: ${formatarMoeda(diferencaTotal)}
${secaoIrregularidades}

A carta deve seguir esta estrutura COMPLETA:

1. CABEÇALHO: Cidade, data de hoje, destinatário (RH da empresa), referência ao contrato

2. APRESENTAÇÃO: Qualificação completa do trabalhador (nome, CPF, período de trabalho, cargo/função se disponível)

3. OBJETO: Informar que a carta tem como objetivo a contestação formal dos valores constantes no Termo de Rescisão do Contrato de Trabalho (TRCT)

4. FUNDAMENTAÇÃO: 
   - Informar que foi realizada conferência técnica e detalhada dos valores rescisórios
   - Para CADA irregularidade identificada, dedicar um parágrafo explicando:
     a) O que foi identificado
     b) Qual o impacto financeiro estimado
     c) A fundamentação legal (artigo da CLT, súmula do TST)
   - Apresentar o cálculo consolidado mostrando a diferença entre o que deveria ter sido pago e o que foi pago

5. PEDIDO:
   - Solicitar formalmente a revisão completa do TRCT
   - Solicitar o pagamento das diferenças apuradas
   - Solicitar resposta formal e por escrito em até 5 (cinco) dias úteis
   - Informar que o trabalhador se reserva no direito de buscar as medidas cabíveis caso não haja resposta ou correção

6. ENCERRAMENTO:
   - Reforçar o tom conciliatório e o desejo de resolução administrativa
   - Espaço para assinatura com nome completo
   - Linha para data

REGRAS DE ESTILO:
- Tom FIRME porém respeitoso e profissional
- Linguagem formal, sem gírias, mas acessível
- Não ameaçar processo diretamente, mas deixar claro que existem medidas cabíveis
- Citar artigos da CLT e súmulas do TST quando fundamentar
- A carta deve ter pelo menos 40 linhas de conteúdo
- Formato em texto simples, pronto para copiar e colar
- Não usar markdown
- Use a data de hoje como data da carta`;

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
            content: "Você é um especialista em direito trabalhista brasileiro com vasta experiência em contestações administrativas. Gere cartas formais, completas, bem fundamentadas e profissionais. Sempre em português do Brasil. Não use markdown, apenas texto simples. Cada irregularidade deve ser detalhada com fundamentação legal específica. A carta deve ser robusta o suficiente para causar impacto no RH e motivar a correção dos valores.",
          },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 4000,
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
        JSON.stringify({ error: "Erro ao gerar carta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const carta = aiResponse.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ carta }),
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
