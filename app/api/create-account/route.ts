import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  const body = await request.json();
  const {
    country = "GB",
    business_type = "individual",
    email,
    first_name,
    last_name,
    dob_day,
    dob_month,
    dob_year,
  } = body;

  try {
    const account = await stripe.accounts.create({
      type: "custom",
      country,
      email,
      business_type: business_type as "individual" | "company",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      individual: {
        first_name,
        last_name,
        dob: {
          day: dob_day,
          month: dob_month,
          year: dob_year,
        },
      },
      business_profile: {
        product_description: "POS app seller",
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ accountId: account.id });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}