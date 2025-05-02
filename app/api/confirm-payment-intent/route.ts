// app/api/confirm-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // Use a stable supported version
})
console.log("💡 Stripe running in", process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "LIVE" : "TEST", "mode");
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { payment_intent_id } = body

  if (!payment_intent_id) {
    return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(payment_intent_id)
    console.log("👉 Retrieved intent status:", intent.status)

    if (intent.status === 'requires_capture') {
      const captured = await stripe.paymentIntents.capture(payment_intent_id)
      console.log("💰 Captured from retrieved intent:", captured.id)
      return NextResponse.json({ status: "captured", intent: captured })
    }

    if (intent.status !== 'requires_confirmation') {
      return NextResponse.json({
        error: `Cannot confirm intent in status ${intent.status}`,
      }, { status: 400 })
    }

    const confirmedIntent = await stripe.paymentIntents.confirm(payment_intent_id)
    console.log("✅ Confirmed intent:", confirmedIntent.id)

    if (confirmedIntent.status === 'requires_capture') {
      const captured = await stripe.paymentIntents.capture(payment_intent_id)
      console.log("💰 Captured after confirmation:", captured.id)
      return NextResponse.json({ status: "captured", intent: captured })
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