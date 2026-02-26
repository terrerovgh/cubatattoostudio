/**
 * Post-build script: patches the Astro-generated Worker entry to export
 * Durable Object classes required by wrangler.jsonc bindings.
 *
 * Run after `astro build` and before `wrangler deploy`.
 *
 * Why: @astrojs/cloudflare generates dist/_worker.js/index.js which exports
 * a default fetch handler, but Cloudflare requires Durable Object classes
 * to be exported from the same entry module. Astro has no mechanism to
 * inject arbitrary named exports, so we patch the output.
 */

import { readFileSync, writeFileSync } from 'fs';

const ENTRY = 'dist/_worker.js/index.js';

let code;
try {
  code = readFileSync(ENTRY, 'utf8');
} catch (err) {
  console.error('❌ Could not read worker entry. Run `astro build` first.');
  process.exit(1);
}

// Skip if already patched
if (code.includes('export class ChatRoom')) {
  console.log('ℹ️  ChatRoom already exported — skipping patch.');
  process.exit(0);
}

// Inline the compiled ChatRoom Durable Object.
// We inline rather than import because the Astro bundle is self-contained
// and wrangler may not rebundle imports correctly from dist/.
const chatRoomSource = `

// ──────────────────────────────────────────────────────────────────────────
// Durable Object: ChatRoom (patched by scripts/patch-do-exports.mjs)
// ──────────────────────────────────────────────────────────────────────────
import { DurableObject } from 'cloudflare:workers';

export class ChatRoom extends DurableObject {
  sessions = new Map();

  async fetch(request) {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const senderType = url.searchParams.get('sender_type');
    const senderId = url.searchParams.get('sender_id');
    const roomId = url.searchParams.get('room_id');

    if (!senderType || !senderId || !roomId) {
      return new Response('Missing params', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    const sessionId = crypto.randomUUID();
    const session = { id: sessionId, sender_type: senderType, sender_id: senderId, room_id: roomId };

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(session);
    this.sessions.set(server, session);

    this._broadcast(server, {
      type: 'connected',
      payload: { sender_type: senderType, sender_id: senderId, timestamp: new Date().toISOString() },
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    const session = this.sessions.get(ws) || ws.deserializeAttachment();
    if (!session) { ws.close(1008, 'No session'); return; }
    if (!this.sessions.has(ws)) this.sessions.set(ws, session);

    let data;
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
        const outgoing = {
          type: 'message',
          payload: {
            id: messageId, room_id: session.room_id,
            sender_type: session.sender_type, sender_id: session.sender_id,
            content: data.content.trim(), message_type: data.message_type || 'text',
            timestamp,
          },
        };
        this._broadcastAll(outgoing);
        await this.ctx.storage.put('pending:' + messageId, {
          id: messageId, room_id: session.room_id,
          sender_type: session.sender_type, sender_id: session.sender_id,
          content: data.content.trim(), message_type: data.message_type || 'text',
          created_at: timestamp,
        });
        const alarm = await this.ctx.storage.getAlarm();
        if (!alarm) await this.ctx.storage.setAlarm(Date.now() + 1000);
        break;
      }
      case 'typing': {
        this._broadcast(ws, {
          type: 'typing',
          payload: { sender_type: session.sender_type, sender_id: session.sender_id, room_id: session.room_id },
        });
        break;
      }
      case 'read': {
        if (data.message_id) {
          this._broadcast(ws, {
            type: 'read',
            payload: { message_id: data.message_id, sender_type: session.sender_type, room_id: session.room_id },
          });
        }
        break;
      }
    }
  }

  async webSocketClose(ws, code, reason) {
    const session = this.sessions.get(ws);
    if (session) {
      this._broadcast(ws, { type: 'disconnected', payload: { sender_type: session.sender_type, sender_id: session.sender_id } });
      this.sessions.delete(ws);
    }
    ws.close(code, reason);
  }

  async webSocketError(ws) {
    this.sessions.delete(ws);
  }

  async alarm() {
    const pending = await this.ctx.storage.list({ prefix: 'pending:' });
    for (const [key, msg] of pending) {
      await this.ctx.storage.put('msg:' + msg.id, msg);
      await this.ctx.storage.delete(key);
    }
  }

  _broadcast(sender, message) {
    const data = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws !== sender) try { ws.send(data); } catch {}
    }
  }

  _broadcastAll(message) {
    const data = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.send(data); } catch {}
    }
  }
}
`;

code += chatRoomSource;
writeFileSync(ENTRY, code);
console.log('✅ Patched worker entry to export ChatRoom Durable Object');
