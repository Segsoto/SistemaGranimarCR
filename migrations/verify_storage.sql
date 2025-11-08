-- Script para verificar la configuración actual de Supabase Storage
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar si existe el bucket 'discos-images'
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name = 'discos-images';

-- 2. Listar todos los buckets disponibles
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets
ORDER BY created_at DESC;
