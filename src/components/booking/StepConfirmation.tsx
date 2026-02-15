import type { BookingFormData, PriceEstimate } from '../../types/booking';

interface Props {
  form: BookingFormData;
  bookingId: string | null;
  priceEstimate: PriceEstimate | null;
}

export function StepConfirmation({ form, bookingId, priceEstimate }: Props) {
  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-[#C8956C]/20 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-[#C8956C] flex items-center justify-center text-black text-3xl sm:text-2xl font-bold">
            ✓
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
        <p className="text-white/60 max-w-md mx-auto text-sm sm:text-base">
          Your appointment has been scheduled. Check your email for confirmation details and your digital consent form.
        </p>
      </div>

      {/* Booking ID */}
      {bookingId && (
        <div className="inline-block px-4 py-2.5 rounded-lg bg-white/5 text-white/60 text-sm font-mono">
          Booking ID: {bookingId.slice(0, 8).toUpperCase()}
        </div>
      )}

      {/* Summary Card */}
      <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left space-y-4">
        <h3 className="font-bold text-white text-center mb-4">Appointment Details</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/40 block text-xs">Artist</span>
            <span className="text-white capitalize font-medium">{form.artist_id}</span>
          </div>
          <div>
            <span className="text-white/40 block text-xs">Service</span>
            <span className="text-white font-medium">{form.service_type}</span>
          </div>
          <div>
            <span className="text-white/40 block text-xs">Date</span>
            <span className="text-white font-medium">
              {form.scheduled_date && new Date(form.scheduled_date + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-white/40 block text-xs">Time</span>
            <span className="text-white font-medium">{form.scheduled_time && formatTime(form.scheduled_time)}</span>
          </div>
          <div>
            <span className="text-white/40 block text-xs">Placement</span>
            <span className="text-white font-medium">{form.placement}</span>
          </div>
          <div>
            <span className="text-white/40 block text-xs">Est. Duration</span>
            <span className="text-white font-medium">
              {form.estimated_duration >= 60 ? `${Math.round(form.estimated_duration / 60)}h` : `${form.estimated_duration}min`}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Estimated Price</span>
            <span className="text-white font-medium">${priceEstimate?.total_min} — ${priceEstimate?.total_max}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-white/60">Deposit Paid</span>
            <span className="text-green-400 font-medium">${priceEstimate?.deposit_required}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="max-w-md mx-auto space-y-3">
        <h4 className="font-bold text-white text-sm">What's Next?</h4>

        <div className="space-y-2.5 text-left">
          <div className="flex gap-3 p-3.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-[#C8956C]/20 flex items-center justify-center text-[#C8956C] text-xs font-bold flex-shrink-0">1</div>
            <div>
              <p className="text-sm text-white font-medium">Check your email</p>
              <p className="text-xs text-white/50">Confirmation and consent form sent to {form.email}</p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-[#C8956C]/20 flex items-center justify-center text-[#C8956C] text-xs font-bold flex-shrink-0">2</div>
            <div>
              <p className="text-sm text-white font-medium">Complete consent form</p>
              <p className="text-xs text-white/50">Required before your appointment — digital signature</p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-[#C8956C]/20 flex items-center justify-center text-[#C8956C] text-xs font-bold flex-shrink-0">3</div>
            <div>
              <p className="text-sm text-white font-medium">Prepare for your session</p>
              <p className="text-xs text-white/50">Stay hydrated, eat well, no alcohol 24h before. Wear comfortable clothing.</p>
            </div>
          </div>

          <div className="flex gap-3 p-3.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-[#C8956C]/20 flex items-center justify-center text-[#C8956C] text-xs font-bold flex-shrink-0">4</div>
            <div>
              <p className="text-sm text-white font-medium">Visit our studio</p>
              <p className="text-xs text-white/50">1311 San Mateo Blvd NE, Albuquerque, NM 87109</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        {bookingId && (
          <a
            href={`/consent/${bookingId}`}
            className="px-6 py-4 sm:py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#DABA8F] active:scale-[0.98] transition-all text-center"
          >
            Complete Consent Form
          </a>
        )}
        <a
          href="/"
          className="px-6 py-4 sm:py-3 rounded-xl bg-white/5 text-white/80 font-medium text-sm hover:bg-white/10 active:bg-white/15 transition-colors text-center"
        >
          Back to Home
        </a>
      </div>

      {/* Referral CTA */}
      <div className="max-w-md mx-auto p-4 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20">
        <p className="text-sm text-white font-medium mb-1">Refer a friend, get $25!</p>
        <p className="text-xs text-white/50">
          Share your unique referral link and both you and your friend get $25 credit toward your next session.
        </p>
      </div>
    </div>
  );
}
