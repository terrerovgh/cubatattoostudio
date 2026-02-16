export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import Stripe from 'stripe';

interface CreateIntentRequest {
  booking_id: string;
  amount: number;
  payment_method_id?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;

    if (!env.STRIPE_SECRET_KEY) {
      return Response.json(
        { success: false, error: 'Payment system not configured' } satisfies ApiResponse,
        { status: 503 },
      );
    }

    const { booking_id, amount, payment_method_id } = await request.json() as CreateIntentRequest;

    if (!booking_id || !amount) {
      return Response.json(
        { success: false, error: 'booking_id and amount are required' } satisfies ApiResponse,
        { status: 400 },
      );
    }

    const db = env.DB;
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(booking_id).first();

    if (!booking) {
      return Response.json(
        { success: false, error: 'Booking not found' } satisfies ApiResponse,
        { status: 404 },
      );
    }

    const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia'
    });

    const intentParams: any = {
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        booking_id,
        client_id: booking.client_id as string,
        artist_id: booking.artist_id as string,
      },
      automatic_payment_methods: { enabled: true },
    };

    if (payment_method_id) {
      intentParams.payment_method = payment_method_id;
      intentParams.confirm = true;
      intentParams.automatic_payment_methods.allow_redirects = 'never';
    }

    const intent = await stripeClient.paymentIntents.create(intentParams);

    // Record pending payment
    const paymentId = crypto.randomUUID().replace(/-/g, '');
    await db.prepare(`
      INSERT INTO payments (id, booking_id, client_id, stripe_payment_intent_id, amount, type, status)
      VALUES (?, ?, ?, ?, ?, 'deposit', 'pending')
    `).bind(paymentId, booking_id, booking.client_id as string, intent.id, amount).run();

    return Response.json({
      success: true,
      data: {
        client_secret: intent.client_secret,
        payment_intent_id: intent.id,
        status: intent.status,
      },
    } satisfies ApiResponse);
  } catch (err) {
    console.error('Payment intent error:', err);
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : 'Payment failed' } satisfies ApiResponse,
      { status: 500 },
    );
  }
};
