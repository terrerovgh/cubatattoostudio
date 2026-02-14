import { useState, useCallback } from 'react';
import type { BookingFormData, SizeCategory, PriceEstimate } from '../../types/booking';
import { StepServiceSelect } from './StepServiceSelect';
import { StepConsultation } from './StepConsultation';
import { StepCalendar } from './StepCalendar';
import { StepPayment } from './StepPayment';
import { StepConfirmation } from './StepConfirmation';
import { calculatePriceEstimate } from '../../lib/pricing';

const STEPS = [
  { id: 'service', label: 'Artist & Service', icon: '✦' },
  { id: 'details', label: 'Your Tattoo', icon: '◇' },
  { id: 'schedule', label: 'Schedule', icon: '◈' },
  { id: 'payment', label: 'Payment', icon: '⬡' },
  { id: 'confirm', label: 'Confirmed', icon: '✓' },
];

const INITIAL_FORM: BookingFormData = {
  artist_id: '',
  service_type: '',
  style: '',
  description: '',
  placement: '',
  size_category: 'medium' as SizeCategory,
  size_inches: '',
  is_cover_up: false,
  is_touch_up: false,
  reference_images: [],
  scheduled_date: '',
  scheduled_time: '',
  estimated_duration: 120,
  deposit_amount: 0,
  payment_method: 'card',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
};

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BookingFormData>(INITIAL_FORM);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateForm = useCallback((updates: Partial<BookingFormData>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };

      // Recalculate price when relevant fields change
      if (
        updates.size_category !== undefined ||
        updates.style !== undefined ||
        updates.is_cover_up !== undefined ||
        updates.is_touch_up !== undefined ||
        updates.scheduled_date !== undefined ||
        updates.scheduled_time !== undefined
      ) {
        const estimate = calculatePriceEstimate({
          size: next.size_category,
          style: next.style || next.service_type,
          isCoverUp: next.is_cover_up,
          isTouchUp: next.is_touch_up,
          date: next.scheduled_date || undefined,
          time: next.scheduled_time || undefined,
        });
        setPriceEstimate(estimate);
        next.deposit_amount = estimate.deposit_required;
        next.estimated_duration = estimate.total_min > 500 ? 480 : estimate.total_min > 250 ? 240 : 120;
      }

      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(async (paymentMethodId?: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_data: form,
          stripe_payment_method_id: paymentMethodId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setBookingId(data.data.booking.id);
      setStep(4); // Confirmation step
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12 px-4">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-500
                  ${i < step
                    ? 'bg-[#C8956C] text-black'
                    : i === step
                      ? 'bg-[#C8956C]/20 text-[#C8956C] ring-2 ring-[#C8956C]/50'
                      : 'bg-white/5 text-white/30'
                  }
                `}
              >
                {i < step ? '✓' : s.icon}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${i <= step ? 'text-white/80' : 'text-white/30'}
                `}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`
                  flex-1 h-px mx-3 mt-[-20px] transition-colors duration-500
                  ${i < step ? 'bg-[#C8956C]/60' : 'bg-white/10'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 0 && (
          <StepServiceSelect
            form={form}
            updateForm={updateForm}
            onNext={handleNext}
          />
        )}
        {step === 1 && (
          <StepConsultation
            form={form}
            updateForm={updateForm}
            priceEstimate={priceEstimate}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 2 && (
          <StepCalendar
            form={form}
            updateForm={updateForm}
            priceEstimate={priceEstimate}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepPayment
            form={form}
            updateForm={updateForm}
            priceEstimate={priceEstimate}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepConfirmation
            form={form}
            bookingId={bookingId}
            priceEstimate={priceEstimate}
          />
        )}
      </div>
    </div>
  );
}
