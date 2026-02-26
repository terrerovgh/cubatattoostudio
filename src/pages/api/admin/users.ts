export const prerender = false;

import type { APIRoute } from 'astro';
import type { CreateUserRequest } from '../../../types/auth';
import { hashPassword } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;
    const url = context.url;
    const role = url.searchParams.get('role');
    const search = url.searchParams.get('search');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')));
    const offset = (page - 1) * perPage;

    let query = `
      SELECT id, email, role, artist_id, client_id, display_name,
             avatar_url, is_active, last_login_at, created_at
      FROM users WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params: unknown[] = [];
    const countParams: unknown[] = [];

    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
      countParams.push(role);
    }

    if (search) {
      const term = `%${search}%`;
      query += ' AND (email LIKE ? OR display_name LIKE ?)';
      countQuery += ' AND (email LIKE ? OR display_name LIKE ?)';
      params.push(term, term);
      countParams.push(term, term);
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
        users: result.results,
        pagination: {
          page,
          per_page: perPage,
          total,
          pages: Math.ceil(total / perPage),
        },
      },
    });
  } catch (err) {
    console.error('Admin users GET error:', err);
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

    const { email, password, role, display_name, artist_id } = body as CreateUserRequest;

    if (!email || !password || !role || !display_name) {
      return Response.json(
        { success: false, error: 'Missing required fields: email, password, role, display_name' },
        { status: 400 },
      );
    }

    if (!['admin', 'artist', 'client'].includes(role)) {
      return Response.json(
        { success: false, error: 'Invalid role. Must be admin, artist, or client' },
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

    const { hash, salt } = await hashPassword(password);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO users (id, email, password_hash, password_salt, role, display_name, artist_id, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      )
      .bind(id, email, hash, salt, role, display_name, artist_id || null, now, now)
      .run();

    return Response.json({
      success: true,
      data: { id, email, role, display_name, artist_id: artist_id || null },
    });
  } catch (err) {
    console.error('Admin users POST error:', err);
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

    const { id, display_name, email, role, is_active, artist_id, password } = body as {
      id: string;
      display_name?: string;
      email?: string;
      role?: string;
      is_active?: number;
      artist_id?: string;
      password?: string;
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
    if (role !== undefined) {
      if (!['admin', 'artist', 'client'].includes(role)) {
        return Response.json(
          { success: false, error: 'Invalid role. Must be admin, artist, or client' },
          { status: 400 },
        );
      }
      updates.push('role = ?');
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    if (artist_id !== undefined) {
      updates.push('artist_id = ?');
      values.push(artist_id);
    }
    if (password) {
      const { hash, salt } = await hashPassword(password);
      updates.push('password_hash = ?');
      values.push(hash);
      updates.push('password_salt = ?');
      values.push(salt);
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
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { id } });
  } catch (err) {
    console.error('Admin users PATCH error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const DELETE: APIRoute = async (context) => {
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

    const { id } = body as { id: string };

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    await db
      .prepare("UPDATE users SET is_active = 0, updated_at = datetime('now') WHERE id = ?")
      .bind(id)
      .run();

    return Response.json({ success: true, data: { id, deactivated: true } });
  } catch (err) {
    console.error('Admin users DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
