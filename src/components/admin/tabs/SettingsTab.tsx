import { useState, useEffect, useCallback } from 'react';
import {
  User,
  Lock,
  Building2,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Camera,
  ShieldCheck,
  Clock,
  Globe,
  DollarSign,
  BadgeCheck,
  Hash,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProfileUser {
  id: string;
  email: string;
  role: string;
  display_name: string;
  avatar_url: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SettingsTabProps {
  session: {
    user_id: string;
    email: string;
    role: string;
    display_name: string;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function avatarFallback(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

function roleColor(role: string): string {
  switch (role) {
    case 'admin':
      return 'bg-red-50 text-red-700 ring-1 ring-red-200';
    case 'artist':
      return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200';
    default:
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
  }
}

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const readonlyInputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50/50 text-gray-500 text-sm cursor-not-allowed select-none';
const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 rounded-lg bg-[#C8956C]/10 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a2e]">{title}</p>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline alert
// ---------------------------------------------------------------------------

interface InlineAlertProps {
  type: 'success' | 'error';
  message: string;
}

function InlineAlert({ type, message }: InlineAlertProps) {
  if (type === 'success') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-700">{message}</p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
      <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile Section
// ---------------------------------------------------------------------------

interface ProfileSectionProps {
  profile: ProfileUser;
  onSaved: (updated: ProfileUser) => void;
}

function getSafeAvatarUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    // Invalid URL, fall through to return empty string
  }
  return '';
}

function ProfileSection({ profile, onSaved }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isDirty =
    displayName.trim() !== profile.display_name || avatarUrl.trim() !== (profile.avatar_url ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setAlert({ type: 'error', message: 'Display name cannot be empty.' });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const body: Record<string, string> = {};
      if (displayName.trim() !== profile.display_name) body.display_name = displayName.trim();
      if (avatarUrl.trim() !== (profile.avatar_url ?? '')) body.avatar_url = avatarUrl.trim();

      const res = await fetch('/api/artist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as ApiResponse<{ updated: boolean }>;

      if (data.success) {
        onSaved({ ...profile, display_name: displayName.trim(), avatar_url: avatarUrl.trim() || null });
        setAlert({ type: 'success', message: 'Profile updated successfully.' });
      } else {
        setAlert({ type: 'error', message: data.error ?? 'Failed to update profile.' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const showAvatar = !!getSafeAvatarUrl(avatarUrl) && !imgError;

  return (
    <Section
      icon={<User size={16} className="text-[#C8956C]" />}
      title="Profile"
      description="Update your public display name and avatar."
    >
      <form onSubmit={(e) => void handleSave(e)} className="space-y-5">
        {alert && <InlineAlert type={alert.type} message={alert.message} />}

        {/* Avatar preview + URL */}
        <div className="flex items-start gap-4">
          {/* Avatar circle */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#C8956C]/15 flex items-center justify-center overflow-hidden border-2 border-[#C8956C]/20">
              {showAvatar ? (
                <img
                  src={getSafeAvatarUrl(avatarUrl)}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-[#C8956C] font-bold text-xl">
                  {avatarFallback(displayName || 'A')}
                </span>
              )}
            </div>
          </div>

          {/* Avatar URL */}
          <div className="flex-1 min-w-0">
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Camera size={11} />
                Avatar URL
              </span>
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => { setAvatarUrl(e.target.value); setImgError(false); }}
              placeholder="https://example.com/avatar.jpg"
              className={inputClass}
              disabled={loading}
            />
            <p className="text-[10px] text-gray-400 mt-1">Paste a direct link to an image.</p>
          </div>
        </div>

        {/* Display name */}
        <div>
          <label className={labelClass}>Display Name *</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
            disabled={loading}
          />
        </div>

        {/* Email — read only */}
        <div>
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={profile.email}
              readOnly
              className={readonlyInputClass}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              read-only
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Contact a super-admin to change your email.</p>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#C8956C]/20"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Password Section
// ---------------------------------------------------------------------------

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const newPasswordStrength: 'weak' | 'medium' | 'strong' | null = newPassword
    ? newPassword.length < 8
      ? 'weak'
      : newPassword.length < 12
      ? 'medium'
      : 'strong'
    : null;

  const strengthConfig = {
    weak: { label: 'Too short', color: 'text-red-500', bars: 1 },
    medium: { label: 'Medium', color: 'text-amber-500', bars: 2 },
    strong: { label: 'Strong', color: 'text-emerald-600', bars: 3 },
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!currentPassword) {
      setAlert({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 8) {
      setAlert({ type: 'error', message: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/artist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: newPassword,
          current_password: currentPassword,
        }),
      });
      const data = (await res.json()) as ApiResponse<{ updated: boolean }>;

      if (data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setAlert({ type: 'success', message: 'Password changed successfully.' });
      } else {
        setAlert({ type: 'error', message: data.error ?? 'Failed to change password.' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      icon={<Lock size={16} className="text-[#C8956C]" />}
      title="Change Password"
      description="Use a strong password of at least 8 characters."
    >
      <form onSubmit={(e) => void handleChangePassword(e)} className="space-y-4">
        {alert && <InlineAlert type={alert.type} message={alert.message} />}

        {/* Current password */}
        <div>
          <label className={labelClass}>Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className={`${inputClass} pr-10`}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className={labelClass}>New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className={`${inputClass} pr-10`}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Strength indicator */}
          {newPasswordStrength && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      bar <= strengthConfig[newPasswordStrength].bars
                        ? newPasswordStrength === 'weak'
                          ? 'bg-red-400'
                          : newPasswordStrength === 'medium'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-[10px] font-medium ${strengthConfig[newPasswordStrength].color}`}>
                {strengthConfig[newPasswordStrength].label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`${inputClass} pr-10 ${
                confirmPassword && confirmPassword !== newPassword
                  ? 'border-red-300 focus:border-red-400'
                  : ''
              }`}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-[10px] text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Studio Settings Section (read-only placeholders)
// ---------------------------------------------------------------------------

interface StudioSettingsRow {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StudioSettingsSection() {
  const rows: StudioSettingsRow[] = [
    { icon: <Building2 size={14} className="text-gray-400" />, label: 'Studio Name', value: 'Cuba Tattoo Studio' },
    { icon: <Globe size={14} className="text-gray-400" />, label: 'Timezone', value: 'America/Havana (UTC-5)' },
    { icon: <DollarSign size={14} className="text-gray-400" />, label: 'Currency', value: 'USD — US Dollar ($)' },
  ];

  return (
    <Section
      icon={<Building2 size={16} className="text-[#C8956C]" />}
      title="Studio Settings"
      description="Global studio configuration. Contact support to update these."
    >
      <div className="space-y-3">
        {rows.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              {icon}
              <span>{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a2e]">{value}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">read-only</span>
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-400 pt-1">
          These settings are managed at the infrastructure level and cannot be changed from the dashboard.
        </p>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Account Info Section
// ---------------------------------------------------------------------------

interface AccountInfoSectionProps {
  profile: ProfileUser;
}

function AccountInfoSection({ profile }: AccountInfoSectionProps) {
  const rows = [
    {
      icon: <Hash size={14} className="text-gray-400" />,
      label: 'User ID',
      value: profile.id,
      mono: true,
    },
    {
      icon: <BadgeCheck size={14} className="text-gray-400" />,
      label: 'Role',
      value: profile.role,
      badge: true,
    },
    {
      icon: <Clock size={14} className="text-gray-400" />,
      label: 'Member Since',
      value: formatDateShort(profile.created_at),
      mono: false,
    },
    {
      icon: <Clock size={14} className="text-gray-400" />,
      label: 'Last Login',
      value: formatDate(profile.last_login_at),
      mono: false,
    },
  ];

  return (
    <Section
      icon={<Info size={16} className="text-[#C8956C]" />}
      title="Account Info"
      description="Read-only metadata about this account."
    >
      <div className="space-y-0">
        {rows.map(({ icon, label, value, mono, badge }) => (
          <div
            key={label}
            className="flex items-start justify-between py-3 border-b border-gray-50 last:border-b-0 gap-4"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
              {icon}
              <span>{label}</span>
            </div>
            <div className="text-right min-w-0">
              {badge ? (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(value)}`}>
                  {value}
                </span>
              ) : (
                <span
                  className={`text-sm font-medium text-[#1a1a2e] break-all ${mono ? 'font-mono text-xs text-gray-600' : ''}`}
                >
                  {value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export function SettingsTab({ session }: SettingsTabProps) {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/artist/profile');
      const data = (await res.json()) as ApiResponse<{ user: ProfileUser }>;
      if (data.success && data.data?.user) {
        setProfile(data.data.user);
      } else {
        // Fallback to session data if API is unavailable
        setProfile({
          id: session.user_id,
          email: session.email,
          role: session.role,
          display_name: session.display_name,
          avatar_url: null,
          is_active: 1,
          last_login_at: null,
          created_at: new Date().toISOString(),
          updated_at: null,
        });
        setFetchError(data.error ?? '');
      }
    } catch {
      // Graceful fallback — use session data
      setProfile({
        id: session.user_id,
        email: session.email,
        role: session.role,
        display_name: session.display_name,
        avatar_url: null,
        is_active: 1,
        last_login_at: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      });
    } finally {
      setLoading(false);
    }
  }, [session.user_id, session.email, session.role, session.display_name]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-[#C8956C]/30 border-t-[#C8956C] animate-spin" />
          <p className="text-sm text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e]">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account and studio preferences.</p>
      </div>

      {/* Soft warning if profile loaded from session fallback */}
      {fetchError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            Profile data is temporarily unavailable. Showing cached session info. Changes may not persist until the API is restored.
          </p>
        </div>
      )}

      {/* 1. Profile */}
      <ProfileSection profile={profile} onSaved={setProfile} />

      {/* 2. Password */}
      <PasswordSection />

      {/* 3. Studio settings */}
      <StudioSettingsSection />

      {/* 4. Account info */}
      <AccountInfoSection profile={profile} />
    </div>
  );
}
