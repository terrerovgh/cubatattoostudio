export const prerender = false;

import type { APIRoute } from 'astro';
import {
  extractSessionToken,
  destroySession,
  clearSessionCookie,
} from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;

    // ─── Extract Session Token ──────────────────────────
    const token = extractSessionToken(request);

    if (token) {
      await destroySession(token, env.AUTH_SESSIONS);
    }

    // ─── Clear Cookie and Return ────────────────────────
    const isSecure = new URL(request.url).protocol === 'https:';
    const cookie = clearSessionCookie(isSecure);

    return Response.json(
      { success: true },
      {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      }
    );
  } catch (err) {
    console.error('Logout error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
