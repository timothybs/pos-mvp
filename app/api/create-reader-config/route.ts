import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // updated to match the required type
});

export async function POST(req: NextRequest) {
  try {
    const config = await stripe.terminal.configurations.create({});

    return NextResponse.json({ configuration: config });
  } catch (err: any) {
    console.error("❌ Failed to create reader configuration:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}