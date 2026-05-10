-- Fix: Restrict public access to relatorios table
-- Reports should only be accessible for paid calculations

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Permitir leitura de relatórios" ON public.relatorios;

-- Create a restrictive SELECT policy
-- Only allow reading reports where the associated calculo has been paid
-- This prevents direct enumeration while still allowing legitimate access
CREATE POLICY "Allow SELECT for paid calculations only"
ON public.relatorios FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.calculos c
    WHERE c.id = relatorios.calculo_id
    AND c.status = 'pago'
  )
);

-- Note: The INSERT policy remains as-is because edge functions use 
-- SUPABASE_SERVICE_ROLE_KEY which bypasses RLS anyway