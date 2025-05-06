import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const stripeAccount = body.stripeAccount

    if (!stripeAccount) {
      return new NextResponse('Missing stripeAccount in request body', { status: 400 })
    }

    const token = await stripe.terminal.connectionTokens.create({}, {
      stripeAccount,
    })

    return NextResponse.json({ secret: token.secret })
  } catch (error) {
    console.error("❌ Error creating token:", error)
    return new NextResponse('Failed to create connection token', { status: 500 })
  }
}