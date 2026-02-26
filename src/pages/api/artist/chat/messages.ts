export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../../types/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;
    const url = context.url;
    const roomId = url.searchParams.get('room_id');

    if (!roomId) {
      return Response.json(
        { success: false, error: 'Missing required query param: room_id' },
        { status: 400 },
      );
    }

    // Verify the room belongs to this artist
    const room = await db
      .prepare('SELECT id FROM chat_rooms WHERE id = ? AND artist_id = ?')
      .bind(roomId, artistId)
      .first();

    if (!room) {
      return Response.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 },
      );
    }

    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '50')));
    const offset = (page - 1) * perPage;

    const [messagesResult, countResult] = await Promise.all([
      db
        .prepare(
          `SELECT * FROM chat_messages
           WHERE room_id = ?
           ORDER BY created_at ASC
           LIMIT ? OFFSET ?`,
        )
        .bind(roomId, perPage, offset)
        .all(),
      db
        .prepare('SELECT COUNT(*) as total FROM chat_messages WHERE room_id = ?')
        .bind(roomId)
        .first<{ total: number }>(),
    ]);

    const total = countResult?.total || 0;

    return Response.json({
      success: true,
      data: {
        messages: messagesResult.results,
        pagination: {
          page,
          per_page: perPage,
          total,
          pages: Math.ceil(total / perPage),
        },
      },
    });
  } catch (err) {
    console.error('Artist chat messages GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { room_id, content, message_type } = body as {
      room_id: string;
      content: string;
      message_type?: 'text' | 'image' | 'booking_link';
    };

    if (!room_id || !content) {
      return Response.json(
        { success: false, error: 'Missing required fields: room_id, content' },
        { status: 400 },
      );
    }

    // Verify the room belongs to this artist
    const room = await db
      .prepare('SELECT id FROM chat_rooms WHERE id = ? AND artist_id = ?')
      .bind(room_id, artistId)
      .first();

    if (!room) {
      return Response.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 },
      );
    }

    const validTypes = ['text', 'image', 'booking_link'];
    const msgType = message_type && validTypes.includes(message_type) ? message_type : 'text';

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert message and update room's last_message_at
    await db.batch([
      db
        .prepare(
          `INSERT INTO chat_messages (
             id, room_id, sender_type, sender_id, content, message_type, is_read, created_at
           ) VALUES (?, ?, 'artist', ?, ?, ?, 0, ?)`,
        )
        .bind(id, room_id, artistId, content, msgType, now),
      db
        .prepare('UPDATE chat_rooms SET last_message_at = ? WHERE id = ?')
        .bind(now, room_id),
    ]);

    return Response.json({
      success: true,
      data: {
        id,
        room_id,
        sender_type: 'artist',
        sender_id: artistId,
        content,
        message_type: msgType,
        created_at: now,
      },
    });
  } catch (err) {
    console.error('Artist chat messages POST error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
