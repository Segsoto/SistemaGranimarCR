-- Verificar la estructura de la tabla discos
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'discos'
ORDER BY ordinal_position;
