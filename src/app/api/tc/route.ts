import { NextResponse } from 'next/server'
import { fetchUSDToCRC } from '@/lib/exchange'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

const makeClient = (useService = false) => {
  const url = SUPABASE_URL
  const key = useService ? SUPABASE_SERVICE || SUPABASE_ANON : SUPABASE_ANON
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: Request) {
  try {
    const urlObj = new URL(request.url)
    const date = urlObj.searchParams.get('date') ?? undefined

    const client = makeClient(false)
    let cfgMap: Record<string, string> = {}
    if (client) {
      const { data: cfg, error: cfgErr } = await client.from('config').select('key, value')
      if (cfgErr) console.warn('Error reading config for tc:', cfgErr)
      (cfg || []).forEach((r: any) => { cfgMap[r.key] = r.value })
    } else {
      console.warn('Supabase env missing; /api/tc will fall back to direct providers')
    }

    if (cfgMap['exchange_source'] === 'manual') {
      const manual = parseFloat(cfgMap['manual_usd_to_crc'] || '')
      if (!isNaN(manual) && manual > 0) {
        return NextResponse.json({ rate: manual })
      }
    }

    const rate = await fetchUSDToCRC(date ?? undefined)
    return NextResponse.json({ rate })
  } catch (err) {
    console.error('Error in /api/tc:', err)
    return NextResponse.json({ error: 'failed', message: String(err) }, { status: 500 })
  }
}
