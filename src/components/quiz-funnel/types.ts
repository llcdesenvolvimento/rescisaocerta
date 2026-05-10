// ===============================================
// TIPOS PARA QUIZ FUNNEL
// ===============================================

export interface QuizOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface QuizQuestion {
  id: string;
  pergunta: string;
  subtexto: string;
  subtextoDestaque?: string;
  perguntaPensando?: string; // Texto alternativo para quem está "pensando em sair"
  subtextoPensando?: string;
  tipo: 'single' | 'multi' | 'input-currency' | 'input-date' | 'input-date-range' | 'input-number' | 'input-month';
  opcoes?: QuizOption[];
  opcoesCondicional?: (formData: Record<string, unknown>) => QuizOption[];
  opcoesPensando?: QuizOption[]; // Opções em tempo presente para quem está "pensando em sair"
  campo: string;
  etapa: number;
  condicional?: (formData: Record<string, unknown>) => boolean;
  opcional?: boolean;
  progressoFixo?: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  isComplete: boolean;
  showCapture: boolean;
  showLoading: boolean;
}

// Etapas do quiz
export const ETAPAS_LABELS = [
  'Situação',
  'Contrato', 
  'Benefícios',
  'Análise'
] as const;

export type EtapaLabel = typeof ETAPAS_LABELS[number];
