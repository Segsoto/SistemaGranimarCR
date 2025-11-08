# Guía para Configurar Storage en Supabase (Interfaz Gráfica)

## Pasos para crear el bucket desde la interfaz de Supabase:

1. **Ir a Storage en Supabase Dashboard**
   - Abre tu proyecto en https://supabase.com/dashboard
   - Ve a la sección "Storage" en el menú lateral

2. **Crear nuevo bucket**
   - Click en "Create a new bucket" o "New Bucket"
   - Nombre: `discos-images`
   - ✅ Marcar como "Public bucket" (importante para que las imágenes sean accesibles)
   - Click en "Create bucket"

3. **Configurar políticas (Opcional - ya vienen por defecto)**
   Las políticas públicas se crean automáticamente cuando marcas el bucket como público

## Alternativa: Usar SQL Editor

Si prefieres usar SQL, sigue estos pasos:

1. Ve a "SQL Editor" en tu dashboard de Supabase
2. Ejecuta primero el script `verify_storage.sql` para verificar si existe
3. Si NO existe, ejecuta el script `003_create_storage_bucket.sql`

## Verificar que funciona:

Después de crear el bucket, deberías poder:
- Ver el bucket "discos-images" en la lista de Storage
- Subir imágenes desde la aplicación
- Las URLs de las imágenes deberían verse así:
  `https://vavlehrkorioncfloedn.supabase.co/storage/v1/object/public/discos-images/nombre_archivo.jpg`

## Troubleshooting:

Si sigue dando error "Bucket not found":
1. Verifica que el bucket se llame exactamente `discos-images`
2. Verifica que esté marcado como público
3. Revisa que las políticas de RLS estén habilitadas
4. Verifica las credenciales en `.env.local`
