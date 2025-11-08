const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://vavlehrkorioncfloedn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxlaHJrb3Jpb25jZmxvZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODkwODYsImV4cCI6MjA3NzI2NTA4Nn0.DvnjmClDEFLVieURMJv6oZES711kJPC4G3ajwsJJgJ4'
)

async function getTipos() {
  const { data, error } = await supabase
    .from('discos')
    .select('tipo, material_compatible')
  
  if (error) {
    console.error('Error:', error)
    return
  }

  const tipos = [...new Set(data.map(d => d.tipo))].sort()
  const materiales = [...new Set(data.map(d => d.material_compatible))].filter(Boolean).sort()
  
  console.log('\n=== TIPOS ÚNICOS ===')
  tipos.forEach(t => console.log(`- ${t}`))
  
  console.log('\n=== MATERIALES ÚNICOS ===')
  materiales.forEach(m => console.log(`- ${m}`))
}

getTipos()
