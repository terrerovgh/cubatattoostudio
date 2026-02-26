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
    const isActive = url.searchParams.get('is_active');

    let query = 'SELECT * FROM promotions WHERE artist_id = ?';
    const params: unknown[] = [artistId];

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query += ' AND is_active = ?';
      params.push(parseInt(isActive));
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.prepare(query).bind(...params).all();

    return Response.json({
      success: true,
      data: { promotions: result.results },
    });
  } catch (err) {
    console.error('Artist promotions GET error:', err);
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

    const { title, description, discount_type, discount_value, start_date, end_date } = body as {
      title: string;
      description?: string;
      discount_type: string;
      discount_value?: number;
      start_date: string;
      end_date: string;
    };

    if (!title || !discount_type || !start_date || !end_date) {
      return Response.json(
        { success: false, error: 'Missing required fields: title, discount_type, start_date, end_date' },
        { status: 400 },
      );
    }

    if (!['percentage', 'fixed', 'custom'].includes(discount_type)) {
      return Response.json(
        { success: false, error: 'Invalid discount_type. Must be percentage, fixed, or custom' },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO promotions (
           id, artist_id, title, description, discount_type,
           discount_value, start_date, end_date, is_active, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      )
      .bind(
        id,
        artistId,
        title,
        description || null,
        discount_type,
        discount_value ?? null,
        start_date,
        end_date,
        now,
      )
      .run();

    return Response.json({
      success: true,
      data: { id, artist_id: artistId, title, discount_type, start_date, end_date },
    });
  } catch (err) {
    console.error('Artist promotions POST error:', err);
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

    const { id, ...fields } = body as { id: string; [key: string]: unknown };

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    // Verify the promotion belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM promotions WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 },
      );
    }

    const allowedFields = [
      'title', 'description', 'discount_type',
      'discount_value', 'start_date', 'end_date', 'is_active',
    ];

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    values.push(id, artistId);

    await db
      .prepare(`UPDATE promotions SET ${updates.join(', ')} WHERE id = ? AND artist_id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Artist promotions PATCH error:', err);
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

    // Verify the promotion belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM promotions WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Promotion not found' },
        { status: 404 },
      );
    }

    await db
      .prepare('DELETE FROM promotions WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .run();

    return Response.json({ success: true, data: { id, deleted: true } });
  } catch (err) {
    console.error('Artist promotions DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
