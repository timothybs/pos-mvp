import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
})

export async function POST(req: Request) {
  const { cart, stripeAccount } = await req.json()

  if (!stripeAccount) {
    return NextResponse.json({ error: "Missing stripeAccount in request body" }, { status: 400 })
  }

  const lineItems = cart.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pay_by_bank_transfer"] as unknown as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      payment_method_collection: "always",
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    }, {
      stripeAccount,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}