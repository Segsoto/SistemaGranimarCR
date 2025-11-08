-- Script para agregar las columnas faltantes a la tabla discos
-- Ejecutar en el SQL Editor de Supabase

-- Agregar columna nombre
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(255) NOT NULL DEFAULT 'Sin nombre';

-- Agregar columna marca
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS marca VARCHAR(100);

-- Agregar columna material_compatible
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS material_compatible VARCHAR(100);

-- Agregar columna imagenes (array de texto)
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS imagenes TEXT[];

-- Agregar columna diametro
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS diametro DECIMAL(10,2);

-- Agregar columna espesor
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS espesor DECIMAL(10,2);

-- Agregar columna descripcion_detallada
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS descripcion_detallada TEXT;

-- Agregar columna ubicacion_fisica
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS ubicacion_fisica VARCHAR(255);

-- Agregar columna updated_at
ALTER TABLE discos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_discos_tipo ON discos(tipo);
CREATE INDEX IF NOT EXISTS idx_discos_material ON discos(material_compatible);
CREATE INDEX IF NOT EXISTS idx_discos_nombre ON discos(nombre);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_discos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_discos_updated_at ON discos;
CREATE TRIGGER trigger_update_discos_updated_at
  BEFORE UPDATE ON discos
  FOR EACH ROW
  EXECUTE FUNCTION update_discos_updated_at();

-- Verificar las columnas después de la migración
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'discos'
ORDER BY ordinal_position;
