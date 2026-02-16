export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';

interface ClaimRequest {
  flash_design_id: string;
  email: string;
  first_name: string;
  last_name?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { flash_design_id, email, first_name, last_name } = await request.json() as ClaimRequest;

    if (!flash_design_id || !email || !first_name) {
      return Response.json({ success: false, error: 'Missing required fields' } satisfies ApiResponse, { status: 400 });
    }

    // Get flash design
    const design = await db.prepare('SELECT * FROM flash_designs WHERE id = ?').bind(flash_design_id).first();
    if (!design) {
      return Response.json({ success: false, error: 'Flash design not found' } satisfies ApiResponse, { status: 404 });
    }

    if (design.status !== 'available') {
      return Response.json({ success: false, error: 'This design is no longer available' } satisfies ApiResponse, { status: 409 });
    }

    // Check if drop hasn't started yet
    if (design.is_drop && design.drop_date) {
      const dropDate = new Date(design.drop_date as string);
      if (new Date() < dropDate) {
        return Response.json({ success: false, error: 'This drop hasn\'t started yet' } satisfies ApiResponse, { status: 409 });
      }
    }

    // Check quantity
    const claimedCount = (design.claimed_count as number) || 0;
    const dropQuantity = (design.drop_quantity as number) || 1;
    if (claimedCount >= dropQuantity) {
      return Response.json({ success: false, error: 'All slots for this design have been claimed' } satisfies ApiResponse, { status: 409 });
    }

    // Find or create client
    let client = await db.prepare('SELECT * FROM clients WHERE email = ?').bind(email).first();
    if (!client) {
      const clientId = crypto.randomUUID().replace(/-/g, '');
      await db.prepare(`
        INSERT INTO clients (id, email, first_name, last_name) VALUES (?, ?, ?, ?)
      `).bind(clientId, email, first_name, last_name || '').run();
      client = { id: clientId };
    }

    // Calculate discount
    const claimPosition = claimedCount + 1;
    let discount = 0;
    const earlyBirdSlots = (design.early_bird_slots as number) || 5;
    const earlyBirdDiscount = (design.early_bird_discount as number) || 0;

    if (claimPosition <= earlyBirdSlots && earlyBirdDiscount > 0) {
      discount = earlyBirdDiscount;
    }

    // Create claim
    const claimId = crypto.randomUUID().replace(/-/g, '');
    await db.prepare(`
      INSERT INTO flash_claims (id, flash_design_id, client_id, claim_position, discount_applied)
      VALUES (?, ?, ?, ?, ?)
    `).bind(claimId, flash_design_id, client.id as string, claimPosition, discount).run();

    // Update design claimed count
    const newCount = claimedCount + 1;
    const newStatus = newCount >= dropQuantity ? 'claimed' : 'available';
    await db.prepare(`
      UPDATE flash_designs SET claimed_count = ?, status = ? WHERE id = ?
    `).bind(newCount, newStatus, flash_design_id).run();

    return Response.json({
      success: true,
      data: {
        claim_id: claimId,
        position: claimPosition,
        discount_percent: discount,
        final_price: (design.price as number) * (1 - discount / 100),
        remaining_slots: dropQuantity - newCount,
      },
      message: discount > 0
        ? `Claimed! You got the early bird ${discount}% discount!`
        : 'Design claimed successfully! Book your appointment to lock it in.',
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
