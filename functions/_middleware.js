// /Users/terrerov/cubatattoostudio/functions/_middleware.js

/**
 * Cloudflare Pages Middleware.
 * This function runs for every request to your site.
 * You can use it to modify requests/responses, handle specific routes, etc.
 * For serving static assets like HTML, CSS, images, Cloudflare Pages
 * will automatically serve them from your build output directory if this
 * middleware calls `context.next()` and doesn't return its own Response.
 */
export async function onRequest(context) {
  // context.request: The incoming request object
  // context.env: Environment variables and bindings (KV, R2, D1, ASSETS, etc.)
  // context.next: A function to call the next middleware or serve the static asset

  const url = new URL(context.request.url);
  console.log(`[Middleware] Request received for: ${url.pathname}`);

  // Example: Add a custom header to the response
  // const response = await context.next();
  // response.headers.set('X-Powered-By', 'CubaTattooStudio-Worker');
  // return response;

  // For now, just pass through to the next handler (static assets or other functions)
  // This allows Cloudflare Pages to serve your static files from the 'launching-soon' directory (if configured as output).
  return context.next();
}