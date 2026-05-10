-- Adicionar coluna para hash único do relatório
ALTER TABLE public.relatorios 
ADD COLUMN report_hash TEXT UNIQUE;

-- Adicionar coluna para URL completa do relatório
ALTER TABLE public.relatorios 
ADD COLUMN report_url TEXT;

-- Criar índice para busca rápida por hash
CREATE INDEX idx_relatorios_report_hash ON public.relatorios(report_hash);