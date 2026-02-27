import { useState, useEffect, useCallback } from 'react';
import {
  UserCog,
  Plus,
  Search,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  Pencil,
  UserX,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  role: 'admin' | 'artist' | 'client';
  display_name: string;
  artist_id: string | null;
  client_id: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
}

type RoleFilter = 'all' | 'admin' | 'artist' | 'client';

interface CreateUserForm {
  email: string;
  password: string;
  role: 'admin' | 'artist' | 'client';
  display_name: string;
  artist_id: string;
}

interface EditUserForm {
  display_name: string;
  email: string;
  role: 'admin' | 'artist' | 'client';
  artist_id: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getRoleBadgeClass(role: string): string {
  switch (role) {
    case 'admin':
      return 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20';
    case 'artist':
      return 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20';
    case 'client':
      return 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20';
    default:
      return 'bg-white/5 text-gray-400 ring-1 ring-white/10';
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeClass(role)}`}>
      {role}
    </span>
  );
}

function ActiveBadge({ isActive }: { isActive: number }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 ring-1 ring-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
      Inactive
    </span>
  );
}

// ─── Create User Modal ────────────────────────────────────────────────────────

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>({
    email: '',
    password: '',
    role: 'client',
    display_name: '',
    artist_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.display_name) {
      setError('Email, password, and display name are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        email: form.email,
        password: form.password,
        role: form.role,
        display_name: form.display_name,
      };
      if (form.role === 'artist' && form.artist_id) {
        body.artist_id = form.artist_id;
      }
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to create user.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#0a0a0c] rounded-2xl shadow-2xl shadow-black w-full max-w-md border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Display Name
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
              placeholder="Jane Doe"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
              placeholder="jane@example.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
                placeholder="Minimum 8 characters"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Role
            </label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as CreateUserForm['role'] })}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-white/10 bg-[#121217] text-white text-sm focus:outline-none focus:border-[#C8956C]/50 transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                <option value="client">Client</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {form.role === 'artist' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Artist ID <span className="font-normal text-gray-500 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.artist_id}
                onChange={(e) => setForm({ ...form, artist_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
                placeholder="e.g. artist-uuid or slug"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C8956C] to-[#b8855c] text-white text-sm font-bold shadow-lg shadow-[#C8956C]/20 hover:shadow-[#C8956C]/40 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit User Modal ──────────────────────────────────────────────────────────

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const [form, setForm] = useState<EditUserForm>({
    display_name: user.display_name,
    email: user.email,
    role: user.role,
    artist_id: user.artist_id ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        id: user.id,
        display_name: form.display_name,
        email: form.email,
        role: form.role,
        artist_id: form.role === 'artist' ? form.artist_id || null : null,
      };
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error ?? 'Failed to update user.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#0a0a0c] rounded-2xl shadow-2xl shadow-black w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Display Name
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Role
            </label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as EditUserForm['role'] })}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-white/10 bg-[#121217] text-white text-sm focus:outline-none focus:border-[#C8956C]/50 transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                <option value="client">Client</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {form.role === 'artist' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Artist ID <span className="font-normal text-gray-500 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.artist_id}
                onChange={(e) => setForm({ ...form, artist_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 focus:bg-white/10 transition-all duration-300"
                placeholder="e.g. artist-uuid or slug"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C8956C] to-[#b8855c] text-white text-sm font-bold shadow-lg shadow-[#C8956C]/20 hover:shadow-[#C8956C]/40 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json() as {
        success: boolean;
        data?: { users: User[] };
        error?: string;
      };
      if (!json.success || !json.data) throw new Error(json.error ?? 'Failed to load users');
      setUsers(json.data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleDeactivate = async (userId: string) => {
    if (!confirm('Deactivate this user? They will no longer be able to log in.')) return;
    setDeactivating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: 0 } : u));
      }
    } finally {
      setDeactivating(null);
    }
  };

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#C8956C] animate-spin" />
        <p className="text-sm font-medium text-gray-400 tracking-wide">Loading users...</p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 backdrop-blur-md">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-wide">Could not load users</p>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => void fetchUsers()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200 mt-2"
          >
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20 flex items-center justify-center shrink-0">
            <UserCog size={24} className="text-[#C8956C]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">User Accounts</h2>
            <p className="text-sm text-gray-400 mt-1">{users.length} {users.length === 1 ? 'user' : 'users'} found in system</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8956C] to-[#b8855c] text-white text-sm font-bold shadow-lg shadow-[#C8956C]/20 hover:shadow-[#C8956C]/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8956C]/50 transition-all duration-300"
          />
        </div>
        {/* Role Filter */}
        <div className="relative md:w-48 shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#121217] backdrop-blur-md text-sm text-white focus:outline-none focus:border-[#C8956C]/50 transition-all duration-300 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => void fetchUsers()}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 shrink-0"
        >
          <RefreshCw size={16} />
          <span className="md:hidden lg:inline">Refresh</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <UserCog size={32} className="text-gray-500" />
            </div>
            <p className="text-base font-bold text-white tracking-wide">No users found</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">
              {roleFilter !== 'all' || search ? 'Try adjusting your filters to see more results.' : 'Create your first user to populate the dashboard.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Email</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Artist ID</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Last Login</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-sm">
                            {user.display_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-white whitespace-nowrap block">{user.display_name}</span>
                          <span className="text-xs text-gray-500 sm:hidden mt-0.5">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap hidden sm:table-cell">{user.email}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {user.artist_id ? (
                        <span className="font-mono text-[11px] text-[#C8956C] bg-[#C8956C]/10 px-2 py-1 rounded truncate max-w-[140px] block border border-[#C8956C]/20">
                          {user.artist_id}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ActiveBadge isActive={user.is_active} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap hidden lg:table-cell text-[13px]">
                      {formatDate(user.last_login_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#C8956C] hover:bg-[#C8956C]/10 transition-colors"
                          title="Edit user"
                        >
                          <Pencil size={16} />
                        </button>
                        {user.is_active === 1 && (
                          <button
                            onClick={() => void handleDeactivate(user.id)}
                            disabled={deactivating === user.id}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                            title="Deactivate user"
                          >
                            {deactivating === user.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <UserX size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => void fetchUsers()}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => void fetchUsers()}
        />
      )}
    </div>
  );
}
