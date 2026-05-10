-- Tabela principal para armazenar todos os cálculos de rescisão
CREATE TABLE public.calculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo_unico TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados do cliente (para PIX)
  nome TEXT,
  email TEXT,
  cpf TEXT,
  
  -- Bloco 1 - Dados obrigatórios do formulário inicial
  tipo_desligamento TEXT,
  data_admissao DATE,
  data_desligamento DATE,
  ainda_trabalhando BOOLEAN DEFAULT false,
  salario_fixo NUMERIC(12,2) DEFAULT 0,
  media_variavel NUMERIC(12,2) DEFAULT 0,
  tem_variavel BOOLEAN DEFAULT false,
  aviso_previo TEXT,
  ferias_vencidas TEXT,
  status_pagamento TEXT,
  
  -- Bloco 2 - Detecção de oportunidade
  fazia_horas_extras TEXT,
  funcoes_diferentes TEXT,
  valor_por_fora TEXT,
  adicionais_trabalho TEXT[], -- array de strings
  erro_na_rescisao TEXT,
  
  -- Dados pós-pagamento - Jornada
  horario_contratado TEXT,
  horario_real_medio TEXT,
  dias_trabalhados_por_semana INTEGER,
  trabalhava_sabados BOOLEAN,
  intervalo_almoco_completo BOOLEAN,
  
  -- Dados pós-pagamento - Valores
  recebia_comissao BOOLEAN,
  media_mensal_comissao NUMERIC(12,2),
  adicional_noturno BOOLEAN,
  insalubridade BOOLEAN,
  periculosidade BOOLEAN,
  recebia_por_fora BOOLEAN,
  media_mensal_por_fora NUMERIC(12,2),
  
  -- Dados pós-pagamento - Tempo
  quando_ultimas_ferias TEXT,
  tirou_ferias_corretamente TEXT,
  meses_trabalhados_ano_rescisao INTEGER,
  aviso_previo_confirmado TEXT,
  
  -- Resultados
  valor_base NUMERIC(12,2),
  valor_refinado NUMERIC(12,2),
  diferenca NUMERIC(12,2),
  nivel_oportunidade TEXT,
  principais_fatores TEXT[],
  itens_verbas JSONB, -- array de {nome, valor}
  
  -- Status do pagamento
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'expirado'))
);

-- Tabela para pedidos PIX
CREATE TABLE public.pedidos_pix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calculo_id UUID NOT NULL REFERENCES public.calculos(id) ON DELETE CASCADE,
  order_id_pagarme TEXT,
  amount INTEGER NOT NULL, -- valor em centavos
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
  qr_code TEXT,
  qr_code_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para relatórios gerados pela IA
CREATE TABLE public.relatorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calculo_id UUID NOT NULL REFERENCES public.calculos(id) ON DELETE CASCADE,
  relatorio_ai JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_calculos_codigo_unico ON public.calculos(codigo_unico);
CREATE INDEX idx_calculos_status ON public.calculos(status);
CREATE INDEX idx_pedidos_pix_calculo_id ON public.pedidos_pix(calculo_id);
CREATE INDEX idx_pedidos_pix_order_id ON public.pedidos_pix(order_id_pagarme);
CREATE INDEX idx_pedidos_pix_status ON public.pedidos_pix(status);
CREATE INDEX idx_relatorios_calculo_id ON public.relatorios(calculo_id);

-- Enable RLS
ALTER TABLE public.calculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_pix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - permitir acesso anônimo para inserção e leitura por código único
-- Como não há autenticação, permitimos operações baseadas em conhecimento do código único

CREATE POLICY "Permitir inserção anônima de cálculos" 
ON public.calculos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura por código único" 
ON public.calculos 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir atualização por código único" 
ON public.calculos 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir inserção de pedidos PIX" 
ON public.pedidos_pix 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de pedidos PIX" 
ON public.pedidos_pix 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir atualização de pedidos PIX" 
ON public.pedidos_pix 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir inserção de relatórios" 
ON public.relatorios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de relatórios" 
ON public.relatorios 
FOR SELECT 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_calculos_updated_at
BEFORE UPDATE ON public.calculos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();