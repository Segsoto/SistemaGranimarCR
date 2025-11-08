// Script para insertar el inventario inicial en Supabase
// Ejecutar con: node scripts/insert-inventory.js

const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = 'https://vavlehrkorioncfloedn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdmxlaHJrb3Jpb25jZmxvZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODkwODYsImV4cCI6MjA3NzI2NTA4Nn0.DvnjmClDEFLVieURMJv6oZES711kJPC4G3ajwsJJgJ4'

const supabase = createClient(supabaseUrl, supabaseKey)

// Datos de piedras de devastar
const piedrasDevastar = [
  {
    tipo: 'Piedra de devastar',
    nombre: 'Piedra de devastar 120',
    marca: 'Generic',
    material_compatible: 'Granito, Mármol, Cuarzo',
    cantidad: 30,
    descripcion_detallada: 'Piedra de devastar grano 120 para trabajo pesado'
  },
  {
    tipo: 'Piedra de devastar',
    nombre: 'Piedra de devastar GC36',
    marca: 'Generic',
    material_compatible: 'Granito, Mármol, Cuarzo',
    cantidad: 10,
    descripcion_detallada: 'Piedra de devastar GC36 para acabado fino'
  }
]

// Discos de pulir granito
const discosGranito = [
  { nombre: 'Disco de pulir 100 Amarillo', grano: 100, color: 'Amarillo', cantidad: 8 },
  { nombre: 'Disco de pulir 200 Naranja', grano: 200, color: 'Naranja', cantidad: 8 },
  { nombre: 'Disco de pulir 400 Rojo', grano: 400, color: 'Rojo', cantidad: 5 },
  { nombre: 'Disco de pulir 500 Rojo', grano: 500, color: 'Rojo', cantidad: 7 },
  { nombre: 'Disco de pulir 800 Verde', grano: 800, color: 'Verde', cantidad: 4 },
  { nombre: 'Disco de pulir 1500 Verde agua', grano: 1500, color: 'Verde agua', cantidad: 8 },
  { nombre: 'Disco de pulir 3000 Gris', grano: 3000, color: 'Gris', cantidad: 8 }
].map(d => ({
  tipo: 'Disco de pulir',
  nombre: d.nombre,
  marca: 'Generic',
  material_compatible: 'Granito',
  cantidad: d.cantidad,
  descripcion_detallada: `Disco de pulir grano ${d.grano} color ${d.color} para granito`,
  diametro: 4.0
}))

// Discos de pulir cuarzo
const discosCuarzo = [
  { nombre: 'Disco de pulir 100 Rojo', grano: 100, color: 'Rojo', cantidad: 30 },
  { nombre: 'Disco de pulir 200 Amarillo', grano: 200, color: 'Amarillo', cantidad: 36 },
  { nombre: 'Disco de pulir 400 Celeste', grano: 400, color: 'Celeste', cantidad: 38 },
  { nombre: 'Disco de pulir 500 Celeste', grano: 500, color: 'Celeste', cantidad: 40 },
  { nombre: 'Disco de pulir 800 Verde', grano: 800, color: 'Verde', cantidad: 50 },
  { nombre: 'Disco de pulir 1500 Naranja', grano: 1500, color: 'Naranja', cantidad: 45 },
  { nombre: 'Disco de pulir 3000 Rosa', grano: 3000, color: 'Rosa', cantidad: 41 }
].map(d => ({
  tipo: 'Disco de pulir',
  nombre: d.nombre,
  marca: 'Generic',
  material_compatible: 'Cuarzo',
  cantidad: d.cantidad,
  descripcion_detallada: `Disco de pulir grano ${d.grano} color ${d.color} para cuarzo`,
  diametro: 4.0
}))

// Juego de discos
const juegoDiscos = [{
  tipo: 'Juego de discos',
  nombre: 'Juego Step 1-2-3 (Amarillo, Celeste, Naranja)',
  marca: 'Generic',
  material_compatible: 'Cuarzo',
  cantidad: 2,
  descripcion_detallada: 'Juego completo de discos Step 1-2-3 para pulido de cuarzo',
  diametro: 4.0
}]

// Discos indiferentes
const discosIndiferentes = [
  { nombre: 'Disco Wet/Dry Step 2 Celeste', cantidad: 7, desc: 'Disco de pulir húmedo/seco Step 2 color celeste' },
  { nombre: 'Disco de pulir 3000 Beige/Gris', cantidad: 5, desc: 'Disco de pulir grano 3000 color beige/gris' },
  { nombre: 'Disco de pulir 50 Verde y Negro', cantidad: 1, desc: 'Disco de pulir grano 50 color verde y negro' },
  { nombre: 'Disco de pulir 100 Rojo y Negro', cantidad: 1, desc: 'Disco de pulir grano 100 color rojo y negro' },
  { nombre: 'Disco de pulir 200 Amarillo y Negro', cantidad: 1, desc: 'Disco de pulir grano 200 color amarillo y negro' },
  { nombre: 'Disco de pulir 1500 JXShine Naranja', cantidad: 1, desc: 'Disco de pulir grano 1500 marca JXShine color naranja', marca: 'JXShine' },
  { nombre: 'Disco de pulir 1500 ADT Naranja', cantidad: 1, desc: 'Disco de pulir grano 1500 marca ADT color naranja', marca: 'ADT' },
  { nombre: 'Disco de pulir 1500 Verde agua', cantidad: 8, desc: 'Disco de pulir grano 1500 color verde agua' },
  { nombre: 'Disco de pulir 1500 JXDry Naranja (Seco)', cantidad: 5, desc: 'Disco de pulir en seco grano 1500 marca JXDry color naranja', marca: 'JXDry' },
  { nombre: 'Disco de pulir 3000 Blanco (Seco)', cantidad: 1, desc: 'Disco de pulir en seco grano 3000 color blanco' },
  { nombre: 'Disco de pulir 3000 JXDry Rosa (Seco)', cantidad: 1, desc: 'Disco de pulir en seco grano 3000 marca JXDry color rosa', marca: 'JXDry' },
  { nombre: 'Disco de pulir 50 Azul (Seco)', cantidad: 2, desc: 'Disco de pulir en seco grano 50 color azul' },
  { nombre: 'Disco de pulir 50 Verde Fosforescente (Seco)', cantidad: 1, desc: 'Disco de pulir en seco grano 50 color verde fosforescente' }
].map(d => ({
  tipo: 'Disco de pulir',
  nombre: d.nombre,
  marca: d.marca || 'Generic',
  material_compatible: 'Universal',
  cantidad: d.cantidad,
  descripcion_detallada: d.desc,
  diametro: 4.0
}))

// Discos curvos
const discosCurvos = [
  { nombre: 'Disco de pulir curvo 400 Rojo', grano: 400, cantidad: 4 },
  { nombre: 'Disco de pulir curvo 500 Rojo', grano: 500, cantidad: 4 },
  { nombre: 'Disco de pulir curvo 800 Verde', grano: 800, cantidad: 4 },
  { nombre: 'Disco de pulir curvo 1500', grano: 1500, cantidad: 4 },
  { nombre: 'Disco de pulir curvo 3000', grano: 3000, cantidad: 4 }
].map(d => ({
  tipo: 'Disco curvo',
  nombre: d.nombre,
  marca: 'Generic',
  material_compatible: 'Universal',
  cantidad: d.cantidad,
  descripcion_detallada: `Disco de pulir curvo grano ${d.grano} para bordes`,
  diametro: 4.0
}))

// Felpas
const felpas = [{
  tipo: 'Felpa',
  nombre: 'Felpa de pulir Blanca',
  marca: 'Generic',
  material_compatible: 'Universal',
  cantidad: 5,
  descripcion_detallada: 'Felpa de pulir color blanca para acabado final'
}]

// Discos de corte
const discosCorte = [{
  tipo: 'Disco de corte',
  nombre: 'Disco de cortar Azul 5" 125MM',
  marca: 'Generic',
  material_compatible: 'Universal',
  cantidad: 17,
  descripcion_detallada: 'Disco de corte diamantado color azul 5 pulgadas (125mm)',
  diametro: 5.0
}]

// Brocas y herramientas (agregando a la tabla discos porque no hay tabla herramientas con cantidad)
const herramientas = [
  { nombre: 'Broca 5/8"-11 1-3/8" Azul', tipo: 'Broca', cantidad: 3, descripcion: 'Broca diamantada 5/8"-11 de 1-3/8" color azul para perforación de piedra' },
  { nombre: 'Broca 5/8"-11 1-7/10" Azul', tipo: 'Broca', cantidad: 2, descripcion: 'Broca diamantada 5/8"-11 de 1-7/10" color azul para perforación de piedra' },
  { nombre: 'Broca 35MM 5/8-11 Negra', tipo: 'Broca', cantidad: 3, descripcion: 'Broca diamantada 35mm con rosca 5/8-11 color negra para perforación de piedra' },
  { nombre: 'Broca 45MM 5/8-11 Negra', tipo: 'Broca', cantidad: 3, descripcion: 'Broca diamantada 45mm con rosca 5/8-11 color negra para perforación de piedra' },
  { nombre: 'Broca 75x40tx5/8"-11 F Negra', tipo: 'Broca', cantidad: 1, descripcion: 'Broca diamantada 75x40t con rosca 5/8"-11 F color negra especial para perforación' },
  { nombre: 'Broca en forma de cuchilla dorada', tipo: 'Broca especial', cantidad: 2, descripcion: 'Broca en forma de cuchilla color dorada para cortes especiales en piedra' },
  { nombre: 'Base negra para pulidora', tipo: 'Accesorio', cantidad: 2, descripcion: 'Base negra compatible con pulidora para montar discos - accesorio esencial' }
].map(h => ({
  tipo: h.tipo,
  nombre: h.nombre,
  marca: 'Generic',
  material_compatible: 'Universal',
  cantidad: h.cantidad,
  descripcion_detallada: h.descripcion,
  notas: 'Inventario inicial - 2024-11-07'
}))

async function insertarInventario() {
  console.log('🚀 Iniciando inserción de inventario...\n')

  try {
    // Insertar piedras de devastar
    console.log('📦 Insertando piedras de devastar...')
    const { data: data1, error: error1 } = await supabase
      .from('discos')
      .insert(piedrasDevastar)
    
    if (error1) throw error1
    console.log(`✅ ${piedrasDevastar.length} piedras de devastar insertadas\n`)

    // Insertar discos de granito
    console.log('📦 Insertando discos de pulir granito...')
    const { data: data2, error: error2 } = await supabase
      .from('discos')
      .insert(discosGranito)
    
    if (error2) throw error2
    console.log(`✅ ${discosGranito.length} discos de granito insertados\n`)

    // Insertar discos de cuarzo
    console.log('📦 Insertando discos de pulir cuarzo...')
    const { data: data3, error: error3 } = await supabase
      .from('discos')
      .insert(discosCuarzo)
    
    if (error3) throw error3
    console.log(`✅ ${discosCuarzo.length} discos de cuarzo insertados\n`)

    // Insertar juego de discos
    console.log('📦 Insertando juego de discos...')
    const { data: data4, error: error4 } = await supabase
      .from('discos')
      .insert(juegoDiscos)
    
    if (error4) throw error4
    console.log(`✅ ${juegoDiscos.length} juego de discos insertado\n`)

    // Insertar discos indiferentes
    console.log('📦 Insertando discos indiferentes...')
    const { data: data5, error: error5 } = await supabase
      .from('discos')
      .insert(discosIndiferentes)
    
    if (error5) throw error5
    console.log(`✅ ${discosIndiferentes.length} discos indiferentes insertados\n`)

    // Insertar discos curvos
    console.log('📦 Insertando discos curvos...')
    const { data: data6, error: error6 } = await supabase
      .from('discos')
      .insert(discosCurvos)
    
    if (error6) throw error6
    console.log(`✅ ${discosCurvos.length} discos curvos insertados\n`)

    // Insertar felpas
    console.log('📦 Insertando felpas...')
    const { data: data7, error: error7 } = await supabase
      .from('discos')
      .insert(felpas)
    
    if (error7) throw error7
    console.log(`✅ ${felpas.length} felpa insertada\n`)

    // Insertar discos de corte
    console.log('📦 Insertando discos de corte...')
    const { data: data8, error: error8 } = await supabase
      .from('discos')
      .insert(discosCorte)
    
    if (error8) throw error8
    console.log(`✅ ${discosCorte.length} tipo de disco de corte insertado\n`)

    // Insertar herramientas (en la tabla discos)
    console.log('📦 Insertando herramientas y brocas...')
    const { data: data9, error: error9 } = await supabase
      .from('discos')
      .insert(herramientas)
    
    if (error9) throw error9
    console.log(`✅ ${herramientas.length} herramientas insertadas\n`)

    // Resumen
    const totalDiscos = piedrasDevastar.length + discosGranito.length + discosCuarzo.length + 
                        juegoDiscos.length + discosIndiferentes.length + discosCurvos.length + 
                        felpas.length + discosCorte.length
    
    const totalUnidades = [...piedrasDevastar, ...discosGranito, ...discosCuarzo, ...juegoDiscos,
                           ...discosIndiferentes, ...discosCurvos, ...felpas, ...discosCorte]
                          .reduce((sum, d) => sum + d.cantidad, 0)

    console.log('═══════════════════════════════════════════')
    console.log('✨ RESUMEN DE INVENTARIO INSERTADO')
    console.log('═══════════════════════════════════════════')
    console.log(`📊 Tipos de discos: ${totalDiscos}`)
    console.log(`📦 Total unidades de discos: ${totalUnidades}`)
    console.log(`🔧 Tipos de herramientas: ${herramientas.length}`)
    console.log(`🔨 Total unidades de herramientas: ${herramientas.reduce((sum, h) => sum + h.cantidad, 0)}`)
    console.log('═══════════════════════════════════════════')
    console.log('✅ Inventario insertado exitosamente!')

  } catch (error) {
    console.error('❌ Error al insertar inventario:', error.message)
    if (error.details) console.error('Detalles:', error.details)
    if (error.hint) console.error('Sugerencia:', error.hint)
    process.exit(1)
  }
}

// Ejecutar
insertarInventario()
