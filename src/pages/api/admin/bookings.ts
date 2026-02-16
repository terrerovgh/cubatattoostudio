export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import { z } from 'zod';
import { verifyAdminAuth } from '../../../lib/auth';

const PatchBookingSchema = z.object({
  booking_id: z.string().min(1),
  status: z.enum(['pending', 'confirmed', 'deposit_paid', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled']).optional(),
  artist_notes: z.string().optional(),
  final_price: z.number().optional(),
  cancellation_reason: z.string().optional(),
});

export const GET: APIRoute = async ({ request, url, locals }) => {
  const env = locals.runtime.env;
  if (!await verifyAdminAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const status = url.searchParams.get('status');
    const artistId = url.searchParams.get('artist_id');
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, c.first_name, c.last_name, c.email, c.phone as client_phone,
             c.loyalty_tier, c.visit_count
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }
    if (artistId) {
      query += ' AND b.artist_id = ?';
      params.push(artistId);
    }
    if (dateFrom) {
      query += ' AND b.scheduled_date >= ?';
      params.push(dateFrom);
    }
    if (dateTo) {
      query += ' AND b.scheduled_date <= ?';
      params.push(dateTo);
    }

    query += ' ORDER BY b.scheduled_date DESC, b.scheduled_time DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
    const countParams: any[] = [];
    if (status) { countQuery += ' AND status = ?'; countParams.push(status); }
    if (artistId) { countQuery += ' AND artist_id = ?'; countParams.push(artistId); }
    if (dateFrom) { countQuery += ' AND scheduled_date >= ?'; countParams.push(dateFrom); }
    if (dateTo) { countQuery += ' AND scheduled_date <= ?'; countParams.push(dateTo); }

    const countResult = await db.prepare(countQuery).bind(...countParams).first();
    const total = (countResult?.total as number) || 0;

    return Response.json({
      success: true,
      data: {
        bookings: result.results,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    } satisfies ApiResponse);
  } catch (err) {
    console.error('Admin bookings error:', err);
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  if (!await verifyAdminAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const json = await request.json().catch(() => ({}));
    const bodyResult = PatchBookingSchema.safeParse(json);

    if (!bodyResult.success) {
      return Response.json(
        { success: false, error: 'Validation failed', data: bodyResult.error.format() } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const { booking_id, status, artist_notes, final_price, cancellation_reason } = bodyResult.data;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) { updates.push('status = ?'); values.push(status); }
    if (artist_notes !== undefined) { updates.push('artist_notes = ?'); values.push(artist_notes); }
    if (final_price !== undefined) { updates.push('final_price = ?'); values.push(final_price); }
    if (cancellation_reason) { updates.push('cancellation_reason = ?'); values.push(cancellation_reason); }

    if (updates.length === 0) {
      return Response.json({ success: false, error: 'No fields to update' } satisfies ApiResponse, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    values.push(booking_id);

    await db.prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

    // If completed, update client stats
    if (status === 'completed') {
      const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(booking_id).first();
      if (booking) {
        await db.prepare(`
          UPDATE clients SET
            visit_count = visit_count + 1,
            total_spent = total_spent + COALESCE(?, 0),
            updated_at = datetime('now')
          WHERE id = ?
        `).bind(final_price || booking.estimated_price_min, booking.client_id).run();
      }
    }

    return Response.json({ success: true, message: 'Booking updated' } satisfies ApiResponse);
  } catch (err) {
    console.error('Booking patch error', err);
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
