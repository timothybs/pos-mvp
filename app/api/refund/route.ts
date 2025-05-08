// app/api/refund/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🛠️ Incoming refund request:", body);
    const balance = await stripe.balance.retrieve();
    console.log("🔍 Stripe account balance test:", balance);
    const { payment_intent_id, stripe_account_id } = body;

    if (!payment_intent_id) {
      return NextResponse.json({ error: 'Missing payment_intent_id' }, { status: 400 });
    }

    if (!stripe_account_id) {
      return NextResponse.json({ error: 'Missing stripe_account_id' }, { status: 400 });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id,
    }, {
      stripeAccount: stripe_account_id,
    });

    console.log('✅ Refund created:', refund.id);

    return NextResponse.json({ refund });
  } catch (err) {
    console.error('❌ Refund failed:', err);
    return NextResponse.json({ error: 'Refund failed' }, { status: 500 });
  }
}