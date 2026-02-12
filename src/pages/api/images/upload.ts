import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: APIRoute = async (context) => {
  const { env } = context.locals.runtime;

  const authHeader = context.request.headers.get('Authorization');
  const expectedToken = env.UPLOAD_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File | null;
    const artist = (formData.get('artist') as string) || 'studio';
    const caption = (formData.get('caption') as string) || '';

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum 10MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const key = `gallery/${artist}/${timestamp}-${random}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        artist,
        caption,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        id: key,
        url: `/api/images/${encodeURIComponent(key)}`,
        artist,
        caption,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};
