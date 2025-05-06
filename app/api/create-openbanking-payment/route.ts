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

    const confirmed = await stripe.paymentIntents.confirm(
      intent.id,
      {
        return_url: "https://example.com/return",
      },
      { stripeAccount }
    );

    console.log("🔎 confirmed.status:", confirmed.status);
    console.log("🔎 confirmed.next_action:", confirmed.next_action);

    return NextResponse.json({
      client_secret: confirmed.client_secret,
      next_action: confirmed.next_action,
      status: confirmed.status,
      redirect_url: confirmed.next_action?.redirect_to_url?.url || null
    });
  } catch (error) {
    console.error("❌ Open Banking intent creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal error" },
      { status: 500 }
    );
  }
}