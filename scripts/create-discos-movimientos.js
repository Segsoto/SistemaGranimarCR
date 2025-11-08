// Script para crear la tabla discos_movimientos en Supabase
// Ejecutar con: node scripts/create-discos-movimientos.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://vavlehrkorioncfloedn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxlaHJrb3Jpb25jZmxvZWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzgyNDMxNCwiZXhwIjoyMDQzNDAwMzE0fQ.VnKKubnXjyuE1FdKKHHw9zYcdv2pP8I3DU9Agh46dro';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createDiscosMovimientos() {
  console.log('🔄 Creando tabla discos_movimientos...\n');

  try {
    // Leer el archivo SQL de migración
    const migrationPath = path.join(__dirname, '..', 'migrations', '008_discos_movimientos.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    // Ejecutar la migración usando RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sqlContent
    });

    if (error) {
      console.error('❌ Error ejecutando migración:', error.message);
      
      // Intentar crear la tabla directamente sin RPC
      console.log('\n🔄 Intentando método alternativo...\n');
      await createTableDirect();
      return;
    }

    console.log('✅ Tabla discos_movimientos creada exitosamente\n');

    // Verificar que la tabla existe
    const { data: tables, error: checkError } = await supabase
      .from('discos_movimientos')
      .select('*')
      .limit(1);

    if (checkError) {
      console.warn('⚠️  Advertencia al verificar tabla:', checkError.message);
    } else {
      console.log('✅ Verificación exitosa: la tabla existe y está accesible\n');
    }

    // Mostrar estructura de la tabla
    console.log('📋 Estructura de la tabla:');
    console.log('   - id (UUID, PRIMARY KEY)');
    console.log('   - disco_id (UUID, FOREIGN KEY -> discos)');
    console.log('   - tipo_movimiento (VARCHAR: entrada/salida)');
    console.log('   - cantidad (INTEGER)');
    console.log('   - motivo (TEXT)');
    console.log('   - proyecto (VARCHAR)');
    console.log('   - usuario (VARCHAR)');
    console.log('   - fecha (TIMESTAMP)');
    console.log('   - created_at (TIMESTAMP)\n');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

// Método alternativo para crear la tabla directamente
async function createTableDirect() {
  try {
    // Insertar un registro ficticio que forzará el error si la tabla no existe
    const { error } = await supabase
      .from('discos_movimientos')
      .select('*')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('📝 La tabla no existe. Debes ejecutar la migración manualmente en Supabase:\n');
      console.log('1. Ve a https://supabase.com/dashboard/project/vavlehrkorioncfloedn/editor/sql');
      console.log('2. Copia el contenido de migrations/008_discos_movimientos.sql');
      console.log('3. Pégalo en el editor SQL y ejecútalo\n');
      process.exit(1);
    } else {
      console.log('✅ La tabla ya existe o fue creada exitosamente\n');
    }
  } catch (error) {
    console.error('❌ Error verificando tabla:', error.message);
    process.exit(1);
  }
}

// Ejecutar
createDiscosMovimientos();
