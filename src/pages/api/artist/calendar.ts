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
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    if (!startDate || !endDate) {
      return Response.json(
        { success: false, error: 'Missing required query params: start_date, end_date' },
        { status: 400 },
      );
    }

    const [overrides, bookings] = await Promise.all([
      db
        .prepare(
          `SELECT * FROM schedule_overrides
           WHERE artist_id = ? AND override_date >= ? AND override_date <= ?
           ORDER BY override_date ASC`,
        )
        .bind(artistId, startDate, endDate)
        .all(),
      db
        .prepare(
          `SELECT b.id, b.client_id, b.scheduled_date, b.scheduled_time,
                  b.estimated_duration, b.status, b.service_type, b.description,
                  c.first_name, c.last_name, c.email as client_email
           FROM bookings b
           JOIN clients c ON b.client_id = c.id
           WHERE b.artist_id = ? AND b.scheduled_date >= ? AND b.scheduled_date <= ?
             AND b.status NOT IN ('cancelled', 'no_show')
           ORDER BY b.scheduled_date ASC, b.scheduled_time ASC`,
        )
        .bind(artistId, startDate, endDate)
        .all(),
    ]);

    return Response.json({
      success: true,
      data: {
        overrides: overrides.results,
        bookings: bookings.results,
      },
    });
  } catch (err) {
    console.error('Artist calendar GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async (context) => {
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

    const { override_date, is_available, start_time, end_time, reason } = body as {
      override_date: string;
      is_available: boolean;
      start_time?: string;
      end_time?: string;
      reason?: string;
    };

    if (!override_date || is_available === undefined) {
      return Response.json(
        { success: false, error: 'Missing required fields: override_date, is_available' },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO schedule_overrides (
           id, artist_id, override_date, is_available, start_time, end_time, reason, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        artistId,
        override_date,
        is_available ? 1 : 0,
        start_time || null,
        end_time || null,
        reason || null,
        now,
      )
      .run();

    return Response.json({
      success: true,
      data: { id, artist_id: artistId, override_date, is_available },
    });
  } catch (err) {
    console.error('Artist calendar POST error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const DELETE: APIRoute = async (context) => {
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

    const { id } = body as { id: string };

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    // Verify the override belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM schedule_overrides WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Schedule override not found' },
        { status: 404 },
      );
    }

    await db
      .prepare('DELETE FROM schedule_overrides WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .run();

    return Response.json({ success: true, data: { id, deleted: true } });
  } catch (err) {
    console.error('Artist calendar DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
