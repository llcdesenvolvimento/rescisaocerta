-- Adicionar coluna charge_id_pagarme à tabela pedidos_pix
ALTER TABLE public.pedidos_pix 
ADD COLUMN IF NOT EXISTS charge_id_pagarme TEXT;