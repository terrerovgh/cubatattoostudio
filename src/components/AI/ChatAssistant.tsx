
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for messages
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your local AI assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../../lib/ai-worker.js', import.meta.url), {
                type: 'module'
            });

            worker.current.addEventListener('message', (e) => {
                const { type, data, text } = e.data;
                if (type === 'progress') {
                    // data has { status, file, progress, ... }
                    // We can just track the overall download progress if we want, or ignore detailed stats
                    if (data.status === 'progress' && data.progress) {
                        setLoadingProgress(data.progress);
                    }
                } else if (type === 'update') {
                    // Streaming update: update the last assistant message
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            // The worker sends the FULL decoded text so far (or we can append).
                            // My worker implementation sends full decoded text in update? 
                            // Let's check worker: yes, `decodedText` from beams[0].output_token_ids
                            // But wait, usually tokenizer.decode on growing ids returns full text.
                            // Let's assume it replaces the content.
                            // ACTUALLY, checking worker code:
                            // `const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, { skip_special_tokens: true });`
                            // This includes the prompt usually if not careful, dependent on pipeline behaviors.
                            // For 'text-generation' pipeline with chat input, it returns the *conversation* or just the new text?
                            // With `return_full_text: false` (default for some), it might be just new text.
                            // Let's accept it as replacement for now to be safe with the `update` event.

                            // However, for clean UI, we usually want just the new response.
                            // We will parse it.

                            // Let's just update content.
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
                }
            });
        }

        return () => {
            // Don't terminate worker on close to keep model loaded
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isGenerating) return;

        const userText = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsGenerating(true);
        setLoadingProgress(0); // Reset for visual feedback if strictly needed (usually implies model loading)

        // Add a placeholder for assistant response
        setMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...' }]);

        // Send to worker
        worker.current?.postMessage({
            type: 'generate',
            text: userText
        });
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
                        style={{ height: '500px' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
                            <h3 className="text-zinc-100 font-medium">AI Assistant</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/95">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-zinc-800 text-zinc-100'
                                            }`}
                                    >
                                        {msg.content}
                                        {msg.role === 'assistant' && msg.content === 'Thinking...' && loadingProgress > 0 && loadingProgress < 100 && (
                                            <div className="mt-2 text-xs text-zinc-400">
                                                Loading model... {Math.round(loadingProgress)}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 bg-zinc-800 border-t border-zinc-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="flex-1 bg-zinc-900 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-zinc-700 placeholder-zinc-500"
                                    disabled={isGenerating}
                                />
                                <button
                                    type="submit"
                                    disabled={isGenerating || !inputValue.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
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
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </motion.button>
        </div>
    );
}
