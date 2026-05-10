-- Adicionar novos campos para o formulário reformulado 2026
ALTER TABLE public.calculos
ADD COLUMN IF NOT EXISTS periodos_ferias_vencidas integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS meses_desde_ultima_ferias integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS meses_trabalhados_2026 integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS anos_servico integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS saldo_fgts numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS num_dependentes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tipo_aviso_previo text,

-- Campos para armazenar cada verba calculada individualmente
ADD COLUMN IF NOT EXISTS calc_saldo_salario numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_aviso_previo numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_dias_aviso_previo integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_ferias_vencidas numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_terco_ferias_vencidas numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_ferias_proporcionais numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_terco_ferias_proporcionais numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_decimo_terceiro numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_multa_fgts numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_total_bruto numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_desconto_inss numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_desconto_irrf numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_total_liquido numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS calc_dias_trabalhados_mes integer DEFAULT 0;