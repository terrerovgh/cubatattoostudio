export const prerender = false;

import type { APIRoute } from 'astro';
import type { ChatRoom } from '../../../types/chat';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const db = env.DB;
    const url = context.url;
    const roomId = url.searchParams.get('room_id');

    // If room_id is provided, return messages for that room
    if (roomId) {
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
    }

    // No room_id: list all chat rooms with client info, unread count, and last message
    const result = await db
      .prepare(
        `SELECT
           cr.id,
           cr.client_id,
           cr.artist_id,
           cr.status,
           cr.last_message_at,
           cr.created_at,
           c.first_name as client_first_name,
           c.last_name as client_last_name,
           c.email as client_email,
           COALESCE(unread.unread_count, 0) as unread_count,
           last_msg.content as last_message,
           last_msg.sender_type as last_message_sender_type
         FROM chat_rooms cr
         LEFT JOIN clients c ON cr.client_id = c.id
         LEFT JOIN (
           SELECT room_id, COUNT(*) as unread_count
           FROM chat_messages
           WHERE is_read = 0 AND sender_type = 'client'
           GROUP BY room_id
         ) unread ON cr.id = unread.room_id
         LEFT JOIN (
           SELECT cm1.room_id, cm1.content, cm1.sender_type
           FROM chat_messages cm1
           INNER JOIN (
             SELECT room_id, MAX(created_at) as max_created
             FROM chat_messages
             GROUP BY room_id
           ) cm2 ON cm1.room_id = cm2.room_id AND cm1.created_at = cm2.max_created
         ) last_msg ON cr.id = last_msg.room_id
         ORDER BY cr.last_message_at DESC`,
      )
      .all();

    return Response.json({
      success: true,
      data: { rooms: result.results },
    });
  } catch (err) {
    console.error('Admin chat GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const PATCH: APIRoute = async (context) => {
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

    const { room_id, status } = body as {
      room_id: string;
      status: ChatRoom['status'];
    };

    if (!room_id || !status) {
      return Response.json(
        { success: false, error: 'Missing required fields: room_id, status' },
        { status: 400 },
      );
    }

    const validStatuses: ChatRoom['status'][] = ['active', 'archived', 'blocked'];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: 'Invalid status. Must be active, archived, or blocked' },
        { status: 400 },
      );
    }

    await db
      .prepare('UPDATE chat_rooms SET status = ? WHERE id = ?')
      .bind(status, room_id)
      .run();

    return Response.json({ success: true, data: { room_id, status } });
  } catch (err) {
    console.error('Admin chat PATCH error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
