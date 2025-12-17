import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for messages and config
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatConfig {
    assistantName: string;
    modalTitle: string;
    welcomeMessage: string;
    inputPlaceholder: string;
    quickActions?: { label: string; prompt: string }[];
    staticResponses?: { trigger: string; response: string }[];
}

interface ChatAssistantProps {
    config?: ChatConfig;
    systemPrompt?: string;
    knowledgeBase?: string;
}

// Booking State
interface BookingData {
    idea: string;
    placement: string;
    size: string;
    style: string;
    references: string;
}

const BOOKING_STEPS = [
    { key: 'idea', question: "Let's get you booked! First, please briefly describe your **tattoo idea** or concept." },
    { key: 'placement', question: "Great idea! **Where on your body** would you like to get this tattoo?" },
    { key: 'size', question: "Roughly what **size** are you thinking? (e.g., 3x3 inches, full sleeve, palm size)" },
    { key: 'style', question: "Do you have a specific **style** in mind? (e.g., Realism, Traditional, Fine Line)" },
    { key: 'references', question: "Do you have any reference images? If yes, please paste a link here. If not, just type 'no'." }
];

export default function ChatAssistant({ config, systemPrompt, knowledgeBase }: ChatAssistantProps) {
    const defaultMessages: Message[] = [
        { role: 'assistant', content: config?.welcomeMessage || 'Hello! How can I help you today?' }
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(defaultMessages);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Booking Flow State
    const [bookingMode, setBookingMode] = useState(false);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState<BookingData>({
        idea: '', placement: '', size: '', style: '', references: ''
    });
    const [showDossier, setShowDossier] = useState(false);

    const worker = useRef<Worker | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
                } else if (type === 'update') {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            return [...newMessages.slice(0, -1), { ...lastMsg, content: text }];
                        }
                        return prev;
                    });
                } else if (type === 'complete') {
                    setIsGenerating(false);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            return [...newMessages.slice(0, -1), { ...lastMsg, content: text }];
                        }
                        return prev;
                    });
                } else if (type === 'error') {
                    setIsGenerating(false);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            return [...newMessages.slice(0, -1), { ...lastMsg, content: `Error: ${e.data.error}` }];
                        }
                        return prev;
                    });
                }
            });
        }
        return () => { };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating, showDossier]);

    const handleStaticResponse = (text: string): boolean => {
        // Check for "Book Appointment" trigger
        if (text.toLowerCase().includes('book appointment') || text.toLowerCase().includes('booking')) {
            startBookingFlow();
            return true;
        }

        if (!config?.staticResponses) return false;
        const match = config.staticResponses.find(r =>
            text.toLowerCase().includes(r.trigger.toLowerCase()) ||
            r.trigger.toLowerCase().includes(text.toLowerCase())
        );

        if (match) {
            setMessages(prev => [...prev, { role: 'assistant', content: match.response }]);
            return true;
        }
        return false;
    };

    const startBookingFlow = () => {
        setBookingMode(true);
        setBookingStep(0);
        setBookingData({ idea: '', placement: '', size: '', style: '', references: '' });
        setMessages(prev => [...prev, { role: 'assistant', content: BOOKING_STEPS[0].question }]);
    };

    const advanceBookingFlow = (userAnswer: string) => {
        const currentField = BOOKING_STEPS[bookingStep].key as keyof BookingData;
        setBookingData(prev => ({ ...prev, [currentField]: userAnswer }));

        const nextStep = bookingStep + 1;
        if (nextStep < BOOKING_STEPS.length) {
            setBookingStep(nextStep);
            setIsGenerating(true);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: BOOKING_STEPS[nextStep].question }]);
                setIsGenerating(false);
            }, 600);
        } else {
            setBookingMode(false);
            setIsGenerating(true);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: "Perfect! I've gathered all your details. Please review your Request Dossier below:" }]);
                setIsGenerating(false);
                setShowDossier(true);
            }, 800);
        }
    };

    const sendMessage = (text: string) => {
        if (!text.trim() || isGenerating) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);

        if (bookingMode) {
            advanceBookingFlow(text);
            return;
        }

        if (handleStaticResponse(text)) {
            return;
        }

        setIsGenerating(true);
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '600px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center relative">
                            <div>
                                <h3 className="text-zinc-100 font-medium">{config?.modalTitle || 'Studio Concierge'}</h3>
                                <p className="text-[10px] text-zinc-400">{bookingMode ? '📝 Booking Application' : '🟢 Online'}</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            {/* Silent Loading Bar */}
                            {isGenerating && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-700/50 overflow-hidden">
                                    {loadingProgress > 0 && loadingProgress < 100 ? (
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                            style={{ width: `${loadingProgress}%` }}
                                        ></div>
                                    ) : (
                                        <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-500 animate-slide"></div>
                                    )}
                                </div>
                            )}
                        </div>

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

                                    {/* Suggestions - Only show after the LAST assistant message if not in booking mode */}
                                    {index === messages.length - 1 && msg.role === 'assistant' && !bookingMode && !showDossier && !isGenerating && (
                                        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in max-w-[90%]">
                                            {/* Quick Actions */}
                                            {config?.quickActions?.map((action, idx) => (
                                                <button
                                                    key={`qa-${idx}`}
                                                    onClick={() => sendMessage(action.prompt)}
                                                    className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-xs text-zinc-300 shadow-sm"
                                                >
                                                    {action.label}
                                                </button>
                                            ))}

                                            {/* Static Responses (filtered to avoid duplicates with quick actions if prompts match) */}
                                            {config?.staticResponses?.filter(r =>
                                                !config.quickActions?.some(qa => qa.prompt === r.trigger)
                                            ).map((response, idx) => (
                                                <button
                                                    key={`sr-${idx}`}
                                                    onClick={() => sendMessage(response.trigger)}
                                                    className="px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-xs text-zinc-300 shadow-sm"
                                                >
                                                    {response.trigger}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Dossier Card (Summary) */}
                            {showDossier && (
                                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mt-4 animate-fade-in mx-2">
                                    <h4 className="text-white font-bold mb-3 border-b border-zinc-600 pb-2">📋 Booking Request Dossier</h4>
                                    <div className="space-y-2 text-xs text-zinc-300">
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-zinc-500 uppercase font-mono">Concept:</span>
                                            <span className="font-medium text-white">{bookingData.idea}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-zinc-500 uppercase font-mono">Placement:</span>
                                            <span className="font-medium text-white">{bookingData.placement}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-zinc-500 uppercase font-mono">Size:</span>
                                            <span className="font-medium text-white">{bookingData.size}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-zinc-500 uppercase font-mono">Style:</span>
                                            <span className="font-medium text-white">{bookingData.style}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                                            onClick={() => alert('Request sent to artists! (Mock)')}
                                        >
                                            Confirm & Send
                                        </button>
                                        <button
                                            className="px-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm"
                                            onClick={() => { setShowDossier(false); setBookingMode(false); }}
                                        >
                                            Edit
                                        </button>
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
                                    placeholder={bookingMode ? "Type your answer..." : (config?.inputPlaceholder || "Ask a question...")}
                                    className={`flex-1 bg-zinc-900 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 border border-zinc-700 placeholder-zinc-500 ${bookingMode ? 'focus:ring-green-500/50' : 'focus:ring-blue-500/50'}`}
                                    disabled={(isGenerating && !bookingMode) || (bookingMode && isGenerating)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={(isGenerating && !bookingMode) || (bookingMode && isGenerating) || !inputValue.trim()}
                                    className={`text-white p-2 rounded-xl transition-colors ${bookingMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
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
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-blue-500/25 hover:shadow-xl transition-all"
                aria-label="Toggle Assistant"
            >
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
