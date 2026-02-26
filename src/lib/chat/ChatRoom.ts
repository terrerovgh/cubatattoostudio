import { DurableObject } from 'cloudflare:workers';

interface ChatSession {
  id: string;
  sender_type: 'artist' | 'client';
  sender_id: string;
  room_id: string;
}

interface WSIncoming {
  type: 'message' | 'typing' | 'read';
  content?: string;
  message_type?: 'text' | 'image' | 'booking_link';
  message_id?: string;
}

interface WSOutgoing {
  type: 'message' | 'typing' | 'read' | 'connected' | 'disconnected';
  payload: Record<string, unknown>;
}

export class ChatRoom extends DurableObject {
  private sessions: Map<WebSocket, ChatSession> = new Map();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const senderType = url.searchParams.get('sender_type') as 'artist' | 'client';
    const senderId = url.searchParams.get('sender_id');
    const roomId = url.searchParams.get('room_id');

    if (!senderType || !senderId || !roomId) {
      return new Response('Missing params', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    const sessionId = crypto.randomUUID();
    const session: ChatSession = { id: sessionId, sender_type: senderType, sender_id: senderId, room_id: roomId };

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(session);
    this.sessions.set(server, session);

    // Notify others of connection
    this.broadcast(server, {
      type: 'connected',
      payload: { sender_type: senderType, sender_id: senderId, timestamp: new Date().toISOString() },
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const session = this.sessions.get(ws) || (ws.deserializeAttachment() as ChatSession);
    if (!session) {
      ws.close(1008, 'No session');
      return;
    }

    // Re-attach if recovered from hibernation
    if (!this.sessions.has(ws)) {
      this.sessions.set(ws, session);
    }

    let data: WSIncoming;
    try {
      data = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message));
    } catch {
      ws.send(JSON.stringify({ type: 'error', payload: { message: 'Invalid JSON' } }));
      return;
    }

    switch (data.type) {
      case 'message': {
        if (!data.content?.trim()) return;

        const messageId = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
        const timestamp = new Date().toISOString();

        const outgoing: WSOutgoing = {
          type: 'message',
          payload: {
            id: messageId,
            room_id: session.room_id,
            sender_type: session.sender_type,
            sender_id: session.sender_id,
            content: data.content.trim(),
            message_type: data.message_type || 'text',
            timestamp,
          },
        };

        // Broadcast to all connected clients including sender
        this.broadcastAll(outgoing);

        // Persist message via alarm (batched writes)
        await this.ctx.storage.put(`pending:${messageId}`, {
          id: messageId,
          room_id: session.room_id,
          sender_type: session.sender_type,
          sender_id: session.sender_id,
          content: data.content.trim(),
          message_type: data.message_type || 'text',
          created_at: timestamp,
        });

        // Schedule alarm for batch persistence (1 second from now)
        const currentAlarm = await this.ctx.storage.getAlarm();
        if (!currentAlarm) {
          await this.ctx.storage.setAlarm(Date.now() + 1000);
        }
        break;
      }

      case 'typing': {
        this.broadcast(ws, {
          type: 'typing',
          payload: {
            sender_type: session.sender_type,
            sender_id: session.sender_id,
            room_id: session.room_id,
          },
        });
        break;
      }

      case 'read': {
        if (data.message_id) {
          this.broadcast(ws, {
            type: 'read',
            payload: {
              message_id: data.message_id,
              sender_type: session.sender_type,
              room_id: session.room_id,
            },
          });
        }
        break;
      }
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string): Promise<void> {
    const session = this.sessions.get(ws);
    if (session) {
      this.broadcast(ws, {
        type: 'disconnected',
        payload: { sender_type: session.sender_type, sender_id: session.sender_id },
      });
      this.sessions.delete(ws);
    }
    ws.close(code, reason);
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    const session = this.sessions.get(ws);
    if (session) {
      this.sessions.delete(ws);
    }
  }

  async alarm(): Promise<void> {
    // Batch persist pending messages
    const pending = await this.ctx.storage.list<Record<string, string>>({ prefix: 'pending:' });
    if (pending.size === 0) return;

    // We don't have direct D1 access from a Durable Object,
    // so we store messages in DO SQLite storage for retrieval by the API
    // The API endpoints will check both D1 and DO storage
    for (const [key, msg] of pending) {
      await this.ctx.storage.put(`msg:${msg.id}`, msg);
      await this.ctx.storage.delete(key);
    }
  }

  private broadcast(sender: WebSocket, message: WSOutgoing): void {
    const data = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws !== sender) {
        try {
          ws.send(data);
        } catch {
          // Client disconnected
        }
      }
    }
  }

  private broadcastAll(message: WSOutgoing): void {
    const data = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(data);
      } catch {
        // Client disconnected
      }
    }
  }
}
