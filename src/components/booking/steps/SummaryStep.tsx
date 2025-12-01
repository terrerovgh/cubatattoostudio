import React from 'react';
import { Check, Calendar, Clock, User, FileText, DollarSign, Image as ImageIcon } from 'lucide-react';
import type { BookingData } from '../BookingWizard';

interface Props {
    data: BookingData;
    onSubmit: () => void;
    loading: boolean;
}

const SummaryStep: React.FC<Props> = ({ data, onSubmit, loading }) => {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-medium text-white mb-6">Review & Confirm</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Contact Information
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-neutral-300">
                            <User className="w-4 h-4 text-neutral-500" />
                            <span>{data.fullName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-300">
                            <span className="text-neutral-500 text-xs">@</span>
                            <span>{data.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-300">
                            <span className="text-neutral-500 text-xs">#</span>
                            <span>{data.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Appointment Details
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-neutral-300">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            <span>{data.date ? new Date(data.date).toLocaleDateString() : 'Date not selected'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-300">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <span>{data.time || 'Time not selected'}</span>
                        </div>
                        {data.artistId && (
                            <div className="flex items-center gap-3 text-neutral-300">
                                <User className="w-4 h-4 text-neutral-500" />
                                <span className="text-sm text-neutral-400">Artist ID: {data.artistId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tattoo Details */}
                <div className="space-y-4 md:col-span-2">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Tattoo Concept
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Placement</span>
                                <span className="text-white">{data.placement}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Style</span>
                                <span className="text-white">{data.style}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Size</span>
                                <span className="text-white">{data.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Complexity</span>
                                <span className="text-white">{data.complexity}</span>
                            </div>
                        </div>
                        <div className="bg-neutral-800/30 p-4 rounded-xl">
                            <p className="text-sm text-neutral-300 italic">"{data.description}"</p>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4 md:col-span-2">
                    <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Visual References
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.referenceImageUrl && (
                            <div className="space-y-2">
                                <span className="text-xs text-neutral-500">Reference</span>
                                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-900">
                                    <img src={data.referenceImageUrl} alt="Reference" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        {data.aiGeneratedDesignUrl && (
                            <div className="space-y-2">
                                <span className="text-xs text-neutral-500">AI Concept</span>
                                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-900">
                                    <img src={data.aiGeneratedDesignUrl} alt="AI Concept" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        {data.bodyPhotoUrl && (
                            <div className="space-y-2">
                                <span className="text-xs text-neutral-500">Placement</span>
                                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-900">
                                    <img src={data.bodyPhotoUrl} alt="Placement" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="md:col-span-2 bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Secure Deposit</p>
                            <p className="text-xs text-emerald-400">Paid & Confirmed</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-white">$50.00</span>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? 'Submitting...' : 'Confirm Booking'} <Check className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default SummaryStep;
