import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
  }

  let userId: string
  try {
    const decoded = jwt.decode(token) as { sub?: string } | null
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    userId = decoded.sub
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !merchant) {
    return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })
  }

  return NextResponse.json(merchant)
}