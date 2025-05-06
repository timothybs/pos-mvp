// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // adjust based on current support
})
console.log("💡 Stripe running in", process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "LIVE" : "TEST", "mode");
console.log("📍 Using location ID:", process.env.STRIPE_LOCATION_ID);
export async function POST(req: NextRequest) {
  let body = {}

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 })
  }

  const { amount = 30, currency = "gbp", stripeAccount } = body as {
    amount?: number
    currency?: string
    stripeAccount?: string
  }

  console.log("💰 Creating payment intent for amount:", amount, currency)
  console.log("🏦 Using connected Stripe account:", stripeAccount)

  if (!stripeAccount) {
    return NextResponse.json({ error: "Missing stripeAccount in request body" }, { status: 400 })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        capture_method: "manual", // required for Stripe Terminal
        payment_method_types: ["card_present"],
      },
      {
        stripeAccount,
      }
    )

    console.log("✅ Payment intent created:", paymentIntent)

    return NextResponse.json({ client_secret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error("❌ Failed to create payment intent:", JSON.stringify(err, null, 2))
    return NextResponse.json({ error: err.message ?? "Stripe error" }, { status: 500 })
  }
}