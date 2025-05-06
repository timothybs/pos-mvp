import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function GET() {
  try {
    const account = await stripe.accounts.retrieve();
    const isConnected = account.controller !== null;

    return new Response(
      JSON.stringify({
        id: account.id,
        type: account.type,
        email: account.email,
        isConnected: isConnected,
        connectedTo: isConnected ? account.controller : null,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
