import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = body?.id
    const password = body?.password

    // Simple password check (default 4315)
    const DEFAULT_PASSWORD = '4315'
    if (!password || password !== DEFAULT_PASSWORD) {
      return NextResponse.json({ ok: false, message: 'Contraseña incorrecta' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Falta id de factura' }, { status: 400 })
    }

    const { error } = await supabase.from('facturacion').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error deleting factura:', err)
    return NextResponse.json({ ok: false, message: err.message || String(err) }, { status: 500 })
  }
}
