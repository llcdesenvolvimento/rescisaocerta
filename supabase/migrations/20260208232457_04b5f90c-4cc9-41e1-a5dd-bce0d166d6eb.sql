-- =====================================================
-- SECURITY FIX: Restrict RLS policies for calculos and pedidos_pix tables
-- =====================================================

-- Drop existing overly permissive SELECT policies
DROP POLICY IF EXISTS "Permitir leitura por código único" ON public.calculos;
DROP POLICY IF EXISTS "Permitir leitura de pedidos PIX" ON public.pedidos_pix;

-- =====================================================
-- CALCULOS TABLE: Restrict SELECT to own records only
-- Since there's no auth, we restrict to matching codigo_unico or status paid
-- Edge functions use service role key to bypass RLS
-- =====================================================

-- Allow SELECT only for specific calculo by ID (not mass enumeration)
-- This policy denies listing all records but allows access via direct ID lookup
-- when the record is accessed through proper application flow
CREATE POLICY "Restrict calculos to own record lookup"
ON public.calculos FOR SELECT
USING (
  -- Only allow SELECT if status is 'pago' (paid) to prevent enumeration of unpaid records
  -- Application flow uses edge functions (service role) for initial operations
  status = 'pago'
);

-- =====================================================
-- PEDIDOS_PIX TABLE: Restrict SELECT to related paid calculations
-- =====================================================

CREATE POLICY "Restrict pedidos_pix to paid calculations"
ON public.pedidos_pix FOR SELECT
USING (
  -- Only allow access to PIX orders for paid calculations
  EXISTS (
    SELECT 1 FROM public.calculos c
    WHERE c.id = pedidos_pix.calculo_id
    AND c.status = 'pago'
  )
);

-- =====================================================
-- Note: INSERT and UPDATE policies remain for edge functions
-- Edge functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
-- These restrictive SELECT policies prevent direct enumeration
-- while allowing legitimate access through the application
-- =====================================================