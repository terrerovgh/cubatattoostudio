export const prerender = false;

import type { APIRoute } from 'astro';
import type { SetupRequest } from '../../../types/auth';
import { hashPassword } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const db = env.DB;

    // ─── Parse Request Body ─────────────────────────────
    let body: SetupRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { email, password, display_name, admin_password } = body;

    if (!email || !password || !display_name || !admin_password) {
      return Response.json(
        { success: false, error: 'All fields are required: email, password, display_name, admin_password' },
        { status: 400 }
      );
    }

    // ─── Verify Admin Password ──────────────────────────
    if (!env.ADMIN_PASSWORD || admin_password !== env.ADMIN_PASSWORD) {
      return Response.json(
        { success: false, error: 'Invalid admin password' },
        { status: 403 }
      );
    }

    // ─── Check If Admin Already Exists ──────────────────
    const existingAdmin = await db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .first();

    if (existingAdmin) {
      return Response.json(
        { success: false, error: 'Admin already configured' },
        { status: 403 }
      );
    }

    // ─── Validate Input ─────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // ─── Create Admin User ──────────────────────────────
    const { hash, salt } = await hashPassword(password);
    const userId = crypto.randomUUID().replace(/-/g, '');

    await db
      .prepare(
        `INSERT INTO users (id, email, password_hash, password_salt, role, display_name, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'admin', ?, 1, datetime('now'), datetime('now'))`
      )
      .bind(userId, email.toLowerCase().trim(), hash, salt, display_name.trim())
      .run();

    return Response.json(
      { success: true, message: 'Admin account created' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Setup error:', err);

    if (err instanceof Error && err.message.includes('UNIQUE')) {
      return Response.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
