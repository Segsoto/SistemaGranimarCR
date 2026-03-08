// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { getUSDToCRC } from '@/lib/utils'

export default function ConfiguracionPage() {
  const [rate, setRate] = useState<number>(500)

  useEffect(() => {
    // Fixed rate; read from utils (env override possible)
    setRate(getUSDToCRC())
  }, [])

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
          <h3 className="font-semibold mb-3">Tasa de cambio fija</h3>
          <p>La aplicación usa una tasa fija de USD → CRC en todos los módulos.</p>
          <div className="mt-4">
            <label className="label">Tasa USD → CRC</label>
            <div className="font-mono text-lg">1 USD = {rate} CRC</div>
          </div>
        </div>
      </div>
    </div>
  )
}
