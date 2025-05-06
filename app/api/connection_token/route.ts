import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const stripeAccount = await verifyAndExtractStripeAccount(token)
    if (!stripeAccount) {
      return new NextResponse('Invalid token or no stripe account found', { status: 403 })
    }

    console.log("📡 Verified stripeAccount from token:", stripeAccount)

    const connectionToken = await stripe.terminal.connectionTokens.create({}, {
      stripeAccount,
    })

    return NextResponse.json({ secret: connectionToken.secret })
  } catch (error) {
    console.error("❌ Error creating connection token:", JSON.stringify(error, null, 2))
    return new NextResponse('Failed to create connection token', { status: 500 })
  }
}

// Dummy implementation — replace with real JWT verification as needed
async function verifyAndExtractStripeAccount(token: string): Promise<string | null> {
  // TODO: implement proper validation; currently just returns a fixed value for testing
  return process.env.STRIPE_ACCOUNT_ID || null
}