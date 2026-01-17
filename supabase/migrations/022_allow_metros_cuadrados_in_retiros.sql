-- Migration: Allow 'metros_cuadrados' as a valid tipo_retiro in public.retiros

BEGIN;

-- Drop existing check constraint if present
ALTER TABLE public.retiros DROP CONSTRAINT IF EXISTS retiros_tipo_retiro_check;

-- Recreate check constraint including 'metros_cuadrados'
ALTER TABLE public.retiros
  ADD CONSTRAINT retiros_tipo_retiro_check CHECK (tipo_retiro IN ('laminas_completas', 'metros_lineales', 'metros_cuadrados'));

COMMIT;
