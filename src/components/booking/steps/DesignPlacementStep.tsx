import React, { useState, useEffect } from 'react';
import {
    Sparkles, Upload, Camera, RefreshCw, Download, Move, Eye, PenTool, Wand2
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BookingData } from '../BookingWizard';
import { Button, Tabs, SectionTitle } from '../ui/BookingUI';
import TattooPlacer from './TattooPlacer';

interface DesignPlacementStepProps {
    data: BookingData;
    updateData: (data: Partial<BookingData>) => void;
    onNext: () => void;
}

const TATTOO_STYLES = [
    { id: 'realism', name: 'Realism', img: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=150&q=80' },
    { id: 'traditional', name: 'Traditional', img: 'https://images.unsplash.com/photo-1590246296840-e30a198533b8?auto=format&fit=crop&w=150&q=80' },
    { id: 'minimalist', name: 'Minimalist', img: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=150&q=80' },
    { id: 'geometric', name: 'Geometric', img: 'https://images.unsplash.com/photo-1621452773781-0f992ee03591?auto=format&fit=crop&w=150&q=80' },
    { id: 'japanese', name: 'Japanese', img: 'https://images.unsplash.com/photo-1542319630-8d10f8e80dd0?auto=format&fit=crop&w=150&q=80' },
];

const DesignPlacementStep: React.FC<DesignPlacementStepProps> = ({ data, updateData, onNext }) => {
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [showPlacer, setShowPlacer] = useState(false);

    // Mock AI Generation
    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            // Mock result - in real app this comes from API
            const mockDesign = "https://images.unsplash.com/photo-1565440962783-f87efdea99fd?auto=format&fit=crop&w=600&q=80";
            updateData({ aiGeneratedDesignUrl: mockDesign });
            setIsGenerating(false);
        }, 2000);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (activeTab === 'upload') {
                    updateData({ referenceImageUrl: reader.result as string, aiGeneratedDesignUrl: null });
                } else {
                    updateData({ bodyPhotoUrl: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSimulate = (resultBase64: string) => {
        setIsSimulating(true);
        setTimeout(() => {
            updateData({ placementResultUrl: resultBase64 });
            setIsSimulating(false);
            setShowPlacer(false);
        }, 1500);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">

            {/* --- Part 1: Design Studio --- */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <SectionTitle title="Design Studio" subtitle="Create unique art or upload a reference." />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Preview */}
                    <div className="relative">
                        <div className="sticky top-24">
                            <div className="relative aspect-square w-full bg-black rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
                                {data.aiGeneratedDesignUrl || data.referenceImageUrl ? (
                                    <img
                                        src={(data.aiGeneratedDesignUrl || data.referenceImageUrl)!}
                                        className="w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-105"
                                        alt="Design"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 bg-zinc-900/50">
                                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                            <Wand2 className="w-8 h-8 opacity-40" />
                                        </div>
                                        <span className="text-sm font-medium">Design Preview Area</span>
                                    </div>
                                )}

                                {/* Actions Overlay */}
                                {(data.aiGeneratedDesignUrl || data.referenceImageUrl) && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="icon" onClick={() => updateData({ aiGeneratedDesignUrl: null, referenceImageUrl: null })} title="Clear">
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Controls */}
                    <div className="space-y-6">
                        <Tabs
                            options={[
                                { id: 'create', label: 'AI Generator', icon: Sparkles },
                                { id: 'upload', label: 'Upload Reference', icon: Upload }
                            ]}
                            selected={activeTab}
                            onChange={(id) => setActiveTab(id as any)}
                        />

                        {activeTab === 'create' ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Style Selector */}
                                <div>
                                    <label className="text-sm font-medium text-zinc-400 ml-1 mb-3 block">Art Style</label>
                                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 snap-x md:mx-0 md:px-0">
                                        {TATTOO_STYLES.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => updateData({ style: s.id })}
                                                className="snap-start flex flex-col items-center gap-2 group flex-shrink-0"
                                            >
                                                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ${data.style === s.id ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black scale-105 shadow-xl shadow-black/50' : 'opacity-80 group-hover:opacity-100'}`}>
                                                    <img src={s.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" alt={s.name} />
                                                    {data.style === s.id && <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />}
                                                </div>
                                                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${data.style === s.id ? 'text-indigo-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                    {s.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-400 ml-1">Refine Description</label>
                                    <div className="relative group">
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => updateData({ description: e.target.value })}
                                            placeholder="e.g. A geometric wolf head with floral accents..."
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-5 text-white h-32 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors text-base"
                                        />
                                        <div className="absolute bottom-4 right-4">
                                            <Button
                                                onClick={handleGenerate}
                                                disabled={isGenerating || !data.description}
                                                variant="accent"
                                                className="rounded-xl px-4 py-2 text-sm shadow-xl"
                                                isLoading={isGenerating}
                                            >
                                                <Sparkles className="w-4 h-4 mr-2" /> Generate
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-zinc-900 hover:border-zinc-500 transition-colors cursor-pointer relative">
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} accept="image/*" />
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Click to Upload</h4>
                                        <p className="text-sm text-zinc-500 mt-1">Supports JPG, PNG (Max 10MB)</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-white/5 my-12" />

            {/* --- Part 2: Virtual Try-On --- */}
            <div className="space-y-8">
                {showPlacer && data.bodyPhotoUrl && (data.aiGeneratedDesignUrl || data.referenceImageUrl) && (
                    <TattooPlacer
                        bodyImage={data.bodyPhotoUrl}
                        tattooImage={(data.aiGeneratedDesignUrl || data.referenceImageUrl)!}
                        onConfirm={handleSimulate}
                        onCancel={() => setShowPlacer(false)}
                    />
                )}

                <SectionTitle title="Virtual Try-On" subtitle="Visualize the tattoo on your body using AR simulation." />

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Visualizer */}
                    <div className="relative aspect-[3/4] md:aspect-[4/5] w-full bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl group">
                        {isSimulating ? (
                            <div className="flex flex-col items-center gap-4 p-8 text-center">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Rendering Simulation</h3>
                                    <p className="text-sm text-zinc-500">Mapping skin texture and lighting...</p>
                                </div>
                            </div>
                        ) : data.placementResultUrl ? (
                            <img src={data.placementResultUrl} className="w-full h-full object-cover" alt="Simulation" />
                        ) : data.bodyPhotoUrl ? (
                            <img src={data.bodyPhotoUrl} className="w-full h-full object-cover opacity-60 grayscale-[0.2]" alt="Body" />
                        ) : (
                            <div className="text-center p-8 max-w-xs">
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                    <Camera className="w-8 h-8 text-zinc-600" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No Photo Selected</h3>
                                <p className="text-zinc-500 text-sm">Upload a clear photo of the body part to start the simulation.</p>
                            </div>
                        )}

                        {/* Floating Action Button for Upload */}
                        {!data.placementResultUrl && !isSimulating && (
                            <label className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 cursor-pointer active:scale-95 transition hover:bg-zinc-200 w-max z-10 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                <Camera className="w-5 h-5" />
                                {data.bodyPhotoUrl ? "Retake Photo" : "Upload Body Photo"}
                                <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
                            </label>
                        )}
                    </div>

                    {/* Right Column: Actions */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="bg-zinc-900/80 backdrop-blur p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl">
                            <h3 className="font-bold flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-indigo-500" /> AI Reality Engine</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <div className="p-2 bg-zinc-800 rounded-lg"><Move className="w-4 h-4 text-zinc-400" /></div>
                                    <div>
                                        <span className="block font-medium text-white text-sm">Precise Placement</span>
                                        <span className="text-xs text-zinc-500">Rotate and scale design on skin</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="p-2 bg-zinc-800 rounded-lg"><Eye className="w-4 h-4 text-zinc-400" /></div>
                                    <div>
                                        <span className="block font-medium text-white text-sm">Texture Blending</span>
                                        <span className="text-xs text-zinc-500">Ink appears under skin pores</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {data.bodyPhotoUrl && (data.aiGeneratedDesignUrl || data.referenceImageUrl) && !isSimulating && (
                            <Button onClick={() => setShowPlacer(true)} variant="accent" className="w-full py-5 text-lg shadow-accent/20 rounded-2xl">
                                <PenTool className="w-5 h-5" /> Enter Placement Editor
                            </Button>
                        )}

                        {data.placementResultUrl && (
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="secondary" onClick={() => updateData({ placementResultUrl: null })}>
                                    <RefreshCw className="w-4 h-4" /> Reset
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = data.placementResultUrl!;
                                    a.download = 'inkflow-sim.png';
                                    a.click();
                                }}>
                                    <Download className="w-4 h-4" /> Download
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-8 border-t border-white/5">
                <Button onClick={onNext} className="px-8 py-3 text-lg">
                    Review & Confirm
                </Button>
            </div>
        </div>
    );
};

export default DesignPlacementStep;
