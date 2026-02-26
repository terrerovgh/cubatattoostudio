import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  User,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatRoom {
  id: string;
  client_id: string;
  artist_id: string;
  status: 'active' | 'archived' | 'blocked';
  last_message_at: string | null;
  created_at: string;
  client_first_name: string | null;
  client_last_name: string | null;
  client_email: string | null;
  unread_count: number;
  last_message: string | null;
  last_message_sender_type: 'artist' | 'client' | null;
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.charAt(0).toUpperCase() ?? '';
  const l = lastName?.charAt(0).toUpperCase() ?? '';
  return f + l || '?';
}

function getClientName(room: ChatRoom): string {
  const name = [room.client_first_name, room.client_last_name].filter(Boolean).join(' ');
  return name || room.client_email || 'Unknown Client';
}

// Group messages by date for date dividers
function groupMessagesByDate(messages: ChatMessage[]): Array<{ date: string; messages: ChatMessage[] }> {
  const groups: Array<{ date: string; messages: ChatMessage[] }> = [];
  for (const msg of messages) {
    const dateKey = new Date(msg.created_at).toDateString();
    const last = groups[groups.length - 1];
    if (last && last.date === dateKey) {
      last.messages.push(msg);
    } else {
      groups.push({ date: dateKey, messages: [msg] });
    }
  }
  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface RoomItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}

function RoomItem({ room, isSelected, onClick }: RoomItemProps) {
  const initials = getInitials(room.client_first_name, room.client_last_name);
  const clientName = getClientName(room);
  const hasUnread = room.unread_count > 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-100 border-b border-gray-100 last:border-0
        ${isSelected
          ? 'bg-[#C8956C]/8 border-l-2 border-l-[#C8956C]'
          : 'hover:bg-gray-50 border-l-2 border-l-transparent'}
      `}
    >
      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm
        ${isSelected
          ? 'bg-[#C8956C] text-white'
          : 'bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/10 text-[#C8956C]'}
      `}>
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-[#1a1a2e]' : 'font-medium text-gray-700'}`}>
            {clientName}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {room.last_message_at && (
              <span className="text-[10px] text-gray-400">
                {fmtTime(room.last_message_at)}
              </span>
            )}
            {hasUnread && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#C8956C] text-white text-[10px] font-bold flex items-center justify-center">
                {room.unread_count > 99 ? '99+' : room.unread_count}
              </span>
            )}
          </div>
        </div>
        {room.last_message ? (
          <p className={`text-xs truncate ${hasUnread ? 'text-gray-600' : 'text-gray-400'}`}>
            {room.last_message_sender_type === 'artist' && (
              <span className="text-[#C8956C]">You: </span>
            )}
            {room.last_message}
          </p>
        ) : (
          <p className="text-xs text-gray-300 italic">No messages yet</p>
        )}
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ArtistChatTab() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // On mobile, track whether we show the room list or the message thread
  const [mobileView, setMobileView] = useState<'rooms' | 'messages'>('rooms');

  // ── Refs ───────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const roomsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) ?? null;

  // ── Fetch rooms ────────────────────────────────────────────────────────────
  const fetchRooms = useCallback(async (showLoader = false) => {
    if (showLoader) setRoomsLoading(true);
    setRoomsError(null);
    try {
      const res = await fetch('/api/artist/chat/rooms');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as { success: boolean; data?: { rooms: ChatRoom[] }; error?: string };
      if (!json.success) throw new Error(json.error ?? 'Failed to load rooms');
      setRooms(json.data?.rooms ?? []);
    } catch (err) {
      setRoomsError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      if (showLoader) setRoomsLoading(false);
    }
  }, []);

  // ── Fetch messages ─────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (roomId: string, showLoader = false) => {
    if (showLoader) setMessagesLoading(true);
    setMessagesError(null);
    try {
      const params = new URLSearchParams({ room_id: roomId, page: '1', per_page: '50' });
      const res = await fetch(`/api/artist/chat/messages?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as {
        success: boolean;
        data?: { messages: ChatMessage[]; pagination: unknown };
        error?: string;
      };
      if (!json.success) throw new Error(json.error ?? 'Failed to load messages');
      setMessages(json.data?.messages ?? []);
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      if (showLoader) setMessagesLoading(false);
    }
  }, []);

  // ── Auto-scroll on new messages ────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ── Initial rooms load + 15-second polling ─────────────────────────────────
  useEffect(() => {
    void fetchRooms(true);

    roomsIntervalRef.current = setInterval(() => {
      void fetchRooms(false);
    }, 15_000);

    return () => {
      if (roomsIntervalRef.current) clearInterval(roomsIntervalRef.current);
    };
  }, [fetchRooms]);

  // ── Messages polling when a room is selected ───────────────────────────────
  useEffect(() => {
    if (messagesIntervalRef.current) clearInterval(messagesIntervalRef.current);

    if (!selectedRoomId) {
      setMessages([]);
      return;
    }

    void fetchMessages(selectedRoomId, true);

    messagesIntervalRef.current = setInterval(() => {
      void fetchMessages(selectedRoomId, false);
    }, 5_000);

    return () => {
      if (messagesIntervalRef.current) clearInterval(messagesIntervalRef.current);
    };
  }, [selectedRoomId, fetchMessages]);

  // ── Room selection ─────────────────────────────────────────────────────────
  const handleSelectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setNewMessage('');
    setSendError(null);
    setMobileView('messages');
  }, []);

  const handleBack = useCallback(() => {
    setMobileView('rooms');
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!selectedRoomId || !newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setSending(true);
    setSendError(null);

    try {
      const res = await fetch('/api/artist/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: selectedRoomId, content, message_type: 'text' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as { success: boolean; data?: ChatMessage; error?: string };
      if (!json.success) throw new Error(json.error ?? 'Failed to send message');

      setNewMessage('');
      // Append optimistically, then re-fetch for consistency
      if (json.data) {
        setMessages(prev => [...prev, json.data as ChatMessage]);
      }
      void fetchMessages(selectedRoomId, false);
      void fetchRooms(false);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [selectedRoomId, newMessage, sending, fetchMessages, fetchRooms]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }, [handleSend]);

  // ── Message groups ─────────────────────────────────────────────────────────
  const messageGroups = groupMessagesByDate(messages);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[500px] rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">

      {/* ── Left panel: Room list ──────────────────────────────────────────── */}
      <div className={`
        flex flex-col border-r border-gray-200 bg-white
        w-full md:w-72 lg:w-80 shrink-0
        ${mobileView === 'messages' ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-[#C8956C]" />
            <h2 className="font-semibold text-[#1a1a2e] text-sm">Conversations</h2>
            {rooms.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
                {rooms.length}
              </span>
            )}
          </div>
          <button
            onClick={() => void fetchRooms(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#C8956C] hover:bg-[#C8956C]/8 transition-colors"
            aria-label="Refresh conversations"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Room list body */}
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <Loader2 size={22} className="animate-spin text-[#C8956C]" />
              <p className="text-xs">Loading conversations...</p>
            </div>
          ) : roomsError ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-xs text-red-500">{roomsError}</p>
              <button
                onClick={() => void fetchRooms(true)}
                className="mt-1 px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle size={24} className="text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Client conversations will appear here once they start chatting.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {rooms.map(room => (
                <RoomItem
                  key={room.id}
                  room={room}
                  isSelected={selectedRoomId === room.id}
                  onClick={() => handleSelectRoom(room.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Total unread footer */}
        {rooms.some(r => r.unread_count > 0) && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-[#C8956C]/5 shrink-0">
            <p className="text-[11px] text-[#C8956C] font-medium">
              {rooms.reduce((acc, r) => acc + (r.unread_count || 0), 0)} unread message(s)
            </p>
          </div>
        )}
      </div>

      {/* ── Right panel: Message thread ────────────────────────────────────── */}
      <div className={`
        flex-1 flex flex-col min-w-0
        ${mobileView === 'rooms' ? 'hidden md:flex' : 'flex'}
      `}>
        {selectedRoom ? (
          <>
            {/* Thread header */}
            <div className="h-14 px-4 flex items-center gap-3 border-b border-gray-100 bg-white shrink-0">
              {/* Mobile back button */}
              <button
                onClick={handleBack}
                className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Client avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8956C]/20 to-[#C8956C]/10 flex items-center justify-center shrink-0">
                <span className="text-[#C8956C] font-semibold text-xs">
                  {getInitials(selectedRoom.client_first_name, selectedRoom.client_last_name)}
                </span>
              </div>

              {/* Client info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a1a2e] truncate">
                  {getClientName(selectedRoom)}
                </p>
                {selectedRoom.client_email && (
                  <p className="text-xs text-gray-400 truncate">{selectedRoom.client_email}</p>
                )}
              </div>

              {/* Status badge */}
              <span className={`
                shrink-0 px-2 py-1 rounded-full text-[10px] font-medium capitalize
                ${selectedRoom.status === 'active'
                  ? 'bg-green-100 text-green-600'
                  : selectedRoom.status === 'archived'
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-red-100 text-red-500'}
              `}>
                {selectedRoom.status}
              </span>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50/40">
              {messagesLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                  <Loader2 size={20} className="animate-spin text-[#C8956C]" />
                  <p className="text-xs">Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                  <AlertCircle size={18} className="text-red-400" />
                  <p className="text-xs text-red-500">{messagesError}</p>
                  <button
                    onClick={() => void fetchMessages(selectedRoom.id, true)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <MessageCircle size={20} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-0.5">Start the conversation below.</p>
                  </div>
                </div>
              ) : (
                <>
                  {messageGroups.map((group) => (
                    <div key={group.date}>
                      {/* Date divider */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200">
                          {fmtMessageDate(group.messages[0].created_at)}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {/* Messages in group */}
                      <div className="space-y-1.5">
                        {group.messages.map((msg, idx) => {
                          const isArtist = msg.sender_type === 'artist';
                          const prevMsg = group.messages[idx - 1];
                          const isSameSenderAsPrev = prevMsg?.sender_type === msg.sender_type;

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-end gap-2 ${isArtist ? 'flex-row-reverse' : 'flex-row'} ${isSameSenderAsPrev ? 'mt-0.5' : 'mt-3'}`}
                            >
                              {/* Client avatar - only show for first message in group */}
                              {!isArtist && (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSameSenderAsPrev ? 'invisible' : 'bg-gradient-to-br from-gray-200 to-gray-100'}`}>
                                  {!isSameSenderAsPrev && (
                                    <User size={12} className="text-gray-400" />
                                  )}
                                </div>
                              )}

                              {/* Bubble */}
                              <div className={`group relative max-w-[70%] sm:max-w-[65%] ${isArtist ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                                {msg.message_type === 'booking_link' ? (
                                  <div className={`
                                    px-4 py-3 rounded-2xl text-sm border
                                    ${isArtist
                                      ? 'bg-[#C8956C]/10 border-[#C8956C]/30 text-[#C8956C] rounded-br-sm'
                                      : 'bg-white border-gray-200 text-[#1a1a2e] rounded-bl-sm shadow-sm'}
                                  `}>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1 opacity-60">Booking Link</p>
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
                                  <div className={`
                                    px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                    ${isArtist
                                      ? 'bg-[#C8956C] text-white rounded-br-sm shadow-sm'
                                      : 'bg-white text-[#1a1a2e] rounded-bl-sm border border-gray-200 shadow-sm'}
                                  `}>
                                    {msg.content}
                                  </div>
                                )}

                                {/* Timestamp - shows on hover */}
                                <div className={`flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isArtist ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <Clock size={9} className="text-gray-300" />
                                  <span className="text-[10px] text-gray-400">
                                    {fmtMessageTime(msg.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} className="h-2" />
                </>
              )}
            </div>

            {/* Send error */}
            {sendError && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 shrink-0">
                <AlertCircle size={13} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-600 flex-1">{sendError}</p>
                <button onClick={() => setSendError(null)} className="text-xs text-red-400 hover:text-red-600">
                  Dismiss
                </button>
              </div>
            )}

            {/* Compose area */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
              {selectedRoom.status !== 'active' && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2 text-center">
                  This conversation is {selectedRoom.status}. You cannot send messages.
                </p>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={e => {
                      setNewMessage(e.target.value);
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedRoom.status === 'active' ? 'Type a message... (Enter to send, Shift+Enter for newline)' : 'Conversation is not active'}
                    disabled={selectedRoom.status !== 'active' || sending}
                    rows={1}
                    className="
                      w-full resize-none px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50
                      text-sm text-[#1a1a2e] placeholder-gray-400
                      focus:outline-none focus:border-[#C8956C] focus:bg-white focus:ring-1 focus:ring-[#C8956C]/20
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      min-h-[42px] max-h-[120px]
                    "
                    style={{ height: '42px' }}
                  />
                </div>
                <button
                  onClick={() => void handleSend()}
                  disabled={!newMessage.trim() || sending || selectedRoom.status !== 'active'}
                  className="
                    h-[42px] w-[42px] rounded-xl bg-[#C8956C] text-white flex items-center justify-center shrink-0
                    hover:bg-[#b8845c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-sm
                  "
                  aria-label="Send message"
                >
                  {sending
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Send size={16} />}
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-gray-300 text-right">
                Press Enter to send, Shift+Enter for newline
              </p>
            </div>
          </>
        ) : (
          /* ── Empty state: no room selected ── */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8 bg-gray-50/40">
            <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <MessageCircle size={32} className="text-[#C8956C]/40" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#1a1a2e]">Select a conversation</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Choose a client conversation from the left panel to view and reply to their messages.
              </p>
            </div>
            {/* Mobile CTA */}
            <button
              onClick={() => setMobileView('rooms')}
              className="md:hidden mt-2 px-5 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-medium hover:bg-[#b8845c] transition-colors"
            >
              View Conversations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
