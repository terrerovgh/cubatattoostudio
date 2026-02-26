export const prerender = false;

import type { APIRoute } from 'astro';
import type { LoginRequest, SessionData, User } from '../../../types/auth';
import {
  verifyPassword,
  createSession,
  createSessionCookie,
  checkRateLimit,
} from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const db = env.DB;

    // ─── Parse Request Body ─────────────────────────────
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // ─── Rate Limiting ──────────────────────────────────
    const clientIp =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    const rateCheck = await checkRateLimit(
      `login:${clientIp}`,
      env.RATE_LIMITER
    );

    if (!rateCheck.allowed) {
      return Response.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // ─── Look Up User ───────────────────────────────────
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email.toLowerCase().trim())
      .first<User>();

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ─── Verify Password ────────────────────────────────
    const valid = await verifyPassword(
      password,
      user.password_hash,
      user.password_salt
    );

    if (!valid) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ─── Check Active Status ────────────────────────────
    if (!user.is_active) {
      return Response.json(
        { success: false, error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // ─── Create Session ─────────────────────────────────
    const sessionData: SessionData = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      artist_id: user.artist_id,
      client_id: user.client_id,
      display_name: user.display_name,
      created_at: Date.now(),
    };

    const token = await createSession(sessionData, env.AUTH_SESSIONS);

    // ─── Update Last Login ──────────────────────────────
    await db
      .prepare("UPDATE users SET last_login_at = datetime('now'), updated_at = datetime('now') WHERE id = ?")
      .bind(user.id)
      .run();

    // ─── Return Response with Session Cookie ────────────
    const isSecure = new URL(request.url).protocol === 'https:';
    const cookie = createSessionCookie(token, isSecure);

    return Response.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          display_name: user.display_name,
          artist_id: user.artist_id,
        },
      },
      {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
