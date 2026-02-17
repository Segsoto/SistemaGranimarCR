// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [exchangeSource, setExchangeSource] = useState('api')
  const [manualRate, setManualRate] = useState('615')

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config')
      const data = await res.json()
      if (data.exchange_source) setExchangeSource(data.exchange_source)
      if (data.manual_usd_to_crc) setManualRate(String(data.manual_usd_to_crc))
    } catch (err) {
      console.error('Error loading config', err)
      toast.error('No se pudo cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      // Upsert exchange_source
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'exchange_source', value: exchangeSource })
      })

      // Upsert manual rate
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'manual_usd_to_crc', value: manualRate })
      })

      toast.success('Configuración guardada')
    } catch (err) {
      console.error('Error saving config', err)
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Ajustes de la aplicación</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-3">Tipo de tasa de cambio</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="radio" name="source" value="api" checked={exchangeSource === 'api'} onChange={() => setExchangeSource('api')} />
              <span>Usar proveedores (Hacienda / exchangerate.host)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="source" value="manual" checked={exchangeSource === 'manual'} onChange={() => setExchangeSource('manual')} />
              <span>Usar tasa manual</span>
            </label>

            {exchangeSource === 'manual' && (
              <div className="mt-2">
                <label className="label">Tasa USD -> CRC</label>
                <input type="number" className="input" value={manualRate} onChange={(e) => setManualRate(e.target.value)} step="0.01" />
              </div>
            )}

            <div className="mt-4">
              <button className="btn btn-primary" onClick={saveConfig} disabled={loading}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
