import { useState, useCallback, useRef, useEffect } from 'react';
import type { BookingFormData, SizeCategory, PriceEstimate } from '../../types/booking';
import { StepServiceSelect } from './StepServiceSelect';
import { StepConsultation } from './StepConsultation';
import { StepCalendar } from './StepCalendar';
import { StepPayment } from './StepPayment';
import { StepConfirmation } from './StepConfirmation';
import { calculatePriceEstimate } from '../../lib/pricing';

const STEPS = [
  { id: 'service', label: 'Artist & Service', shortLabel: 'Artist' },
  { id: 'details', label: 'Your Tattoo', shortLabel: 'Details' },
  { id: 'schedule', label: 'Schedule', shortLabel: 'Date' },
  { id: 'payment', label: 'Payment', shortLabel: 'Pay' },
  { id: 'confirm', label: 'Confirmed', shortLabel: 'Done' },
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
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateForm = useCallback((updates: Partial<BookingFormData>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };

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

  const animateStep = useCallback((newStep: number, dir: 'forward' | 'back') => {
    setDirection(dir);
    setAnimating(true);
    // Short timeout for exit animation
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
      // Scroll to top of wizard
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, []);

  const handleNext = useCallback(() => {
    setError(null);
    animateStep(Math.min(step + 1, STEPS.length - 1), 'forward');
  }, [step, animateStep]);

  const handleBack = useCallback(() => {
    setError(null);
    animateStep(Math.max(step - 1, 0), 'back');
  }, [step, animateStep]);

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

      const data = await res.json() as any;

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setBookingId(data.data.booking.id);
      animateStep(4, 'forward');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, animateStep]);

  // Progress percentage
  const progress = step === 4 ? 100 : (step / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto" ref={contentRef}>
      {/* Progress Bar — segmented, modern */}
      <div className="mb-10 sm:mb-12 px-2">
        {/* Step labels */}
        <div className="flex justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <span
                className={`
                  text-[10px] sm:text-xs font-medium transition-colors duration-300
                  ${i <= step ? 'text-[#C8956C]' : 'text-white/25'}
                `}
              >
                <span className="sm:hidden">{s.shortLabel}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Segmented progress bar */}
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="progress-segment flex-1"
              style={{
                '--progress': i < step ? '1' : i === step ? '0.5' : '0',
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Step Content — card container with glass effect */}
      <div className="liquid-glass rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 lg:p-10 overflow-hidden">
        <div
          className={`
            min-h-[400px] sm:min-h-[500px] transition-all duration-200 ease-out
            ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
          `}
          style={{
            transform: animating
              ? direction === 'forward' ? 'translateX(20px)' : 'translateX(-20px)'
              : 'translateX(0)',
          }}
        >
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
    </div>
  );
}
