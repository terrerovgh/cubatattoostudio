import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, ChevronRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import type { BookingData } from '../BookingWizard';

// Initialize Stripe outside component to avoid recreating it
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface Props {
    data: BookingData;
    updateData: (data: Partial<BookingData>) => void;
    onNext: () => void;
}

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message ?? 'An unexpected error occurred.');
        } else {
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            {message && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{message}</p>
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full py-4 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>Pay $50.00 Deposit <Lock className="w-4 h-4" /></>
                )}
            </button>
            
            <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Payments are secure and encrypted.
            </p>
        </form>
    );
};

const PaymentStep: React.FC<Props> = ({ data, updateData, onNext }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!data.depositPaid) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: 'deposit' }] }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setClientSecret(data.clientSecret);
                    }
                })
                .catch((err) => setError('Failed to load payment system'));
        }
    }, [data.depositPaid]);

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

            {error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm justify-center">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            ) : clientSecret ? (
                <Elements 
                    options={{ 
                        clientSecret, 
                        appearance: { 
                            theme: 'night',
                            variables: {
                                colorPrimary: '#ffffff',
                                colorBackground: '#262626', // neutral-800
                                colorText: '#ffffff',
                                colorDanger: '#ef4444',
                                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                                spacingUnit: '4px',
                                borderRadius: '12px',
                            },
                        } 
                    }} 
                    stripe={stripePromise}
                >
                    <CheckoutForm onSuccess={() => updateData({ depositPaid: true })} />
                </Elements>
            ) : (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
                </div>
            )}
        </div>
    );
};

export default PaymentStep;
