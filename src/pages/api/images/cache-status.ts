import type { APIRoute } from 'astro';
import { verifyAdminAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { env } = context.locals.runtime;

  if (!await verifyAdminAuth(context.request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const listed = await env.R2_BUCKET.list({ prefix: 'gallery/', limit: 100 });

    const images = listed.objects.map((obj) => ({
      id: obj.key,
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
      etag: obj.httpEtag,
    }));

    return new Response(
      JSON.stringify({
        count: images.length,
        truncated: listed.truncated,
        images,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list images';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
