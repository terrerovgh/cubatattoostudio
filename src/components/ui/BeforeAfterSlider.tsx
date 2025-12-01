import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, className = '' }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: MouseEvent | TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        // Prevent default behavior on touch to avoid scrolling interference
        if ('touches' in event && event.cancelable) {
            event.preventDefault();
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

        const position = ((clientX - containerRect.left) / containerRect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMove); // removeEventListener doesn't need options usually
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none ${className}`}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />

            {/* Before Image (Foreground - Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 z-10"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Visual Vertical Line */}
                <div className="absolute inset-y-0 -left-0.5 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" />

                {/* Interactive Touch Area - Wide column for easier grabbing */}
                <div
                    className="absolute inset-y-0 -left-8 w-16 cursor-ew-resize touch-none flex items-center justify-center group"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    {/* Visual Handle Button */}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-neutral-200 transition-transform group-active:scale-110">
                        <MoveHorizontal className="w-5 h-5 text-black" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white font-medium pointer-events-none border border-white/10">
                BEFORE
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white font-medium pointer-events-none border border-white/10">
                AFTER
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
