import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper to create a client; prefer service role for write operations
const makeClient = (useService = false) => {
  const url = SUPABASE_URL
  const key = useService ? SUPABASE_SERVICE || SUPABASE_ANON : SUPABASE_ANON
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  try {
    const client = makeClient(false)
    if (!client) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 500 })
    const { data, error } = await client.from('config').select('key, value')
    if (error) {
      console.error('Supabase error reading config:', error)
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }
    const result: Record<string, string> = {}
    (data || []).forEach((r: any) => { result[r.key] = r.value })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Unexpected error in GET /api/config:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Only allow writes when service role key is available
    const client = makeClient(true)
    if (!client || !SUPABASE_SERVICE) {
      return NextResponse.json({ error: 'server_missing_service_role' }, { status: 403 })
    }

    const body = await request.json()
    if (!body || !body.key) return NextResponse.json({ error: 'invalid' }, { status: 400 })

    const upsert = await client
      .from('config')
      .upsert([{ key: body.key, value: String(body.value) }], { onConflict: 'key' })

    if (upsert.error) {
      console.error('Supabase error upserting config:', upsert.error)
      throw upsert.error
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Unexpected error in POST /api/config:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
