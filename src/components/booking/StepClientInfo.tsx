import { useState, useCallback, useRef } from 'react';
import type { BookingFormData } from '../../types/booking';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  accentColor?: string;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validateEmail(email: string): { valid: boolean; suggestion?: string } {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false };

  const domain = email.split('@')[1]?.toLowerCase();
  const suggestions: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'outllook.com': 'outlook.com',
    'outlok.com': 'outlook.com',
  };

  if (suggestions[domain]) {
    return { valid: true, suggestion: email.split('@')[0] + '@' + suggestions[domain] };
  }

  return { valid: true };
}

export function StepClientInfo({ form, updateForm, onNext, onBack, accentColor = '#C8956C' }: Props) {
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const lookupRef = useRef<ReturnType<typeof setTimeout>>();

  const handleEmailChange = useCallback((email: string) => {
    updateForm({ email });

    // Clear previous suggestion
    setEmailSuggestion(null);
    setIsReturning(false);

    // Validate
    const result = validateEmail(email);
    if (result.suggestion) {
      setEmailSuggestion(result.suggestion);
    }

    // Debounced lookup for returning clients
    if (lookupRef.current) clearTimeout(lookupRef.current);
    if (email && result.valid) {
      lookupRef.current = setTimeout(async () => {
        setIsLookingUp(true);
        try {
          const res = await fetch(`/api/booking/client-lookup?email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data?.client) {
              const c = data.data.client;
              updateForm({
                first_name: c.first_name || form.first_name,
                last_name: c.last_name || form.last_name,
                phone: c.phone || form.phone,
                date_of_birth: c.date_of_birth || form.date_of_birth,
              });
              setIsReturning(true);
            }
          }
        } catch {
          // Silently fail — manual entry still works
        } finally {
          setIsLookingUp(false);
        }
      }, 500);
    }
  }, [form.first_name, form.last_name, form.phone, form.date_of_birth, updateForm]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email).valid) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const canProceed = form.first_name && form.last_name && form.email && form.phone;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Your Information
        </h2>
        <p className="text-white/45 text-sm">We'll use this to confirm your booking</p>
      </div>

      {/* Returning client banner */}
      {isReturning && (
        <div
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}25` }}
        >
          <span className="text-2xl">👋</span>
          <div>
            <p className="text-sm font-medium text-white">Welcome back!</p>
            <p className="text-xs text-white/50">We've filled in your details from your last visit</p>
          </div>
        </div>
      )}

      {/* Email — first, enables auto-fill */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Email Address <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="your@email.com"
            className={`input-premium text-sm ${errors.email ? 'border-red-400/50' : ''}`}
          />
          {isLookingUp && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        {emailSuggestion && (
          <button
            onClick={() => {
              handleEmailChange(emailSuggestion);
              setEmailSuggestion(null);
            }}
            className="mt-1 text-xs hover:underline"
            style={{ color: accentColor }}
          >
            Did you mean {emailSuggestion}?
          </button>
        )}
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => updateForm({ first_name: e.target.value })}
            placeholder="First name"
            className={`input-premium text-sm ${errors.first_name ? 'border-red-400/50' : ''}`}
          />
          {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => updateForm({ last_name: e.target.value })}
            placeholder="Last name"
            className={`input-premium text-sm ${errors.last_name ? 'border-red-400/50' : ''}`}
          />
          {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Phone Number <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateForm({ phone: formatPhone(e.target.value) })}
          placeholder="(505) 555-0123"
          className={`input-premium text-sm ${errors.phone ? 'border-red-400/50' : ''}`}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
      </div>

      {/* Date of birth — optional */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Date of Birth <span className="text-white/25 font-normal">(optional — for birthday discounts!)</span>
        </label>
        <input
          type="date"
          value={form.date_of_birth}
          onChange={(e) => updateForm({ date_of_birth: e.target.value })}
          className="input-premium text-sm max-w-xs"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Consent note */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <div>
            <p className="text-sm text-white/50">
              A digital consent form will be sent to your email before your appointment.
            </p>
            <p className="text-xs text-white/30 mt-1">
              Required by New Mexico health regulations for all tattoo services.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canProceed
              ? 'text-black hover:brightness-110 active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={canProceed ? { background: accentColor } : undefined}
        >
          Review & Pay →
        </button>
      </div>
    </div>
  );
}
