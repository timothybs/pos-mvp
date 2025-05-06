import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

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
    .select('id, stripe_account_id, terminal_location_id, user_id, status, settings')
    .eq('user_id', userId)
    .single()

  if (error || !merchant) {
    return NextResponse.json({ error: 'Merchant not found' }, { status: 404 })
  }

  // Check if terminal_location_id is missing, create if necessary
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil'
  })

  if (!merchant.terminal_location_id) {
    const location = await stripe.terminal.locations.create({
      display_name: "Default Location",
      address: {
        line1: "123 Main St",
        city: "London",
        country: "GB",
        postal_code: "W1A 1AA"
      }
    }, {
      stripeAccount: merchant.stripe_account_id
    })

    const { error: updateError } = await supabase
      .from('merchants')
      .update({ terminal_location_id: location.id })
      .eq('id', merchant.id)

    if (!updateError) {
      merchant.terminal_location_id = location.id
    }
  }

  return NextResponse.json(merchant)
}