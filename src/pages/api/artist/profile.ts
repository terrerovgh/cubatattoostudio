export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../types/auth';
import { hashPassword, verifyPassword } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;

  try {
    const db = env.DB;

    const user = await db
      .prepare(
        `SELECT id, email, role, artist_id, client_id, display_name,
                avatar_url, is_active, last_login_at, created_at, updated_at
         FROM users WHERE id = ?`,
      )
      .bind(session.user_id)
      .first();

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    console.error('Artist profile GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const PATCH: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { display_name, avatar_url, password, current_password } = body as {
      display_name?: string;
      avatar_url?: string;
      password?: string;
      current_password?: string;
    };

    const updates: string[] = [];
    const values: unknown[] = [];

    if (display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(display_name);
    }

    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(avatar_url);
    }

    // Handle password change
    if (password && current_password) {
      if (password.length < 8) {
        return Response.json(
          { success: false, error: 'New password must be at least 8 characters' },
          { status: 400 },
        );
      }

      // Fetch current password hash and salt
      const user = await db
        .prepare('SELECT password_hash, password_salt FROM users WHERE id = ?')
        .bind(session.user_id)
        .first<{ password_hash: string; password_salt: string }>();

      if (!user) {
        return Response.json(
          { success: false, error: 'User not found' },
          { status: 404 },
        );
      }

      const isValid = await verifyPassword(current_password, user.password_hash, user.password_salt);

      if (!isValid) {
        return Response.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 403 },
        );
      }

      const { hash, salt } = await hashPassword(password);
      updates.push('password_hash = ?');
      values.push(hash);
      updates.push('password_salt = ?');
      values.push(salt);
    } else if (password && !current_password) {
      return Response.json(
        { success: false, error: 'current_password is required to change password' },
        { status: 400 },
      );
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 },
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(session.user_id);

    await db
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    return Response.json({ success: true, data: { updated: true } });
  } catch (err) {
    console.error('Artist profile PATCH error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
