export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization');
  if (!auth || !env.ADMIN_PASSWORD) return false;
  const token = auth.replace('Bearer ', '');
  return token === env.ADMIN_PASSWORD;
}

export const GET: APIRoute = async ({ request, url, locals }) => {
  const env = locals.runtime.env;
  if (!checkAuth(request, env)) {
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
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const { booking_id, status, artist_notes, final_price, cancellation_reason } = await request.json();

    if (!booking_id) {
      return Response.json({ success: false, error: 'booking_id required' } satisfies ApiResponse, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status) { updates.push('status = ?'); values.push(status); }
    if (artist_notes !== undefined) { updates.push('artist_notes = ?'); values.push(artist_notes); }
    if (final_price !== undefined) { updates.push('final_price = ?'); values.push(final_price); }
    if (cancellation_reason) { updates.push('cancellation_reason = ?'); values.push(cancellation_reason); }

    updates.push("updated_at = datetime('now')");
    values.push(booking_id);

    await db.prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

    // If completed, update client stats and schedule aftercare
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
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
