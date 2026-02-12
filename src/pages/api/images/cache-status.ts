import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { env } = context.locals.runtime;

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
          'Access-Control-Allow-Origin': '*',
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
