
-- Drop all existing RESTRICTIVE policies on relatorios
DROP POLICY IF EXISTS "Allow SELECT for paid calculations only" ON public.relatorios;
DROP POLICY IF EXISTS "Permitir atualização de relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Permitir inserção de relatórios" ON public.relatorios;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Allow SELECT for paid calculations only"
ON public.relatorios FOR SELECT
USING (EXISTS (
  SELECT 1 FROM calculos c
  WHERE c.id = relatorios.calculo_id AND c.status = 'pago'
));

CREATE POLICY "Permitir inserção de relatórios"
ON public.relatorios FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização de relatórios"
ON public.relatorios FOR UPDATE
USING (true);
