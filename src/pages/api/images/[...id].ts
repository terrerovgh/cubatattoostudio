import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { env } = context.locals.runtime;
  const id = context.params.id;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const object = await env.R2_BUCKET.get(id);
    if (!object) {
      return new Response(JSON.stringify({ error: 'Image not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', object.httpEtag);
    headers.set('Access-Control-Allow-Origin', '*');

    const ifNoneMatch = context.request.headers.get('If-None-Match');
    if (ifNoneMatch === object.httpEtag) {
      return new Response(null, { status: 304, headers });
    }

    if (object.customMetadata?.artist) {
      headers.set('X-Image-Artist', object.customMetadata.artist);
    }
    if (object.customMetadata?.caption) {
      headers.set('X-Image-Caption', object.customMetadata.caption);
    }

    return new Response(object.body, { headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve image';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  const { env } = context.locals.runtime;
  const id = context.params.id;

  const authHeader = context.request.headers.get('Authorization');
  const expectedToken = env.UPLOAD_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: 'Image ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await env.R2_BUCKET.delete(id);
    return new Response(JSON.stringify({ success: true, id }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};
