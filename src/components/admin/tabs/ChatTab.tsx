import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, Circle, ChevronDown, Search, X, Loader2,
  AlertCircle, CheckCircle2, ArrowLeft, RefreshCw, Archive,
  ShieldOff, Clock, Send,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  last_message_sender_type: 'client' | 'artist' | null;
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_type: 'client' | 'artist' | 'admin';
  sender_id: string;
  content: string;
  created_at: string;
  is_read: number;
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type RoomStatus = 'active' | 'archived' | 'blocked';
type StatusFilter = '' | RoomStatus;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARTIST_FILTER_OPTIONS = [
  { id: '', label: 'All Artists' },
  { id: 'david', label: 'David' },
  { id: 'nina', label: 'Nina' },
  { id: 'karli', label: 'Karli' },
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'blocked', label: 'Blocked' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function clientDisplayName(room: ChatRoom): string {
  const name = [room.client_first_name, room.client_last_name].filter(Boolean).join(' ');
  return name || room.client_email || `Client ${room.client_id.slice(0, 8)}`;
}

function statusBadgeClass(status: RoomStatus): string {
  const map: Record<RoomStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    archived: 'bg-gray-100 text-gray-500 border-gray-200',
    blocked: 'bg-red-50 text-red-600 border-red-200',
  };
  return map[status];
}

function statusIcon(status: RoomStatus) {
  if (status === 'active') return <Circle size={8} className="fill-emerald-500 text-emerald-500" />;
  if (status === 'archived') return <Archive size={10} className="text-gray-400" />;
  return <ShieldOff size={10} className="text-red-400" />;
}

// ---------------------------------------------------------------------------
// Room Status Changer
// ---------------------------------------------------------------------------

interface StatusChangerProps {
  currentStatus: RoomStatus;
  loading: boolean;
  onChangeStatus: (status: RoomStatus) => void;
}

function StatusChanger({ currentStatus, loading, onChangeStatus }: StatusChangerProps) {
  const options: { value: RoomStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {options
        .filter((o) => o.value !== currentStatus)
        .map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChangeStatus(opt.value)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
              opt.value === 'active'
                ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                : opt.value === 'archived'
                ? 'border-gray-200 text-gray-500 hover:bg-gray-50'
                : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            {loading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : opt.value === 'archived' ? (
              <Archive size={11} />
            ) : opt.value === 'blocked' ? (
              <ShieldOff size={11} />
            ) : (
              <Circle size={8} className="fill-emerald-500 text-emerald-500" />
            )}
            Mark {opt.label}
          </button>
        ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Room Row
// ---------------------------------------------------------------------------

interface RoomRowProps {
  room: ChatRoom;
  onSelect: (room: ChatRoom) => void;
}

function RoomRow({ room, onSelect }: RoomRowProps) {
  const name = clientDisplayName(room);

  return (
    <button
      onClick={() => onSelect(room)}
      className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl bg-[#C8956C]/15 text-[#C8956C] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{name}</p>
          <span className="text-[10px] text-gray-400 shrink-0">{formatDate(room.last_message_at)}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400 truncate">
            {room.last_message_sender_type === 'artist' ? (
              <span className="text-[#C8956C] font-medium">Artist: </span>
            ) : room.last_message_sender_type === 'client' ? (
              <span className="text-gray-500 font-medium">Client: </span>
            ) : null}
            {room.last_message ?? 'No messages yet'}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {room.unread_count > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#C8956C] text-white text-[10px] font-bold flex items-center justify-center">
                {room.unread_count > 99 ? '99+' : room.unread_count}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${statusBadgeClass(room.status)}`}
            >
              {statusIcon(room.status)}
              {room.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-gray-400 capitalize">Artist: {room.artist_id}</span>
          {room.client_email && (
            <span className="text-[10px] text-gray-400 truncate">{room.client_email}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Message Bubble
// ---------------------------------------------------------------------------

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isClient = message.sender_type === 'client';
  const isAdmin = message.sender_type === 'admin';

  return (
    <div className={`flex ${isClient ? 'justify-start' : 'justify-end'} mb-3`}>
      <div className={`max-w-[75%] ${isClient ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isClient
              ? 'bg-gray-100 text-[#1a1a2e] rounded-tl-sm'
              : isAdmin
              ? 'bg-gray-200 text-gray-700 rounded-br-sm'
              : 'bg-[#C8956C] text-white rounded-br-sm'
          }`}
        >
          {message.content}
        </div>
        <p className={`text-[10px] text-gray-400 mt-1 ${isClient ? 'text-left' : 'text-right'}`}>
          <span className="capitalize font-medium">{message.sender_type}</span>
          {' · '}
          {formatFullDate(message.created_at)}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Room Detail View
// ---------------------------------------------------------------------------

interface RoomDetailProps {
  room: ChatRoom;
  onBack: () => void;
  onStatusChanged: (roomId: string, status: RoomStatus) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

function RoomDetail({ room, onBack, onStatusChanged, onError, onSuccess }: RoomDetailProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<RoomStatus>(room.status);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchMessages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ room_id: room.id, page: String(p), per_page: '50' });
      const res = await fetch(`/api/admin/chat?${params}`);
      const data = (await res.json()) as ApiResponse<{ messages: ChatMessage[]; pagination: Pagination }>;
      if (data.success && data.data) {
        setMessages((prev) => (p === 1 ? data.data!.messages : [...data.data!.messages, ...prev]));
        setPagination(data.data.pagination);
      } else {
        onError(data.error ?? 'Failed to load messages.');
      }
    } catch {
      onError('Network error loading messages.');
    } finally {
      setLoading(false);
    }
  }, [room.id, onError]);

  useEffect(() => {
    void fetchMessages(1);
  }, [fetchMessages]);

  const handleChangeStatus = async (status: RoomStatus) => {
    setChangingStatus(true);
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: room.id, status }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setCurrentStatus(status);
        onStatusChanged(room.id, status);
        onSuccess(`Room marked as ${status}.`);
      } else {
        onError(data.error ?? 'Status update failed.');
      }
    } catch {
      onError('Network error.');
    } finally {
      setChangingStatus(false);
    }
  };

  const clientName = clientDisplayName(room);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-[#C8956C]/15 text-[#C8956C] flex items-center justify-center text-sm font-bold">
            {clientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">{clientName}</p>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span>Artist: {room.artist_id}</span>
              {room.client_email && <span>{room.client_email}</span>}
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${statusBadgeClass(currentStatus)}`}>
                {statusIcon(currentStatus)}
                {currentStatus}
              </span>
            </div>
          </div>
        </div>

        <StatusChanger
          currentStatus={currentStatus}
          loading={changingStatus}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      {/* Load older */}
      {pagination && pagination.page < pagination.total_pages && (
        <div className="text-center mb-3">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              void fetchMessages(nextPage);
            }}
            className="text-xs text-[#C8956C] hover:underline"
          >
            Load older messages
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-[300px] max-h-[500px] pr-1">
        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-[#C8956C]/30 border-t-[#C8956C] animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare size={24} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No messages in this room yet.</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Meta footer */}
      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          Created {formatFullDate(room.created_at)}
        </span>
        {room.unread_count > 0 && (
          <span className="flex items-center gap-1 text-[#C8956C] font-medium">
            <Send size={11} />
            {room.unread_count} unread
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ChatTab() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const [filterArtist, setFilterArtist] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('');
  const [search, setSearch] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/chat');
      const data = (await res.json()) as ApiResponse<{ rooms: ChatRoom[] }>;
      if (data.success && data.data) {
        setRooms(data.data.rooms);
      } else {
        setError(data.error ?? 'Failed to load chat rooms.');
      }
    } catch {
      setError('Network error. Could not load chats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const handleStatusChanged = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r)),
    );
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterArtist && room.artist_id !== filterArtist) return false;
    if (filterStatus && room.status !== filterStatus) return false;
    if (search) {
      const name = clientDisplayName(room).toLowerCase();
      const email = (room.client_email ?? '').toLowerCase();
      const q = search.toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  const totalUnread = rooms.reduce((sum, r) => sum + r.unread_count, 0);

  const selectClass =
    'pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] appearance-none focus:outline-none focus:border-[#C8956C] transition-colors';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      {!selectedRoom && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
              Chat Rooms
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#C8956C] text-white text-xs font-bold">
                  {totalUnread}
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? 'Loading...' : `${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''}${filterArtist || filterStatus || search ? ' (filtered)' : ''}`}
            </p>
          </div>
          <button
            onClick={() => void fetchRooms()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      )}

      {/* Room Detail */}
      {selectedRoom ? (
        <RoomDetail
          room={selectedRoom}
          onBack={() => setSelectedRoom(null)}
          onStatusChanged={handleStatusChanged}
          onError={(msg) => showToast(msg, 'error')}
          onSuccess={(msg) => showToast(msg)}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={filterArtist}
                onChange={(e) => setFilterArtist(e.target.value)}
                className={selectClass}
              >
                {ARTIST_FILTER_OPTIONS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                className={selectClass}
              >
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by client name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#C8956C] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {(filterArtist || filterStatus || search) && (
              <button
                onClick={() => { setFilterArtist(''); setFilterStatus(''); setSearch(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredRooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">No chat rooms found</p>
              <p className="text-xs text-gray-400 mt-1">
                {filterArtist || filterStatus || search
                  ? 'Try clearing the filters.'
                  : 'Chats will appear here once clients start conversations.'}
              </p>
            </div>
          )}

          {/* Room list */}
          {!loading && filteredRooms.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {filteredRooms.map((room) => (
                <RoomRow
                  key={room.id}
                  room={room}
                  onSelect={setSelectedRoom}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-[#1a1a2e] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={15} className="text-[#C8956C]" />
          ) : (
            <AlertCircle size={15} />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
