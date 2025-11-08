-- Script para agregar políticas de RLS al bucket 'discos-images'
-- Ejecutar en el SQL Editor de Supabase

-- IMPORTANTE: Primero, habilitar RLS en la tabla storage.objects si no está habilitado
-- (Normalmente ya está habilitado por defecto)

-- 1. Eliminar políticas existentes si hay alguna (por si acaso)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

-- 2. POLÍTICA: Permitir a CUALQUIERA leer/ver las imágenes (público)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'discos-images');

-- 3. POLÍTICA: Permitir a CUALQUIERA subir imágenes (sin autenticación requerida)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'discos-images');

-- 4. POLÍTICA: Permitir a CUALQUIERA actualizar imágenes
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'discos-images')
WITH CHECK (bucket_id = 'discos-images');

-- 5. POLÍTICA: Permitir a CUALQUIERA eliminar imágenes
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'discos-images');

-- 6. Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND (qual LIKE '%discos-images%' OR with_check LIKE '%discos-images%')
ORDER BY policyname;
