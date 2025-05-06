import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount = 100,
      currency = "gbp",
      stripeAccount,
    } = body as {
      amount?: number;
      currency?: string;
      stripeAccount?: string;
    };

    if (!stripeAccount) {
      return NextResponse.json({ error: "Missing stripeAccount" }, { status: 400 });
    }

    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: ["pay_by_bank"],
      },
      { stripeAccount }
    );

    return NextResponse.json({
      id: intent.id,
      client_secret: intent.client_secret,
      status: intent.status
    });
  } catch (error) {
    console.error("❌ Open Banking intent creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal error" },
      { status: 500 }
    );
  }
}