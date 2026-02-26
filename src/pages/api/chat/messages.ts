export const prerender = false;

import type { APIRoute } from 'astro';
import { validateChatToken } from '../../../lib/auth';

/**
 * Client-facing chat messages endpoint (REST fallback).
 *
 * Authentication: Uses a `chat_token` query param or cookie
 * that maps to a valid chat room + client.
 *
 * GET  ?room_id=xxx&page=1&per_page=50  - Fetch messages
 * POST { room_id, content, message_type? } - Send a message
 */

// Helper: extract chat token from request
function getChatToken(request: Request, url: URL): string | null {
  // Check query param first
  const tokenParam = url.searchParams.get('chat_token');
  if (tokenParam) return tokenParam;

  // Check cookie
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(/chat_token=([^;]+)/);
  return match ? match[1] : null;
}

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const url = context.url;

  try {
    const db = env.DB;
    const roomId = url.searchParams.get('room_id');

    if (!roomId) {
      return Response.json(
        { success: false, error: 'Missing required query param: room_id' },
        { status: 400 },
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
    console.error('Chat messages GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { room_id, sender_type, sender_id, content, message_type } = body as {
      room_id: string;
      sender_type: 'client' | 'artist';
      sender_id: string;
      content: string;
      message_type?: 'text' | 'image' | 'booking_link';
    };

    if (!room_id || !content || !sender_id) {
      return Response.json(
        { success: false, error: 'Missing required fields: room_id, content, sender_id' },
        { status: 400 },
      );
    }

    // Verify the room exists
    const room = await db
      .prepare('SELECT id, status FROM chat_rooms WHERE id = ?')
      .bind(room_id)
      .first<{ id: string; status: string }>();

    if (!room) {
      return Response.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 },
      );
    }

    if (room.status !== 'active') {
      return Response.json(
        { success: false, error: 'This conversation is no longer active' },
        { status: 403 },
      );
    }

    const validTypes = ['text', 'image', 'booking_link'];
    const msgType = message_type && validTypes.includes(message_type) ? message_type : 'text';
    const type = sender_type === 'artist' ? 'artist' : 'client';

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert message and update room timestamp
    await db.batch([
      db
        .prepare(
          `INSERT INTO chat_messages (
             id, room_id, sender_type, sender_id, content, message_type, is_read, created_at
           ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        )
        .bind(id, room_id, type, sender_id, content.trim(), msgType, now),
      db
        .prepare('UPDATE chat_rooms SET last_message_at = ? WHERE id = ?')
        .bind(now, room_id),
    ]);

    return Response.json({
      success: true,
      data: {
        id,
        room_id,
        sender_type: type,
        sender_id,
        content: content.trim(),
        message_type: msgType,
        is_read: false,
        created_at: now,
      },
    });
  } catch (err) {
    console.error('Chat messages POST error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
