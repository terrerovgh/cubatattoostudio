import { defineMiddleware } from 'astro:middleware';
import { extractSessionToken, getSession, verifyAdminAuth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals, url } = context;
  const pathname = url.pathname;
  const env = (locals as any).runtime?.env as Env | undefined;

  // ─── Extract Session ───────────────────────────────
  if (env?.AUTH_SESSIONS) {
    const token = extractSessionToken(request);
    if (token) {
      locals.session = await getSession(token, env.AUTH_SESSIONS);
    } else {
      locals.session = null;
    }
  }

  // ─── Route Protection ──────────────────────────────

  // Admin pages (not login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!locals.session || locals.session.role !== 'admin') {
      return context.redirect('/admin/login');
    }
  }

  // Artist dashboard pages (not login) — must not match /artists/* (public profiles)
  if ((pathname === '/artist' || pathname.startsWith('/artist/')) && pathname !== '/artist/login') {
    if (!locals.session || locals.session.role !== 'artist') {
      return context.redirect('/artist/login');
    }
  }

  // Admin API endpoints
  if (pathname.startsWith('/api/admin/')) {
    const hasSession = locals.session && locals.session.role === 'admin';
    // Legacy Bearer token support for backward compatibility
    const hasLegacyAuth = env ? await verifyAdminAuth(request, env) : false;

    if (!hasSession && !hasLegacyAuth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Artist API endpoints
  if (pathname.startsWith('/api/artist/')) {
    if (!locals.session || locals.session.role !== 'artist') {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ─── Process Request ───────────────────────────────
  const response = await next();

  // ─── Security Headers ──────────────────────────────
  const headers = response.headers;

  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://fonts.googleapis.com https://huggingface.co https://cdn-lfs.huggingface.co https://*.huggingface.co wss://*.cubatattoostudio.com wss://cubatattoostudio.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
  ];

  headers.set('Content-Security-Policy', csp.join('; '));

  return response;
});
