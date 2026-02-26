export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../../types/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;

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
         WHERE cr.artist_id = ?
         ORDER BY cr.last_message_at DESC`,
      )
      .bind(artistId)
      .all();

    return Response.json({
      success: true,
      data: { rooms: result.results },
    });
  } catch (err) {
    console.error('Artist chat rooms GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
