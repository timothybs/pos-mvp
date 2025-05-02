// app/api/confirm-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // Use a stable supported version
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { payment_intent_id } = body

  if (!payment_intent_id) {
    return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
  }

  try {
    const confirmedIntent = await stripe.paymentIntents.confirm(payment_intent_id)
    console.log("✅ PaymentIntent confirmed:", confirmedIntent.id)

    console.log("👉 Status after confirmation:", confirmedIntent.status)

    if (confirmedIntent.status === 'requires_capture') {
      const capturedIntent = await stripe.paymentIntents.capture(payment_intent_id)
      console.log("💰 PaymentIntent captured:", capturedIntent.id)
      return NextResponse.json({ status: "captured", intent: capturedIntent })
    }

    // Fallback for debugging
    try {
      const capturedIntent = await stripe.paymentIntents.capture(payment_intent_id)
      console.log("💰 [Fallback] Captured anyway:", capturedIntent.id)
      return NextResponse.json({ status: "captured", intent: capturedIntent })
    } catch (err) {
      console.error("❌ Capture failed in fallback:", err.message)
    }

    return NextResponse.json({ status: "confirmed", intent: confirmedIntent })
  } catch (err: any) {
    console.error("❌ Failed to confirm PaymentIntent:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ message: "GET request received" });
}