export type TipoDesligamento = 
  | 'demissao_sem_justa_causa' 
  | 'pedido_demissao' 
  | 'acordo' 
  | 'termino_contrato'
  | 'termino_antecipado_empregador'
  | 'termino_antecipado_empregado'
  | 'justa_causa'
  | 'rescisao_indireta';

export type TipoAvisoPrevio = 'trabalhado' | 'indenizado' | 'nao_cumprido' | 'metade' | 'nao_se_aplica';

export type FrequenciaHorasExtras = 'sempre' | 'quase_sempre' | 'vez_em_quando' | 'raramente' | 'nao_fazia';

export type StatusFeriasVencidas = 'sim' | 'nao' | 'nao_sei';

export type StatusPagamentoRescisao = 'sim' | 'nao' | 'parcial' | 'ainda_nao';

export type OpcaoSimNao = 'sim' | 'nao';

export type OpcaoSimNaoNaoSei = 'sim' | 'nao' | 'nao_sei';

export type OpcaoErroRescisao = 'sim' | 'talvez' | 'nao' | 'nao_sei_avaliar';

export type AdicionalTrabalho = 'periculosidade' | 'insalubridade' | 'trabalho_noturno' | 'nenhum';

// Bloco 1 - Dados do Contrato
export interface Bloco1Data {
  situacaoAtual: 'ja_saiu' | 'demitido_aviso' | 'pediu_aviso' | 'pensando' | '';
  objetivo: 'simular' | 'conferir' | 'entender' | '';
  tipoDesligamento: TipoDesligamento | '';
  dataAdmissao: string; // DD/MM/AAAA
  dataDesligamento: string; // DD/MM/AAAA
  aindaTrabalhando: boolean;
  salarioFixo: number;
  mediaVariavel: number;
  temVariavel: boolean;
}

// Bloco 2 - Verbas Rescisórias (reformulado para 2026)
export interface Bloco2Data {
  // Férias
  periodosFeriasVencidas: number; // -1 = não selecionado, 0, 1, 2+
  mesesDesdeUltimaFerias: number; // -1 = não selecionado, 0-12
  // 13º proporcional (calculado automaticamente)
  mesesTrabalhados2026: number; // 0-12
  // Aviso prévio
  tipoAvisoPrevio: TipoAvisoPrevio | '';
  anosServico: number; // 0, 1, 2, ... (calculado automaticamente)
  // FGTS
  saldoFGTS: number;
  sabeSaldoFGTS: boolean | undefined; // undefined = não selecionado
  // Dependentes (para IRRF)
  numDependentes: number; // -1 = não selecionado, 0-10
}

// Bloco 3 - Detecção de oportunidade + detalhamento
export interface Bloco3Data {
  faziaHorasExtras: FrequenciaHorasExtras | '';
  bancoHoras: string;
  controlePonto: string;
  exerciaFuncoesDiferentes: OpcaoSimNaoNaoSei | '';
  funcoesDiferentes: FrequenciaHorasExtras | OpcaoSimNaoNaoSei | '';
  diferencaSalarialEstimada: number;
  valorPorFora: OpcaoSimNao | '';
  valorPorForaMensal: number;
  adicionaisTrabalho: AdicionalTrabalho[];
  recebiaAdicionalNoturno: string;
  horasNoturnasSemana: string;
  grauInsalubridade: string;
  recebiaInsalubridade: string;
  recebiaPericulosidade: string;
  erroNaRescisao: OpcaoErroRescisao | '';
}

export interface FormData extends Bloco1Data, Bloco2Data, Bloco3Data {}

export interface LinhaResultado {
  descricao: string;
  valor: number;
  tipo: 'provento' | 'desconto' | 'neutro';
  exibir: boolean;
}

export interface ResultadoCalculo {
  linhas: LinhaResultado[];
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  // Detalhamento individual para persistência
  detalhamento?: ResultadoDetalhado;
}

// Estrutura detalhada para salvar no banco
export interface ResultadoDetalhado {
  saldoSalario: number;
  diasTrabalhadosMes: number;
  avisoPrevio: number;
  diasAvisoPrevio: number;
  feriasVencidas: number;
  tercoFeriasVencidas: number;
  feriasProporcionais: number;
  tercoFeriasProporcionais: number;
  decimoTerceiro: number;
  multaFGTS: number;
  totalBruto: number;
  descontoINSS: number;
  descontoIRRF: number;
  totalLiquido: number;
}

// Legacy types for backwards compatibility
export type TipoRescisao = 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'acordo_484a';
export type TipoAviso = 'indenizado' | 'trabalhado' | 'sem_aviso';
