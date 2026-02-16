export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse } from '../../../types/booking';
import { generateAftercareMessages } from '../../../lib/aftercare';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const bookingId = url.searchParams.get('booking_id');

    if (!bookingId) {
      return Response.json({ success: false, error: 'booking_id required' } satisfies ApiResponse, { status: 400 });
    }

    const messages = await db.prepare(`
      SELECT * FROM aftercare_messages WHERE booking_id = ? ORDER BY day_number ASC
    `).bind(bookingId).all();

    return Response.json({
      success: true,
      data: { messages: messages.results },
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};

// Schedule aftercare messages when a booking is completed
interface StatusRequest {
  booking_id: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const { booking_id } = await request.json() as StatusRequest;

    if (!booking_id) {
      return Response.json({ success: false, error: 'booking_id required' } satisfies ApiResponse, { status: 400 });
    }

    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(booking_id).first();
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' } satisfies ApiResponse, { status: 404 });
    }

    const client = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(booking.client_id).first();
    if (!client) {
      return Response.json({ success: false, error: 'Client not found' } satisfies ApiResponse, { status: 404 });
    }

    const artistNames: Record<string, string> = { david: 'David', nina: 'Nina', karli: 'Karli' };
    const artistName = artistNames[booking.artist_id as string] || (booking.artist_id as string);
    const clientName = `${client.first_name}`;

    const messages = generateAftercareMessages({
      bookingId: booking_id,
      clientId: client.id as string,
      completedDate: new Date().toISOString(),
      clientName,
      artistName,
    });

    // Insert all messages
    for (const msg of messages) {
      const msgId = crypto.randomUUID().replace(/-/g, '');
      await db.prepare(`
        INSERT INTO aftercare_messages (id, booking_id, client_id, day_number, type, channel, status, scheduled_for, content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        msgId, msg.booking_id, msg.client_id, msg.day_number,
        msg.type, msg.channel, msg.status, msg.scheduled_for, msg.content,
      ).run();
    }

    return Response.json({
      success: true,
      data: { scheduled_count: messages.length },
      message: `Scheduled ${messages.length} aftercare messages`,
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
