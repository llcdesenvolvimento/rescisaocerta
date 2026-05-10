// ===============================================
// TIPOS PARA FORMULÁRIO PÓS-PAGAMENTO
// ===============================================

// PASSO A - Jornada de trabalho
export interface DadosJornada {
  horarioContratado: string; // ex: "08:00-17:00"
  horarioRealMedio: string; // ex: "08:00-19:00"
  diasTrabalhadosPorSemana: number;
  trabalhavaSabados: boolean;
  intervaloAlmocoCompleto: boolean;
}

// PASSO B - Valores que impactam base de cálculo
export interface DadosValores {
  recebiaComissao: boolean;
  mediaMensalComissao: number;
  adicionalNoturno: boolean;
  insalubridade: boolean;
  periculosidade: boolean;
  recebiaPorFora: boolean;
  mediaMensalPorFora: number;
}

// PASSO C - Tempo, férias e 13º
export interface DadosTempo {
  quandoUltimasFerias: string; // mês/ano
  tirouFeriasCorretamente: 'sim' | 'nao' | 'nao_sei';
  mesesTrabalhadosAnoRescisao: number;
  avisoPrevioConfirmado: 'trabalhado' | 'indenizado';
}

// Formulário completo pós-pagamento
export interface FormularioPosPagamento {
  jornada: DadosJornada;
  valores: DadosValores;
  tempo: DadosTempo;
}

// Default values
export const defaultDadosJornada: DadosJornada = {
  horarioContratado: '08:00-17:00',
  horarioRealMedio: '08:00-17:00',
  diasTrabalhadosPorSemana: 5,
  trabalhavaSabados: false,
  intervaloAlmocoCompleto: true,
};

export const defaultDadosValores: DadosValores = {
  recebiaComissao: false,
  mediaMensalComissao: 0,
  adicionalNoturno: false,
  insalubridade: false,
  periculosidade: false,
  recebiaPorFora: false,
  mediaMensalPorFora: 0,
};

export const defaultDadosTempo: DadosTempo = {
  quandoUltimasFerias: '',
  tirouFeriasCorretamente: 'nao_sei',
  mesesTrabalhadosAnoRescisao: 12,
  avisoPrevioConfirmado: 'indenizado',
};

// ===============================================
// TIPOS PARA RESULTADO REFINADO
// ===============================================

export interface ItemVerba {
  nome: string;
  valor: number;
}

export type NivelOportunidade = 'baixo' | 'medio' | 'alto';

export interface ResultadoRefinado {
  valor_base: number;
  valor_refinado: number;
  diferenca: number;
  nivel_oportunidade: NivelOportunidade;
  principais_fatores: string[];
  itens: ItemVerba[];
  // Dados do formulário para contexto no relatório
  dados_informados: {
    jornada: DadosJornada;
    valores: DadosValores;
    tempo: DadosTempo;
  };
}

// ===============================================
// TIPOS PARA RELATÓRIO AI
// ===============================================

export interface RelatorioAI {
  resumo: string;
  deOndeVemDiferenca: string;
  detalhamentoVerbas: string;
  checklistPratico: string;
  proximosPassos: string;
  disclaimer: string;
  loading?: boolean;
  error?: string;
}

export type EtapaRelatorio = 'resumo' | 'detalhamento' | 'checklist';
