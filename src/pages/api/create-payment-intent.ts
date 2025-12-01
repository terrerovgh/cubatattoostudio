import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Stripe Secret Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

  try {
    // In a real app, you should validate the amount on the server side
    // based on the selected services/items to prevent tampering.
    // For this booking system, the deposit is fixed at $50.00.
    const amount = 5000; // $50.00 in cents
    const currency = 'usd';

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
