// Script para verificar la estructura de discos_movimientos
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vavlehrkorioncfloedn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxlaHJrb3Jpb25jZmxvZWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzgyNDMxNCwiZXhwIjoyMDQzNDAwMzE0fQ.VnKKubnXjyuE1FdKKHHw9zYcdv2pP8I3DU9Agh46dro';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
  console.log('🔍 Verificando estructura de discos_movimientos...\n');

  try {
    // Intentar hacer un select vacío para ver qué columnas devuelve
    const { data, error } = await supabase
      .from('discos_movimientos')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n📝 La tabla probablemente no existe aún.');
      console.log('Debes ejecutar el SQL en Supabase SQL Editor.\n');
      return;
    }

    console.log('✅ Tabla existe!');
    console.log('\n📋 Datos de ejemplo:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data && data.length > 0) {
      console.log('\n🔑 Columnas encontradas:');
      Object.keys(data[0]).forEach(key => {
        console.log(`   - ${key}`);
      });
    } else {
      console.log('\n⚠️  La tabla está vacía, no se pueden ver las columnas.');
      console.log('Intentando insertar un registro de prueba...\n');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkStructure();
