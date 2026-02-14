export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import { calculateTier, getTierBenefits, getNextTier, calculateBookingPoints } from '../../../lib/loyalty';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const email = url.searchParams.get('email');
    const clientId = url.searchParams.get('client_id');

    if (!email && !clientId) {
      return Response.json({ success: false, error: 'email or client_id required' } satisfies ApiResponse, { status: 400 });
    }

    const client = email
      ? await db.prepare('SELECT * FROM clients WHERE email = ?').bind(email).first()
      : await db.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first();

    if (!client) {
      return Response.json({ success: true, data: { points: 0, tier: 'standard', benefits: getTierBenefits('standard'), next_tier: getNextTier('standard') } } satisfies ApiResponse);
    }

    const points = (client.loyalty_points as number) || 0;
    const tier = calculateTier(points);
    const benefits = getTierBenefits(tier);
    const nextTier = getNextTier(tier);

    // Recent transactions
    const transactions = await db.prepare(`
      SELECT * FROM loyalty_transactions WHERE client_id = ?
      ORDER BY created_at DESC LIMIT 10
    `).bind(client.id).all();

    // Check if birthday month
    const now = new Date();
    const dob = client.date_of_birth as string;
    const isBirthdayMonth = dob ? new Date(dob).getMonth() === now.getMonth() : false;

    return Response.json({
      success: true,
      data: {
        points,
        tier,
        benefits,
        next_tier: nextTier,
        visit_count: client.visit_count,
        total_spent: client.total_spent,
        is_birthday_month: isBirthdayMonth,
        recent_transactions: transactions.results,
      },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { client_id, type, points, booking_id, description } = await request.json();

    if (!client_id || !type || points === undefined) {
      return Response.json({ success: false, error: 'client_id, type, and points required' } satisfies ApiResponse, { status: 400 });
    }

    const client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(client_id).first();
    if (!client) {
      return Response.json({ success: false, error: 'Client not found' } satisfies ApiResponse, { status: 404 });
    }

    const currentPoints = (client.loyalty_points as number) || 0;
    const newBalance = currentPoints + points;

    // Create transaction
    const txnId = crypto.randomUUID().replace(/-/g, '');
    await db.prepare(`
      INSERT INTO loyalty_transactions (id, client_id, booking_id, points, type, description, balance_after)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(txnId, client_id, booking_id || null, points, type, description || null, newBalance).run();

    // Update client points and tier
    const newTier = calculateTier(newBalance);
    await db.prepare(`
      UPDATE clients SET loyalty_points = ?, loyalty_tier = ?, updated_at = datetime('now') WHERE id = ?
    `).bind(newBalance, newTier, client_id).run();

    return Response.json({
      success: true,
      data: { points: newBalance, tier: newTier, transaction_id: txnId },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
