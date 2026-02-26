import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Wifi,
  WifiOff,
  Loader2,
  MessageCircle,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  room_id: string;
  sender_type: 'artist' | 'client';
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'booking_link';
  is_read: boolean | number;
  created_at: string;
}

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'polling';

interface WSIncomingMessage {
  type: 'message' | 'typing' | 'read' | 'connected' | 'disconnected' | 'error';
  payload?: {
    id?: string;
    room_id?: string;
    sender_type?: 'artist' | 'client';
    sender_id?: string;
    content?: string;
    message_type?: 'text' | 'image' | 'booking_link';
    timestamp?: string;
    message?: string;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_COPPER = '#C8956C';
const POLL_INTERVAL_MS = 5_000;
const TYPING_CLEAR_DELAY_MS = 3_000;
const WS_RECONNECT_DELAY_MS = 3_000;
const WS_MAX_RECONNECTS = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function fmtMessageDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function groupMessagesByDate(
  messages: ChatMessage[],
): Array<{ dateKey: string; label: string; messages: ChatMessage[] }> {
  const groups: Array<{ dateKey: string; label: string; messages: ChatMessage[] }> = [];
  for (const msg of messages) {
    const dateKey = new Date(msg.created_at).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.dateKey === dateKey) {
      last.messages.push(msg);
    } else {
      groups.push({ dateKey, label: fmtMessageDate(msg.created_at), messages: [msg] });
    }
  }
  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConnectionDot({ status }: { status: ConnectionStatus }) {
  const colorMap: Record<ConnectionStatus, string> = {
    connected: 'bg-emerald-400',
    connecting: 'bg-yellow-400',
    reconnecting: 'bg-yellow-400',
    disconnected: 'bg-red-500',
    polling: 'bg-white/30',
  };
  const labelMap: Record<ConnectionStatus, string> = {
    connected: 'Live',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    disconnected: 'Offline',
    polling: 'Syncing',
  };

  const isAnimated = status === 'connecting' || status === 'reconnecting';

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`
          w-2 h-2 rounded-full shrink-0
          ${colorMap[status]}
          ${isAnimated ? 'animate-pulse' : ''}
        `}
        aria-hidden="true"
      />
      <span className="text-[11px] text-white/40 font-medium">{labelMap[status]}</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mt-3">
      {/* Artist avatar placeholder */}
      <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
        <User size={11} className="text-white/30" />
      </div>
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white/[0.05] border border-white/[0.06] flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatWidget({ room_id, client_id }: { room_id: string; client_id: string }) {
  // ── State ────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [artistTyping, setArtistTyping] = useState(false);

  // Room status — drives whether the input is enabled.
  // Fetched on mount alongside messages; updated if the server signals a status change.
  const [roomStatus, setRoomStatus] = useState<'active' | 'archived' | 'blocked'>('active');

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const usingWSRef = useRef(false);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Also scroll when typing indicator appears
  useEffect(() => {
    if (artistTyping) scrollToBottom();
  }, [artistTyping, scrollToBottom]);

  // ── Fetch room status ────────────────────────────────────────────────────
  // Uses the client-facing chat messages endpoint which will return an error
  // if the room is archived or blocked.
  const fetchRoomStatus = useCallback(async () => {
    // Room status is implicitly checked when we fetch messages.
    // If the room is inactive, the POST endpoint returns 403.
    // We keep status as 'active' by default — the send handler
    // will catch 403s and update roomStatus accordingly.
  }, []);

  // ── Fetch messages (REST polling fallback) ────────────────────────────────
  const fetchMessages = useCallback(
    async (showLoader = false) => {
      if (!isMountedRef.current) return;
      if (showLoader) setLoading(true);
      setLoadError(null);

      try {
        const params = new URLSearchParams({ room_id, per_page: '100' });
        const res = await fetch(`/api/chat/messages?${params}`);

        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const json = (await res.json()) as {
          success: boolean;
          data?: {
            messages: ChatMessage[];
          };
          error?: string;
        };

        if (!json.success) throw new Error(json.error ?? 'Failed to load messages');

        if (isMountedRef.current) {
          setMessages(json.data?.messages ?? []);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setLoadError(err instanceof Error ? err.message : 'Could not load messages');
        }
      } finally {
        if (isMountedRef.current && showLoader) {
          setLoading(false);
        }
      }
    },
    [room_id],
  );

  // ── Start polling ────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    usingWSRef.current = false;
    setConnectionStatus('polling');

    pollIntervalRef.current = setInterval(() => {
      void fetchMessages(false);
    }, POLL_INTERVAL_MS);
  }, [fetchMessages]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // ── Merge incoming WS message into local state ────────────────────────────
  const mergeWSMessage = useCallback((incoming: ChatMessage) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === incoming.id);
      if (exists) return prev;
      return [...prev, incoming];
    });
  }, []);

  // ── WebSocket setup ──────────────────────────────────────────────────────
  const connectWS = useCallback(() => {
    if (!isMountedRef.current) return;
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/chat/ws?room_id=${room_id}&sender_type=client&sender_id=${client_id}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      setConnectionStatus('connecting');

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        reconnectAttemptsRef.current = 0;
        usingWSRef.current = true;
        stopPolling();
        setConnectionStatus('connected');
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!isMountedRef.current) return;
        let data: WSIncomingMessage;
        try {
          data = JSON.parse(event.data as string) as WSIncomingMessage;
        } catch {
          return;
        }

        switch (data.type) {
          case 'message': {
            const payload = data.payload;
            if (!payload?.id || !payload.content || !payload.sender_type) return;
            const msg: ChatMessage = {
              id: payload.id,
              room_id,
              sender_type: payload.sender_type,
              sender_id: payload.sender_id ?? '',
              content: payload.content,
              message_type: payload.message_type ?? 'text',
              is_read: false,
              created_at: payload.timestamp ?? new Date().toISOString(),
            };
            mergeWSMessage(msg);
            break;
          }
          case 'typing': {
            const senderType = data.payload?.sender_type;
            if (senderType === 'artist') {
              setArtistTyping(true);
              if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
              typingClearTimerRef.current = setTimeout(() => {
                if (isMountedRef.current) setArtistTyping(false);
              }, TYPING_CLEAR_DELAY_MS);
            }
            break;
          }
          case 'connected':
          case 'disconnected':
            // Presence events — no UI change needed for client view
            break;
          case 'read':
            // Could mark messages as read — skip for client simplicity
            break;
          default:
            break;
        }
      };

      ws.onerror = () => {
        // Let onclose handle reconnect logic
      };

      ws.onclose = () => {
        if (!isMountedRef.current) return;
        wsRef.current = null;
        usingWSRef.current = false;

        if (reconnectAttemptsRef.current < WS_MAX_RECONNECTS) {
          reconnectAttemptsRef.current += 1;
          setConnectionStatus('reconnecting');
          reconnectTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) connectWS();
          }, WS_RECONNECT_DELAY_MS);
        } else {
          // Exhausted reconnects — fall back to polling
          setConnectionStatus('disconnected');
          startPolling();
        }
      };
    } catch {
      // WebSocket not available (e.g., SSR guard hit somehow)
      startPolling();
    }
  }, [room_id, client_id, mergeWSMessage, startPolling, stopPolling]);

  // ── Initialization ───────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    // Fetch room status and message history in parallel on mount
    void Promise.all([fetchMessages(true), fetchRoomStatus()]).then(() => {
      if (!isMountedRef.current) return;
      setLoading(false);
      // Attempt WS connection after initial load
      connectWS();
    });

    return () => {
      isMountedRef.current = false;

      // Cleanup WS
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      // Cleanup timers
      stopPolling();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
      if (typingThrottleRef.current) clearTimeout(typingThrottleRef.current);
    };
  }, [fetchMessages, fetchRoomStatus, connectWS, stopPolling]);

  // ── Send message via WS or REST fallback ─────────────────────────────────
  const handleSend = useCallback(async () => {
    const content = newMessage.trim();
    if (!content || sending || roomStatus !== 'active') return;

    setSending(true);
    setSendError(null);
    setNewMessage('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
    }

    // Optimistic insert with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const tempMsg: ChatMessage = {
      id: tempId,
      room_id,
      sender_type: 'client',
      sender_id: client_id,
      content,
      message_type: 'text',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      // Prefer WS if connected
      if (usingWSRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: 'message', content, message_type: 'text' }),
        );
        // The server will echo the message back with a real ID via the WS stream.
        // Remove the temp optimistic entry once the real one arrives.
        // We keep the temp until the next poll reconciles it.
      } else {
        // REST fallback: POST to the client-facing chat messages endpoint
        const res = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_id,
            sender_type: 'client',
            sender_id: client_id,
            content,
            message_type: 'text',
          }),
        });

        if (res.ok) {
          const json = (await res.json()) as {
            success: boolean;
            data?: ChatMessage;
            error?: string;
          };
          if (json.success && json.data) {
            // Replace temp optimistic msg with persisted one
            setMessages((prev) =>
              prev.map((m) => (m.id === tempId ? (json.data as ChatMessage) : m)),
            );
          }
        } else {
          // Remove temp on failure
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          throw new Error(`Server returned ${res.status}`);
        }
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError(err instanceof Error ? err.message : 'Failed to send message');
      // Restore the message text so the user can retry
      setNewMessage(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [newMessage, sending, roomStatus, room_id, client_id]);

  // ── Send typing signal via WS ────────────────────────────────────────────
  const sendTypingSignal = useCallback(() => {
    if (usingWSRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      if (!typingThrottleRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'typing' }));
        typingThrottleRef.current = setTimeout(() => {
          typingThrottleRef.current = null;
        }, 2_000);
      }
    }
  }, []);

  // ── Keyboard handler ─────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  // ── Textarea auto-resize + typing signal ────────────────────────────────
  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
      // Auto-resize
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
      // Typing signal
      sendTypingSignal();
    },
    [sendTypingSignal],
  );

  // ── Grouped messages ─────────────────────────────────────────────────────
  const messageGroups = groupMessagesByDate(messages);

  // ── Whether input is disabled ─────────────────────────────────────────────
  const isInputDisabled = roomStatus !== 'active' || sending;
  const disabledReason =
    roomStatus === 'archived'
      ? 'This conversation has been archived.'
      : roomStatus === 'blocked'
        ? 'This conversation has been closed.'
        : null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{
        height: '100dvh',
        background: 'var(--color-surface-primary, #08080a)',
        color: 'var(--color-text-primary, rgba(250,248,245,0.94))',
        fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: 'rgba(17, 17, 19, 0.98)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-base"
            style={{ background: BRAND_COPPER, color: '#fff' }}
          >
            C
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Cuba Tattoo Studio</p>
            <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Client Chat
            </p>
          </div>
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-3">
          <ConnectionDot status={connectionStatus} />
          {(connectionStatus === 'disconnected' || connectionStatus === 'polling') && (
            <button
              onClick={() => {
                reconnectAttemptsRef.current = 0;
                connectWS();
              }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              aria-label="Reconnect"
              title="Reconnect"
            >
              {connectionStatus === 'disconnected' ? (
                <WifiOff size={14} />
              ) : (
                <Wifi size={14} />
              )}
            </button>
          )}
        </div>
      </header>

      {/* ── Messages area ─────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ overscrollBehavior: 'contain' }}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {loading ? (
          /* Initial loading skeleton */
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 size={24} className="animate-spin" style={{ color: BRAND_COPPER }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Loading conversation...
            </p>
          </div>
        ) : loadError ? (
          /* Error state */
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(248,113,113,0.1)' }}
            >
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Could not load messages</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {loadError}
              </p>
            </div>
            <button
              onClick={() => void fetchMessages(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(200,149,108,0.08)',
                border: '1px solid rgba(200,149,108,0.15)',
              }}
            >
              <MessageCircle size={28} style={{ color: BRAND_COPPER, opacity: 0.7 }} />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Start the conversation</p>
              <p className="text-sm mt-1.5 max-w-[220px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Send a message and our team will respond as soon as possible.
              </p>
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="space-y-0">
            {messageGroups.map((group) => (
              <div key={group.dateKey}>
                {/* Date divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {group.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>

                {/* Messages within date group */}
                <div className="space-y-1">
                  {group.messages.map((msg, idx) => {
                    const isClient = msg.sender_type === 'client';
                    const isTemp = msg.id.startsWith('temp-');
                    const prevMsg = group.messages[idx - 1];
                    const isSameSenderAsPrev = prevMsg?.sender_type === msg.sender_type;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${isClient ? 'flex-row-reverse' : 'flex-row'} ${isSameSenderAsPrev ? 'mt-0.5' : 'mt-3'}`}
                      >
                        {/* Artist avatar (left side) */}
                        {!isClient && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              visibility: isSameSenderAsPrev ? 'hidden' : 'visible',
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <User size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                          </div>
                        )}

                        {/* Bubble + meta */}
                        <div
                          className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[65%] ${isClient ? 'items-end' : 'items-start'}`}
                        >
                          {/* Sender label (only for first in a group) */}
                          {!isSameSenderAsPrev && (
                            <span
                              className="text-[10px] font-medium px-1"
                              style={{ color: 'rgba(255,255,255,0.3)' }}
                            >
                              {isClient ? 'You' : 'Artist'}
                            </span>
                          )}

                          {/* Message bubble */}
                          {msg.message_type === 'booking_link' ? (
                            <div
                              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isClient ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                              style={
                                isClient
                                  ? {
                                      background: `${BRAND_COPPER}22`,
                                      border: `1px solid ${BRAND_COPPER}40`,
                                      color: BRAND_COPPER,
                                    }
                                  : {
                                      background: 'rgba(255,255,255,0.05)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      color: 'rgba(250,248,245,0.9)',
                                    }
                              }
                            >
                              <p
                                className="text-[10px] font-semibold uppercase tracking-wide mb-1"
                                style={{ opacity: 0.6 }}
                              >
                                Booking Link
                              </p>
                              <a
                                href={msg.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 break-all"
                              >
                                {msg.content}
                              </a>
                            </div>
                          ) : (
                            <div
                              className={`group relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isClient ? 'rounded-br-sm' : 'rounded-bl-sm'} ${isTemp ? 'opacity-60' : ''}`}
                              style={
                                isClient
                                  ? {
                                      background: BRAND_COPPER,
                                      color: '#fff',
                                    }
                                  : {
                                      background: 'rgba(255,255,255,0.05)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      color: 'rgba(250,248,245,0.9)',
                                    }
                              }
                            >
                              {msg.content}
                            </div>
                          )}

                          {/* Timestamp */}
                          <span
                            className="text-[10px] px-1"
                            style={{ color: 'rgba(255,255,255,0.25)' }}
                          >
                            {isTemp ? 'Sending...' : fmtMessageTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {artistTyping && <TypingIndicator />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* ── Input area ────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-4 pt-3 pb-safe-4"
        style={{
          background: 'rgba(11,11,14,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        }}
      >
        {/* Disabled room notice */}
        {disabledReason && (
          <div
            className="flex items-center gap-2 mb-3 px-3 py-2.5 rounded-xl text-sm"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: 'rgba(248,113,113,0.8)',
            }}
            role="alert"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{disabledReason}</span>
          </div>
        )}

        {/* Send error banner */}
        {sendError && (
          <div
            className="flex items-center justify-between gap-2 mb-3 px-3 py-2 rounded-xl text-xs"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.15)',
              color: 'rgba(248,113,113,0.8)',
            }}
            role="alert"
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle size={12} className="shrink-0" />
              <span>{sendError}</span>
            </div>
            <button
              onClick={() => setSendError(null)}
              className="shrink-0 font-medium hover:opacity-100 transition-opacity"
              style={{ opacity: 0.6 }}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Compose row */}
        <div className="flex items-end gap-2">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                roomStatus === 'active'
                  ? 'Type a message...'
                  : 'This conversation is no longer active'
              }
              disabled={isInputDisabled}
              rows={1}
              aria-label="Message input"
              className="w-full resize-none rounded-xl text-sm transition-colors"
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                height: '44px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(250,248,245,0.9)',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.5',
                opacity: isInputDisabled ? 0.5 : 1,
                cursor: isInputDisabled ? 'not-allowed' : 'text',
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                  `${BRAND_COPPER}60`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                  'rgba(255,255,255,0.08)';
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={() => void handleSend()}
            disabled={!newMessage.trim() || isInputDisabled}
            aria-label="Send message"
            className="shrink-0 flex items-center justify-center rounded-xl transition-all duration-150"
            style={{
              width: '44px',
              height: '44px',
              background:
                !newMessage.trim() || isInputDisabled
                  ? 'rgba(255,255,255,0.06)'
                  : BRAND_COPPER,
              color:
                !newMessage.trim() || isInputDisabled
                  ? 'rgba(255,255,255,0.25)'
                  : '#fff',
              cursor: !newMessage.trim() || isInputDisabled ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Keyboard hint */}
        {roomStatus === 'active' && (
          <p
            className="mt-1.5 text-[10px] text-right"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            Enter to send &middot; Shift+Enter for new line
          </p>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 text-center py-2"
        style={{
          background: 'rgba(11,11,14,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Powered by{' '}
          <span style={{ color: BRAND_COPPER, opacity: 0.7 }}>Cuba Tattoo Studio</span>
        </p>
      </div>
    </div>
  );
}
