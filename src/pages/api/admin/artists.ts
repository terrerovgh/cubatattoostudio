export const prerender = false;

import type { APIRoute } from 'astro';
import { hashPassword } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;

    const result = await db
      .prepare(
        `SELECT
           u.id,
           u.display_name,
           u.email,
           u.artist_id,
           u.is_active,
           u.last_login_at,
           u.created_at,
           COALESCE(p.portfolio_count, 0) as portfolio_count,
           COALESCE(b.booking_count, 0) as booking_count
         FROM users u
         LEFT JOIN (
           SELECT artist_id, COUNT(*) as portfolio_count
           FROM portfolio_items
           GROUP BY artist_id
         ) p ON u.artist_id = p.artist_id
         LEFT JOIN (
           SELECT artist_id, COUNT(*) as booking_count
           FROM bookings
           GROUP BY artist_id
         ) b ON u.artist_id = b.artist_id
         WHERE u.role = 'artist'
         ORDER BY u.created_at DESC`,
      )
      .all();

    return Response.json({
      success: true,
      data: { artists: result.results },
    });
  } catch (err) {
    console.error('Admin artists GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { email, password, display_name, artist_id } = body as {
      email: string;
      password: string;
      display_name: string;
      artist_id: string;
    };

    if (!email || !password || !display_name || !artist_id) {
      return Response.json(
        { success: false, error: 'Missing required fields: email, password, display_name, artist_id' },
        { status: 400 },
      );
    }

    // Check for existing user with same email
    const existing = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (existing) {
      return Response.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 409 },
      );
    }

    // Check for duplicate artist_id
    const existingArtist = await db
      .prepare('SELECT id FROM users WHERE artist_id = ?')
      .bind(artist_id)
      .first();

    if (existingArtist) {
      return Response.json(
        { success: false, error: 'A user with this artist_id already exists' },
        { status: 409 },
      );
    }

    const { hash, salt } = await hashPassword(password);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO users (id, email, password_hash, password_salt, role, display_name, artist_id, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'artist', ?, ?, 1, ?, ?)`,
      )
      .bind(id, email, hash, salt, display_name, artist_id, now, now)
      .run();

    return Response.json({
      success: true,
      data: { id, email, role: 'artist', display_name, artist_id },
    });
  } catch (err) {
    console.error('Admin artists POST error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const PATCH: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { id, display_name, email, artist_id, is_active } = body as {
      id: string;
      display_name?: string;
      email?: string;
      artist_id?: string;
      is_active?: number;
    };

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(display_name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (artist_id !== undefined) {
      updates.push('artist_id = ?');
      values.push(artist_id);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 },
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    await db
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ? AND role = 'artist'`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Admin artists PATCH error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
