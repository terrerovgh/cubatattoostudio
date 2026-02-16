export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const artistId = url.searchParams.get('artist_id');
    const status = url.searchParams.get('status') || 'available';
    const isDrop = url.searchParams.get('is_drop');

    let query = 'SELECT * FROM flash_designs WHERE 1=1';
    const params: any[] = [];

    if (artistId) { query += ' AND artist_id = ?'; params.push(artistId); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (isDrop === '1') { query += ' AND is_drop = 1'; }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await db.prepare(query).bind(...params).all();

    return Response.json({
      success: true,
      data: { designs: result.results },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};

interface CreateDropRequest {
  artist_id: string;
  title: string;
  description?: string;
  image_url: string;
  style?: string;
  placement_suggestion?: string;
  size_category?: string;
  price: number;
  original_price?: number;
  is_drop?: boolean;
  drop_date?: string;
  drop_quantity?: number;
  early_bird_discount?: number;
  early_bird_slots?: number;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const auth = request.headers.get('authorization');
    if (!auth || auth.replace('Bearer ', '') !== env.ADMIN_PASSWORD) {
      return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
    }

    const db = env.DB;
    const {
      artist_id, title, description, image_url, style,
      placement_suggestion, size_category, price, original_price,
      is_drop, drop_date, drop_quantity, early_bird_discount, early_bird_slots,
    } = await request.json() as CreateDropRequest;

    if (!artist_id || !title || !image_url || !price) {
      return Response.json({ success: false, error: 'Missing required fields' } satisfies ApiResponse, { status: 400 });
    }

    const id = crypto.randomUUID().replace(/-/g, '');

    await db.prepare(`
      INSERT INTO flash_designs (
        id, artist_id, title, description, image_url, style,
        placement_suggestion, size_category, price, original_price,
        is_drop, drop_date, drop_quantity, early_bird_discount, early_bird_slots
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, artist_id, title, description || null, image_url, style || null,
      placement_suggestion || null, size_category || null, price, original_price || null,
      is_drop ? 1 : 0, drop_date || null, drop_quantity || 1,
      early_bird_discount || 0, early_bird_slots || 5,
    ).run();

    return Response.json({ success: true, data: { id } } satisfies ApiResponse, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
