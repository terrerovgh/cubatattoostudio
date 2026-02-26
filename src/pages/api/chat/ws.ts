export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * WebSocket upgrade endpoint for real-time chat.
 *
 * Query params:
 *  - room_id: chat room ID (required)
 *  - sender_type: 'artist' | 'client' (required)
 *  - sender_id: artist or client UUID (required)
 *
 * The request is forwarded to the ChatRoom Durable Object which manages
 * WebSocket sessions, message broadcasting, and batched persistence.
 */
export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const url = context.url;

  // Verify this is a WebSocket upgrade request
  if (context.request.headers.get('Upgrade') !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const roomId = url.searchParams.get('room_id');
  const senderType = url.searchParams.get('sender_type');
  const senderId = url.searchParams.get('sender_id');

  if (!roomId || !senderType || !senderId) {
    return new Response(
      JSON.stringify({ error: 'Missing required params: room_id, sender_type, sender_id' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (senderType !== 'artist' && senderType !== 'client') {
    return new Response(
      JSON.stringify({ error: 'sender_type must be "artist" or "client"' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    // Get the Durable Object for this chat room
    const id = env.CHAT_ROOM.idFromName(roomId);
    const stub = env.CHAT_ROOM.get(id);

    // Forward the request to the Durable Object
    const doUrl = new URL(context.request.url);
    doUrl.pathname = '/websocket';

    return stub.fetch(
      new Request(doUrl.toString(), {
        headers: context.request.headers,
      }),
    );
  } catch (err) {
    console.error('Chat WS error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to establish WebSocket connection' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
