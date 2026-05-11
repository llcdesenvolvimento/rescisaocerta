import { QuizQuestion } from "./types";

// ============================================================================
// QUIZ ESTRUTURADO EM 2 BLOCOS:
//
// 1) ESSENCIAL (8 perguntas) — todo mundo responde, gera cálculo básico das
//    verbas rescisórias (saldo, aviso, 13º, férias, FGTS, multa, INSS, IRRF).
//
// 2) EXTRAS (5 a 12 perguntas, condicionais) — oferecido APÓS o resultado
//    básico, com CTA "Descubra valores extras". Aciona os módulos de
//    oportunidade (horas extras, adicionais, desvio função, valor por fora).
//
// A copy se adapta a `situacaoAtual`:
//   - 'pensando' usa `perguntaPensando` / `opcoesPensando` (tempo presente,
//     hipotético).
//   - 'demitido_aviso' e 'ja_saiu' usam a versão padrão (tempo passado/presente
//     real).
// ============================================================================

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ============================================================================
  // BLOCO ESSENCIAL — 8 perguntas
  // ============================================================================

  // 1. Situação atual — sempre primeira pergunta, define copy do resto
  {
    id: "situacao-atual",
    pergunta: "Qual é a sua situação hoje?",
    subtexto: "A gente adapta as próximas perguntas conforme a sua resposta.",
    tipo: "single",
    campo: "situacaoAtual",
    etapa: 1,
    bloco: "essencial",
    opcoes: [
      {
        value: "ja_saiu",
        label: "Já saí da empresa",
        sublabel: "O contrato já foi encerrado",
      },
      {
        value: "demitido_aviso",
        label: "Estou cumprindo aviso prévio",
        sublabel: "Fui demitido ou pedi demissão e estou no aviso",
      },
      {
        value: "pensando",
        label: "Estou pensando em sair",
        sublabel: "Ainda não tomei a decisão",
      },
    ],
  },

  // 2. Tipo de desligamento (real) — para quem já saiu ou está no aviso
  {
    id: "tipo-desligamento",
    pergunta: "Como foi a sua saída da empresa?",
    subtexto: "Cada tipo tem regras diferentes. Escolha o que mais combina com o seu caso.",
    tipo: "single",
    campo: "tipoDesligamento",
    etapa: 1,
    bloco: "essencial",
    condicional: (formData) => formData.situacaoAtual !== "pensando",
    opcoesCondicional: (formData) => {
      const noAviso = formData.situacaoAtual === "demitido_aviso";
      const todas = [
        {
          value: "demissao_sem_justa_causa",
          label: "Fui demitido",
          sublabel: "A empresa me dispensou sem eu ter dado motivo grave",
        },
        {
          value: "pedido_demissao",
          label: "Pedi pra sair",
          sublabel: "Eu decidi sair da empresa por vontade própria",
        },
        {
          value: "acordo",
          label: "Foi um acordo entre os dois",
          sublabel: "A empresa e eu combinamos a saída em comum acordo",
        },
        {
          value: "justa_causa",
          label: "Fui demitido por justa causa",
          sublabel: "A empresa alegou falta grave para encerrar o contrato",
        },
        {
          value: "termino_contrato",
          label: "Acabou o contrato com prazo",
          sublabel: "Era contrato de experiência ou prazo determinado",
        },
      ];
      // Quem está no aviso prévio não está em justa causa
      return noAviso ? todas.filter((o) => o.value !== "justa_causa") : todas;
    },
  },

  // 2-bis. Tipo de desligamento (hipotético) — para quem está pensando
  {
    id: "tipo-desligamento-pensando",
    pergunta: "Se você sair hoje, qual seria a forma mais provável?",
    subtexto: "A gente simula seus direitos pra essa hipótese.",
    tipo: "single",
    campo: "tipoDesligamento",
    etapa: 1,
    bloco: "essencial",
    condicional: (formData) => formData.situacaoAtual === "pensando",
    opcoes: [
      {
        value: "pedido_demissao",
        label: "Pedir demissão",
        sublabel: "Sair por vontade própria",
      },
      {
        value: "acordo",
        label: "Tentar um acordo",
        sublabel: "Negociar a saída de comum acordo com a empresa",
      },
      {
        value: "demissao_sem_justa_causa",
        label: "Aguardar uma demissão",
        sublabel: "Esperar a empresa tomar a iniciativa",
      },
      {
        value: "nao_sei",
        label: "Ainda não sei",
        sublabel: "Quero entender meus direitos antes de decidir",
      },
    ],
  },

  // 3. Datas
  {
    id: "periodo-contrato",
    pergunta: "Quando você entrou e quando saiu?",
    subtexto: "Está na carteira de trabalho ou no app Carteira Digital. **Se não lembrar o dia exato, pode usar uma data aproximada.**",
    perguntaPensando: "Desde quando você está nessa empresa?",
    subtextoPensando: "Está na carteira de trabalho ou no app Carteira Digital. **Se não lembrar o dia exato, pode usar uma data aproximada.**",
    tipo: "input-date-range",
    campo: "periodoContrato",
    etapa: 1,
    bloco: "essencial",
  },

  // 4. Salário
  {
    id: "salario-bruto",
    pergunta: "Quanto você recebia por mês?",
    subtexto: "Inclua seu salário fixo + a média de comissões e bônus.",
    perguntaPensando: "Quanto você recebe por mês?",
    subtextoPensando: "Inclua seu salário fixo + a média de comissões e bônus.",
    tipo: "input-currency",
    campo: "salarioFixo",
    etapa: 1,
    bloco: "essencial",
  },

  // 5. Aviso prévio (real) — para quem já saiu (não é justa causa nem fim de contrato)
  {
    id: "tipo-aviso-previo",
    pergunta: "Como foi o seu aviso prévio?",
    subtexto: "É o período entre saber da demissão e sair de fato.",
    tipo: "single",
    campo: "tipoAvisoPrevio",
    etapa: 2,
    bloco: "essencial",
    condicional: (formData) => {
      const tipo = formData.tipoDesligamento as string;
      return (
        formData.situacaoAtual !== "pensando" &&
        formData.situacaoAtual !== "demitido_aviso" &&
        tipo !== "justa_causa" &&
        tipo !== "termino_contrato" &&
        tipo !== "nao_sei"
      );
    },
    opcoes: [
      {
        value: "indenizado",
        label: "Recebi e fui embora no dia",
        sublabel: "A empresa pagou o aviso e me liberou na hora",
      },
      {
        value: "trabalhado",
        label: "Trabalhei o aviso",
        sublabel: "Cumpri os 30 dias (ou mais) trabalhando normalmente",
      },
      {
        value: "nao_cumprido",
        label: "Saí sem cumprir",
        sublabel: "Pedi pra sair e não trabalhei os 30 dias",
      },
      {
        value: "nao_se_aplica",
        label: "Não tenho aviso prévio",
        sublabel: "Ex: justa causa ou fim de contrato",
      },
    ],
  },

  // 5-bis. Aviso prévio (hipotético) — para quem está pensando
  {
    id: "tipo-aviso-previo-pensando",
    pergunta: "Se pedir demissão, pretende cumprir o aviso de 30 dias?",
    subtexto: "Isso muda o valor final da sua rescisão.",
    tipo: "single",
    campo: "tipoAvisoPrevio",
    etapa: 2,
    bloco: "essencial",
    condicional: (formData) => formData.situacaoAtual === "pensando" && formData.tipoDesligamento !== "nao_sei",
    opcoes: [
      {
        value: "trabalhado",
        label: "Sim, trabalharia normalmente",
        sublabel: "Cumpriria os 30 dias na empresa",
      },
      {
        value: "nao_cumprido",
        label: "Tentaria sair sem cumprir",
        sublabel: "O valor do aviso pode ser descontado da rescisão",
      },
      {
        value: "nao_se_aplica",
        label: "Ainda não sei",
        sublabel: "Quero entender antes de decidir",
      },
    ],
  },

  // 6. Férias vencidas
  {
    id: "ferias-vencidas",
    pergunta: "Você tirou todas as férias que tinha direito?",
    subtexto: "Cada 12 meses trabalhados, a empresa precisa te dar férias. Se passou disso sem tirar, vira valor a receber.",
    perguntaPensando: "Você tirou todas as férias que tem direito até hoje?",
    subtextoPensando: "Cada 12 meses trabalhados, a empresa precisa te dar férias. Se passou disso sem tirar, vira valor a receber.",
    tipo: "single",
    campo: "periodosFeriasVencidas",
    etapa: 3,
    bloco: "essencial",
    opcoes: [
      {
        value: "0",
        label: "Sim, tirei tudo em dia",
        sublabel: "Tirei férias dentro do prazo de cada 12 meses",
      },
      {
        value: "1",
        label: "Tem 1 período que não tirei",
        sublabel: "Completei 12 meses e a empresa não me deu férias",
      },
      {
        value: "2",
        label: "Tem 2 ou mais períodos atrasados",
        sublabel: "Mais de um ano de férias acumuladas sem tirar",
      },
      {
        value: "nunca",
        label: "Nunca tirei férias nesse emprego",
        sublabel: "Trabalhei muito tempo sem ter férias concedidas",
      },
    ],
  },

  // 7. Dependentes IR
  {
    id: "dependentes",
    pergunta: "Quantos dependentes você declara no Imposto de Renda?",
    subtexto: "Filhos menores de 21 anos (ou até 24 se cursando faculdade), cônjuge sem renda, pais que dependem de você. **Se não tem nenhum, deixe 0.**",
    tipo: "input-number",
    campo: "numDependentes",
    etapa: 2,
    bloco: "essencial",
  },

  // 8. FGTS (opcional)
  {
    id: "saldo-fgts",
    pergunta: "Você sabe o saldo do seu FGTS?",
    subtexto: "Se souber, ajuda a deixar a conta mais precisa. Pode olhar no app FGTS ou Caixa.",
    subtextoDestaque: "Se não souber, pulamos isso. A gente estima pelo seu tempo de empresa.",
    tipo: "input-currency",
    campo: "saldoFGTS",
    etapa: 2,
    bloco: "essencial",
    opcional: true,
  },

  // ============================================================================
  // BLOCO EXTRAS — perguntas condicionais que aumentam o valor da rescisão
  // Apresentadas APÓS o usuário ver o resultado básico, em uma tela CTA
  // "Descubra valores extras que você pode ter a receber".
  // ============================================================================

  // E1. Horas extras
  {
    id: "horas-extras",
    pergunta: "Quantas horas extras você fazia por mês, em média?",
    subtexto: "Hora extra é qualquer minuto além da jornada combinada. Vale dinheiro e mexe em férias, 13º e FGTS.",
    perguntaPensando: "Quantas horas extras você faz por mês, em média?",
    subtextoPensando: "Hora extra é qualquer minuto além da jornada combinada. Vale dinheiro e mexe em férias, 13º e FGTS.",
    tipo: "single",
    campo: "faziaHorasExtras",
    etapa: 4,
    bloco: "extras",
    opcoes: [
      { value: "nao_fazia", label: "Nenhuma", sublabel: "Sempre saía no horário" },
      { value: "vez_em_quando", label: "Até 10h por mês", sublabel: "Cerca de 2-3h por semana" },
      { value: "quase_sempre", label: "10 a 30h por mês", sublabel: "Cerca de 3-7h por semana" },
      { value: "sempre", label: "Mais de 30h por mês", sublabel: "Mais de 7h por semana" },
    ],
    opcoesPensando: [
      { value: "nao_fazia", label: "Nenhuma", sublabel: "Saio sempre no horário" },
      { value: "vez_em_quando", label: "Até 10h por mês", sublabel: "Cerca de 2-3h por semana" },
      { value: "quase_sempre", label: "10 a 30h por mês", sublabel: "Cerca de 3-7h por semana" },
      { value: "sempre", label: "Mais de 30h por mês", sublabel: "Mais de 7h por semana" },
    ],
  },

  // E2. Banco de horas (se fazia hora extra)
  {
    id: "banco-horas",
    pergunta: "A empresa tinha banco de horas?",
    subtexto: "Banco de horas é quando a hora extra é trocada por folga em vez de paga em dinheiro.",
    perguntaPensando: "A empresa tem banco de horas?",
    subtextoPensando: "Banco de horas é quando a hora extra é trocada por folga em vez de paga em dinheiro.",
    tipo: "single",
    campo: "bancoHoras",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      return formData.faziaHorasExtras !== "nao_fazia" && !!formData.faziaHorasExtras;
    },
    opcoes: [
      { value: "sim", label: "Sim", sublabel: "As horas extras eram compensadas com folgas" },
      { value: "nao", label: "Não", sublabel: "As horas extras deveriam ser pagas em dinheiro" },
      { value: "nao_sei", label: "Não sei", sublabel: "Quero que vocês confiram" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Sim", sublabel: "As horas extras são compensadas com folgas" },
      { value: "nao", label: "Não", sublabel: "As horas extras devem ser pagas em dinheiro" },
      { value: "nao_sei", label: "Não sei", sublabel: "Quero que vocês confiram" },
    ],
  },

  // E3. Desvio de função
  {
    id: "funcoes-diferentes",
    pergunta: "Você fazia tarefas de um cargo acima do seu?",
    subtexto: "Por exemplo: registrado como auxiliar mas fazendo trabalho de analista. Isso é desvio de função e a CLT cobre.",
    perguntaPensando: "Você faz tarefas de um cargo acima do seu?",
    subtextoPensando: "Por exemplo: registrado como auxiliar mas fazendo trabalho de analista. Isso é desvio de função e a CLT cobre.",
    tipo: "single",
    campo: "funcoesDiferentes",
    etapa: 4,
    bloco: "extras",
    opcoes: [
      { value: "sim", label: "Sim, com certeza", sublabel: "Fazia tarefas de cargo superior ao registrado" },
      { value: "nao", label: "Não, fazia o do meu cargo", sublabel: "As tarefas eram compatíveis com o que está na carteira" },
      { value: "nao_sei", label: "Acho que sim, mas não tenho certeza", sublabel: "Quero que vocês confiram" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Sim, com certeza", sublabel: "Faço tarefas de cargo superior ao registrado" },
      { value: "nao", label: "Não, faço o do meu cargo", sublabel: "As tarefas são compatíveis com o que está na carteira" },
      { value: "nao_sei", label: "Acho que sim, mas não tenho certeza", sublabel: "Quero que vocês confiram" },
    ],
  },

  // E4. Valor por fora
  {
    id: "valor-por-fora",
    pergunta: "Você recebia algum valor por fora do salário registrado?",
    subtexto: "Por exemplo: PIX da empresa, dinheiro na mão, depósito de outra pessoa. **Sem julgamento.** A gente pergunta porque isso entra na conta de férias, 13º e FGTS.",
    perguntaPensando: "Você recebe algum valor por fora do salário registrado?",
    subtextoPensando: "Por exemplo: PIX da empresa, dinheiro na mão, depósito de outra pessoa. **Sem julgamento.** A gente pergunta porque isso entra na conta de férias, 13º e FGTS.",
    tipo: "single",
    campo: "valorPorFora",
    etapa: 4,
    bloco: "extras",
    opcoes: [
      { value: "nao", label: "Não, tudo era registrado", sublabel: "O que recebia estava na carteira de trabalho" },
      { value: "sim", label: "Sim, recebia parte por fora", sublabel: "Parte do salário vinha em dinheiro ou PIX sem registro" },
    ],
    opcoesPensando: [
      { value: "nao", label: "Não, tudo é registrado", sublabel: "O que recebo está na carteira de trabalho" },
      { value: "sim", label: "Sim, recebo parte por fora", sublabel: "Parte do salário vem em dinheiro ou PIX sem registro" },
    ],
  },

  // E5. Valor por fora mensal (se recebia)
  {
    id: "valor-por-fora-mensal",
    pergunta: "Mais ou menos quanto por mês?",
    subtexto: "Pode colocar uma média aproximada. Esse valor deveria estar entrando na base de FGTS, 13º e férias.",
    perguntaPensando: "Mais ou menos quanto por mês?",
    subtextoPensando: "Pode colocar uma média aproximada. Esse valor deveria estar entrando na base de FGTS, 13º e férias.",
    tipo: "input-currency",
    campo: "valorPorForaMensal",
    etapa: 4,
    bloco: "extras",
    opcional: true,
    condicional: (formData) => formData.valorPorFora === "sim",
  },

  // E6. Adicionais (multi-select)
  {
    id: "adicionais",
    pergunta: "Marque tudo que se aplica ao seu trabalho:",
    subtexto: "Cada um desses adicionais a CLT manda pagar a mais, e muito empregador esquece.",
    perguntaPensando: "Marque tudo que se aplica ao seu trabalho:",
    subtextoPensando: "Cada um desses adicionais a CLT manda pagar a mais, e muito empregador esquece.",
    tipo: "multi",
    campo: "adicionaisTrabalho",
    etapa: 4,
    bloco: "extras",
    opcoes: [
      { value: "trabalho_noturno", label: "Trabalhava à noite (depois das 22h)", sublabel: "Adicional noturno: +20% sobre a hora normal" },
      { value: "insalubridade", label: "Local insalubre (calor, ruído, químicos, etc.)", sublabel: "Adicional de insalubridade: +10% a 40%" },
      { value: "periculosidade", label: "Atividade perigosa (eletricidade, inflamáveis, segurança)", sublabel: "Adicional de periculosidade: +30%" },
      { value: "nenhum", label: "Nenhum dos anteriores", sublabel: "Trabalho em condições normais" },
    ],
    opcoesPensando: [
      { value: "trabalho_noturno", label: "Trabalho à noite (depois das 22h)", sublabel: "Adicional noturno: +20% sobre a hora normal" },
      { value: "insalubridade", label: "Local insalubre (calor, ruído, químicos, etc.)", sublabel: "Adicional de insalubridade: +10% a 40%" },
      { value: "periculosidade", label: "Atividade perigosa (eletricidade, inflamáveis, segurança)", sublabel: "Adicional de periculosidade: +30%" },
      { value: "nenhum", label: "Nenhum dos anteriores", sublabel: "Trabalho em condições normais" },
    ],
  },

  // E7. Noturno recebia corretamente?
  {
    id: "noturno-recebia",
    pergunta: "Você recebia adicional noturno corretamente?",
    subtexto: "O adicional noturno é de pelo menos 20% sobre a hora diurna (CLT art. 73).",
    perguntaPensando: "Você recebe adicional noturno corretamente?",
    subtextoPensando: "O adicional noturno é de pelo menos 20% sobre a hora diurna (CLT art. 73).",
    tipo: "single",
    campo: "recebiaAdicionalNoturno",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      const adicionais = formData.adicionaisTrabalho as string[] | undefined;
      return Array.isArray(adicionais) && adicionais.includes("trabalho_noturno");
    },
    opcoes: [
      { value: "sim", label: "Sim, recebia corretamente" },
      { value: "nao", label: "Não recebia" },
      { value: "nao_sei", label: "Não sei" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Sim, recebo corretamente" },
      { value: "nao", label: "Não recebo" },
      { value: "nao_sei", label: "Não sei" },
    ],
  },

  // E8. Horas noturnas semanais (só se não recebia certo)
  {
    id: "noturno-horas",
    pergunta: "Quantas horas noturnas você trabalhava por semana?",
    subtexto: "Considere o período entre 22h e 5h.",
    perguntaPensando: "Quantas horas noturnas você trabalha por semana?",
    subtextoPensando: "Considere o período entre 22h e 5h.",
    tipo: "single",
    campo: "horasNoturnasSemana",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      const adicionais = formData.adicionaisTrabalho as string[] | undefined;
      return (
        Array.isArray(adicionais) &&
        adicionais.includes("trabalho_noturno") &&
        formData.recebiaAdicionalNoturno !== "sim"
      );
    },
    opcoes: [
      { value: "ate_10", label: "Até 10 horas/semana" },
      { value: "10_a_20", label: "10 a 20 horas/semana" },
      { value: "20_a_30", label: "20 a 30 horas/semana" },
      { value: "mais_30", label: "Mais de 30 horas/semana" },
    ],
  },

  // E9. Grau de insalubridade (se marcou)
  {
    id: "insalubridade-grau",
    pergunta: "Qual o grau de insalubridade do seu trabalho?",
    subtexto: "O grau influencia no percentual do adicional (CLT art. 192).",
    tipo: "single",
    campo: "grauInsalubridade",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      const adicionais = formData.adicionaisTrabalho as string[] | undefined;
      return Array.isArray(adicionais) && adicionais.includes("insalubridade");
    },
    opcoes: [
      { value: "minimo", label: "Grau mínimo (10%)", sublabel: "Exposição leve a agentes nocivos" },
      { value: "medio", label: "Grau médio (20%)", sublabel: "Exposição moderada a agentes nocivos" },
      { value: "maximo", label: "Grau máximo (40%)", sublabel: "Exposição intensa a agentes nocivos" },
      { value: "nao_sei", label: "Não sei", sublabel: "Quero que seja verificado" },
    ],
  },

  // E10. Insalubridade recebia corretamente?
  {
    id: "insalubridade-recebia",
    pergunta: "Você recebia adicional de insalubridade corretamente?",
    subtexto: "O adicional é calculado sobre o salário mínimo.",
    perguntaPensando: "Você recebe adicional de insalubridade corretamente?",
    subtextoPensando: "O adicional é calculado sobre o salário mínimo.",
    tipo: "single",
    campo: "recebiaInsalubridade",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      const adicionais = formData.adicionaisTrabalho as string[] | undefined;
      return Array.isArray(adicionais) && adicionais.includes("insalubridade");
    },
    opcoes: [
      { value: "sim", label: "Sim, recebia corretamente" },
      { value: "nao", label: "Não recebia" },
      { value: "nao_sei", label: "Não sei" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Sim, recebo corretamente" },
      { value: "nao", label: "Não recebo" },
      { value: "nao_sei", label: "Não sei" },
    ],
  },

  // E11. Periculosidade recebia corretamente?
  {
    id: "periculosidade-recebia",
    pergunta: "Você recebia adicional de periculosidade corretamente?",
    subtexto: "O adicional de periculosidade é de 30% sobre o salário-base (CLT art. 193).",
    perguntaPensando: "Você recebe adicional de periculosidade corretamente?",
    subtextoPensando: "O adicional de periculosidade é de 30% sobre o salário-base (CLT art. 193).",
    tipo: "single",
    campo: "recebiaPericulosidade",
    etapa: 4,
    bloco: "extras",
    condicional: (formData) => {
      const adicionais = formData.adicionaisTrabalho as string[] | undefined;
      return Array.isArray(adicionais) && adicionais.includes("periculosidade");
    },
    opcoes: [
      { value: "sim", label: "Sim, recebia corretamente (30%)" },
      { value: "nao", label: "Não recebia" },
      { value: "nao_sei", label: "Não sei" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Sim, recebo corretamente (30%)" },
      { value: "nao", label: "Não recebo" },
      { value: "nao_sei", label: "Não sei" },
    ],
  },

  // E12. Pergunta final (motivacional)
  {
    id: "erro-rescisao",
    pergunta: "Pra fechar: o que mais te preocupa nessa rescisão?",
    subtexto: "Sua resposta nos ajuda a destacar o que mais importa pra você na análise. Sem resposta certa ou errada.",
    perguntaPensando: "Pra fechar: o que mais te preocupa nessa saída?",
    subtextoPensando: "Sua resposta nos ajuda a destacar o que mais importa pra você na análise. Sem resposta certa ou errada.",
    tipo: "single",
    campo: "erroNaRescisao",
    etapa: 4,
    bloco: "extras",
    progressoFixo: 99,
    opcoes: [
      { value: "sim", label: "Garantir que recebi tudo que tenho direito", sublabel: "Quero conferir cada verba com calma" },
      { value: "talvez", label: "Saber se algum valor ficou de fora", sublabel: "Horas extras, adicionais, desvio de função" },
      { value: "nao", label: "Entender o que fazer antes de assinar", sublabel: "Quero ir pro RH com os números na mão" },
      { value: "nao_sei_avaliar", label: "Só quero entender meus direitos", sublabel: "Não tenho certeza do que cobrar nem como" },
    ],
    opcoesPensando: [
      { value: "sim", label: "Saber quanto eu teria direito a receber", sublabel: "Quero ver o valor antes de tomar decisão" },
      { value: "talvez", label: "Comparar os tipos de saída", sublabel: "Ver o que pesa mais: pedir, acordo ou esperar" },
      { value: "nao", label: "Saber o que pode estar faltando", sublabel: "Horas extras, adicionais, desvio de função" },
      { value: "nao_sei_avaliar", label: "Só quero entender meus direitos", sublabel: "Não tenho certeza do que pedir nem como" },
    ],
  },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Retorna as perguntas ativas filtradas pelo bloco e pelas condicionais.
 *
 * - Padrão (`mode: 'essencial'`): só o bloco essencial.
 * - `mode: 'extras'`: APENAS o bloco extras (não inclui essencial).
 *   Útil quando o usuário já completou o essencial e está retornando para
 *   responder as perguntas opcionais via /quiz/extras-intro.
 * - `mode: 'todas'`: essencial + extras (compatibilidade para callers que
 *   precisam ver o quiz completo, ex.: páginas que iteram para mostrar respostas).
 */
export type QuizMode = 'essencial' | 'extras' | 'todas';

export function getActiveQuestions(
  formData: Record<string, unknown>,
  options: { mode?: QuizMode; incluirExtras?: boolean } = {},
): QuizQuestion[] {
  // Suporte ao parâmetro legado `incluirExtras`: true → 'todas', false → 'essencial'
  const mode: QuizMode =
    options.mode ?? (options.incluirExtras ? 'todas' : 'essencial');

  return QUIZ_QUESTIONS.filter((q) => {
    if (mode === 'essencial' && q.bloco !== 'essencial') return false;
    if (mode === 'extras' && q.bloco !== 'extras') return false;
    if (!q.condicional) return true;
    return q.condicional(formData);
  });
}

/** Obter etapa atual baseada no índice da pergunta */
export function getCurrentEtapa(questionIndex: number, questions: QuizQuestion[]): number {
  if (questionIndex >= questions.length) return 4;
  return questions[questionIndex]?.etapa || 1;
}

/** Obter total de etapas */
export function getTotalEtapas(): number {
  return 4;
}
