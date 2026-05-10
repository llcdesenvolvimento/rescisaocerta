-- Tabela para rastrear sessões do funil de quiz
CREATE TABLE public.funnel_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Progresso do quiz
  current_question_index INTEGER DEFAULT 0,
  current_question_campo TEXT,
  max_question_reached INTEGER DEFAULT 0,
  total_questions INTEGER,
  
  -- Marcos do funil
  completed_quiz BOOLEAN DEFAULT false,
  reached_loading BOOLEAN DEFAULT false,
  reached_risk_screen BOOLEAN DEFAULT false,
  reached_resultado BOOLEAN DEFAULT false,
  reached_payment BOOLEAN DEFAULT false,
  payment_completed BOOLEAN DEFAULT false,
  
  -- Contexto
  device_type TEXT,
  user_agent TEXT,
  
  -- Dados do cálculo (opcional, para vincular)
  calculo_id UUID REFERENCES public.calculos(id)
);

-- Índices para queries de análise
CREATE INDEX idx_funnel_sessions_started_at ON public.funnel_sessions(started_at);
CREATE INDEX idx_funnel_sessions_max_question ON public.funnel_sessions(max_question_reached);
CREATE INDEX idx_funnel_sessions_completed ON public.funnel_sessions(completed_quiz);

-- Enable RLS
ALTER TABLE public.funnel_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso anônimo (necessário para tracking)
CREATE POLICY "Allow anonymous insert funnel sessions" 
ON public.funnel_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous update funnel sessions" 
ON public.funnel_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow anonymous select funnel sessions" 
ON public.funnel_sessions 
FOR SELECT 
USING (true);