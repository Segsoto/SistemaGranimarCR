-- Crear tabla para movimientos de discos (entradas y salidas)
-- Fecha: 2024-11-07

-- ELIMINAR tabla si existe (para recrearla con estructura correcta)
DROP TABLE IF EXISTS discos_movimientos CASCADE;

-- TABLA: discos_movimientos
CREATE TABLE discos_movimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disco_id UUID REFERENCES discos(id) ON DELETE CASCADE,
  tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  motivo TEXT,
  usuario VARCHAR(100),
  fecha_retiro TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_discos_movimientos_disco ON discos_movimientos(disco_id);
CREATE INDEX IF NOT EXISTS idx_discos_movimientos_fecha ON discos_movimientos(fecha_retiro);
CREATE INDEX IF NOT EXISTS idx_discos_movimientos_tipo ON discos_movimientos(tipo_movimiento);

-- Habilitar RLS
ALTER TABLE discos_movimientos ENABLE ROW LEVEL SECURITY;

-- Política de acceso (permitir a todos los usuarios, autenticados y anónimos)
CREATE POLICY "Permitir todo en discos_movimientos" 
  ON discos_movimientos 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE discos_movimientos IS 'Registro de movimientos (entradas/salidas) de discos y herramientas';
COMMENT ON COLUMN discos_movimientos.tipo_movimiento IS 'Tipo de movimiento: entrada o salida';
COMMENT ON COLUMN discos_movimientos.cantidad IS 'Cantidad de unidades del movimiento';
COMMENT ON COLUMN discos_movimientos.motivo IS 'Detalle o descripción del movimiento';
COMMENT ON COLUMN discos_movimientos.usuario IS 'Persona que realizó el movimiento';
