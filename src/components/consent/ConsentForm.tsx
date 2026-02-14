import { useState, useRef, useCallback } from 'react';

interface Props {
  bookingId: string;
}

export function ConsentForm({ bookingId }: Props) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    government_id_type: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    has_allergies: false,
    allergies_detail: '',
    has_medical_conditions: false,
    medical_conditions_detail: '',
    is_pregnant: false,
    is_on_blood_thinners: false,
    has_skin_conditions: false,
    skin_conditions_detail: '',
    recent_alcohol: false,
    ack_age_18: false,
    ack_sober: false,
    ack_aftercare: false,
    ack_infection_risk: false,
    ack_no_guarantee: false,
    ack_photo_release: false,
    ack_final_design: false,
  });

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Signature Pad ──────────────────────────────────

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#C8956C';
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureData = (): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const signatureData = getSignatureData();
    if (!signatureData) {
      setError('Please provide your signature');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/booking/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          ...form,
          signature_data: signatureData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit consent');

      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <span className="text-green-400 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Consent Form Signed</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Thank you! Your consent form has been submitted and recorded. You're all set for your appointment.
        </p>
        <a href="/" className="inline-block px-6 py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#D4A574] transition-colors">
          Back to Home
        </a>
      </div>
    );
  }

  const STEPS = ['Personal Info', 'Medical History', 'Acknowledgements', 'Signature'];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Consent & Waiver Form</h2>
        <p className="text-white/50 text-sm mt-2">Cuba Tattoo Studio — Required before your appointment</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-[#C8956C] text-black' :
                i === step ? 'bg-[#C8956C]/20 text-[#C8956C] ring-2 ring-[#C8956C]/50' :
                'bg-white/5 text-white/30'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`mt-1 text-[10px] ${i <= step ? 'text-white/60' : 'text-white/20'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 mt-[-16px] ${i < step ? 'bg-[#C8956C]/50' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">Full Legal Name *</label>
              <input type="text" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Date of Birth *</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Government ID Type</label>
              <select value={form.government_id_type} onChange={(e) => update('government_id_type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50">
                <option value="">Select...</option>
                <option value="drivers_license">Driver's License</option>
                <option value="passport">Passport</option>
                <option value="state_id">State ID</option>
                <option value="military_id">Military ID</option>
              </select>
            </div>
          </div>
          <h4 className="font-medium text-white text-sm mt-6 mb-3">Emergency Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">Name</label>
              <input type="text" value={form.emergency_contact_name} onChange={(e) => update('emergency_contact_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Phone</label>
              <input type="tel" value={form.emergency_contact_phone} onChange={(e) => update('emergency_contact_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Medical History */}
      {step === 1 && (
        <div className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white mb-4">Medical History</h3>
          <p className="text-white/40 text-sm mb-4">Please answer honestly for your safety.</p>

          {[
            { field: 'has_allergies', label: 'Do you have any allergies? (latex, adhesives, inks, metals)', detail: 'allergies_detail' },
            { field: 'has_medical_conditions', label: 'Do you have any medical conditions? (diabetes, heart condition, hemophilia, epilepsy)', detail: 'medical_conditions_detail' },
            { field: 'has_skin_conditions', label: 'Do you have any skin conditions? (eczema, psoriasis, keloids)', detail: 'skin_conditions_detail' },
          ].map(({ field, label, detail }) => (
            <div key={field} className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={(form as any)[field]} onChange={(e) => update(field, e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${(form as any)[field] ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
                  {(form as any)[field] && '✓'}
                </div>
                <span className="text-sm text-white/80">{label}</span>
              </label>
              {(form as any)[field] && (
                <input type="text" value={(form as any)[detail]} onChange={(e) => update(detail, e.target.value)}
                  placeholder="Please describe..."
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
              )}
            </div>
          ))}

          {[
            { field: 'is_pregnant', label: 'Are you pregnant or nursing?' },
            { field: 'is_on_blood_thinners', label: 'Are you on blood thinners or anticoagulants?' },
            { field: 'recent_alcohol', label: 'Have you consumed alcohol in the last 24 hours?' },
          ].map(({ field, label }) => (
            <label key={field} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={(form as any)[field]} onChange={(e) => update(field, e.target.checked)} className="sr-only" />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${(form as any)[field] ? 'bg-red-500 border-red-500 text-white' : 'border-white/20'}`}>
                {(form as any)[field] && '✓'}
              </div>
              <span className="text-sm text-white/80">{label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Step 2: Acknowledgements */}
      {step === 2 && (
        <div className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white mb-4">Acknowledgements & Consent</h3>
          <p className="text-white/40 text-sm mb-4">Please read and accept each statement.</p>

          {[
            { field: 'ack_age_18', text: 'I confirm that I am at least 18 years of age and have a valid government-issued photo ID.' },
            { field: 'ack_sober', text: 'I confirm that I am not under the influence of alcohol, drugs, or any substance that may impair my judgment.' },
            { field: 'ack_aftercare', text: 'I understand and agree to follow the aftercare instructions provided to me. I understand that failure to follow these instructions may affect the healing and appearance of my tattoo.' },
            { field: 'ack_infection_risk', text: 'I understand that there is a risk of infection, scarring, allergic reaction, and other complications associated with getting a tattoo. I accept these risks.' },
            { field: 'ack_no_guarantee', text: 'I understand that tattoo results may vary and that Cuba Tattoo Studio cannot guarantee specific outcomes. Colors may fade or shift over time.' },
            { field: 'ack_final_design', text: 'I have approved the final design, placement, and size. I understand that once the tattooing process begins, I am responsible for the decision.' },
            { field: 'ack_photo_release', text: 'I grant Cuba Tattoo Studio permission to photograph my tattoo and use the images for portfolio and social media purposes. (Optional)' },
          ].map(({ field, text }) => (
            <label key={field} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
              <input type="checkbox" checked={(form as any)[field]} onChange={(e) => update(field, e.target.checked)} className="sr-only" />
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs mt-0.5 ${(form as any)[field] ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
                {(form as any)[field] && '✓'}
              </div>
              <span className="text-sm text-white/70 leading-relaxed">{text}</span>
            </label>
          ))}
        </div>
      )}

      {/* Step 3: Signature */}
      {step === 3 && (
        <div className="space-y-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white">Digital Signature</h3>
          <p className="text-white/40 text-sm">Draw your signature below to complete the consent form.</p>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[200px] rounded-xl bg-white/5 border border-white/10 cursor-crosshair touch-none"
            />
            <button
              onClick={clearSignature}
              className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-white/10 text-white/60 text-xs hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20 text-sm text-white/70">
            By signing above, I acknowledge that I have read, understood, and agree to all terms and conditions
            outlined in this consent and waiver form. I certify that all information provided is true and accurate.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
            ← Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && (!form.full_name || !form.date_of_birth)}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              (step === 0 && (!form.full_name || !form.date_of_birth))
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
            }`}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.ack_age_18 || !form.ack_sober || !form.ack_aftercare || !form.ack_infection_risk || !form.ack_no_guarantee || !form.ack_final_design}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              isSubmitting || !form.ack_age_18 || !form.ack_final_design
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Submitting...
              </>
            ) : 'Sign & Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
