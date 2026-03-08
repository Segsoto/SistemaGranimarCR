-- Migration: 033_alter_gastos_fecha_to_date.sql
-- Convertir la columna `fecha` de `gastos` a tipo `date` (sin zona horaria)
-- Esto evita desajustes por conversión UTC/local cuando se usa inputs de tipo date.

BEGIN;

-- Convertir preservando la fecha en la zona horaria de Costa Rica
-- Esto evita que timestamps con zona (timestamptz) se reduzcan un día por diferencia UTC.
ALTER TABLE IF EXISTS gastos
  ALTER COLUMN fecha TYPE date USING ((fecha AT TIME ZONE 'America/Costa_Rica')::date);

COMMIT;

COMMENT ON COLUMN gastos.fecha IS 'Fecha del gasto (solo fecha, sin hora)';
