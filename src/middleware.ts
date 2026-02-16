import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();

  // Create a new response with the same body and status, but mutable headers
  // modifying response.headers directly might not work depending on the adapter/environment if headers are immutable
  // usually in Astro middleware response.headers is mutable, but let's be safe.
  // Actually, in Astro middleware, modifying the response object returned by next() is the way.

  const headers = response.headers;

  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    // Images: allow self, data URIs, https (for external images), and blob (for client generation)
    "img-src 'self' data: https: blob:",
    // Scripts: allow self, unsafe-inline (often needed), unsafe-eval (needed for some libs/dev), and Cloudflare analytics
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
    // Styles: allow self, unsafe-inline, and Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fonts: allow self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Connect: allow self, Google Fonts, and HuggingFace (for AI models)
    "connect-src 'self' https://fonts.googleapis.com https://huggingface.co https://cdn-lfs.huggingface.co https://*.huggingface.co",
    // Workers: allow self and blob (for AI workers)
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'"
  ];

  headers.set('Content-Security-Policy', csp.join('; '));

  return response;
});
