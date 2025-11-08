-- Script para crear el bucket 'discos-images' y sus políticas
-- Ejecutar en el SQL Editor de Supabase SOLO SI el bucket no existe

-- 1. Crear el bucket 'discos-images' (público para lectura)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'discos-images',
  'discos-images',
  true, -- Público para que las imágenes sean accesibles
  5242880, -- 5MB límite por archivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política: Permitir a todos ver las imágenes (lectura pública)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'discos-images');

-- 3. Política: Permitir a usuarios autenticados subir imágenes
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'discos-images');

-- 4. Política: Permitir a usuarios autenticados actualizar sus imágenes
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'discos-images')
WITH CHECK (bucket_id = 'discos-images');

-- 5. Política: Permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'discos-images');

-- 6. Verificar que se creó correctamente
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name = 'discos-images';
