export const prerender = false;

import type { APIRoute } from 'astro';
import type { CreateBookingRequest, ApiResponse, CreateBookingResponse } from '../../../types/booking';
import { calculatePriceEstimate, estimateDuration } from '../../../lib/pricing';
import { z } from 'zod';

const BookingSchema = z.object({
  form_data: z.object({
    artist_id: z.string().min(1, "Artist ID is required"),
    service_type: z.string().min(1, "Service type is required"),
    scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    scheduled_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
    date_of_birth: z.string().optional(),
    size_category: z.enum(['tiny', 'small', 'medium', 'large', 'xlarge', 'custom']).optional(),
    style: z.string().optional(),
    is_cover_up: z.boolean().optional(),
    is_touch_up: z.boolean().optional(),
    reference_images: z.array(z.any()).optional(),
    description: z.string().optional(),
    placement: z.string().optional(),
    size_inches: z.string().optional(),
    payment_method: z.string().optional(),
  }),
  stripe_payment_method_id: z.string().optional(),
});

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const db = env.DB;

    // ─── Validate Input ───────────────────────────────
    const bodyResult = BookingSchema.safeParse(await request.json());
    if (!bodyResult.success) {
      return Response.json(
        { success: false, error: 'Validation failed', data: bodyResult.error.format() } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const { form_data, stripe_payment_method_id } = bodyResult.data;

    // ─── Find or create client ────────────────────────
    let client = await db.prepare('SELECT * FROM clients WHERE email = ?').bind(form_data.email).first();

    if (!client) {
      const clientId = crypto.randomUUID().replace(/-/g, '');
      await db.prepare(`
        INSERT INTO clients (id, email, phone, first_name, last_name, date_of_birth, preferred_artist)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        clientId,
        form_data.email,
        form_data.phone || null,
        form_data.first_name,
        form_data.last_name,
        form_data.date_of_birth || null,
        form_data.artist_id,
      ).run();

      client = { id: clientId, email: form_data.email, loyalty_points: 0 };
    }

    // ─── Calculate pricing & duration ─────────────────
    const estimate = calculatePriceEstimate({
      size: form_data.size_category,
      style: form_data.style || form_data.service_type,
      isCoverUp: form_data.is_cover_up || false,
      isTouchUp: form_data.is_touch_up || false,
      date: form_data.scheduled_date,
      time: form_data.scheduled_time,
    });

    const duration = estimateDuration(
      form_data.size_category,
      form_data.style || form_data.service_type,
      form_data.is_cover_up || false,
    );

    // ─── Check for schedule conflicts (Overlap Check) ─
    const bookings = await db.prepare(`
      SELECT scheduled_time, estimated_duration FROM bookings
      WHERE artist_id = ? AND scheduled_date = ?
      AND status NOT IN ('cancelled', 'no_show', 'rescheduled')
    `).bind(form_data.artist_id, form_data.scheduled_date).all();

    const newStart = timeToMinutes(form_data.scheduled_time);
    const newEnd = newStart + duration;

    const hasOverlap = (bookings.results || []).some((b: any) => {
      const existingStart = timeToMinutes(b.scheduled_time);
      const existingEnd = existingStart + (b.estimated_duration || 60);
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasOverlap) {
      return Response.json({ success: false, error: 'This time slot overlaps with an existing booking.' } satisfies ApiResponse, { status: 409 });
    }

    // ─── Create booking ───────────────────────────────
    const bookingId = crypto.randomUUID().replace(/-/g, '');
    const referenceImages = form_data.reference_images?.length
      ? JSON.stringify(form_data.reference_images.map((_, i) => `ref_${bookingId}_${i}`))
      : null;

    try {
      await db.prepare(`
        INSERT INTO bookings (
          id, client_id, artist_id, service_type, status,
          scheduled_date, scheduled_time, estimated_duration,
          description, placement, size_category, size_inches, style,
          is_cover_up, is_touch_up, reference_images,
          estimated_price_min, estimated_price_max,
          deposit_amount, price_modifier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        bookingId,
        client.id as string,
        form_data.artist_id,
        form_data.service_type,
        'pending',
        form_data.scheduled_date,
        form_data.scheduled_time,
        duration,
        form_data.description || null,
        form_data.placement || null,
        form_data.size_category,
        form_data.size_inches || null,
        form_data.style || null,
        form_data.is_cover_up ? 1 : 0,
        form_data.is_touch_up ? 1 : 0,
        referenceImages,
        estimate.total_min,
        estimate.total_max,
        estimate.deposit_required,
        estimate.modifier,
      ).run();
    } catch (err: any) {
      // Catch race condition if UNIQUE constraint is hit
      if (err.message && (err.message.includes('constraint') || err.message.includes('UNIQUE'))) {
        return Response.json({ success: false, error: 'This time slot was just booked by someone else.' } satisfies ApiResponse, { status: 409 });
      }
      throw err;
    }

    // ─── Create Stripe payment intent ─────────────────
    let paymentIntent: { client_secret: string; amount: number } | undefined;

    if (stripe_payment_method_id && env.STRIPE_SECRET_KEY) {
      const stripe = await import('stripe');
      const stripeClient = new stripe.default(env.STRIPE_SECRET_KEY);

      const intent = await stripeClient.paymentIntents.create({
        amount: Math.round(estimate.deposit_required * 100), // cents
        currency: 'usd',
        payment_method: stripe_payment_method_id,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: {
          booking_id: bookingId,
          client_id: client.id as string,
          artist_id: form_data.artist_id,
        },
      });

      // Record payment
      const paymentId = crypto.randomUUID().replace(/-/g, '');
      await db.prepare(`
        INSERT INTO payments (id, booking_id, client_id, stripe_payment_intent_id, amount, type, status, payment_method)
        VALUES (?, ?, ?, ?, ?, 'deposit', ?, ?)
      `).bind(
        paymentId,
        bookingId,
        client.id as string,
        intent.id,
        estimate.deposit_required,
        intent.status === 'succeeded' ? 'succeeded' : 'processing',
        form_data.payment_method,
      ).run();

      if (intent.status === 'succeeded') {
        await db.prepare(`UPDATE bookings SET status = 'deposit_paid', deposit_paid = 1 WHERE id = ?`).bind(bookingId).run();
      }

      paymentIntent = {
        client_secret: intent.client_secret!,
        amount: estimate.deposit_required,
      };
    } else {
      // No Stripe key — mark as confirmed without payment (for development)
      await db.prepare(`UPDATE bookings SET status = 'confirmed' WHERE id = ?`).bind(bookingId).run();
    }

    // ─── Audit log ────────────────────────────────────
    await db.prepare(`
      INSERT INTO audit_log (id, entity_type, entity_id, action, actor, changes)
      VALUES (?, 'booking', ?, 'created', ?, ?)
    `).bind(
      crypto.randomUUID().replace(/-/g, ''),
      bookingId,
      form_data.email,
      JSON.stringify({ service: form_data.service_type, artist: form_data.artist_id }),
    ).run();

    const siteUrl = env.SITE_URL || 'https://cubatattoostudio.com';

    const response: CreateBookingResponse = {
      booking: {
        id: bookingId,
        client_id: client.id as string,
        artist_id: form_data.artist_id,
        service_type: form_data.service_type,
        status: paymentIntent ? 'deposit_paid' : 'confirmed',
        scheduled_date: form_data.scheduled_date,
        scheduled_time: form_data.scheduled_time,
        estimated_duration: duration,
        description: form_data.description,
        placement: form_data.placement,
        size_category: form_data.size_category,
        style: form_data.style,
        is_cover_up: form_data.is_cover_up || false,
        is_touch_up: form_data.is_touch_up || false,
        estimated_price_min: estimate.total_min,
        estimated_price_max: estimate.total_max,
        deposit_amount: estimate.deposit_required,
        deposit_paid: !!paymentIntent,
        price_modifier: estimate.modifier,
        consent_signed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      payment_intent: paymentIntent,
      consent_url: `${siteUrl}/consent/${bookingId}`,
    };

    return Response.json({ success: true, data: response } satisfies ApiResponse<CreateBookingResponse>, { status: 201 });
  } catch (err) {
    console.error('Booking creation error:', err);
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : 'Internal server error' } satisfies ApiResponse,
      { status: 500 },
    );
  }
};
