import React, { useRef } from 'react';
import { Upload, X, ChevronRight } from 'lucide-react';
import type { BookingData } from '../BookingWizard';

interface Props {
    data: BookingData;
    updateData: (data: Partial<BookingData>) => void;
    onNext: () => void;
}

const STYLES = ['Realism', 'Traditional', 'Neo-Traditional', 'Blackwork', 'Fine Line', 'Watercolor', 'Tribal', 'Japanese', 'Other'];
const SIZES = ['Small (< 3")', 'Medium (3-6")', 'Large (6-10")', 'Extra Large (> 10")', 'Full Sleeve', 'Back Piece'];
const COMPLEXITIES = ['Simple', 'Moderate', 'Complex', 'Highly Detailed'];

const TattooDetailsStep: React.FC<Props> = ({ data, updateData, onNext }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            updateData({ referenceImage: file, referenceImageUrl: url });
        }
    };

    const removeImage = () => {
        updateData({ referenceImage: null, referenceImageUrl: null });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const isValid = data.placement && data.style && data.size && data.description;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Placement */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Placement</label>
                    <input
                        type="text"
                        value={data.placement}
                        onChange={(e) => updateData({ placement: e.target.value })}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="e.g. Inner Forearm"
                    />
                </div>

                {/* Style */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Style</label>
                    <div className="relative">
                        <select
                            value={data.style}
                            onChange={(e) => updateData({ style: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                        >
                            <option value="" className="bg-neutral-900">Select Style</option>
                            {STYLES.map(style => (
                                <option key={style} value={style} className="bg-neutral-900">{style}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Size */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Size</label>
                    <div className="relative">
                        <select
                            value={data.size}
                            onChange={(e) => updateData({ size: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                        >
                            <option value="" className="bg-neutral-900">Select Size</option>
                            {SIZES.map(size => (
                                <option key={size} value={size} className="bg-neutral-900">{size}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Complexity */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Complexity</label>
                    <div className="relative">
                        <select
                            value={data.complexity}
                            onChange={(e) => updateData({ complexity: e.target.value })}
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                        >
                            <option value="" className="bg-neutral-900">Select Complexity</option>
                            {COMPLEXITIES.map(comp => (
                                <option key={comp} value={comp} className="bg-neutral-900">{comp}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Concept Description</label>
                <textarea
                    rows={4}
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="Describe your idea in detail..."
                />
            </div>

            {/* Reference Image */}
            <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Reference Image (Optional)</label>

                {!data.referenceImageUrl ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-500 hover:bg-neutral-800/30 transition-all"
                    >
                        <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                        <p className="text-sm text-neutral-400">Click to upload reference image</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-48 bg-neutral-900 rounded-xl overflow-hidden group">
                        <img
                            src={data.referenceImageUrl}
                            alt="Reference"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next Step <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TattooDetailsStep;
