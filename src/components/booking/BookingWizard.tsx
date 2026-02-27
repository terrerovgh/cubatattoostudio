import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $bookingDraft, $bookingPriceEstimate, $bookingStep } from '../../store';
import { calculatePriceEstimate } from '../../lib/pricing';
import type { BookingFormData } from '../../types/booking';

// Step Components
import { StepArtistStyle } from './StepArtistStyle';
import { StepVision } from './StepVision';
import { StepSchedule } from './StepSchedule';
import { StepClientInfo } from './StepClientInfo';
import { StepReviewPay } from './StepReviewPay';
import { PriceCalculator } from './PriceCalculator';

const STEPS = [
  { id: 'artist', label: 'Artist & Style', shortLabel: 'Artist' },
  { id: 'vision', label: 'Your Vision', shortLabel: 'Vision' },
  { id: 'schedule', label: 'Schedule', shortLabel: 'Time' },
  { id: 'info', label: 'Your Info', shortLabel: 'Info' },
  { id: 'review', label: 'Review & Pay', shortLabel: 'Pay' },
];

export function BookingWizard() {
  // Sync state with Nano Stores
  const draft = useStore($bookingDraft);
  const currentStepIndex = useStore($bookingStep);
  const priceEstimateInfo = useStore($bookingPriceEstimate);

  const [form, setForm] = useState<BookingFormData>(draft as unknown as BookingFormData);
  const [estimate, setEstimate] = useState<any>(null); // Full estimate object for components
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Sync component form state with nanostores draft on change
  useEffect(() => {
    // We only update the store when form changes
    $bookingDraft.set(form as any);
  }, [form]);

  const updateForm = useCallback((updates: Partial<BookingFormData>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };

      if (
        updates.size_category !== undefined ||
        updates.style !== undefined ||
        updates.service_type !== undefined ||
        updates.is_cover_up !== undefined ||
        updates.is_touch_up !== undefined ||
        updates.scheduled_date !== undefined ||
        updates.scheduled_time !== undefined
      ) {
        const calculated = calculatePriceEstimate({
          size: next.size_category || 'medium',
          style: next.style || next.service_type || '',
          isCoverUp: next.is_cover_up || false,
          isTouchUp: next.is_touch_up || false,
          date: next.scheduled_date || undefined,
          time: next.scheduled_time || undefined,
        });

        setEstimate(calculated);
        next.deposit_amount = calculated.deposit_required;
        next.estimated_duration = calculated.estimated_duration;

        // Update nanostore for live pricing
        $bookingPriceEstimate.set({
          totalMin: calculated.total_min,
          totalMax: calculated.total_max,
          deposit: calculated.deposit_required,
          duration: calculated.estimated_duration,
        });
      }

      return next;
    });
  }, []);

  // Calculate pricing on initial load if form has data
  useEffect(() => {
    if (form.size_category) {
      updateForm({}); // Triggers recalculation
    }
  }, []);

  const animateStep = useCallback((newStep: number, dir: 'forward' | 'back') => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      $bookingStep.set(newStep);
      setAnimating(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  }, []);

  const handleNext = useCallback(() => {
    setError(null);
    animateStep(Math.min(currentStepIndex + 1, STEPS.length - 1), 'forward');
  }, [currentStepIndex, animateStep]);

  const handleBack = useCallback(() => {
    setError(null);
    animateStep(Math.max(currentStepIndex - 1, 0), 'back');
  }, [currentStepIndex, animateStep]);

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

      setBookingId(data.data?.booking?.id || 'BOOKING-1234');

      // On success, we can show a confirmation step or redirect
      // For now, we'll just handle it internally
      alert(`Booking Successful! ID: ${data.data?.booking?.id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  // Derive artist accent and image for PriceCalculator
  const ARTISTS: Record<string, any> = {
    david: { name: 'David', image: '/artists/david.jpg', accent: '#E8793A' },
    nina: { name: 'Nina', image: '/artists/nina.jpg', accent: '#feb4b4' },
    karli: { name: 'Karli', image: '/artists/karli.jpg', accent: '#4A9EBF' },
  };
  const selectedArtist = form.artist_id ? ARTISTS[form.artist_id] : null;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start relative pb-32 lg:pb-0" ref={contentRef}>

      {/* Left Column: Wizard Steps */}
      <div className="flex-1 w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8 px-2">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <span className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${i <= currentStepIndex ? 'text-cuba-gold' : 'text-white/25'}`}>
                  <span className="sm:hidden">{s.shortLabel}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 h-1.5 rounded-full overflow-hidden bg-white/5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="flex-1 transition-all duration-500 rounded-full"
                style={{
                  background: i < currentStepIndex ? '#C8956C' : i === currentStepIndex ? 'linear-gradient(90deg, #C8956C, transparent)' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <span>{error}</span>
          </div>
        )}

        {/* Step Container */}
        <div className="liquid-glass rounded-[24px] overflow-hidden">
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] p-5 sm:p-8 lg:p-10 ${animating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
            style={{
              transform: animating ? (direction === 'forward' ? 'translateX(20px)' : 'translateX(-20px)') : 'translateX(0)',
            }}
          >
            {currentStepIndex === 0 && (
              <StepArtistStyle form={form} updateForm={updateForm} onNext={handleNext} />
            )}
            {currentStepIndex === 1 && (
              <StepVision form={form} updateForm={updateForm} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStepIndex === 2 && (
              <StepSchedule form={form} updateForm={updateForm} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStepIndex === 3 && (
              <StepClientInfo form={form} updateForm={updateForm} onNext={handleNext} onBack={handleBack} />
            )}
            {currentStepIndex === 4 && (
              <StepReviewPay
                form={form}
                updateForm={updateForm}
                priceEstimate={estimate}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Live Pricing Widget (Sticky Desktop / Floating Mobile) */}
      <PriceCalculator
        estimate={estimate}
        artistName={selectedArtist?.name}
        artistImage={selectedArtist?.image}
        artistAccent={selectedArtist?.accent}
        className="w-full lg:w-[320px] lg:sticky lg:top-24 z-40 transition-all duration-300"
      />

    </div>
  );
}
