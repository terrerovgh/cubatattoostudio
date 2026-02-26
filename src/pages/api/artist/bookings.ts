export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../types/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;
    const url = context.url;
    const status = url.searchParams.get('status');
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')));
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, c.first_name, c.last_name, c.email as client_email, c.phone as client_phone
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      WHERE b.artist_id = ?
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE artist_id = ?';
    const params: unknown[] = [artistId];
    const countParams: unknown[] = [artistId];

    if (status) {
      query += ' AND b.status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }
    if (dateFrom) {
      query += ' AND b.scheduled_date >= ?';
      countQuery += ' AND scheduled_date >= ?';
      params.push(dateFrom);
      countParams.push(dateFrom);
    }
    if (dateTo) {
      query += ' AND b.scheduled_date <= ?';
      countQuery += ' AND scheduled_date <= ?';
      params.push(dateTo);
      countParams.push(dateTo);
    }

    query += ' ORDER BY b.scheduled_date DESC, b.scheduled_time DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      db.prepare(query).bind(...params).all(),
      db.prepare(countQuery).bind(...countParams).first<{ total: number }>(),
    ]);

    const total = countResult?.total || 0;

    return Response.json({
      success: true,
      data: {
        bookings: result.results,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Artist bookings GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const PATCH: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { booking_id, status, artist_notes } = body as {
      booking_id: string;
      status?: string;
      artist_notes?: string;
    };

    if (!booking_id) {
      return Response.json(
        { success: false, error: 'Missing required field: booking_id' },
        { status: 400 },
      );
    }

    // Verify the booking belongs to this artist
    const existing = await db
      .prepare('SELECT id, artist_id FROM bookings WHERE id = ? AND artist_id = ?')
      .bind(booking_id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Booking not found' },
        { status: 404 },
      );
    }

    const validStatuses = [
      'pending', 'confirmed', 'deposit_paid', 'in_progress',
      'completed', 'cancelled', 'no_show', 'rescheduled',
    ];

    if (status && !validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 },
      );
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (artist_notes !== undefined) {
      updates.push('artist_notes = ?');
      values.push(artist_notes);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 },
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(booking_id, artistId);

    await db
      .prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ? AND artist_id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { booking_id, updated: true } });
  } catch (err) {
    console.error('Artist bookings PATCH error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
