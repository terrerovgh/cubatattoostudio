import { useState } from 'react';
import type { BookingFormData, PriceEstimate } from '../../types/booking';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  priceEstimate: PriceEstimate | null;
  isSubmitting: boolean;
  onSubmit: (paymentMethodId?: string) => void;
  onBack: () => void;
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: '💳' },
  { id: 'apple_pay', label: 'Apple Pay', desc: 'Pay with Apple Pay', icon: '' },
  { id: 'google_pay', label: 'Google Pay', desc: 'Pay with Google Pay', icon: '🔵' },
];

export function StepPayment({ form, updateForm, priceEstimate, isSubmitting, onSubmit, onBack }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(`${form.first_name} ${form.last_name}`);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardApplied, setGiftCardApplied] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const deposit = priceEstimate?.deposit_required || 50;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const isCardValid = cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvc.length >= 3 && cardName;

  const canSubmit = agreeTerms && (form.payment_method !== 'card' || isCardValid);

  const handleSubmit = () => {
    // In production, this would use Stripe.js to create a PaymentMethod
    // and pass the paymentMethodId to onSubmit
    onSubmit('pm_simulated_' + Date.now());
  };

  return (
    <div className="space-y-8">
      {/* Booking Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Artist</span>
            <span className="text-white capitalize">{form.artist_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Service</span>
            <span className="text-white">{form.service_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Placement</span>
            <span className="text-white">{form.placement}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Size</span>
            <span className="text-white capitalize">{form.size_category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Date & Time</span>
            <span className="text-white">
              {form.scheduled_date && new Date(form.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {' '}at {form.scheduled_time && (() => {
                const [h, m] = form.scheduled_time.split(':').map(Number);
                const period = h >= 12 ? 'PM' : 'AM';
                const hour = h > 12 ? h - 12 : h;
                return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
              })()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Estimated Duration</span>
            <span className="text-white">{form.estimated_duration >= 60 ? `${Math.round(form.estimated_duration / 60)} hours` : `${form.estimated_duration} min`}</span>
          </div>

          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Estimated Range</span>
              <span className="text-white font-medium">
                ${priceEstimate?.total_min || 0} — ${priceEstimate?.total_max || 0}
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between">
              <span className="text-white font-bold">Deposit Due Now</span>
              <span className="text-[#C8956C] font-bold text-xl">${deposit}</span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Deposit applies to final cost. Non-refundable within 48h of appointment.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => updateForm({ payment_method: method.id })}
              className={`
                p-4 rounded-xl text-left transition-all duration-300 min-h-[64px]
                ${form.payment_method === method.id
                  ? 'bg-[#C8956C]/15 border border-[#C8956C]/40'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <span className="text-xl">{method.icon}</span>
              <h4 className={`font-semibold text-sm mt-2 ${form.payment_method === method.id ? 'text-[#C8956C]' : 'text-white'}`}>
                {method.label}
              </h4>
              <p className="text-white/40 text-xs mt-0.5">{method.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {form.payment_method === 'card' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Name on Card</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="input-premium w-full"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="input-premium w-full font-mono"
              placeholder="4242 4242 4242 4242"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Expiry</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                className="input-premium w-full font-mono"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">CVC</label>
              <input
                type="text"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input-premium w-full font-mono"
                placeholder="123"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40 pt-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by Stripe — your card info never touches our servers</span>
          </div>
        </div>
      )}

      {/* Gift Card */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-sm text-white/55 mb-3">Have a gift card or promo code?</p>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
            className="input-premium flex-1 font-mono"
            placeholder="ENTER CODE"
          />
          <button
            onClick={() => setGiftCardApplied(true)}
            className="px-5 py-3 rounded-xl bg-white/5 text-white/60 font-medium text-sm hover:bg-white/10 active:bg-white/15 transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        {giftCardApplied && (
          <p className="mt-2 text-sm text-green-400">Gift card will be verified at checkout</p>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer min-h-[48px] py-1">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs mt-0.5 ${agreeTerms ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
          {agreeTerms && '✓'}
        </div>
        <span className="text-sm text-white/60 leading-relaxed">
          I agree to the <a href="#" className="text-[#C8956C] underline">cancellation policy</a>. The deposit is non-refundable if cancelled within 48 hours of the appointment. I understand that the final price may vary based on the complexity and duration of the session.
        </span>
      </label>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3.5 sm:py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors text-center"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`
            w-full sm:w-auto px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
            ${canSubmit && !isSubmitting
              ? 'bg-[#C8956C] text-black hover:bg-[#DABA8F] active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ${deposit} Deposit & Confirm</>
          )}
        </button>
      </div>
    </div>
  );
}
