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
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')));
    const offset = (page - 1) * perPage;

    let query = 'SELECT * FROM flash_designs WHERE artist_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM flash_designs WHERE artist_id = ?';
    const params: unknown[] = [artistId];
    const countParams: unknown[] = [artistId];

    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(perPage, offset);

    const [result, countResult] = await Promise.all([
      db.prepare(query).bind(...params).all(),
      db.prepare(countQuery).bind(...countParams).first<{ total: number }>(),
    ]);

    const total = countResult?.total || 0;

    return Response.json({
      success: true,
      data: {
        flash_designs: result.results,
        pagination: {
          page,
          per_page: perPage,
          total,
          pages: Math.ceil(total / perPage),
        },
      },
    });
  } catch (err) {
    console.error('Artist flash GET error:', err);
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

    const {
      title,
      description,
      image_url,
      style,
      placement_suggestion,
      size_category,
      price,
      original_price,
      is_drop,
      drop_date,
      drop_quantity,
      early_bird_discount,
      early_bird_slots,
    } = body as {
      title: string;
      description?: string;
      image_url: string;
      style?: string;
      placement_suggestion?: string;
      size_category?: string;
      price: number;
      original_price?: number;
      is_drop?: boolean;
      drop_date?: string;
      drop_quantity?: number;
      early_bird_discount?: number;
      early_bird_slots?: number;
    };

    if (!title || !image_url || price === undefined || price === null) {
      return Response.json(
        { success: false, error: 'Missing required fields: title, image_url, price' },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO flash_designs (
           id, artist_id, title, description, image_url, style,
           placement_suggestion, size_category, price, original_price,
           is_drop, drop_date, drop_quantity, early_bird_discount,
           early_bird_slots, status, claimed_count, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', 0, ?)`,
      )
      .bind(
        id,
        artistId,
        title,
        description || null,
        image_url,
        style || null,
        placement_suggestion || null,
        size_category || null,
        price,
        original_price || null,
        is_drop ? 1 : 0,
        drop_date || null,
        drop_quantity || 0,
        early_bird_discount || 0,
        early_bird_slots || 0,
        now,
      )
      .run();

    return Response.json({
      success: true,
      data: { id, artist_id: artistId, title, price, status: 'available' },
    });
  } catch (err) {
    console.error('Artist flash POST error:', err);
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

    // Verify the flash design belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM flash_designs WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Flash design not found' },
        { status: 404 },
      );
    }

    const allowedFields = [
      'title', 'description', 'image_url', 'style',
      'placement_suggestion', 'size_category', 'price', 'original_price',
      'is_drop', 'drop_date', 'drop_quantity', 'early_bird_discount',
      'early_bird_slots', 'status',
    ];

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(key === 'is_drop' ? (value ? 1 : 0) : value);
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
      .prepare(`UPDATE flash_designs SET ${updates.join(', ')} WHERE id = ? AND artist_id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Artist flash PATCH error:', err);
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

    // Verify the flash design belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM flash_designs WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Flash design not found' },
        { status: 404 },
      );
    }

    // Archive instead of hard delete
    await db
      .prepare("UPDATE flash_designs SET status = 'archived' WHERE id = ? AND artist_id = ?")
      .bind(id, artistId)
      .run();

    return Response.json({ success: true, data: { id, archived: true } });
  } catch (err) {
    console.error('Artist flash DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
