import { useState } from 'react';
import type { BookingFormData, PriceEstimate } from '../../types/booking';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  priceEstimate: PriceEstimate | null;
  isSubmitting: boolean;
  onSubmit: (paymentMethodId?: string) => void;
  onBack: () => void;
  accentColor?: string;
  bookingId?: string | null;
}

const ARTISTS: Record<string, { name: string; image: string; accent: string }> = {
  david: { name: 'David', image: '/artists/david.jpg', accent: '#E8793A' },
  nina: { name: 'Nina', image: '/artists/nina.jpg', accent: '#feb4b4' },
  karli: { name: 'Karli', image: '/artists/karli.jpg', accent: '#4A9EBF' },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time: string): string {
  if (!time) return '—';
  const h = parseInt(time.split(':')[0]);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:00 ${ampm}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hour${h > 1 ? 's' : ''}`;
  return `${h}h ${m}min`;
}

export function StepReviewPay({
  form,
  updateForm,
  priceEstimate,
  isSubmitting,
  onSubmit,
  onBack,
  accentColor = '#C8956C',
  bookingId,
}: Props) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState(form.gift_card_code || '');
  const [giftCardApplied, setGiftCardApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const artist = ARTISTS[form.artist_id];

  // ─── Confirmation state ────────────────────
  if (bookingId) {
    return (
      <div className="space-y-8 text-center py-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: `${accentColor}15`, border: `2px solid ${accentColor}40` }}
          >
            ✓
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/50 text-sm">Your tattoo session has been secured</p>
        </div>

        {/* Booking ID */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-xs text-white/40">Booking ID:</span>
          <span className="text-sm font-mono font-bold text-white">{bookingId}</span>
          <button
            onClick={() => navigator.clipboard.writeText(bookingId)}
            className="text-white/30 hover:text-white/60 transition-colors"
            title="Copy ID"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
          </button>
        </div>

        {/* Quick summary */}
        <div className="liquid-glass-elevated rounded-2xl p-5 text-left max-w-md mx-auto space-y-3">
          {artist && (
            <div className="flex items-center gap-3 pb-3 border-b border-white/8">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center ring-2"
                style={{ backgroundImage: `url(${artist.image})`, ringColor: artist.accent }}
              />
              <div>
                <p className="text-sm font-medium text-white">{artist.name}</p>
                <p className="text-xs text-white/40">{form.service_type}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Date</span>
            <span className="text-white">{formatDate(form.scheduled_date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Time</span>
            <span className="text-white">{formatTime(form.scheduled_time)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Placement</span>
            <span className="text-white">{form.placement}</span>
          </div>
        </div>

        {/* What's next timeline */}
        <div className="text-left max-w-md mx-auto">
          <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">What's Next</h3>
          <div className="space-y-3">
            {[
              { icon: '📧', title: 'Confirmation Email', desc: 'Sent to your inbox with all details' },
              { icon: '📋', title: 'Consent Form', desc: 'Digital form sent 48h before your appointment' },
              { icon: '🎨', title: 'Prepare Your Design', desc: 'Your artist will review references and prepare' },
              { icon: '🏠', title: 'Visit Us', desc: `${formatDate(form.scheduled_date)} at ${formatTime(form.scheduled_time)}` },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                <span className="text-lg">{step.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="/"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:bg-white/5 transition-all text-center"
          >
            Return Home
          </a>
          <a
            href="/gallery"
            className="px-6 py-3 rounded-xl text-sm font-medium text-black text-center hover:brightness-110 transition-all"
            style={{ background: accentColor }}
          >
            Browse Gallery
          </a>
        </div>
      </div>
    );
  }

  // ─── Review & Payment state ────────────────
  const canSubmit = agreedToTerms && !isSubmitting;

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Review & Confirm
        </h2>
        <p className="text-white/45 text-sm">Double-check everything before securing your spot</p>
      </div>

      {/* Full Booking Summary */}
      <div className="liquid-glass-elevated rounded-2xl p-5 space-y-4">
        {/* Artist */}
        {artist && (
          <div className="flex items-center gap-3 pb-3 border-b border-white/8">
            <div
              className="w-12 h-12 rounded-xl bg-cover bg-center ring-2"
              style={{ backgroundImage: `url(${artist.image})`, ringColor: artist.accent }}
            />
            <div>
              <p className="text-base font-bold text-white">{artist.name}</p>
              <p className="text-xs text-white/40">{form.service_type}</p>
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-white/40 text-xs">Style</p>
            <p className="text-white font-medium">{form.style || form.service_type}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Size</p>
            <p className="text-white font-medium capitalize">{form.size_category}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Placement</p>
            <p className="text-white font-medium">{form.placement || '—'}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Duration</p>
            <p className="text-white font-medium">{priceEstimate ? formatDuration(priceEstimate.estimated_duration) : '—'}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Date</p>
            <p className="text-white font-medium">{formatDate(form.scheduled_date)}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Time</p>
            <p className="text-white font-medium">{formatTime(form.scheduled_time)}</p>
          </div>
        </div>

        {/* Modifiers */}
        {(form.is_cover_up || form.is_touch_up) && (
          <div className="flex gap-2 pt-2 border-t border-white/8">
            {form.is_cover_up && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                🔄 Cover-up
              </span>
            )}
            {form.is_touch_up && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                ✨ Touch-up
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {form.description && (
          <div className="pt-2 border-t border-white/8">
            <p className="text-white/40 text-xs mb-1">Description</p>
            <p className="text-sm text-white/70 line-clamp-3">{form.description}</p>
          </div>
        )}

        {/* Reference images */}
        {form.reference_images && form.reference_images.length > 0 && (
          <div className="pt-2 border-t border-white/8">
            <p className="text-white/40 text-xs mb-2">Reference Images</p>
            <div className="flex gap-2">
              {form.reference_images.map((file, i) => (
                <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Ref ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client info */}
        <div className="pt-2 border-t border-white/8 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-white/40 text-xs">Name</p>
            <p className="text-white">{form.first_name} {form.last_name}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Email</p>
            <p className="text-white text-xs break-all">{form.email}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Phone</p>
            <p className="text-white">{form.phone}</p>
          </div>
        </div>
      </div>

      {/* Itemized Price Breakdown */}
      {priceEstimate && (
        <div className="liquid-glass-elevated rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Price Breakdown</h3>

          {priceEstimate.breakdown.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-white/50">{item.label}</span>
              <span className={item.amount < 0 ? 'text-green-400 font-medium' : 'text-white/70'}>
                {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount)}
              </span>
            </div>
          ))}

          <div className="border-t border-white/8 pt-3 flex justify-between">
            <span className="text-white/60 font-medium">Estimated Total</span>
            <span className="text-white font-bold text-lg">
              ${priceEstimate.total_min} – ${priceEstimate.total_max}
            </span>
          </div>

          <div
            className="p-3 rounded-xl text-center"
            style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}30` }}
          >
            <p className="text-xs text-white/50 mb-0.5">Deposit to Secure Your Spot</p>
            <p className="text-2xl font-bold" style={{ color: accentColor }}>
              ${priceEstimate.deposit_required}
            </p>
            <p className="text-xs text-white/30 mt-0.5">Applied toward your final total</p>
          </div>
        </div>
      )}

      {/* Gift Card / Promo */}
      <div>
        <label className="block text-xs text-white/40 mb-2">Gift Card or Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="input-premium text-sm flex-1"
            disabled={giftCardApplied}
          />
          <button
            onClick={() => {
              if (giftCardCode) {
                updateForm({ gift_card_code: giftCardCode });
                setGiftCardApplied(true);
              }
            }}
            disabled={!giftCardCode || giftCardApplied}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              giftCardApplied
                ? 'bg-green-500/10 text-green-400'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {giftCardApplied ? 'Applied ✓' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Payment Method — Simulated Stripe Elements */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Payment Details</h3>

        <div>
          <label className="block text-xs text-white/40 mb-2">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCard(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="input-premium text-sm font-mono"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-2">Expiry</label>
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="input-premium text-sm font-mono"
              maxLength={5}
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">CVC</label>
            <input
              type="text"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              className="input-premium text-sm font-mono"
              maxLength={4}
            />
          </div>
        </div>

        <p className="text-xs text-white/20 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secured with Stripe — we never store your card details
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-current"
          style={{ accentColor }}
        />
        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
          I agree to the{' '}
          <a href="#" className="underline" style={{ color: accentColor }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline" style={{ color: accentColor }}>Cancellation Policy</a>.
          I understand the deposit is non-refundable for no-shows.
        </span>
      </label>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={() => onSubmit(`pm_simulated_${Date.now()}`)}
          disabled={!canSubmit}
          className={`px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            canSubmit
              ? 'text-black hover:brightness-110 active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={canSubmit ? { background: accentColor } : undefined}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ${priceEstimate?.deposit_required || 0} Deposit & Confirm</>
          )}
        </button>
      </div>
    </div>
  );
}
