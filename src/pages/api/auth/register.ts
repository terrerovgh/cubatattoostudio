export const prerender = false;

import type { APIRoute } from 'astro';
import type { RegisterRequest, SessionData } from '../../../types/auth';
import {
  hashPassword,
  createSession,
  createSessionCookie,
  checkRateLimit,
} from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const db = env.DB;

    // ─── Parse Request Body ─────────────────────────────
    let body: RegisterRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { email, password, first_name, last_name } = body;

    if (!email || !password || !first_name || !last_name) {
      return Response.json(
        { success: false, error: 'All fields are required: email, password, first_name, last_name' },
        { status: 400 }
      );
    }

    // ─── Rate Limiting ──────────────────────────────────
    const clientIp =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    const rateCheck = await checkRateLimit(
      `register:${clientIp}`,
      env.RATE_LIMITER
    );

    if (!rateCheck.allowed) {
      return Response.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // ─── Validate Email Format ──────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ─── Validate Password Length ────────────────────────
    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // ─── Check If Email Already Exists ──────────────────
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(normalizedEmail)
      .first();

    if (existingUser) {
      return Response.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // ─── Look Up Existing Client Record ─────────────────
    const existingClient = await db
      .prepare('SELECT id FROM clients WHERE email = ?')
      .bind(normalizedEmail)
      .first<{ id: string }>();

    const clientId = existingClient?.id || null;

    // ─── Hash Password and Create User ──────────────────
    const { hash, salt } = await hashPassword(password);
    const userId = crypto.randomUUID().replace(/-/g, '');
    const displayName = `${first_name.trim()} ${last_name.trim()}`;

    await db
      .prepare(
        `INSERT INTO users (id, email, password_hash, password_salt, role, client_id, display_name, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'client', ?, ?, 1, datetime('now'), datetime('now'))`
      )
      .bind(userId, normalizedEmail, hash, salt, clientId, displayName)
      .run();

    // ─── Create Session ─────────────────────────────────
    const sessionData: SessionData = {
      user_id: userId,
      email: normalizedEmail,
      role: 'client',
      client_id: clientId || undefined,
      display_name: displayName,
      created_at: Date.now(),
    };

    const token = await createSession(sessionData, env.AUTH_SESSIONS);

    // ─── Return Response with Session Cookie ────────────
    const isSecure = new URL(request.url).protocol === 'https:';
    const cookie = createSessionCookie(token, isSecure);

    return Response.json(
      {
        success: true,
        user: {
          id: userId,
          email: normalizedEmail,
          role: 'client' as const,
          display_name: displayName,
          client_id: clientId,
        },
      },
      {
        status: 201,
        headers: { 'Set-Cookie': cookie },
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
