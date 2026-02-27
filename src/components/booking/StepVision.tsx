import { useState, useCallback, useRef } from 'react';
import type { BookingFormData, SizeCategory } from '../../types/booking';
import { BodyMapSVG } from './BodyMapSVG';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  accentColor?: string;
}

const SIZE_OPTIONS: { id: SizeCategory; label: string; desc: string; reference: string; range: string }[] = [
  { id: 'tiny', label: 'Tiny', desc: 'Under 2"', reference: 'Coin-sized', range: '$50 – $100' },
  { id: 'small', label: 'Small', desc: '2–4 inches', reference: 'Credit card', range: '$100 – $250' },
  { id: 'medium', label: 'Medium', desc: '4–6 inches', reference: 'Palm-sized', range: '$250 – $500' },
  { id: 'large', label: 'Large', desc: '6–10 inches', reference: 'Hand-sized', range: '$500 – $1,200' },
  { id: 'xlarge', label: 'Extra Large', desc: '10+ inches', reference: 'Half sleeve+', range: '$1,200+' },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function StepVision({ form, updateForm, onNext, onBack, accentColor = '#C8956C' }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canProceed = form.placement && form.size_category;

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setUploadError(null);

    const current = form.reference_images || [];
    const remaining = MAX_FILES - current.length;

    if (remaining <= 0) {
      setUploadError(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`${file.name}: Only JPG, PNG, WebP, HEIC allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`${file.name}: Max 10MB per image`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      updateForm({ reference_images: [...current, ...validFiles] });
    }
  }, [form.reference_images, updateForm]);

  const removeImage = (index: number) => {
    const updated = [...(form.reference_images || [])];
    updated.splice(index, 1);
    updateForm({ reference_images: updated });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Describe Your Vision
        </h2>
        <p className="text-white/45 text-sm">Help us understand your perfect tattoo</p>
      </div>

      {/* Tattoo Description */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          What do you want? <span className="text-white/30 font-normal">(optional but helpful)</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          placeholder="Describe your tattoo idea in detail — style, elements, meaning, mood..."
          rows={3}
          className="input-premium text-sm resize-none"
          maxLength={1000}
        />
        <div className="flex justify-between mt-1.5">
          <a href="/gallery" target="_blank" className="text-xs hover:underline" style={{ color: accentColor }}>
            Need inspiration? Browse our gallery →
          </a>
          <span className="text-xs text-white/20">{form.description.length}/1000</span>
        </div>
      </div>

      {/* Reference Images */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Reference Images <span className="text-white/30 font-normal">(up to {MAX_FILES})</span>
        </label>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            dragActive
              ? 'border-opacity-60 bg-opacity-10'
              : 'border-white/10 hover:border-white/20'
          }`}
          style={dragActive ? {
            borderColor: accentColor,
            background: `${accentColor}08`,
          } : undefined}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <svg className="w-8 h-8 mx-auto mb-2 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5z" />
          </svg>
          <p className="text-sm text-white/40">
            <span className="font-medium text-white/60">Drop images here</span> or tap to browse
          </p>
          <p className="text-xs text-white/20 mt-1">JPG, PNG, WebP, HEIC — Max 10MB each</p>
        </div>

        {uploadError && (
          <p className="mt-2 text-xs text-red-400">{uploadError}</p>
        )}

        {/* Image previews */}
        {form.reference_images && form.reference_images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {form.reference_images.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Reference ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white/80 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body Placement */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">
          Body Placement <span className="text-red-400">*</span>
        </label>
        <BodyMapSVG
          value={form.body_region || ''}
          onChange={(region, label) => updateForm({ body_region: region, placement: label })}
          accentColor={accentColor}
        />
      </div>

      {/* Size Selector */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">
          Approximate Size <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SIZE_OPTIONS.map(size => {
            const isSelected = form.size_category === size.id;
            return (
              <button
                key={size.id}
                onClick={() => updateForm({ size_category: size.id as SizeCategory })}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  isSelected
                    ? 'border'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
                style={isSelected ? {
                  background: `${accentColor}12`,
                  borderColor: `${accentColor}40`,
                } : undefined}
              >
                <p className={`text-sm font-bold ${isSelected ? '' : 'text-white'}`}
                  style={isSelected ? { color: accentColor } : undefined}
                >
                  {size.label}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{size.desc}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{size.reference}</p>
                <p className="text-xs font-medium mt-1.5" style={{ color: `${accentColor}80` }}>
                  {size.range}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom size input */}
        {form.size_category === 'custom' && (
          <div className="mt-3">
            <input
              type="text"
              value={form.size_inches}
              onChange={(e) => updateForm({ size_inches: e.target.value })}
              placeholder="e.g., 8 x 5 inches"
              className="input-premium text-sm max-w-xs"
            />
          </div>
        )}
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
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canProceed
              ? 'text-black hover:brightness-110 active:scale-[0.98]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={canProceed ? { background: accentColor } : undefined}
        >
          Choose Date & Time →
        </button>
      </div>
    </div>
  );
}
