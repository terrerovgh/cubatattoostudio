import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ContactStep from './steps/ContactStep';
import TattooDetailsStep from './steps/TattooDetailsStep';
import PaymentStep from './steps/PaymentStep';
import DesignPlacementStep from './steps/DesignPlacementStep';
import SummaryStep from './steps/SummaryStep';
import { supabase } from '../../lib/supabase';

export interface BookingData {
    // Contact
    fullName: string;
    email: string;
    phone: string;
    artistId: string;

    // Tattoo Details
    placement: string;
    description: string;
    style: string;
    complexity: string;
    size: string;
    referenceImage: File | null;
    referenceImageUrl: string | null;

    // Date Preference
    date: string;
    time: string;

    // Payment
    depositPaid: boolean;

    // Design/AI
    aiGeneratedDesignUrl: string | null;
    bodyPhoto: File | null;
    bodyPhotoUrl: string | null;
    placementResultUrl: string | null; // The final composition
}

const initialData: BookingData = {
    fullName: '',
    email: '',
    phone: '',
    artistId: '',
    placement: '',
    description: '',
    style: '',
    complexity: '',
    size: '',
    referenceImage: null,
    referenceImageUrl: null,
    date: '',
    time: '',
    depositPaid: false,
    aiGeneratedDesignUrl: null,
    bodyPhoto: null,
    bodyPhotoUrl: null,
    placementResultUrl: null
};

const STEPS = [
    { id: 'contact', title: 'Contact Info' },
    { id: 'details', title: 'Tattoo Details' },
    { id: 'payment', title: 'Secure Deposit' },
    { id: 'design', title: 'Design & Placement' },
    { id: 'summary', title: 'Confirmation' }
];

const BookingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState<BookingData>(initialData);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const updateData = (updates: Partial<BookingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const submitBooking = async () => {
        setLoading(true);
        try {
            // Upload images if needed (already handled in steps usually, but final check)

            // Create appointment
            const { error } = await supabase
                .from('appointments')
                .insert([{
                    client_name: data.fullName,
                    client_email: data.email,
                    phone: data.phone,
                    artist_id: data.artistId || null,
                    start_time: data.date && data.time ? new Date(`${data.date}T${data.time}`).toISOString() : null,
                    notes: data.description,
                    style: data.style,
                    complexity: data.complexity,
                    size: data.size,
                    placement: data.placement,
                    reference_image_url: data.referenceImageUrl,
                    ai_design_url: data.aiGeneratedDesignUrl,
                    body_photo_url: data.bodyPhotoUrl,
                    deposit_paid: data.depositPaid,
                    deposit_amount: 50.00,
                    status: 'pending'
                }]);

            if (error) throw error;
            setCompleted(true);
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Failed to submit booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Booking Request Received!</h2>
                <p className="text-neutral-400 max-w-md mb-8">
                    Your appointment request has been successfully submitted. We will review your details and get back to you shortly to confirm.
                </p>
                <button
                    onClick={() => {
                        setCompleted(false);
                        setCurrentStep(0);
                        setData(initialData);
                    }}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors"
                >
                    Book Another
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Progress Bar */}
            <div className="h-1 bg-neutral-800 w-full">
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h2 className="text-xl font-medium text-white">
                        {STEPS[currentStep].title}
                    </h2>
                </div>
                <div className="text-sm text-neutral-500">
                    Step {currentStep + 1} of {STEPS.length}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 0 && (
                            <ContactStep data={data} updateData={updateData} onNext={nextStep} />
                        )}
                        {currentStep === 1 && (
                            <TattooDetailsStep data={data} updateData={updateData} onNext={nextStep} />
                        )}
                        {currentStep === 2 && (
                            <PaymentStep data={data} updateData={updateData} onNext={nextStep} />
                        )}
                        {currentStep === 3 && (
                            <DesignPlacementStep data={data} updateData={updateData} onNext={nextStep} />
                        )}
                        {currentStep === 4 && (
                            <SummaryStep data={data} onSubmit={submitBooking} loading={loading} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingWizard;
