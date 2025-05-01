import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🚀 HIT /connection_token")

  try {
    const token = await stripe.terminal.connectionTokens.create()
    res.status(200).json({ secret: token.secret })
  } catch (error) {
    console.error("❌ Error creating token:", error)
    res.status(500).json({ error: "Failed to create connection token" })
  }
}