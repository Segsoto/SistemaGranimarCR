// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Plus, Search, Filter, Trash2, Package, Calendar, User, Edit } from 'lucide-react'
import Link from 'next/link'

interface Disco {
  id: string
  nombre: string
  tipo: string
  marca: string | null
  cantidad: number
}

interface Retirodisco {
  id: string
  disco_id: string
  cantidad: number
  motivo: string | null
  proyecto: string | null
  fecha_retiro: string
  usuario: string | null
  created_at: string
  discos?: Disco
}

export default function RetirosDiscosPage() {
  const [retiros, setRetiros] = useState<Retirodisco[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMes, setFilterMes] = useState<string>('')
  const [filterAnio, setFilterAnio] = useState<string>(new Date().getFullYear().toString())

  useEffect(() => {
    fetchRetiros()
  }, [filterMes, filterAnio])

  const fetchRetiros = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('discos_movimientos')
        .select(`
          *,
          discos (
            id,
            nombre,
            tipo,
            marca,
            cantidad
          )
        `)
        .eq('tipo_movimiento', 'salida')
        .order('fecha_retiro', { ascending: false })

      // Filtrar por mes y año si están seleccionados
      if (filterAnio) {
        const startDate = filterMes 
          ? new Date(parseInt(filterAnio), parseInt(filterMes) - 1, 1).toISOString()
          : new Date(parseInt(filterAnio), 0, 1).toISOString()
        
        const endDate = filterMes
          ? new Date(parseInt(filterAnio), parseInt(filterMes), 0, 23, 59, 59).toISOString()
          : new Date(parseInt(filterAnio), 11, 31, 23, 59, 59).toISOString()

        query = query.gte('fecha_retiro', startDate).lte('fecha_retiro', endDate)
      }

      const { data, error } = await query

      if (error) throw error
      setRetiros(data || [])
    } catch (error) {
      console.error('Error fetching retiros:', error)
      toast.error('Error al cargar retiros')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (retiro: Retirodisco) => {
    if (!confirm(`¿Eliminar retiro de ${retiro.discos?.nombre}?`)) return

    try {
      // Devolver la cantidad al inventario
      if (retiro.discos) {
        const { error: updateError } = await supabase
          .from('discos')
          .update({
            cantidad: retiro.discos.cantidad + retiro.cantidad
          })
          .eq('id', retiro.disco_id)

        if (updateError) throw updateError
      }

      // Eliminar el retiro
      const { error } = await supabase
        .from('discos_movimientos')
        .delete()
        .eq('id', retiro.id)

      if (error) throw error

      toast.success('Retiro eliminado y cantidad devuelta al inventario')
      fetchRetiros()
    } catch (error: any) {
      console.error('Error deleting retiro:', error)
      toast.error('Error: ' + error.message)
    }
  }

  const filteredRetiros = retiros.filter(retiro => {
    const searchLower = searchTerm.toLowerCase()
    return (
      retiro.discos?.nombre?.toLowerCase().includes(searchLower) ||
      retiro.discos?.tipo?.toLowerCase().includes(searchLower) ||
      retiro.proyecto?.toLowerCase().includes(searchLower) ||
      retiro.motivo?.toLowerCase().includes(searchLower) ||
      retiro.usuario?.toLowerCase().includes(searchLower)
    )
  })

  // Calcular totales
  const totalRetiros = filteredRetiros.reduce((sum, r) => sum + r.cantidad, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Retiros de Discos/Herramientas</h1>
          <p className="page-subtitle">Control de salidas de discos y herramientas</p>
        </div>
        <Link href="/inventario/herramientas/discos/retiros/nuevo" className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Registrar Retiro
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Retiros</p>
                <p className="text-2xl font-bold text-gray-900">{filteredRetiros.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cantidad Total Retirada</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalRetiros)} unidades</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <Search className="w-4 h-4" />
                Buscar
              </label>
              <input
                type="text"
                placeholder="Disco, herramienta, proyecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">
                <Filter className="w-4 h-4" />
                Mes
              </label>
              <select
                value={filterMes}
                onChange={(e) => setFilterMes(e.target.value)}
                className="input"
              >
                <option value="">Todos los meses</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            <div>
              <label className="label">
                <Calendar className="w-4 h-4" />
                Año
              </label>
              <select
                value={filterAnio}
                onChange={(e) => setFilterAnio(e.target.value)}
                className="input"
              >
                <option value="">Todos</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="spinner spinner-lg"></div>
        </div>
      ) : filteredRetiros.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay retiros registrados</h3>
            <p className="text-gray-500 mb-4">Comienza registrando tu primer retiro de discos/herramientas</p>
            <Link href="/inventario/herramientas/discos/retiros/nuevo" className="btn btn-primary">
              <Plus className="w-5 h-5" />
              Registrar Retiro
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Disco/Herramienta</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Cantidad</th>
                  <th>Detalle</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetiros.map((retiro) => (
                  <tr key={retiro.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(retiro.fecha_retiro).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {retiro.discos?.nombre || 'Disco eliminado'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">
                        {retiro.discos?.tipo || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="text-gray-600">
                        {retiro.discos?.marca || '-'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {formatNumber(retiro.cantidad)} uds
                      </span>
                    </td>
                    <td>
                      <div className="text-gray-600 text-sm max-w-xs truncate">
                        {retiro.motivo || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        {retiro.usuario || 'Sistema'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/inventario/herramientas/discos/retiros/editar/${retiro.id}`}
                          className="btn btn-sm btn-secondary"
                          title="Editar retiro"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(retiro)}
                          className="btn btn-sm btn-danger"
                          title="Eliminar y devolver al inventario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
