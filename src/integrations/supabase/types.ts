// Tipos do schema do Supabase (rescisão certa).
// Manualmente alinhados com `supabase/migrations/20260510_initial_schema.sql`.
// Para regenerar via CLI:
//   supabase gen types typescript --project-id micfchxnaexdkxngvonb --schema public

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface QuizSessionRow {
  id: string;
  created_at: string;
  updated_at: string;
  respostas: Json;
  etapa_atual: number;
  bloco: 'essencial' | 'extras';
  completo: boolean;
  user_agent: string | null;
  ip_hash: string | null;
  completed_at: string | null;
}

export interface CalculoRow {
  id: string;
  created_at: string;
  updated_at: string;
  quiz_session_id: string;
  codigo_unico: string;
  valor_base: number;
  valor_bruto: number;
  total_descontos: number;
  valor_potencial: number | null;
  verbas: Json;
  modulos_extras: Json;
  detalhamento: Json | null;
  tipo_rescisao: string | null;
  meses_trabalhados: number | null;
}

export interface PagamentoRow {
  id: string;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  expires_at: string | null;
  calculo_id: string;
  quiz_session_id: string | null;
  status: 'pendente' | 'pago' | 'expirado' | 'cancelado' | 'erro';
  amount_cents: number;
  provider: string;
  provider_order_id: string | null;
  provider_charge_id: string | null;
  qr_code: string | null;
  qr_code_url: string | null;
  email: string | null;
  nome: string | null;
}

export interface RelatorioRow {
  id: string;
  created_at: string;
  updated_at: string;
  calculo_id: string;
  tipo: 'relatorio_completo' | 'carta_rh' | 'checklist';
  conteudo: Json;
  versao: number;
}

export interface EventoRow {
  id: number;
  created_at: string;
  quiz_session_id: string | null;
  calculo_id: string | null;
  tipo: string;
  metadata: Json;
}

// Helper para Inserts (campos auto-gerados são opcionais)
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type AutoFields = 'id' | 'created_at' | 'updated_at';

export interface Database {
  public: {
    Tables: {
      quiz_sessions: {
        Row: QuizSessionRow;
        Insert: Optional<QuizSessionRow, AutoFields | 'respostas' | 'etapa_atual' | 'bloco' | 'completo' | 'user_agent' | 'ip_hash' | 'completed_at'>;
        Update: Partial<QuizSessionRow>;
      };
      calculos: {
        Row: CalculoRow;
        Insert: Optional<CalculoRow, AutoFields | 'valor_base' | 'valor_bruto' | 'total_descontos' | 'valor_potencial' | 'verbas' | 'modulos_extras' | 'detalhamento' | 'tipo_rescisao' | 'meses_trabalhados'>;
        Update: Partial<CalculoRow>;
      };
      pagamentos: {
        Row: PagamentoRow;
        Insert: Optional<PagamentoRow, AutoFields | 'paid_at' | 'expires_at' | 'quiz_session_id' | 'status' | 'provider' | 'provider_order_id' | 'provider_charge_id' | 'qr_code' | 'qr_code_url' | 'email' | 'nome'>;
        Update: Partial<PagamentoRow>;
      };
      relatorios: {
        Row: RelatorioRow;
        Insert: Optional<RelatorioRow, AutoFields | 'conteudo' | 'versao'>;
        Update: Partial<RelatorioRow>;
      };
      eventos: {
        Row: EventoRow;
        Insert: Optional<EventoRow, 'id' | 'created_at' | 'quiz_session_id' | 'calculo_id' | 'metadata'>;
        Update: Partial<EventoRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
