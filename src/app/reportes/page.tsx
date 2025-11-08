// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, getMonthYear } from '@/lib/utils'
import toast from 'react-hot-toast'
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Package,
  Download,
  Filter
} from 'lucide-react'

interface ReporteStats {
  totalGastosFijos: number
  totalGastosVariables: number
  totalProduccion: number
  totalRetiros: number
  inventarioValor: number
}

export default function ReportesPage() {
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState<ReporteStats>({
    totalGastosFijos: 0,
    totalGastosVariables: 0,
    totalProduccion: 0,
    totalRetiros: 0,
    inventarioValor: 0,
  })
  const [gastosDetalle, setGastosDetalle] = useState<any[]>([])
  const [produccionDetalle, setProduccionDetalle] = useState<any[]>([])
  const [retirosDetalle, setRetirosDetalle] = useState<any[]>([])

  useEffect(() => {
    fetchReporteData()
  }, [selectedMonth, selectedYear])

  const fetchReporteData = async () => {
    setLoading(true)
    try {
      // Obtener gastos del mes
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
      const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`

      const { data: gastos } = await supabase
        .from('gastos')
        .select('*')
        .gte('fecha', startDate)
        .lte('fecha', endDate)

      const gastosFijos = gastos?.filter(g => g.es_fijo) || []
      const gastosVariables = gastos?.filter(g => !g.es_fijo) || []

      setGastosDetalle(gastos || [])

      // Obtener producción del mes
      const { data: produccion } = await supabase
        .from('produccion_sobres')
        .select('*')
        .gte('fecha', startDate)
        .lte('fecha', endDate)

      setProduccionDetalle(produccion || [])

      // Obtener retiros del mes
      const { data: retiros } = await supabase
        .from('retiros')
        .select(`
          *,
          materiales (nombre)
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      setRetirosDetalle(retiros || [])

      // Obtener valor del inventario
      const { data: materiales } = await supabase
        .from('materiales')
        .select('precio_costo, cantidad_laminas')

      const valorInventario = materiales?.reduce((sum, m) => 
        sum + (m.precio_costo * m.cantidad_laminas), 0
      ) || 0

      // Calcular totales
      setStats({
        totalGastosFijos: gastosFijos.reduce((sum, g) => sum + Number(g.monto), 0),
        totalGastosVariables: gastosVariables.reduce((sum, g) => sum + Number(g.monto), 0),
        totalProduccion: produccion?.reduce((sum, p) => sum + Number(p.costo_total), 0) || 0,
        totalRetiros: retiros?.length || 0,
        inventarioValor: valorInventario,
      })

    } catch (error) {
      console.error('Error fetching reporte:', error)
      toast.error('Error al cargar datos del reporte')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    // Generar CSV simple
    let csv = 'Reporte Mensual Granimar CR\n'
    csv += `Período: ${getMonthYear(selectedYear, selectedMonth)}\n\n`
    
    csv += 'RESUMEN GENERAL\n'
    csv += `Gastos Fijos,${formatCurrency(stats.totalGastosFijos)}\n`
    csv += `Gastos Variables,${formatCurrency(stats.totalGastosVariables)}\n`
    csv += `Total Gastos,${formatCurrency(stats.totalGastosFijos + stats.totalGastosVariables)}\n`
    csv += `Producción Total,${formatCurrency(stats.totalProduccion)}\n`
    csv += `Retiros de Material,${stats.totalRetiros}\n`
    csv += `Valor Inventario,${formatCurrency(stats.inventarioValor)}\n\n`

    csv += 'DETALLE DE GASTOS\n'
    csv += 'Fecha,Tipo,Categoría,Monto,Descripción\n'
    gastosDetalle.forEach(g => {
      csv += `${g.fecha},${g.es_fijo ? 'Fijo' : 'Variable'},${g.categoria || 'N/A'},${g.monto},"${g.descripcion || ''}"\n`
    })

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_${selectedYear}_${selectedMonth}.csv`
    a.click()

    toast.success('Reporte exportado')
  }

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const totalGastos = stats.totalGastosFijos + stats.totalGastosVariables
  const margen = stats.totalProduccion - totalGastos

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Análisis financiero y operativo</p>
        </div>
        <button onClick={exportToCSV} className="btn btn-primary">
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="label">Mes</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="input"
                >
                  {months.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Año</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="input"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="stat-icon bg-red-100 text-red-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Gastos Fijos</h3>
                <p className="stat-value">{formatCurrency(stats.totalGastosFijos)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-orange-100 text-orange-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Gastos Variables</h3>
                <p className="stat-value">{formatCurrency(stats.totalGastosVariables)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-blue-100 text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Producción</h3>
                <p className="stat-value">{formatCurrency(stats.totalProduccion)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-purple-100 text-purple-600">
                <Package className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">Valor Inventario</h3>
                <p className="stat-value">{formatCurrency(stats.inventarioValor)}</p>
              </div>
            </div>
          </div>

          {/* Análisis Financiero */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Análisis Financiero - {months[selectedMonth - 1]} {selectedYear}</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <span className="font-medium">Total Gastos del Mes</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(totalGastos)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                  <span className="font-medium">Total Producción</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(stats.totalProduccion)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-primary-50 rounded border-2 border-primary-200">
                  <span className="font-bold text-lg">Margen del Mes</span>
                  <span className={`text-xl font-bold ${margen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(margen)}
                  </span>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Distribución de Gastos</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-red-500 rounded flex items-center justify-center text-white text-sm font-medium"
                         style={{ width: `${(stats.totalGastosFijos / totalGastos) * 100}%` }}>
                      Fijos {totalGastos > 0 ? Math.round((stats.totalGastosFijos / totalGastos) * 100) : 0}%
                    </div>
                    <div className="flex-1 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-sm font-medium"
                         style={{ width: `${(stats.totalGastosVariables / totalGastos) * 100}%` }}>
                      Variables {totalGastos > 0 ? Math.round((stats.totalGastosVariables / totalGastos) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalle de Gastos */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Detalle de Gastos ({gastosDetalle.length})</h2>
            </div>
            <div className="card-body">
              {gastosDetalle.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay gastos registrados en este período</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th className="text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosDetalle.map(gasto => (
                        <tr key={gasto.id}>
                          <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${gasto.es_fijo ? 'badge-danger' : 'badge-warning'}`}>
                              {gasto.es_fijo ? 'Fijo' : 'Variable'}
                            </span>
                          </td>
                          <td>{gasto.categoria || '-'}</td>
                          <td className="max-w-xs truncate">{gasto.descripcion || '-'}</td>
                          <td className="text-right font-semibold">{formatCurrency(gasto.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td colSpan={4} className="text-right">TOTAL</td>
                        <td className="text-right">{formatCurrency(totalGastos)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Detalle de Producción */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Detalle de Producción ({produccionDetalle.length})</h2>
            </div>
            <div className="card-body">
              {produccionDetalle.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay órdenes de producción en este período</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Material</th>
                        <th>Mano de Obra</th>
                        <th>Insumos</th>
                        <th>Servicios</th>
                        <th>Otros</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produccionDetalle.map(prod => (
                        <tr key={prod.id}>
                          <td>{new Date(prod.fecha).toLocaleDateString()}</td>
                          <td>{formatCurrency(prod.material_usado)}</td>
                          <td>{formatCurrency(prod.mano_obra)}</td>
                          <td>{formatCurrency(prod.insumos)}</td>
                          <td>{formatCurrency(prod.servicios)}</td>
                          <td>{formatCurrency(prod.otros_gastos)}</td>
                          <td className="text-right font-semibold">{formatCurrency(prod.costo_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td colSpan={6} className="text-right">TOTAL</td>
                        <td className="text-right">{formatCurrency(stats.totalProduccion)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Detalle de Retiros */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Retiros de Material ({retirosDetalle.length})</h2>
            </div>
            <div className="card-body">
              {retirosDetalle.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay retiros registrados en este período</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Material</th>
                        <th>Metros Lineales</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retirosDetalle.map(retiro => (
                        <tr key={retiro.id}>
                          <td>{new Date(retiro.created_at).toLocaleDateString()}</td>
                          <td>{retiro.materiales?.nombre || 'N/A'}</td>
                          <td className="font-semibold">{retiro.metros_lineales} m</td>
                          <td className="max-w-xs truncate">{retiro.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
