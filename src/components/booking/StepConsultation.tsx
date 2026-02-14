import { useState, useRef } from 'react';
import type { BookingFormData, SizeCategory, PriceEstimate } from '../../types/booking';
import { BodySelector } from './BodySelector';

interface Props {
  form: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  priceEstimate: PriceEstimate | null;
  onNext: () => void;
  onBack: () => void;
}

const SIZES: { id: SizeCategory; label: string; desc: string; example: string }[] = [
  { id: 'tiny', label: 'Tiny', desc: 'Under 2"', example: 'Small symbol, initial' },
  { id: 'small', label: 'Small', desc: '2-4 inches', example: 'Wrist piece, small flower' },
  { id: 'medium', label: 'Medium', desc: '4-6 inches', example: 'Forearm piece, portrait' },
  { id: 'large', label: 'Large', desc: '6-10 inches', example: 'Half sleeve, back piece section' },
  { id: 'xlarge', label: 'Extra Large', desc: '10+ inches', example: 'Full sleeve, large back piece' },
  { id: 'custom', label: 'Custom', desc: 'Let us measure', example: 'Complex or unusual placement' },
];

export function StepConsultation({ form, updateForm, priceEstimate, onNext, onBack }: Props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - form.reference_images.length);
    const newPreviews: string[] = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newPreviews.push(ev.target.result as string);
          if (newPreviews.length === newFiles.length) {
            setPreviewImages((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    updateForm({
      reference_images: [...form.reference_images, ...newFiles],
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    updateForm({
      reference_images: form.reference_images.filter((_, i) => i !== index),
    });
  };

  const canProceed = form.description && form.placement && form.size_category;

  return (
    <div className="space-y-10">
      {/* Tattoo Description */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Describe Your Tattoo</h3>
        <p className="text-white/50 text-sm mb-4">Tell us about your vision — the more detail, the better</p>
        <textarea
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          placeholder="Describe your tattoo idea... Include any specific elements, colors, mood, or meaning you want to capture."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50 resize-none"
        />
      </div>

      {/* Reference Images */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Reference Images</h3>
        <p className="text-white/50 text-sm mb-4">Upload up to 5 inspiration images</p>

        <div className="flex flex-wrap gap-3">
          {previewImages.map((src, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
              <img src={src} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
              >
                ×
              </button>
            </div>
          ))}

          {previewImages.length < 5 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/30 hover:border-[#C8956C]/30 hover:text-[#C8956C]/60 transition-colors"
            >
              <span className="text-2xl mb-1">+</span>
              <span className="text-[10px]">Add Photo</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Body Placement Selector */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Placement</h3>
        <p className="text-white/50 text-sm mb-4">Where do you want your tattoo?</p>
        <BodySelector
          selected={form.placement}
          onSelect={(placement) => updateForm({ placement })}
        />
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Size</h3>
        <p className="text-white/50 text-sm mb-4">Approximate size of your tattoo</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => updateForm({ size_category: size.id })}
              className={`
                p-4 rounded-xl text-left transition-all duration-300
                ${form.size_category === size.id
                  ? 'bg-[#C8956C]/15 border border-[#C8956C]/40'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }
              `}
            >
              <h4 className={`font-semibold text-sm ${form.size_category === size.id ? 'text-[#C8956C]' : 'text-white'}`}>
                {size.label}
              </h4>
              <p className="text-white/50 text-xs mt-0.5">{size.desc}</p>
              <p className="text-white/30 text-[10px] mt-1">{size.example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex gap-4">
        <label className={`
          flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all
          ${form.is_cover_up ? 'bg-[#C8956C]/15 border border-[#C8956C]/40' : 'bg-white/[0.03] border border-white/[0.06]'}
        `}>
          <input
            type="checkbox"
            checked={form.is_cover_up}
            onChange={(e) => updateForm({ is_cover_up: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${form.is_cover_up ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
            {form.is_cover_up && '✓'}
          </div>
          <div>
            <span className="text-sm text-white font-medium">Cover-up</span>
            <p className="text-white/40 text-xs">Covering an existing tattoo</p>
          </div>
        </label>

        <label className={`
          flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all
          ${form.is_touch_up ? 'bg-[#C8956C]/15 border border-[#C8956C]/40' : 'bg-white/[0.03] border border-white/[0.06]'}
        `}>
          <input
            type="checkbox"
            checked={form.is_touch_up}
            onChange={(e) => updateForm({ is_touch_up: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${form.is_touch_up ? 'bg-[#C8956C] border-[#C8956C] text-black' : 'border-white/20'}`}>
            {form.is_touch_up && '✓'}
          </div>
          <div>
            <span className="text-sm text-white font-medium">Touch-up</span>
            <p className="text-white/40 text-xs">Refreshing an existing tattoo</p>
          </div>
        </label>
      </div>

      {/* Price Preview */}
      {priceEstimate && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="text-lg font-bold text-white mb-4">Estimated Price</h3>
          <div className="space-y-2">
            {priceEstimate.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-white/60">{item.label}</span>
                <span className={item.amount < 0 ? 'text-green-400' : 'text-white/80'}>
                  {item.amount < 0 ? '-' : ''}${Math.abs(item.amount)}
                </span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 mt-3 flex justify-between">
              <span className="font-bold text-white">Estimated Range</span>
              <span className="font-bold text-[#C8956C]">
                ${priceEstimate.total_min} — ${priceEstimate.total_max}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Deposit required</span>
              <span className="text-white/80">${priceEstimate.deposit_required}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
            ${canProceed
              ? 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
            }
          `}
        >
          Choose Date & Time →
        </button>
      </div>
    </div>
  );
}
