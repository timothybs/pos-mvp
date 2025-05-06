import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const stripeAccount = await verifyAndExtractStripeAccount(token)
    if (!stripeAccount) {
      return new NextResponse('Invalid token or no stripe account found', { status: 403 })
    }

    console.log("📡 Verified stripeAccount from token:", stripeAccount)

    const connectionToken = await stripe.terminal.connectionTokens.create({}, {
      stripeAccount,
    })

    return NextResponse.json({ secret: connectionToken.secret })
  } catch (error) {
    console.error("❌ Error creating connection token:", JSON.stringify(error, null, 2))
    return new NextResponse('Failed to create connection token', { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyAndExtractStripeAccount(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as { sub: string }
    const userId = decoded.sub

    const { data, error } = await supabase
      .from('merchants')
      .select('stripe_account_id')
      .eq('user_id', userId)
      .single()

      console.log("🧾 Supabase response — data:", data)
      console.log("🧾 Supabase response — error:", error)

    if (error) {
      console.error("❌ Supabase merchant fetch error:", error)
      return null
    }

    return data?.stripe_account_id || null
  } catch (err) {
    console.error("❌ JWT verification failed:", err)
    return null
  }
}