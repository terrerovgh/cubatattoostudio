import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import type { BookingData } from '../BookingWizard';

interface Props {
    data: BookingData;
    updateData: (data: Partial<BookingData>) => void;
    onNext: () => void;
}

const PaymentStep: React.FC<Props> = ({ data, updateData, onNext }) => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            updateData({ depositPaid: true });
            // Automatically move to next step after success
            // But maybe let user see success state first?
            // Let's just show success state and a "Continue" button.
        }, 1500);
    };

    if (data.depositPaid) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-xl font-medium text-white mb-2">Deposit Paid Successfully</h3>
                    <p className="text-neutral-400">Your $50.00 secure deposit has been confirmed.</p>
                </div>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                    Continue to Design <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-xl font-medium text-white mb-2">Secure Deposit</h3>
                <p className="text-neutral-400 text-sm">
                    A $50.00 deposit is required to secure your appointment and start the design process. This amount will be deducted from the final price.
                </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors placeholder-neutral-600"
                                placeholder="0000 0000 0000 0000"
                                required
                            />
                            <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Expiry Date</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder-neutral-600"
                                placeholder="MM/YY"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">CVC</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-white transition-colors placeholder-neutral-600"
                                    placeholder="123"
                                    required
                                />
                                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">Cardholder Name</label>
                        <input
                            type="text"
                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder-neutral-600"
                            placeholder="Name on card"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>Processing...</>
                    ) : (
                        <>Pay $50.00 Deposit <Lock className="w-4 h-4" /></>
                    )}
                </button>

                <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Payments are secure and encrypted.
                </p>
            </form>
        </div>
    );
};

export default PaymentStep;
