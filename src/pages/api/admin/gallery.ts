export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const url = context.url;
    const prefix = url.searchParams.get('prefix') || undefined;
    const cursor = url.searchParams.get('cursor') || undefined;
    const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get('limit') || '100')));

    const listResult = await env.R2_BUCKET.list({
      prefix,
      cursor,
      limit,
    });

    const objects = listResult.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
      etag: obj.etag,
      httpEtag: obj.httpEtag,
    }));

    return Response.json({
      success: true,
      data: {
        objects,
        truncated: listResult.truncated,
        cursor: listResult.truncated ? listResult.cursor : undefined,
      },
    });
  } catch (err) {
    console.error('Admin gallery GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const contentType = context.request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return Response.json(
        { success: false, error: 'Expected multipart/form-data' },
        { status: 400 },
      );
    }

    const formData = await context.request.formData();
    const file = formData.get('file') as File | null;
    const pathPrefix = (formData.get('path') as string) || '';

    if (!file || !(file instanceof File)) {
      return Response.json(
        { success: false, error: 'Missing file field' },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    ];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: `Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { success: false, error: 'File too large. Maximum size is 10MB' },
        { status: 400 },
      );
    }

    // Build the R2 key
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const key = pathPrefix
      ? `${pathPrefix.replace(/^\/|\/$/g, '')}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();

    await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return Response.json({
      success: true,
      data: {
        key,
        size: file.size,
        content_type: file.type,
      },
    });
  } catch (err) {
    console.error('Admin gallery POST error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const DELETE: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { key } = body as { key: string };

    if (!key) {
      return Response.json(
        { success: false, error: 'Missing required field: key' },
        { status: 400 },
      );
    }

    await env.R2_BUCKET.delete(key);

    return Response.json({ success: true, data: { key, deleted: true } });
  } catch (err) {
    console.error('Admin gallery DELETE error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
