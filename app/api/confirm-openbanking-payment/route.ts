


import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payment_intent_id, stripeAccount } = body;

    if (!payment_intent_id || !stripeAccount) {
      return NextResponse.json({ error: "Missing payment_intent_id or stripeAccount" }, { status: 400 });
    }

    const confirmed = await stripe.paymentIntents.confirm(payment_intent_id, {
      return_url: "https://example.com/return"
    }, { stripeAccount });

    return NextResponse.json({
      client_secret: confirmed.client_secret,
      status: confirmed.status,
      redirect_url: confirmed.next_action?.redirect_to_url?.url || null
    });
  } catch (error) {
    console.error("❌ Failed to confirm Open Banking PaymentIntent:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}