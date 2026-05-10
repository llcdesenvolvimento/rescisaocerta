// ===============================================
// TIPOS PARA FORMULÁRIO PÓS-PAGAMENTO V2
// ===============================================

// Enums para as perguntas
export type OpcaoSimNaoNaoSei = 'sim' | 'nao' | 'nao_sei';
export type OpcaoBancoHoras = 'sim' | 'nao' | 'nao_sei';
export type OpcaoControlePonto = 'sim' | 'nao' | 'parcial';
export type GrauInsalubridade = 'minimo' | 'medio' | 'maximo' | 'nao_sei';

// Dados vindos do fluxo anterior (já existentes)
export interface DadosFluxoAnterior {
  // Base
  salarioBrutoMensal: number;
  dataAdmissao: string;
  dataDesligamento: string;
  motivoRescisao: string;
  dependentes: number;
  saldoFGTS: number;
  // Extras do formulário principal
  freqHorasExtras: string; // "Sempre","Quase sempre","De vez em quando","Raramente","Nunca"
  desvioFuncaoFreq: string; // "Sempre","Quase sempre","De vez em quando","Raramente","Nunca"
  pagamentoPorFora: string; // "Sim","Não"
  adicionaisSelecionados: string[]; // ["Periculosidade","Insalubridade","Trabalho noturno","Nenhum desses"]
  suspeitaErroEmpregador: string; // "Sim","Não"
  // Valores do cálculo básico
  totalBasico: number;
}

// Perguntas adicionais - Jornada
export interface DadosJornadaV2 {
  cargaContratadaSemanaH: number; // ex: 44
  cargaRealSemanaH: number; // ex: 52 (inclui horas extras)
  bancoHoras: OpcaoBancoHoras;
  controlePonto: OpcaoControlePonto;
}

// Perguntas adicionais - Adicionais (condicionais)
export interface DadosAdicionaisV2 {
  // Trabalho noturno
  recebiaAdicionalNoturnoCorretamente?: OpcaoSimNaoNaoSei;
  horasNoturnasSemanaH?: number;
  // Periculosidade
  recebiaPericulosidadeCorretamente?: OpcaoSimNaoNaoSei;
  // Insalubridade
  grauInsalubridade?: GrauInsalubridade;
  recebiaInsalubridadeCorretamente?: OpcaoSimNaoNaoSei;
}

// Perguntas adicionais - Valores extras
export interface DadosValoresExtrasV2 {
  valorPorForaMensal?: number; // Se pagamentoPorFora = "Sim"
  diferencaSalarialEstimadaMensal?: number; // Se desvioFuncaoFreq != "Nunca"
}

// Formulário completo pós-pagamento V2
export interface FormularioPosPagamentoV2 {
  jornada: DadosJornadaV2;
  adicionais: DadosAdicionaisV2;
  valoresExtras: DadosValoresExtrasV2;
}

// Defaults
export const defaultDadosJornadaV2: DadosJornadaV2 = {
  cargaContratadaSemanaH: 44,
  cargaRealSemanaH: 44,
  bancoHoras: 'nao_sei',
  controlePonto: 'sim',
};

export const defaultDadosAdicionaisV2: DadosAdicionaisV2 = {};

export const defaultDadosValoresExtrasV2: DadosValoresExtrasV2 = {};

// ===============================================
// TIPOS PARA CÁLCULO DE EXTRAS
// ===============================================

export interface ItemExtra {
  nome: string;
  valorMensal: number;
  condicao?: string; // Condição ou observação
  isEstimativa: boolean;
}

export interface ResultadoExtras {
  horasExtras: ItemExtra | null;
  adicionalNoturno: ItemExtra | null;
  periculosidade: ItemExtra | null;
  insalubridade: ItemExtra | null;
  porFora: ItemExtra | null;
  desvioFuncao: ItemExtra | null;
  totalExtrasMensal: number;
  itensAplicaveis: ItemExtra[];
}

// ===============================================
// TIPOS PARA RELATÓRIO FINAL V2
// ===============================================

export interface DadosRelatorioV2 {
  // Seção A - Básico
  totalBasico: number;
  linhasBasico: Array<{ descricao: string; valor: number }>;
  // Seção B - Extras
  extras: ResultadoExtras;
  // Seção C - Erros
  temSuspeitaErro: boolean;
  temExtrasIdentificados: boolean;
  // Seção D - Próximos passos
  // (gerado dinamicamente)
}

// Salário mínimo 2026 (configurável)
export const SALARIO_MINIMO_2026 = 1518; // Atualizar conforme necessário
export const SEMANAS_POR_MES = 4.3333;
