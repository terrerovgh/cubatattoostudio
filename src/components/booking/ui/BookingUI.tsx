import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
    children, onClick, variant = 'primary', className = '', disabled = false, isLoading = false, title = '', icon
}: any) => {
    const baseStyle = "relative overflow-hidden px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] touch-manipulation select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:filter disabled:grayscale";
    const variants = {
        primary: "bg-white text-black shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5",
        secondary: "bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 hover:border-white/20",
        accent: "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5",
        ghost: "text-zinc-400 hover:text-white bg-transparent hover:bg-white/5",
        outline: "border-2 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent",
        icon: "p-3 bg-zinc-800/80 backdrop-blur border border-white/10 text-white rounded-xl hover:bg-zinc-700"
    };

    const styleClass = variants[variant as keyof typeof variants] || variants.primary;

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            title={title}
            className={`${baseStyle} ${styleClass} ${className} ${isLoading ? 'cursor-wait' : ''}`}
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon ? <span className="mr-1">{icon}</span> : null}
            {children}
        </button>
    );
};

export const Input = ({ label, error, icon, ...props }: any) => (
    <div className="flex flex-col gap-2 w-full">
        {label && <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>}
        <div className="relative group">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">
                    {icon}
                </div>
            )}
            <input
                className={`bg-zinc-900/50 border rounded-2xl ${icon ? 'pl-11 pr-5' : 'px-5'} py-4 text-base focus:outline-none transition-all placeholder:text-zinc-700 text-white w-full ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-white/30 hover:border-white/20'
                    }`}
                {...props}
            />
        </div>
        {error && (
            <div className="text-xs text-red-400 animate-in slide-in-from-top-1 fade-in duration-200 flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> {error}
            </div>
        )}
    </div>
);

export const Tabs = ({ options, selected, onChange }: { options: { id: string, label: string, icon?: any }[], selected: string, onChange: (id: string) => void }) => (
    <div className="flex p-1.5 bg-zinc-900/80 border border-white/5 rounded-2xl mb-6 relative w-full">
        {options.map(opt => (
            <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative z-10 ${selected === opt.id
                        ? 'text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
            >
                {opt.icon && <opt.icon className="w-4 h-4" />}
                {opt.label}
            </button>
        ))}
        <div
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-zinc-800 transition-all duration-300 ease-out shadow-sm"
            style={{
                left: `${(options.findIndex(o => o.id === selected) * (100 / options.length)) + 0.5}%`,
                width: `${(100 / options.length) - 1}%`
            }}
        />
    </div>
);

export const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6 space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">{subtitle}</p>}
    </div>
);
