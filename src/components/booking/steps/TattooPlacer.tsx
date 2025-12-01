import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/BookingUI';

// Converts white pixels to transparent pixels
const removeWhiteBackground = (base64: string, threshold = 220): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(base64);

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (r > threshold && g > threshold && b > threshold) {
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(base64);
    });
};

const TattooPlacer = ({ bodyImage, tattooImage, onConfirm, onCancel }: {
    bodyImage: string, tattooImage: string, onConfirm: (b64: string) => void, onCancel: () => void
}) => {
    const [pos, setPos] = useState({ x: 0, y: 0 }); // Center initially
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [opacity, setOpacity] = useState(0.85);
    const [processedTattoo, setProcessedTattoo] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize
    useEffect(() => {
        setIsProcessing(true);
        removeWhiteBackground(tattooImage).then((result) => {
            setProcessedTattoo(result);
            setIsProcessing(false);
            // Center initial position
            if (containerRef.current) {
                setPos({
                    x: containerRef.current.clientWidth / 2 - 100,
                    y: containerRef.current.clientHeight / 2 - 100
                });
            }
        });
    }, [tattooImage]);

    // Touch Drag Logic
    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && containerRef.current) {
            const touch = e.touches[0];
            const rect = containerRef.current.getBoundingClientRect();
            setPos({
                x: touch.clientX - rect.left - 100 * scale, // Center offset approximation
                y: touch.clientY - rect.top - 100 * scale
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons === 1 && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setPos({
                x: e.clientX - rect.left - 100 * scale,
                y: e.clientY - rect.top - 100 * scale
            });
        }
    }

    const generateComposite = () => {
        if (!containerRef.current || !processedTattoo) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const bgImg = new Image();
        bgImg.src = bodyImage;

        bgImg.onload = () => {
            canvas.width = bgImg.naturalWidth;
            canvas.height = bgImg.naturalHeight;
            const container = containerRef.current!;
            const imgEl = container.querySelector('img.bg-target') as HTMLImageElement;

            const displayRatio = imgEl.width / imgEl.height;
            const naturalRatio = bgImg.naturalWidth / bgImg.naturalHeight;

            let renderW = imgEl.width;
            let renderH = imgEl.height;
            let offsetX = 0;
            let offsetY = 0;

            if (displayRatio > naturalRatio) {
                renderW = imgEl.height * naturalRatio;
                offsetX = (imgEl.width - renderW) / 2;
            } else {
                renderH = imgEl.width / naturalRatio;
                offsetY = (imgEl.height - renderH) / 2;
            }

            const scaleFactor = bgImg.naturalWidth / renderW;

            ctx?.drawImage(bgImg, 0, 0);

            const fgImg = new Image();
            fgImg.src = processedTattoo;
            fgImg.onload = () => {
                if (!ctx) return;
                ctx.save();

                const tattooX = (pos.x - offsetX) * scaleFactor;
                const tattooY = (pos.y - offsetY) * scaleFactor;

                const baseWidth = 200 * scale * scaleFactor;
                const baseHeight = baseWidth * (fgImg.naturalHeight / fgImg.naturalWidth);

                ctx.translate(tattooX + baseWidth / 2, tattooY + baseHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = opacity;

                ctx.drawImage(fgImg, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
                ctx.restore();

                onConfirm(canvas.toDataURL('image/png'));
            };
        };
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col h-[100dvh] animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <h3 className="font-bold drop-shadow-md text-white px-2">Adjust Placement</h3>
                <button onClick={onCancel} className="p-2 bg-black/50 backdrop-blur rounded-full text-white pointer-events-auto hover:bg-zinc-800 transition"><X className="w-6 h-6" /></button>
            </div>

            {/* Canvas Area */}
            <div
                className="relative flex-grow bg-zinc-900 overflow-hidden touch-none flex items-center justify-center cursor-move"
                ref={containerRef}
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
            >
                <img src={bodyImage} className="bg-target w-full h-full object-contain pointer-events-none opacity-80" alt="Body" />

                {isProcessing ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-white" />
                            <span className="text-sm font-medium text-white">Removing background...</span>
                        </div>
                    </div>
                ) : (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            width: '200px',
                            transform: `rotate(${rotation}deg) scale(${scale})`,
                            transformOrigin: 'center center',
                            opacity: opacity,
                            mixBlendMode: 'multiply'
                        }}
                    >
                        <img
                            src={processedTattoo!}
                            className="w-full h-auto drop-shadow-2xl select-none"
                            draggable={false}
                            style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                        />
                        <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-lg animate-pulse"></div>
                    </div>
                )}
            </div>

            {/* Controls Sheet */}
            <div className="bg-zinc-900 border-t border-zinc-800 p-6 pb-safe-area-bottom space-y-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-medium flex justify-between">
                            <span>Size</span> <span>{scale.toFixed(1)}x</span>
                        </label>
                        <input type="range" min="0.2" max="3" step="0.1" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-medium flex justify-between">
                            <span>Rotate</span> <span>{rotation}°</span>
                        </label>
                        <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs text-zinc-400 font-medium flex justify-between">
                            <span>Opacity</span> <span>{(opacity * 100).toFixed(0)}%</span>
                        </label>
                        <input type="range" min="0.3" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
                <Button onClick={generateComposite} className="w-full py-4 text-lg" disabled={isProcessing}>
                    <CheckCircle className="w-5 h-5" /> Simulate Reality
                </Button>
            </div>
        </div>
    );
};

export default TattooPlacer;
