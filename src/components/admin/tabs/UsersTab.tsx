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
      return 'bg-red-50 text-red-700 ring-1 ring-red-200';
    case 'artist':
      return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200';
    case 'client':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
    default:
      return 'bg-gray-50 text-gray-600 ring-1 ring-gray-200';
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 ring-1 ring-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#1a1a2e]">Create User Account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
              placeholder="Jane Doe"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
              placeholder="jane@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
                placeholder="Minimum 8 characters"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Role
            </label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as CreateUserForm['role'] })}
                className="w-full appearance-none px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
                disabled={loading}
              >
                <option value="client">Client</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {form.role === 'artist' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Artist ID <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={form.artist_id}
                onChange={(e) => setForm({ ...form, artist_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
                placeholder="e.g. artist-uuid or slug"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#1a1a2e]">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Role
            </label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as EditUserForm['role'] })}
                className="w-full appearance-none px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
                disabled={loading}
              >
                <option value="client">Client</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {form.role === 'artist' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Artist ID <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={form.artist_id}
                onChange={(e) => setForm({ ...form, artist_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors"
                placeholder="e.g. artist-uuid or slug"
                disabled={loading}
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
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
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#C8956C]" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">Could not load users</p>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={() => void fetchUsers()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C8956C]/10 flex items-center justify-center">
            <UserCog size={18} className="text-[#C8956C]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">User Accounts</h2>
            <p className="text-xs text-gray-500">{users.length} {users.length === 1 ? 'user' : 'users'} found</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#C8956C] transition-colors"
          />
        </div>
        {/* Role Filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="appearance-none pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#C8956C] transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="artist">Artist</option>
            <option value="client">Client</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <button
          onClick={() => void fetchUsers()}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C8956C] transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center">
            <UserCog size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No users found</p>
            <p className="text-xs text-gray-400 mt-1">
              {roleFilter !== 'all' || search ? 'Try adjusting your filters.' : 'Create the first user to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Artist ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Last Login</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#C8956C]/15 flex items-center justify-center shrink-0">
                          <span className="text-[#C8956C] font-semibold text-xs">
                            {user.display_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-[#1a1a2e] whitespace-nowrap">{user.display_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs hidden md:table-cell">
                      {user.artist_id
                        ? <span className="truncate max-w-[120px] block">{user.artist_id}</span>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      <ActiveBadge isActive={user.is_active} />
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap hidden lg:table-cell">
                      {formatDate(user.last_login_at)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditUser(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#C8956C] hover:bg-[#C8956C]/10 transition-colors"
                          title="Edit user"
                        >
                          <Pencil size={14} />
                        </button>
                        {user.is_active === 1 && (
                          <button
                            onClick={() => void handleDeactivate(user.id)}
                            disabled={deactivating === user.id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                            title="Deactivate user"
                          >
                            {deactivating === user.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <UserX size={14} />
                            }
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
