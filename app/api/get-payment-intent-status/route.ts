

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

    const intent = await stripe.paymentIntents.retrieve(payment_intent_id, {
      stripeAccount,
    });

    return NextResponse.json({ status: intent.status });
  } catch (error) {
    console.error("❌ Failed to retrieve PaymentIntent status:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}