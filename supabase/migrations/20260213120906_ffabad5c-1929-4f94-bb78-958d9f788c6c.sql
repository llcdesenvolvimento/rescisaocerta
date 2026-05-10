-- Adicionar constraint UNIQUE em calculo_id para permitir upsert
ALTER TABLE public.relatorios ADD CONSTRAINT relatorios_calculo_id_unique UNIQUE (calculo_id);

-- Permitir UPDATE para upsert funcionar
CREATE POLICY "Permitir atualização de relatórios"
  ON public.relatorios
  FOR UPDATE
  USING (true);