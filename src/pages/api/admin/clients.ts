export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import { z } from 'zod';

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization');
  if (!auth || !env.ADMIN_PASSWORD) return false;
  return auth.replace('Bearer ', '') === env.ADMIN_PASSWORD;
}

const PatchClientSchema = z.object({
  client_id: z.string().min(1),
  notes: z.string().optional(),
  preferred_artist: z.string().optional(),
  loyalty_tier: z.enum(['standard', 'silver', 'gold', 'vip']).optional(),
});

export const GET: APIRoute = async ({ request, url, locals }) => {
  const env = locals.runtime.env;
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const search = url.searchParams.get('search');
    const clientId = url.searchParams.get('id');
    const tier = url.searchParams.get('tier');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Single client with full history
    if (clientId) {
      const client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();
      if (!client) {
        return Response.json({ success: false, error: 'Client not found' } satisfies ApiResponse, { status: 404 });
      }

      const bookings = await db.prepare(`
        SELECT * FROM bookings WHERE client_id = ? ORDER BY scheduled_date DESC
      `).bind(clientId).all();

      const payments = await db.prepare(`
        SELECT * FROM payments WHERE client_id = ? ORDER BY created_at DESC
      `).bind(clientId).all();

      const loyalty = await db.prepare(`
        SELECT * FROM loyalty_transactions WHERE client_id = ? ORDER BY created_at DESC LIMIT 20
      `).bind(clientId).all();

      const consents = await db.prepare(`
        SELECT id, booking_id, signed_at FROM consent_forms WHERE client_id = ?
      `).bind(clientId).all();

      return Response.json({
        success: true,
        data: {
          client,
          bookings: bookings.results,
          payments: payments.results,
          loyalty_history: loyalty.results,
          consent_forms: consents.results,
        },
      } satisfies ApiResponse);
    }

    // Client list
    let query = 'SELECT * FROM clients WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (tier) {
      query += ' AND loyalty_tier = ?';
      params.push(tier);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await db.prepare(query).bind(...params).all();

    return Response.json({
      success: true,
      data: { clients: result.results },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const json = await request.json().catch(() => ({}));
    const bodyResult = PatchClientSchema.safeParse(json);

    if (!bodyResult.success) {
      return Response.json(
        { success: false, error: 'Validation failed', data: bodyResult.error.format() } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const { client_id, notes, preferred_artist, loyalty_tier } = bodyResult.data;

    const updates: string[] = [];
    const values: any[] = [];

    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    if (preferred_artist) { updates.push('preferred_artist = ?'); values.push(preferred_artist); }
    if (loyalty_tier) { updates.push('loyalty_tier = ?'); values.push(loyalty_tier); }

    if (updates.length === 0) {
      return Response.json({ success: false, error: 'No fields to update' } satisfies ApiResponse, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    values.push(client_id);

    await db.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

    return Response.json({ success: true, message: 'Client updated' } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
