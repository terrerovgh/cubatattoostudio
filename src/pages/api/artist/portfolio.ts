export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../types/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;

    const result = await db
      .prepare('SELECT * FROM portfolio_items WHERE artist_id = ? ORDER BY sort_order ASC')
      .bind(artistId)
      .all();

    return Response.json({
      success: true,
      data: { portfolio_items: result.results },
    });
  } catch (err) {
    console.error('Artist portfolio GET error:', err);
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

    const { title, description, image_url, style, tags, is_featured, sort_order } = body as {
      title: string;
      description?: string;
      image_url: string;
      style?: string;
      tags?: string;
      is_featured?: boolean;
      sort_order?: number;
    };

    if (!title || !image_url) {
      return Response.json(
        { success: false, error: 'Missing required fields: title, image_url' },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO portfolio_items (
           id, artist_id, title, description, image_url, style,
           tags, is_featured, sort_order, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        artistId,
        title,
        description || null,
        image_url,
        style || null,
        tags || null,
        is_featured ? 1 : 0,
        sort_order ?? 0,
        now,
      )
      .run();

    return Response.json({
      success: true,
      data: { id, artist_id: artistId, title, image_url },
    });
  } catch (err) {
    console.error('Artist portfolio POST error:', err);
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

    // Verify the portfolio item belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM portfolio_items WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 },
      );
    }

    const allowedFields = [
      'title', 'description', 'image_url', 'style',
      'tags', 'is_featured', 'sort_order',
    ];

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(key === 'is_featured' ? (value ? 1 : 0) : value);
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
      .prepare(`UPDATE portfolio_items SET ${updates.join(', ')} WHERE id = ? AND artist_id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Artist portfolio PATCH error:', err);
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

    // Verify the portfolio item belongs to this artist
    const existing = await db
      .prepare('SELECT id FROM portfolio_items WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .first();

    if (!existing) {
      return Response.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 },
      );
    }

    await db
      .prepare('DELETE FROM portfolio_items WHERE id = ? AND artist_id = ?')
      .bind(id, artistId)
      .run();

    return Response.json({ success: true, data: { id, deleted: true } });
  } catch (err) {
    console.error('Artist portfolio DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
