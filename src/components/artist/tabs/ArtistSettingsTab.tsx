import { useState, useEffect, useRef } from 'react';
import {
  User,
  Lock,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  email: string;
  role: string;
  artist_id: string | null;
  client_id: string | null;
  display_name: string;
  avatar_url: string | null;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileForm {
  display_name: string;
  avatar_url: string;
}

interface PasswordForm {
  current_password: string;
  password: string;
  confirm_password: string;
}

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ArtistSettingsTabProps {
  session: {
    user_id: string;
    email: string;
    role: string;
    display_name: string;
    artist_id?: string;
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Toast Component ───────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto
            animate-in slide-in-from-bottom-2 fade-in duration-200
            ${toast.type === 'success'
              ? 'bg-white border-emerald-100 text-emerald-800'
              : 'bg-white border-red-100 text-red-800'
            }
          `}
        >
          {toast.type === 'success'
            ? <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            : <AlertCircle size={16} className="text-red-500 shrink-0" />
          }
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <div className="w-9 h-9 rounded-lg bg-[#C8956C]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={18} className="text-[#C8956C]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1a1a2e]">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Field Components ──────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReadOnlyField({ value }: { value: string }) {
  return (
    <div className="w-full px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-500 select-all font-mono">
      {value || <span className="text-gray-300 italic font-sans">—</span>}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1a1a2e] text-sm placeholder-gray-400 focus:outline-none focus:border-[#C8956C] focus:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

// ─── Main Component ────────────────────────────────────────────────────────────

export function ArtistSettingsTab({ session }: ArtistSettingsTabProps) {
  // ── State ───────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    display_name: '',
    avatar_url: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    password: '',
    confirm_password: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // ── Toast helpers ────────────────────────────────────────────────────────────
  const pushToast = (type: ToastType, message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Fetch profile ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setLoadError(null);
      try {
        const res = await fetch('/api/artist/profile');
        const data = await res.json() as {
          success: boolean;
          data?: { user: UserProfile };
          error?: string;
        };
        if (cancelled) return;
        if (!data.success || !data.data) {
          throw new Error(data.error ?? 'Failed to load profile');
        }
        const user = data.data.user;
        setProfile(user);
        setProfileForm({
          display_name: user.display_name ?? '',
          avatar_url: user.avatar_url ?? '',
        });
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load profile');
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    void fetchProfile();
    return () => { cancelled = true; };
  }, []);

  // ── Save profile ─────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.display_name.trim()) {
      pushToast('error', 'Display name is required.');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch('/api/artist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: profileForm.display_name.trim(),
          avatar_url: profileForm.avatar_url.trim() || null,
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        pushToast('success', 'Profile updated successfully.');
        if (profile) {
          setProfile({
            ...profile,
            display_name: profileForm.display_name.trim(),
            avatar_url: profileForm.avatar_url.trim() || null,
          });
        }
      } else {
        pushToast('error', data.error ?? 'Failed to update profile.');
      }
    } catch {
      pushToast('error', 'Connection error. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Save password ─────────────────────────────────────────────────────────────
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.current_password) {
      pushToast('error', 'Current password is required.');
      return;
    }
    if (passwordForm.password.length < 8) {
      pushToast('error', 'New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.password !== passwordForm.confirm_password) {
      pushToast('error', 'New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/artist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: passwordForm.password,
          current_password: passwordForm.current_password,
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        pushToast('success', 'Password changed successfully.');
        setPasswordForm({ current_password: '', password: '', confirm_password: '' });
        setShowCurrentPw(false);
        setShowNewPw(false);
        setShowConfirmPw(false);
      } else {
        pushToast('error', data.error ?? 'Failed to change password.');
      }
    } catch {
      pushToast('error', 'Connection error. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#C8956C]" />
          <p className="text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">Could not load settings</p>
            <p className="text-xs text-gray-500 mt-1">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="max-w-2xl space-y-6">

        {/* ── Profile Section ─────────────────────────────────────────────── */}
        <SectionCard
          icon={User}
          title="Profile Information"
          description="Update your public display name and avatar."
        >
          <form onSubmit={(e) => void handleSaveProfile(e)} className="space-y-4">

            {/* Avatar preview + URL */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#C8956C]/15 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#C8956C]/20">
                {profileForm.avatar_url ? (
                  <img
                    src={profileForm.avatar_url}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[#C8956C] font-bold text-xl select-none">
                    {(profileForm.display_name || session.display_name).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a2e] truncate">
                  {profileForm.display_name || session.display_name}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5 capitalize">{session.role}</p>
              </div>
            </div>

            <FormField label="Display Name" required>
              <input
                type="text"
                value={profileForm.display_name}
                onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                className={inputClass}
                placeholder="Your public name"
                disabled={savingProfile}
                maxLength={80}
              />
            </FormField>

            <FormField label="Avatar URL">
              <input
                type="url"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                className={inputClass}
                placeholder="https://example.com/avatar.jpg"
                disabled={savingProfile}
              />
              <p className="text-xs text-gray-400 mt-1">Paste a direct image URL. Leave blank to use initials.</p>
            </FormField>

            <FormField label="Email Address">
              <ReadOnlyField value={session.email} />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed from this panel.</p>
            </FormField>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-60"
              >
                {savingProfile
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Save size={15} />
                }
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ── Password Section ─────────────────────────────────────────────── */}
        <SectionCard
          icon={Lock}
          title="Change Password"
          description="Use a strong password with at least 8 characters."
        >
          <form onSubmit={(e) => void handleSavePassword(e)} className="space-y-4">

            <FormField label="Current Password" required>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className={`${inputClass} pr-10`}
                  placeholder="Your current password"
                  disabled={savingPassword}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            <FormField label="New Password" required>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                  placeholder="At least 8 characters"
                  disabled={savingPassword}
                  autoComplete="new-password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showNewPw ? 'Hide password' : 'Show password'}
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength hint */}
              {passwordForm.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5">
                  {[4, 8, 12].map((threshold, i) => (
                    <div
                      key={threshold}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordForm.password.length >= threshold
                          ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 shrink-0">
                    {passwordForm.password.length < 4
                      ? 'Too short'
                      : passwordForm.password.length < 8
                      ? 'Weak'
                      : passwordForm.password.length < 12
                      ? 'Good'
                      : 'Strong'}
                  </span>
                </div>
              )}
            </FormField>

            <FormField label="Confirm New Password" required>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className={`${inputClass} pr-10 ${
                    passwordForm.confirm_password.length > 0 &&
                    passwordForm.confirm_password !== passwordForm.password
                      ? 'border-red-300 bg-red-50 focus:border-red-400'
                      : ''
                  }`}
                  placeholder="Repeat new password"
                  disabled={savingPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordForm.confirm_password.length > 0 &&
                passwordForm.confirm_password !== passwordForm.password && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                )}
            </FormField>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a4e] transition-colors disabled:opacity-60"
              >
                {savingPassword
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Lock size={15} />
                }
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ── Account Info Section ─────────────────────────────────────────── */}
        <SectionCard
          icon={Shield}
          title="Account Information"
          description="Read-only details about your account."
        >
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

            <div>
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Artist ID
              </dt>
              <dd className="text-sm text-[#1a1a2e] font-mono break-all">
                {session.artist_id ?? profile?.artist_id ?? (
                  <span className="text-gray-300 font-sans italic">Not linked</span>
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Role
              </dt>
              <dd>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-purple-50 text-purple-700 ring-1 ring-purple-200">
                  {session.role}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Member Since
              </dt>
              <dd className="text-sm text-[#1a1a2e]">
                {formatDateShort(profile?.created_at ?? null)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Last Login
              </dt>
              <dd className="text-sm text-[#1a1a2e]">
                {formatDate(profile?.last_login_at ?? null)}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Account Status
              </dt>
              <dd>
                {profile?.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 ring-1 ring-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Inactive
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </SectionCard>

      </div>

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
