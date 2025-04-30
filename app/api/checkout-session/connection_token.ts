// pages/api/connection_token.ts (Next.js or Vercel edge function)
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await stripe.terminal.connectionTokens.create()
  res.status(200).json({ secret: token.secret })
}