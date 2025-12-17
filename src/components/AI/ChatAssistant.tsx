import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import z from 'zod'; // For schema validation if needed locally
import Calendar from '../Booking/Calendar';

// Types for messages and config
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    image?: string; // Support for displaying images in chat history
}

interface ChatConfig {
    greeting?: string;
    assistantName?: string;
    modalTitle?: string;
    welcomeMessage?: string; // Schema likely uses this
    systemPrompt?: string; // Schema might make this optional or uses 'systemPrompt'
    inputPlaceholder?: string;
    quickActions?: { label: string; prompt: string }[];
    staticResponses?: { trigger: string; response: string | string[] }[];
    bookingSteps?: { key: string; question: string | string[]; type?: 'text' | 'option' | 'image' | 'date'; options?: string[]; errorMessage?: string | string[] }[];
}

interface ChatAssistantProps {
    config?: ChatConfig;
    systemPrompt?: string;
    knowledgeBase?: string;
}

// Booking State

// Removed hardcoded CHARISMATIC_STEPS - now reading from config

// Helper for randomizing text
const getRandomVariation = (text: string | string[] | undefined): string => {
    if (!text) return "";
    if (Array.isArray(text)) {
        return text[Math.floor(Math.random() * text.length)];
    }
    return text;
};

// Default fallback steps in case config loading fails
const DEFAULT_BOOKING_STEPS: NonNullable<ChatConfig['bookingSteps']> = [
    {
        key: 'age',
        question: [
            "Awesome! I'd love to help you set that up. First things first—are you 18 or older?",
            "Let's get started. Just confirming, are you 18+?",
            "First step: Are you at least 18 years old?"
        ],
        type: 'option',
        options: ["Yes, I am 18+", "Not yet"]
    },
    {
        key: 'artist',
        question: [
            "Great. Do you have a specific artist in mind for your session, or are you looking for a recommendation?",
            "Do you have a preferred artist, or should we find the best match for you?"
        ],
        type: 'option',
        options: ["David", "Nina", "Karli", "No preference"]
    },
    {
        key: 'placement',
        question: "Got it. Where on your body are you thinking of placing this masterpiece?",
        type: 'option',
        options: ["Arm", "Leg", "Back", "Chest", "Other"]
    },
    {
        key: 'placement_image',
        question: "Mind sharing a photo of the area? It helps us visualize the canvas.",
        type: 'image'
    },
    {
        key: 'size',
        question: "And roughly what size are you envisioning?",
        type: 'option',
        options: ["Small (<3in)", "Medium (3-6in)", "Large (>6in)", "Full Sleeve/Back"]
    },
    {
        key: 'style',
        question: "Almost done with the basics. What style are you envisioning for this?",
        type: 'option',
        options: ["Realism", "Traditional", "Fine Line", "Blackwork", "Not sure / Open to advice"]
    },
    {
        key: 'idea',
        question: "Perfect. Last detail: Tell me a bit about your idea. What are we making today? (Feel free to describe the subject, mood, or elements)",
        type: 'text'
    },
    {
        key: 'reference_image',
        question: "Optionally, do you have any reference images or sketches for your idea?",
        type: 'image'
    },
    {
        key: 'name',
        question: "Thanks! Now, who am I specifically creating this dossier for? (Your full name)",
        type: 'text'
    },
    {
        key: 'phone',
        question: "And a phone number? (Optional, just type 'Skip' if you prefer email only)",
        type: 'text'
    },
    {
        key: 'email',
        question: "What is the best email address to reach you at?",
        type: 'text'
    },
    {
        key: 'verification_code',
        question: "I've sent a 6-digit verification code to your email. Please verify it so I can finalize your dossier.",
        type: 'text'
    }
];

export default function ChatAssistant({ config, systemPrompt, knowledgeBase }: ChatAssistantProps) {
    const defaultMessages: Message[] = [
        { role: 'assistant', content: getRandomVariation(config?.welcomeMessage || 'Hello! How can I help you today?') }
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(defaultMessages);
    const [inputValue, setInputValue] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Human-like Behavior State
    const [isTyping, setIsTyping] = useState(false);
    const [messageQueue, setMessageQueue] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Booking Flow State
    const [bookingMode, setBookingMode] = useState(false);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState<Record<string, string>>({});
    const [showDossier, setShowDossier] = useState(false);

    // Model State
    const [modelReady, setModelReady] = useState(false);

    const worker = useRef<Worker | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Dynamic Steps from Config with Fallback
    const bookingSteps = (config?.bookingSteps && config.bookingSteps.length > 0)
        ? config.bookingSteps
        : DEFAULT_BOOKING_STEPS;

    // Initialize Worker & Listener
    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../../lib/ai-worker.js', import.meta.url), {
                type: 'module'
            });

            worker.current.addEventListener('message', (e) => {
                const { type, data, text } = e.data;
                if (type === 'progress') {
                    if (data.status === 'progress' && data.progress) {
                        setLoadingProgress(data.progress);
                    }
                } else if (type === 'ready') {
                    setModelReady(true);
                    setLoadingProgress(100);
                } else if (type === 'complete') {
                    setIsProcessing(false);
                    processResponse(text);
                } else if (type === 'error') {
                    console.error("AI Error:", e.data.error);
                    setIsProcessing(false);
                    setIsTyping(false);
                }
            });
        }

        // Removed automatic preload on mount.
        // Trigger ONLY at Booking Step 3 per user request.
    }, []);

    // Preload model helper
    const triggerModelPreload = () => {
        if (!modelReady && worker.current) {
            worker.current.postMessage({ type: 'init' });
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isProcessing, showDossier]);

    // Message Queue Consumer
    useEffect(() => {
        if (messageQueue.length > 0 && !isTyping) {
            const processNextMessage = async () => {
                setIsTyping(true);
                const nextMessage = messageQueue[0];

                const typingTime = Math.min(4000, Math.max(1500, nextMessage.length * 30));

                await new Promise(resolve => setTimeout(resolve, typingTime));

                setMessages(prev => [...prev, { role: 'assistant', content: nextMessage }]);
                setMessageQueue(prev => prev.slice(1));
                setIsTyping(false);
            };

            processNextMessage();
        }
    }, [messageQueue, isTyping]);

    const processResponse = (fullText: string) => {
        const sentences = fullText.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [fullText];
        const chunks: string[] = [];
        let currentChunk = "";
        let sentencesToGroup = Math.floor(Math.random() * 3) + 1;

        sentences.forEach((sentence, index) => {
            currentChunk += sentence;
            sentencesToGroup--;
            if (sentencesToGroup <= 0 || index === sentences.length - 1 || currentChunk.length > 200) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
                sentencesToGroup = Math.floor(Math.random() * 3) + 1;
            }
        });
        if (currentChunk.trim()) { chunks.push(currentChunk.trim()); }
        setMessageQueue(prev => [...prev, ...chunks]);
    };

    const handleStaticResponse = (text: string): boolean => {
        // Normalize text
        const lowerText = text.toLowerCase();

        // Check triggers from config
        if (config?.staticResponses) {
            const match = config.staticResponses.find(r =>
                lowerText.includes(r.trigger.toLowerCase()) ||
                r.trigger.toLowerCase().includes(lowerText)
            );
            if (match) {
                processResponse(getRandomVariation(match.response));
                return true;
            }
        }

        // Fallback for Booking trigger if not in staticResponses explicitly as "Booking"
        if (lowerText.includes('book') || lowerText.includes('appointment')) {
            startBookingFlow();
            return true;
        }

        return false;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local URL for preview
        const imageUrl = URL.createObjectURL(file);

        // Add user message with image
        setMessages(prev => [...prev, {
            role: 'user',
            content: `Sent an image: ${file.name}`,
            image: imageUrl
        }]);

        if (bookingMode) {
            // Store with prefix to identify as image in dossier
            advanceBookingFlow(`IMAGE::${imageUrl}`);
        }
    };

    const handleConfirmBooking = async () => {
        setIsProcessing(true);
        setShowDossier(false); // Hide dossier while processing
        // Call API to save dossier
        try {
            const response = await fetch('/api/booking/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: bookingData.name || 'Guest',
                    clientEmail: bookingData.email,
                    clientPhone: bookingData.phone,
                    artist: bookingData.artist,
                    style: bookingData.style,
                    placement: bookingData.placement,
                    description: bookingData.idea, // Assuming 'idea' is the description field
                    selectedDate: bookingData.appointment?.split(' at ')[0], // specific to date step
                    selectedTime: bookingData.appointment?.split(' at ')[1],
                    // Extract base64 images from bookingData keys starting with IMAGE::
                    images: Object.keys(bookingData)
                        .filter(k => bookingData[k]?.startsWith('IMAGE::'))
                        .map(k => bookingData[k].replace('IMAGE::', ''))
                })
            });

            const result = await response.json();

            if (result.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Fantastic! Your booking is confirmed. 
                    
                    📂 **Dossier Created**: \`${result.dossierId}\`
                    
                    I've notified ${bookingData.artist || 'the team'}. You can view your appointment on the calendar.`
                }]);

                // Optional: Redirect or show link
                setTimeout(() => {
                    if (result.calendarUrl) {
                        window.location.href = result.calendarUrl;
                    }
                }, 4000);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error saving your booking. Please communicate with the studio directly." }]);
            }

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: "System error. Please try again later." }]);
        } finally {
            setIsProcessing(false);
            setBookingMode(false); // Exit booking mode after attempt
        }
    };

    const handleSkipImage = () => {
        if (bookingMode) {
            advanceBookingFlow("No image provided");
        }
    };

    const startBookingFlow = async () => {
        if (bookingSteps.length === 0) {
            processResponse("I'm sorry, I cannot take bookings right now. Please contact us directly.");
            return;
        }
        setBookingMode(true);
        setBookingStep(0);
        setBookingData({});
        // Removed triggerModelPreload() from here.
        // It will be triggered at Step 3 (index 2).

        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', content: getRandomVariation(bookingSteps[0].question) }]);
    };

    // Validation Helpers
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 10;
    };
    const isValidCode = (code: string) => /^\d{6}$/.test(code.trim());

    const advanceBookingFlow = async (userAnswer: string) => {
        const currentStepObj = bookingSteps[bookingStep];
        const trimmedAnswer = userAnswer.trim();

        // Edge Case: Underage check
        if (currentStepObj.key === 'age' && userAnswer.toLowerCase().includes('not')) {
            setBookingMode(false);
            processResponse("I appreciate your honesty! Unfortunately, we can only tattoo clients who are 18 or older.");
            return;
        }

        // --- Validation Logic ---
        if (currentStepObj.key === 'email') {
            if (!isValidEmail(trimmedAnswer)) {
                const errorMsg = getRandomVariation(currentStepObj.errorMessage) || "That doesn't look like a valid email address. Please try again (e.g., name@example.com).";
                setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
                return; // Do not advance
            }
        }

        if (currentStepObj.key === 'phone') {
            if (trimmedAnswer.toLowerCase() !== 'skip' && !isValidPhone(trimmedAnswer)) {
                const errorMsg = getRandomVariation(currentStepObj.errorMessage) || "Please enter a valid 10-digit US phone number, or type 'Skip'.";
                setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
                return;
            }
        }

        if (currentStepObj.key === 'verification_code') {
            if (!isValidCode(trimmedAnswer)) {
                const errorMsg = getRandomVariation(currentStepObj.errorMessage) || "The code should be exactly 6 digits. Please check and try again.";
                setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
                return;
            }
        }

        // Save valid data
        setBookingData(prev => ({ ...prev, [currentStepObj.key]: userAnswer }));

        const nextStep = bookingStep + 1;

        // Trigger LLM Download at Question 3 (Index 2)
        if (nextStep === 2) {
            triggerModelPreload();
        }

        // Handling the transition TO the verification step (sending the code)
        if (nextStep < bookingSteps.length) {
            const nextStepObj = bookingSteps[nextStep];

            if (nextStepObj.key === 'verification_code') {
                // Simulate sending code
                setIsTyping(true);
                await new Promise(r => setTimeout(r, 1500));
                setIsTyping(false);
                setMessages(prev => [...prev, { role: 'assistant', content: "Generated secure code. Sending to your email..." }]);
                await new Promise(r => setTimeout(r, 1000));
            }

            setBookingStep(nextStep);
            setMessageQueue(prev => [...prev, getRandomVariation(bookingSteps[nextStep].question)]);
        } else {
            // Check verification code logic
            if (currentStepObj.key === 'verification_code') {
                // Check if model is ready before finishing
                if (!modelReady) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "Verifying identity... (Waiting for secure brain connection)" }]);
                    setIsProcessing(true);
                    // The useEffect below will handle resuming
                    return;
                }
            }
            finishBookingFlow();
        }
    };

    // Effect to auto-advance verification if blocked
    useEffect(() => {
        if (modelReady && isProcessing && bookingSteps[bookingStep]?.key === 'verification_code') {
            // Model just became ready while we were verifying
            setIsProcessing(false);
            finishBookingFlow();
        }
    }, [modelReady, isProcessing, bookingStep, bookingSteps]);


    const finishBookingFlow = async () => {
        // If we just finished verification
        if (bookingSteps[bookingStep]?.key === 'verification_code') {
            setMessages(prev => [...prev, { role: 'assistant', content: "✅ Verified! Code accepted." }]);
            await new Promise(r => setTimeout(r, 800));
        }

        setBookingMode(false);
        showFinalDossier();
    };

    const showFinalDossier = () => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', content: "All set! Here is the complete dossier. Please review the details below." }]);
            setShowDossier(true);
        }, 1500);
    };

    const confirmBooking = () => {
        setShowDossier(false);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'assistant', content: "🎉 Fantastic! Request sent. An artist will be in touch soon!" }]);
        }, 1000);
    };

    const sendMessage = (text: string) => {
        if (!text.trim() || isProcessing || isTyping) return;
        setMessages(prev => [...prev, { role: 'user', content: text }]);

        if (bookingMode) {
            advanceBookingFlow(text);
            return;
        }

        // Always check static responses first (Offline capable)
        if (handleStaticResponse(text)) {
            return;
        }

        // If no static response matched, checking online status
        if (!modelReady) {
            // Should not happen if input is disabled, but safeguard
            processResponse("I'm currently offline and can only answer basic questions. Please wait for me to come online!");
            return;
        }

        setIsProcessing(true);
        triggerModelPreload();

        worker.current?.postMessage({
            type: 'generate',
            text: text,
            systemPrompt: systemPrompt,
            knowledgeBase: knowledgeBase
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;
        setInputValue('');
        sendMessage(text);
    };

    // --- Status Logic ---
    // States: 'offline' | 'process' | 'online'
    const status = modelReady ? 'online' : (loadingProgress > 0 ? 'process' : 'offline');

    // Color Logic
    // Red (Offline) -> Orange/Yellow (Process) -> Green (Online)
    const getStatusColor = () => {
        if (status === 'online') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
        if (status === 'offline') return 'bg-red-500';

        // Process: Gradient from Red to Yellow/Greenish
        if (loadingProgress < 30) return 'bg-red-500';
        if (loadingProgress < 60) return 'bg-orange-500';
        return 'bg-yellow-400';
    };

    const getStatusText = () => {
        if (status === 'online') return 'Online';
        if (status === 'process') return `Loading AI Brain... ${Math.floor(loadingProgress)}%`;
        return 'Offline';
    };

    // Input disabled if NOT online
    // Exception: Booking Mode? Request said "Si no esta disponible ... no se podra escribir".
    // So ONLY Buttons allowed when offline/process.
    // If Booking Step "Idea" requires text, user is blocked until Online?
    // Request: "Si no hay llm descargado ... chat usara respuestas predefinidas ... y proceso de booking."
    // This implies Booking SHOULD work offline.
    // So if Booking Mode is active, Input SHOULD be enabled?
    // "Si no esta disponible el modelo no se podra escribir en el campo de texto" -> strictly implies disabled.
    // BUT "preceso de booking ... sin llm".
    // If "Idea" step requires typing, and we block typing, we break "booking sin llm".
    // Possible interpretation: The "Idea" step should be skipped or made optional/button-based if we want full offline?
    // OR, we enable input SPECIFICALLY for Booking Mode because it doesn't use LLM.
    // I will enable input for Booking Mode to satisfy "booking sin llm", but disable for General Chat if offline.
    const currentBookStep = bookingSteps[bookingStep];
    const isImageStep = bookingMode && currentBookStep?.type === 'image';
    const isInputDisabled = (status !== 'online' && !bookingMode) || isProcessing || isTyping || isImageStep;

    // Helper to render dossier fields
    const renderDossierField = (step: any, val: string, idx: number) => {
        const isImage = val.startsWith('IMAGE::');
        const displayVal = isImage ? val.replace('IMAGE::', '') : val;

        return (
            <div key={step.key} className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-700/50 flex justify-between items-center group hover:bg-zinc-900 transition-colors">
                <div className="flex-1 overflow-hidden">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1 tracking-wider">{step.key.replace('_', ' ')}</span>
                    {isImage ? (
                        <div className="flex items-center gap-3 mt-1">
                            <img src={displayVal} alt="Reference" className="w-16 h-16 object-cover rounded-lg border border-zinc-700" />
                            <span className="text-xs text-zinc-400 italic">Attached Image</span>
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-200 font-medium truncate">{displayVal}</p>
                    )}
                </div>
                <button
                    onClick={() => {
                        setShowDossier(false);
                        setBookingMode(true);
                        setBookingStep(idx);
                        setMessages(prev => [...prev, { role: 'assistant', content: `Ok, let's update your ${step.key}. ${getRandomVariation(step.question)}` }]);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-blue-400 transition-all bg-zinc-800 rounded-lg"
                    title="Edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
            </div>
        );
    };

    const clientFields = ['name', 'phone', 'email'];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                        style={{ height: '650px', maxHeight: '85vh' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center relative z-10 shadow-sm">
                            <div>
                                <h3 className="text-zinc-100 font-semibold tracking-tight">{config?.modalTitle || 'Studio Concierge'}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${getStatusColor()} ${status === 'process' ? 'animate-pulse' : ''}`}></div>
                                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                                        {getStatusText()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-md"
                                aria-label="Close chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Dossier Modal Overlay */}
                        <AnimatePresence>
                            {showDossier && (
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.95, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.95, y: 20 }}
                                        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-h-[95%] flex flex-col shadow-2xl overflow-hidden max-w-sm"
                                    >
                                        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                                                    <span>📋</span> Project Brief
                                                </h4>
                                                <p className="text-zinc-400 text-xs mt-1">Review your details before submission.</p>
                                            </div>
                                            <button
                                                onClick={() => setShowDossier(false)}
                                                className="text-zinc-500 hover:text-white transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>

                                        <div className="p-4 overflow-y-auto space-y-6 bg-zinc-950 flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
                                            {/* Client Details Section */}
                                            <div>
                                                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">Client Details</h5>
                                                <div className="space-y-2">
                                                    {bookingSteps.map((step, idx) => {
                                                        const val = bookingData[step.key];
                                                        if (!val || !clientFields.includes(step.key)) return null;
                                                        return renderDossierField(step, val, idx);
                                                    })}
                                                </div>
                                            </div>

                                            {/* Project Details Section */}
                                            <div>
                                                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">Project Concept</h5>
                                                <div className="space-y-2">
                                                    {bookingSteps.map((step, idx) => {
                                                        const val = bookingData[step.key];
                                                        // Filter out client fields and verification code
                                                        if (!val || clientFields.includes(step.key) || step.key === 'verification_code') return null;
                                                        return renderDossierField(step, val, idx);
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                                            <button
                                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                                onClick={confirmBooking}
                                            >
                                                <span>Confirm & Send Booking</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/95 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-zinc-800 text-zinc-100'
                                            }`}
                                        dangerouslySetInnerHTML={{
                                            __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                    {/* Image Display */}
                                    {msg.image && (
                                        <img src={msg.image} alt="User upload" className="mt-2 max-w-[200px] rounded-xl border border-zinc-700 shadow-md" />
                                    )}

                                    {/* Booking Options Buttons */}
                                    {index === messages.length - 1 && msg.role === 'assistant' && bookingMode && currentBookStep?.type === 'option' && currentBookStep?.options && !isTyping && messageQueue.length === 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in max-w-[90%]">
                                            {currentBookStep.options.map((option: string, idx: number) => (
                                                <button
                                                    key={`opt-${idx}`}
                                                    onClick={() => sendMessage(option)}
                                                    className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-600 hover:bg-green-600 hover:border-green-500 hover:text-white transition-all text-sm text-zinc-300 shadow-sm flex-grow text-left"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Calendar Step */}
                                    {index === messages.length - 1 && msg.role === 'assistant' && bookingMode && currentBookStep?.type === 'date' && !isTyping && messageQueue.length === 0 && (
                                        <div className="mt-4 animate-fade-in max-w-[90%]">
                                            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 scale-90 origin-top-left">
                                                <Calendar
                                                    artistName={bookingData.artist || "Studio"}
                                                    bookings={[]}
                                                    onSelectDate={(date, time) => {
                                                        advanceBookingFlow(`${date} at ${time}`);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Upload Button */}
                                    {index === messages.length - 1 && msg.role === 'assistant' && bookingMode && currentBookStep?.type === 'image' && !isTyping && messageQueue.length === 0 && (
                                        <div className="flex flex-col gap-2 mt-3 animate-fade-in max-w-[90%]">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-600 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all text-sm text-zinc-300 shadow-sm flex items-center gap-2 w-full justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                Upload Photo
                                            </button>
                                            <button
                                                onClick={handleSkipImage}
                                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
                                            >
                                                Skip / No Photo
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                    )}

                                    {/* Normal Suggestions */}
                                    {index === messages.length - 1 && msg.role === 'assistant' && !bookingMode && !showDossier && !isTyping && !isProcessing && messageQueue.length === 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in max-w-[90%]">
                                            {/* Quick Actions (Always visible/allowed) */}
                                            {config?.quickActions?.map((action, idx) => (
                                                <button
                                                    key={`qa-${idx}`}
                                                    onClick={() => sendMessage(action.prompt)}
                                                    className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-xs text-zinc-300 shadow-sm"
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 bg-zinc-800 border-t border-zinc-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={
                                        status !== 'online' && !bookingMode ? "Chat unavailable (Offline)" :
                                            (bookingMode && isImageStep) ? "Upload a photo or skip..." :
                                                bookingMode ? "Type your answer..." :
                                                    (config?.inputPlaceholder || "Ask a question...")
                                    }
                                    className={`flex-1 bg-zinc-900 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 border border-zinc-700 placeholder-zinc-500 ${bookingMode ? 'focus:ring-green-500/50' : 'focus:ring-blue-500/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={isInputDisabled /* Note: Image upload step doesn't require text input, so disabling is fine, they use buttons */}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isInputDisabled || !inputValue.trim()}
                                    className={`text-white p-2 rounded-xl transition-colors ${bookingMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-blue-500/25 hover:shadow-xl transition-all relative"
                aria-label="Toggle Assistant"
            >
                {/* External Status Dot */}
                <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-zinc-900 transition-colors duration-500 ${getStatusColor()}`}></div>

                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </motion.button>
            <style>{`
                @keyframes slide {
                    0% { left: -35%; }
                    100% { left: 100%; }
                }
                .animate-slide {
                    animation: slide 1.5s infinite linear;
                }
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

