// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // adjust based on current support
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { amount, currency = "usd" } = body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      capture_method: "manual", // required for Stripe Terminal
      payment_method_types: ["card_present"],
    })

    return NextResponse.json({ client_secret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error("Failed to create payment intent:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}