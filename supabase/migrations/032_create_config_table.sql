-- Crear tabla config para guardar pares clave/valor de configuración de la aplicación
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE config IS 'Tabla de configuración general (clave/valor)';
COMMENT ON COLUMN config.key IS 'Clave de configuración, por ejemplo: exchange_source, manual_usd_to_crc';
COMMENT ON COLUMN config.value IS 'Valor de la configuración (texto). Para tasas usar número en formato decimal.';
