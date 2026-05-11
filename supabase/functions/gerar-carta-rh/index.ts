import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================================================
// Geração de Carta de Contestação ao RH — Anthropic Claude
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Max-Age": "86400",
};

const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4000;

const SYSTEM_PROMPT = `Você é um(a) advogado(a) trabalhista brasileiro(a) com 15 anos de experiência em contestações administrativas perante o RH de empresas. Sua escrita é técnica, firme, respeitosa e baseada na CLT.

Regras absolutas:
- Português do Brasil, em texto simples (sem markdown, sem bullets *, sem cabeçalhos com #).
- Use apenas os dados fornecidos. NUNCA invente valores, irregularidades, datas, cargos ou empresas.
- Quando um dado estiver marcado como "[não informado]", deixe entre colchetes na carta para o trabalhador preencher.
- Cite artigos da CLT (ex.: art. 477, art. 457, §1º), súmulas do TST e leis específicas quando fundamentar uma irregularidade.
- Tom: firme, sem ameaças explícitas, mas indicando que existem medidas cabíveis caso a empresa não responda.
- A carta deve estar pronta para copiar e colar no e-mail/papel — sem placeholders genéricos do tipo "[insira aqui]" (exceto para campos do trabalhador que ele preencherá manualmente).`;

interface CartaInput {
  nomeCompleto?: string;
  cpf?: string;
  empresa?: string;
  cnpj?: string;
  cargo?: string;
  infoAdicional?: string;
  dataAdmissao?: string;
  dataDesligamento?: string;
  tipoDesligamento?: string;
  salario?: number;
  tempoContrato?: string;
  totalBasicas?: number;
  totalExtras?: number;
  freqHorasExtras?: string;
  desvioFuncaoFreq?: string;
  pagamentoPorFora?: string;
  adicionaisSelecionados?: string[];
  suspeitaErroEmpregador?: string;
  dependentes?: number;
  saldoFGTS?: number;
}

function formatarData(data?: string): string {
  if (!data) return "[data não informada]";
  try {
    const iso = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const d = iso
      ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      : new Date(data);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return data;
  }
}

function formatarMoeda(valor?: number): string {
  return (valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function montarIrregularidades(input: CartaInput): string[] {
  const lista: string[] = [];

  if (
    input.freqHorasExtras &&
    !["Nunca", "Raramente", ""].includes(input.freqHorasExtras)
  ) {
    lista.push(
      `Realização habitual de horas extras (frequência informada: "${input.freqHorasExtras}"), com possível ausência de inclusão na base de cálculo das verbas rescisórias. Aplicam-se o art. 7º, XVI, CF, art. 59 da CLT, Súmula 264 do TST e Súmula 376 do TST (reflexos em 13º, férias + 1/3, FGTS e aviso prévio).`,
    );
  }

  if (
    input.desvioFuncaoFreq &&
    !["Nunca", "Raramente", ""].includes(input.desvioFuncaoFreq)
  ) {
    lista.push(
      `Exercício habitual de funções diversas da contratada (frequência: "${input.desvioFuncaoFreq}"), caracterizando possível desvio de função nos termos do art. 460 da CLT e da Súmula 6 do TST, com direito a diferenças salariais e reflexos.`,
    );
  }

  if (input.pagamentoPorFora === "Sim") {
    lista.push(
      `Pagamentos realizados fora da folha de pagamento, configurando natureza salarial nos termos do art. 457, §1º da CLT e da Súmula 354 do TST, com integração à remuneração para todos os efeitos (FGTS, 13º, férias + 1/3, INSS).`,
    );
  }

  const adicionais = input.adicionaisSelecionados || [];
  if (adicionais.includes("Periculosidade")) {
    lista.push(
      `Exposição a condições de periculosidade (art. 193 da CLT), com possível direito ao adicional de 30% sobre o salário-base e reflexos nas verbas rescisórias. Súmula 191 do TST sobre a base de cálculo.`,
    );
  }
  if (adicionais.includes("Insalubridade")) {
    lista.push(
      `Exposição a agentes insalubres (art. 189 e 192 da CLT, Súmula Vinculante 4 do STF), com possível direito ao adicional de insalubridade (10%, 20% ou 40% do salário mínimo, conforme grau) e respectivos reflexos.`,
    );
  }
  if (adicionais.includes("Trabalho noturno")) {
    lista.push(
      `Realização de trabalho em horário noturno (art. 73 da CLT), com direito ao adicional noturno de 20% e à hora noturna reduzida (52min30s = 1h), com reflexos nas verbas rescisórias.`,
    );
  }

  if (
    input.suspeitaErroEmpregador === "Sim" ||
    input.suspeitaErroEmpregador === "sim"
  ) {
    lista.push(
      `O(a) trabalhador(a) identificou, de forma fundamentada, indícios de divergência nos valores pagos a título de rescisão.`,
    );
  }

  return lista;
}

function montarPrompt(input: CartaInput): string {
  const irregularidades = montarIrregularidades(input);
  const blocoIrregularidades =
    irregularidades.length > 0
      ? `\n\nIRREGULARIDADES IDENTIFICADAS (use exatamente estas, sem inventar outras):\n${irregularidades
          .map((it, i) => `${i + 1}. ${it}`)
          .join("\n\n")}`
      : "";

  const totalEstimado = (input.totalBasicas || 0) + (input.totalExtras || 0);

  return `Gere uma carta formal de contestação trabalhista destinada ao setor de Recursos Humanos da empresa.

DADOS DO TRABALHADOR:
- Nome: ${input.nomeCompleto || "[Nome não informado]"}
- CPF: ${input.cpf || "[CPF não informado]"}
- Cargo: ${input.cargo || "[não informado]"}
- Empresa: ${input.empresa || "[Empresa não informada]"}
- CNPJ: ${input.cnpj || "[CNPJ não informado]"}
- Admissão: ${formatarData(input.dataAdmissao)}
- Desligamento: ${formatarData(input.dataDesligamento)}
- Tipo de desligamento: ${input.tipoDesligamento || "[não informado]"}
- Salário base registrado: ${formatarMoeda(input.salario)}
- Tempo de contrato: ${input.tempoContrato || "[não informado]"}
${input.dependentes ? `- Dependentes para IRRF: ${input.dependentes}` : ""}
${input.saldoFGTS && input.saldoFGTS > 0 ? `- Saldo de FGTS informado: ${formatarMoeda(input.saldoFGTS)}` : ""}
${input.infoAdicional ? `\nINFORMAÇÕES ADICIONAIS RELATADAS:\n${input.infoAdicional}` : ""}

VALORES CONFERIDOS:
- Verbas básicas calculadas (CLT): ${formatarMoeda(input.totalBasicas)}
- Verbas extras identificadas (adicionais, horas extras, integrações): ${formatarMoeda(input.totalExtras)}
- Total estimado correto: ${formatarMoeda(totalEstimado)}${blocoIrregularidades}

ESTRUTURA OBRIGATÓRIA (use exatamente esta ordem):

1. CABEÇALHO: cidade e data de hoje (use a data atual), destinatário ("À empresa [Nome da Empresa] — Departamento de Recursos Humanos"), assunto/referência.

2. QUALIFICAÇÃO: parágrafo apresentando o(a) trabalhador(a) com nome, CPF, cargo e período do contrato.

3. OBJETO: parágrafo curto declarando que a carta tem como objeto a contestação formal dos valores do TRCT, em conformidade com o art. 477 da CLT.

4. FUNDAMENTAÇÃO: um parágrafo para CADA irregularidade listada acima. Em cada parágrafo, descreva o fato, o impacto financeiro estimado e a base legal específica. Se não houver irregularidades, escreva um único parágrafo sobre a conferência técnica feita.

5. PEDIDO: solicite formalmente (a) revisão completa do TRCT, (b) pagamento das diferenças, (c) resposta por escrito em até 5 (cinco) dias úteis, (d) ressalvas quanto às medidas administrativas e judiciais cabíveis caso não haja resposta.

6. ENCERRAMENTO: tom conciliatório reforçando o desejo de resolução administrativa. Linha de assinatura com nome do trabalhador.

REGRAS DE ESTILO:
- Texto corrido em parágrafos. Sem listas, sem markdown.
- Linguagem formal, acessível, sem juridiquês excessivo.
- Mínimo de 40 linhas, máximo de 80 linhas.
- Não ameace processar diretamente — fale em "medidas cabíveis".
- Use a data de hoje (formato dd/mm/aaaa) no cabeçalho.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input = (await req.json()) as CartaInput;

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
        JSON.stringify({ error: "Erro ao gerar carta" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const aiResponse = await response.json();
    // Anthropic retorna { content: [ { type: 'text', text: '...' } ] }
    const carta: string = aiResponse.content
      ?.filter((b: { type: string }) => b.type === "text")
      ?.map((b: { text: string }) => b.text)
      ?.join("\n") || "";

    if (!carta) {
      console.error("Resposta vazia do modelo:", JSON.stringify(aiResponse));
      return new Response(
        JSON.stringify({ error: "Modelo retornou conteúdo vazio" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ carta }), {
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
