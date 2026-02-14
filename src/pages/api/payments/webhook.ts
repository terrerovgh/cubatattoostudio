export const prerender = false;

import type { APIRoute } from 'astro';
import { generateAftercareMessages } from '../../../lib/aftercare';
import { calculateBookingPoints, calculateTier } from '../../../lib/loyalty';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const db = env.DB;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Stripe not configured', { status: 500 });
  }

  const stripe = await import('stripe');
  const stripeClient = new stripe.default(env.STRIPE_SECRET_KEY);

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        const bookingId = intent.metadata?.booking_id;
        const clientId = intent.metadata?.client_id;

        if (bookingId) {
          // Update payment record
          await db.prepare(`
            UPDATE payments SET status = 'succeeded', stripe_charge_id = ?
            WHERE stripe_payment_intent_id = ?
          `).bind(intent.latest_charge || null, intent.id).run();

          // Update booking
          await db.prepare(`
            UPDATE bookings SET status = 'deposit_paid', deposit_paid = 1, updated_at = datetime('now')
            WHERE id = ?
          `).bind(bookingId).run();
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        const bookingId = intent.metadata?.booking_id;

        if (bookingId) {
          await db.prepare(`UPDATE payments SET status = 'failed' WHERE stripe_payment_intent_id = ?`)
            .bind(intent.id).run();
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const payment = await db.prepare(`SELECT * FROM payments WHERE stripe_charge_id = ?`)
          .bind(charge.id).first();

        if (payment) {
          const refundedAmount = charge.amount_refunded / 100;
          const isFullRefund = charge.refunded;

          await db.prepare(`
            UPDATE payments SET
              status = ?,
              refund_amount = ?,
              updated_at = datetime('now')
            WHERE stripe_charge_id = ?
          `).bind(
            isFullRefund ? 'refunded' : 'partially_refunded',
            refundedAmount,
            charge.id,
          ).run();
        }
        break;
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Webhook handler error', { status: 500 });
  }
};
