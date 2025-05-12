import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  const { account_id, account_holder_name, sort_code, account_number } = await request.json();

  try {
    const result = await stripe.accounts.createExternalAccount(account_id, {
      external_account: {
        object: "bank_account",
        country: "GB",
        currency: "GBP",
        account_holder_name,
        account_number,
        routing_number: sort_code,
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Stripe bank account error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}