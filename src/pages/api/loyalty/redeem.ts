export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import { calculateTier } from '../../../lib/loyalty';

const REWARDS = [
  { id: 'discount_5', name: '5% Discount', points_cost: 200, discount_percent: 5 },
  { id: 'discount_10', name: '10% Discount', points_cost: 400, discount_percent: 10 },
  { id: 'discount_15', name: '15% Discount', points_cost: 600, discount_percent: 15 },
  { id: 'free_touch_up', name: 'Free Touch-up', points_cost: 500, discount_percent: 100 },
  { id: 'priority_booking', name: 'Priority Booking (1 month)', points_cost: 300, discount_percent: 0 },
];

export const GET: APIRoute = async () => {
  return Response.json({
    success: true,
    data: { rewards: REWARDS },
  } satisfies ApiResponse);
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { client_id, reward_id, booking_id } = await request.json();

    if (!client_id || !reward_id) {
      return Response.json({ success: false, error: 'client_id and reward_id required' } satisfies ApiResponse, { status: 400 });
    }

    const reward = REWARDS.find((r) => r.id === reward_id);
    if (!reward) {
      return Response.json({ success: false, error: 'Invalid reward' } satisfies ApiResponse, { status: 400 });
    }

    const client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(client_id).first();
    if (!client) {
      return Response.json({ success: false, error: 'Client not found' } satisfies ApiResponse, { status: 404 });
    }

    const currentPoints = (client.loyalty_points as number) || 0;
    if (currentPoints < reward.points_cost) {
      return Response.json({ success: false, error: `Insufficient points. Need ${reward.points_cost}, have ${currentPoints}` } satisfies ApiResponse, { status: 400 });
    }

    const newBalance = currentPoints - reward.points_cost;
    const txnId = crypto.randomUUID().replace(/-/g, '');

    await db.prepare(`
      INSERT INTO loyalty_transactions (id, client_id, booking_id, points, type, description, balance_after)
      VALUES (?, ?, ?, ?, 'redeem_discount', ?, ?)
    `).bind(txnId, client_id, booking_id || null, -reward.points_cost, `Redeemed: ${reward.name}`, newBalance).run();

    const newTier = calculateTier(newBalance);
    await db.prepare(`
      UPDATE clients SET loyalty_points = ?, loyalty_tier = ?, updated_at = datetime('now') WHERE id = ?
    `).bind(newBalance, newTier, client_id).run();

    return Response.json({
      success: true,
      data: {
        reward: reward.name,
        discount_percent: reward.discount_percent,
        points_spent: reward.points_cost,
        remaining_points: newBalance,
      },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
