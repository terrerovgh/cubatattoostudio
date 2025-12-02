import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, Clock, Wand2, Upload, User, ChevronRight, ChevronLeft, CheckCircle, 
  Image as ImageIcon, Sparkles, MapPin, X, Loader2, Camera, Sliders, Palette, Printer, Download,
  CreditCard, Lock, ShieldCheck, Crop, RefreshCw, Move, RotateCw, DollarSign, Ruler, Eye, Tag,
  Undo, Redo, ChevronDown, Monitor, Smartphone, PenTool
} from 'lucide-react';
import { BookingData, Step, BODY_PLACEMENTS, TIME_SLOTS } from './types';
import { generateTattooDesign, simulateTattooOnBody, refineDescription, enhanceTattooDesign } from './services/gemini';

// --- UI Components (Responsive & Mobile First) ---

const Button = ({ 
  children, onClick, variant = 'primary', className = '', disabled = false, isLoading = false, title = '', icon
}: any) => {
  const baseStyle = "relative overflow-hidden px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] touch-manipulation select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:filter disabled:grayscale";
  const variants = {
    primary: "bg-primary text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5",
    secondary: "bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 hover:border-white/20",
    accent: "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5",
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

const Input = ({ label, error, icon, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
      )}
      <input 
        className={`bg-zinc-900/50 border rounded-2xl ${icon ? 'pl-11 pr-5' : 'px-5'} py-4 text-base focus:outline-none transition-all placeholder:text-zinc-700 text-white w-full ${
          error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-white/10 focus:border-primary/50 hover:border-white/20'
        }`}
        {...props} 
      />
    </div>
    {error && (
      <div className="text-xs text-red-400 animate-in slide-in-from-top-1 fade-in duration-200 flex items-center gap-1 ml-1">
         <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"/> {error}
      </div>
    )}
  </div>
);

const Tabs = ({ options, selected, onChange }: { options: {id: string, label: string, icon?: any}[], selected: string, onChange: (id: string) => void }) => (
  <div className="flex p-1.5 bg-zinc-900/80 border border-white/5 rounded-2xl mb-6 relative w-full">
    {options.map(opt => (
      <button
        key={opt.id}
        onClick={() => onChange(opt.id)}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative z-10 ${
          selected === opt.id 
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

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6 space-y-2">
    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
    {subtitle && <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">{subtitle}</p>}
  </div>
);

// --- Helpers ---

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

// --- Image Cropper ---

const ImageCropper = ({ src, onConfirm, onCancel }: { src: string, onConfirm: (b64: string) => void, onCancel: () => void }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Default crop: Center 80%
    const w = width * 0.8;
    const h = height * 0.8;
    setCrop({
      x: (width - w) / 2,
      y: (height - h) / 2,
      width: w,
      height: h
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only start if left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    isDragging.current = true;
    startPos.current = { x, y };
    
    // We are starting a new drag
    setCrop({ x, y, width: 0, height: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const startX = startPos.current.x;
    const startY = startPos.current.y;
    
    // Calculate new rect coordinates
    // We clamp them to the image/container bounds
    const x = Math.max(0, Math.min(startX, currentX));
    const y = Math.max(0, Math.min(startY, currentY));
    const width = Math.min(rect.width - x, Math.abs(currentX - startX));
    const height = Math.min(rect.height - y, Math.abs(currentY - startY));

    setCrop({ x, y, width, height });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const performCrop = () => {
    const img = imgRef.current;
    if (!img || crop.width === 0 || crop.height === 0) return;

    const canvas = document.createElement('canvas');
    // Calculate scale factor (Natural Size / Displayed Size)
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0, 0,
      canvas.width,
      canvas.height
    );

    onConfirm(canvas.toDataURL('image/png'));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300">
      <div className="p-4 flex justify-between items-center bg-zinc-900/50 border-b border-white/5">
        <h3 className="font-bold text-lg flex items-center gap-2"><Crop className="w-5 h-5" /> Crop Image</h3>
        <button onClick={onCancel} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition"><X className="w-5 h-5"/></button>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4 overflow-hidden select-none touch-none">
        <div 
          ref={containerRef}
          className="relative shadow-2xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          <img 
            ref={imgRef}
            src={src} 
            onLoad={onImgLoad}
            className="max-w-full max-h-[70vh] block object-contain select-none pointer-events-none" 
            alt="Crop Target" 
            draggable={false}
          />
          
          {/* Overlay System */}
          <div className="absolute inset-0 pointer-events-none">
             {/* Dim Areas Outside Selection */}
             <div className="absolute top-0 left-0 right-0 bg-black/60" style={{ height: crop.y }} />
             <div className="absolute bottom-0 left-0 right-0 bg-black/60" style={{ top: crop.y + crop.height }} />
             <div className="absolute left-0 bg-black/60" style={{ top: crop.y, height: crop.height, width: crop.x }} />
             <div className="absolute right-0 bg-black/60" style={{ top: crop.y, height: crop.height, left: crop.x + crop.width }} />
          </div>

          {/* Active Selection Box */}
          <div 
            className="absolute border-2 border-primary shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{
              left: crop.x,
              top: crop.y,
              width: crop.width,
              height: crop.height
            }}
          >
            {/* Grid Lines Rule of Thirds */}
            <div className="absolute inset-0 flex flex-col justify-evenly opacity-30">
               <div className="h-px bg-white w-full shadow-sm"></div>
               <div className="h-px bg-white w-full shadow-sm"></div>
            </div>
             <div className="absolute inset-0 flex flex-row justify-evenly opacity-30">
               <div className="w-px bg-white h-full shadow-sm"></div>
               <div className="w-px bg-white h-full shadow-sm"></div>
            </div>
            {/* Size Badge */}
            <div className="absolute -top-6 left-0 bg-black/70 text-[10px] px-1.5 py-0.5 rounded text-white font-mono">
               {Math.round(crop.width)} x {Math.round(crop.height)}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
             <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white/80 border border-white/10 shadow-lg">
               Drag to select area
             </span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-zinc-900 border-t border-white/10 pb-safe-area-bottom flex flex-col md:flex-row gap-3">
        <Button onClick={() => onConfirm(src)} variant="secondary" className="w-full md:w-auto flex-1">
           Use Original (No Crop)
        </Button>
        <Button onClick={performCrop} className="w-full md:w-auto flex-[2]">
           <CheckCircle className="w-4 h-4 mr-2"/> Confirm Crop
        </Button>
      </div>
    </div>
  );
};

// --- Tattoo Placer (Mobile Optimized & Fullscreen) ---

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
    if(e.touches.length === 1 && containerRef.current) {
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

        ctx.translate(tattooX + baseWidth/2, tattooY + baseHeight/2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = opacity; 
        
        ctx.drawImage(fgImg, -baseWidth/2, -baseHeight/2, baseWidth, baseHeight);
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
        <button onClick={onCancel} className="p-2 bg-black/50 backdrop-blur rounded-full text-white pointer-events-auto hover:bg-zinc-800 transition"><X className="w-6 h-6"/></button>
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
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-sm font-medium">Removing background...</span>
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
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg animate-pulse"></div>
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
             <input type="range" min="0.2" max="3" step="0.1" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"/>
           </div>
           <div className="space-y-2">
             <label className="text-xs text-zinc-400 font-medium flex justify-between">
               <span>Rotate</span> <span>{rotation}°</span>
             </label>
             <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"/>
           </div>
           <div className="space-y-2 col-span-2 md:col-span-1">
             <label className="text-xs text-zinc-400 font-medium flex justify-between">
               <span>Opacity</span> <span>{(opacity * 100).toFixed(0)}%</span>
             </label>
             <input type="range" min="0.3" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"/>
           </div>
         </div>
         <Button onClick={generateComposite} className="w-full py-4 text-lg" disabled={isProcessing}>
           <CheckCircle className="w-5 h-5" /> Simulate Reality
         </Button>
      </div>
    </div>
  );
};

// --- Wizard Steps ---

const StepPersonal = ({ data, updateData }: any) => {
  const [errors, setErrors] = useState({ email: '', phone: '' });

  const validateEmail = (val: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setErrors(prev => ({ ...prev, email: val && !isValid ? 'Invalid email format' : '' }));
  };

  const validatePhone = (val: string) => {
    const isValid = val.replace(/\D/g, '').length >= 10;
    setErrors(prev => ({ ...prev, phone: val && !isValid ? 'Min 10 digits required' : '' }));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
      <div className="md:col-span-2">
         <SectionTitle title="Client Details" subtitle="We need your contact information to send you the booking confirmation and design files." />
      </div>
      
      <div className="space-y-5 md:col-span-1">
        <Input 
          label="Full Name"
          placeholder="e.g. Alex Doe"
          icon={<User className="w-5 h-5"/>}
          value={data.fullName}
          onChange={(e: any) => updateData({ fullName: e.target.value })}
        />
        <Input 
          label="Email Address"
          type="email"
          placeholder="alex@example.com"
          icon={<Monitor className="w-5 h-5"/>}
          value={data.email}
          onChange={(e: any) => { updateData({ email: e.target.value }); validateEmail(e.target.value); }}
          error={errors.email}
        />
        <Input 
          label="Phone Number"
          type="tel"
          placeholder="(555) 000-0000"
          icon={<Smartphone className="w-5 h-5"/>}
          value={data.phone}
          onChange={(e: any) => { updateData({ phone: e.target.value }); validatePhone(e.target.value); }}
          error={errors.phone}
        />
      </div>

      <div className="md:col-span-1">
        <div className="h-full bg-zinc-900/50 rounded-3xl p-8 border border-white/5 flex flex-col justify-center space-y-6">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                 <ShieldCheck className="w-6 h-6"/>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-1">Privacy Guarantee</h4>
                 <p className="text-sm text-zinc-400">Your designs and personal data are encrypted. We never share client information with third parties.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                 <Clock className="w-6 h-6"/>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-1">Quick Response</h4>
                 <p className="text-sm text-zinc-400">Our artists typically review bookings within 2 hours during business days.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StepDateTime = ({ data, updateData }: any) => {
  const today = new Date();
  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <SectionTitle title="Select Schedule" subtitle="Choose a date and time for your consultation appointment." />

      <div className="space-y-4">
        <label className="text-sm font-medium text-zinc-400 ml-1">Available Dates</label>
        
        {/* Adaptive: Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 snap-x md:mx-0 md:px-0 md:grid md:grid-cols-7 md:overflow-visible">
          {days.map((d, i) => {
            const isSelected = data.date?.toDateString() === d.toDateString();
            return (
              <button
                key={i}
                onClick={() => updateData({ date: d, timeSlot: null })}
                className={`flex-shrink-0 snap-center w-20 h-24 md:w-auto rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border group relative overflow-hidden ${
                  isSelected 
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className={`text-xs uppercase font-bold tracking-wider ${isSelected ? 'opacity-70' : 'opacity-50'}`}>
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-2xl font-bold">{d.getDate()}</span>
                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full animate-pulse"/>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <label className="text-sm font-medium text-zinc-400 ml-1">Available Time Slots</label>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-3">
          {TIME_SLOTS.map(time => (
            <button
              key={time}
              disabled={!data.date}
              onClick={() => updateData({ timeSlot: time })}
              className={`p-4 rounded-2xl border text-center font-medium transition-all duration-200 ${
                !data.date ? 'opacity-30 border-transparent bg-zinc-900 cursor-not-allowed' :
                data.timeSlot === time
                ? 'bg-white text-black border-white shadow-xl scale-[1.02]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 active:scale-95'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepPayment = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 md:grid md:grid-cols-2 md:gap-12 md:items-center">
      <div>
        <SectionTitle title="Secure Deposit" subtitle="A $50 refundable deposit is required to start the custom design process." />
        
        {/* Credit Card Abstract UI */}
        <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden mb-8 max-w-sm mx-auto md:mx-0 transform transition-transform hover:scale-[1.02] duration-500 group cursor-default">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          <div className="flex justify-between items-center mb-10 relative z-10">
             <div className="w-12 h-8 bg-zinc-600/50 backdrop-blur rounded-md border border-white/10"/>
             <CreditCard className="text-zinc-400 w-8 h-8"/>
          </div>
          <div className="space-y-4 mb-8 relative z-10">
             <div className="h-5 w-3/4 bg-zinc-700/50 rounded-full animate-pulse"/>
             <div className="h-4 w-1/2 bg-zinc-700/50 rounded-full animate-pulse"/>
          </div>
          <div className="flex justify-between items-end relative z-10">
             <div className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Encrypted Transaction</div>
             <Lock className="w-5 h-5 text-primary drop-shadow-[0_0_10px_rgba(212,177,98,0.5)]"/>
          </div>
        </div>
      </div>

      <div className="space-y-5 max-w-md mx-auto w-full">
        <Input placeholder="Card Number" icon={<CreditCard className="w-5 h-5"/>} />
        <div className="flex gap-4">
           <Input placeholder="MM/YY" />
           <Input placeholder="CVC" />
        </div>
        <Input placeholder="Cardholder Name" icon={<User className="w-5 h-5"/>} />
        
        <div className="flex justify-center text-xs text-zinc-500 items-center gap-2 mt-4 bg-zinc-900/50 py-3 rounded-xl">
           <ShieldCheck className="w-4 h-4 text-green-500"/> 
           <span>Processed securely via Stripe</span>
        </div>
      </div>
    </div>
  );
};

const StepDesign = ({ data, updateData }: any) => {
  const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const TATTOO_STYLES = [
    { id: 'realism', name: 'Realism', img: 'https://images.unsplash.com/photo-1590246295702-f940809228eb?auto=format&fit=crop&w=150&q=80' },
    { id: 'traditional', name: 'Traditional', img: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=150&q=80' },
    { id: 'minimalist', name: 'Minimalist', img: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=150&q=80' },
    { id: 'geometric', name: 'Geometric', img: 'https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&w=150&q=80' },
    { id: 'watercolor', name: 'Watercolor', img: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&w=150&q=80' },
    { id: 'lettering', name: 'Lettering', img: 'https://images.unsplash.com/photo-1595967735343-4cb50325b349?auto=format&fit=crop&w=150&q=80' },
    { id: 'blackwork', name: 'Blackwork', img: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=150&q=80' },
  ];

  const handleGenerate = async () => {
    if (!data.description) return;
    setIsGenerating(true);
    try {
      const refined = await refineDescription(data.description);
      const b64 = await generateTattooDesign(refined, data.style || 'Realism', data.complexity || 'detailed');
      updateData({ aiGeneratedDesign: b64 }, true);
    } catch (e) {
      alert("Error generating. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
     if(!data.referenceImage) return;
     setIsGenerating(true);
     try {
        const b64 = await enhanceTattooDesign(data.referenceImage, data.description || "Clean up this sketch", data.style || "Realism");
        updateData({ aiGeneratedDesign: b64 }, true);
     } catch (e) {
        alert("Enhancement failed.");
     } finally {
        setIsGenerating(false);
     }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.onload = () => setTempImage(r.result as string);
      r.readAsDataURL(e.target.files[0]);
      e.target.value = ''; // Reset input to allow re-selection of the same file
    }
  };

  // Calculate Price Logic
  useEffect(() => {
    if (!data.size || !data.style) return;
    let base = 100; // Small
    if (data.size === 'Medium') base = 250;
    if (data.size === 'Large') base = 500;
    if (data.complexity === 'Detailed') base *= 1.5;
    if (data.style === 'Realism') base *= 1.2;
    updateData({ estimatedPrice: `$${base} - $${Math.round(base * 1.3)}` });
  }, [data.size, data.style, data.complexity]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 h-full flex flex-col">
      {tempImage && <ImageCropper src={tempImage} onConfirm={(i) => {updateData({referenceImage: i}, true); setTempImage(null)}} onCancel={()=>setTempImage(null)} />}

      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <SectionTitle title="Design Studio" subtitle="Create unique art or upload a reference." />
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:h-full">
        {/* Left Column: Preview (Sticky on Desktop) */}
        <div className="md:order-1 relative">
           <div className="sticky top-24">
              <div className="relative aspect-square w-full bg-black rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
                {data.aiGeneratedDesign || data.referenceImage ? (
                  <img 
                    src={data.aiGeneratedDesign || data.referenceImage} 
                    className="w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-105" 
                    alt="Design" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600 bg-zinc-900/50">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                       <Wand2 className="w-8 h-8 opacity-40"/>
                    </div>
                    <span className="text-sm font-medium">Design Preview Area</span>
                  </div>
                )}
                
                {/* Actions Overlay */}
                {(data.aiGeneratedDesign || data.referenceImage) && (
                   <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="icon" onClick={() => updateData({aiGeneratedDesign: null, referenceImage: null})} title="Clear">
                         <RefreshCw className="w-4 h-4"/>
                      </Button>
                   </div>
                )}
              </div>
              <p className="text-center text-xs text-zinc-500 mt-4">
                {data.estimatedPrice ? `Est. Price: ${data.estimatedPrice}` : 'Price calculated based on complexity'}
              </p>
           </div>
        </div>

        {/* Right Column: Controls */}
        <div className="space-y-6 md:order-2">
           <Tabs 
             options={[
               {id: 'create', label: 'AI Generator', icon: Sparkles},
               {id: 'upload', label: 'Upload Reference', icon: Upload}
             ]} 
             selected={activeTab} 
             onChange={(id) => setActiveTab(id as any)} 
           />

           {activeTab === 'create' ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Style Selector Strip */}
                <div>
                  <label className="text-sm font-medium text-zinc-400 ml-1 mb-3 block">Art Style</label>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 snap-x md:mx-0 md:px-0">
                     {TATTOO_STYLES.map(s => (
                       <button 
                          key={s.id} 
                          onClick={() => updateData({ style: s.id })}
                          className="snap-start flex flex-col items-center gap-2 group flex-shrink-0"
                       >
                         <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ${data.style === s.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-105 shadow-xl shadow-black/50' : 'opacity-80 group-hover:opacity-100'}`}>
                           <img src={s.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                           {/* Highlight overlay for active state */}
                           {data.style === s.id && <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"/>}
                         </div>
                         <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${data.style === s.id ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                           {s.name}
                         </span>
                       </button>
                     ))}
                  </div>
                </div>

                {/* Size Card Selector */}
                <div>
                   <label className="text-sm font-medium text-zinc-400 ml-1 mb-3 block">Approximate Size</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['Small', 'Medium', 'Large'].map(sz => (
                        <button
                          key={sz}
                          onClick={() => updateData({ size: sz })}
                          className={`p-4 rounded-xl border transition-all ${data.size === sz ? 'bg-zinc-800 border-primary text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                        >
                          <span className="block text-sm font-bold">{sz}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-sm font-medium text-zinc-400 ml-1">Describe your Vision</label>
                   <div className="relative group">
                      <textarea 
                        value={data.description}
                        onChange={(e) => updateData({description: e.target.value})}
                        placeholder="e.g. A geometric wolf head with floral accents..."
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-5 text-white h-40 resize-none focus:outline-none focus:border-primary/50 transition-colors text-base"
                      />
                      <div className="absolute bottom-4 right-4">
                        <Button 
                          onClick={handleGenerate}
                          disabled={isGenerating || !data.description}
                          variant="accent"
                          className="rounded-xl px-4 py-2 text-sm shadow-xl"
                          isLoading={isGenerating}
                        >
                           <Sparkles className="w-4 h-4 mr-2"/> Generate
                        </Button>
                      </div>
                   </div>
                   <p className="text-xs text-zinc-500 ml-2">AI generates a custom high-contrast stencil.</p>
                </div>
             </div>
           ) : (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-zinc-900 hover:border-zinc-500 transition-colors cursor-pointer relative">
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} accept="image/*" />
                   <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-zinc-400"/>
                   </div>
                   <div>
                      <h4 className="font-bold text-white">Click to Upload</h4>
                      <p className="text-sm text-zinc-500 mt-1">Supports JPG, PNG (Max 10MB)</p>
                   </div>
                </div>

                {data.referenceImage && (
                   <div className="bg-zinc-800/50 p-6 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                         <Sparkles className="w-5 h-5 text-primary"/>
                         <h4 className="font-bold">AI Enhancer</h4>
                      </div>
                      <p className="text-sm text-zinc-400">Transform your sketch into a polished tattoo design using Gemini.</p>
                      <Button onClick={handleEnhance} isLoading={isGenerating} variant="secondary" className="w-full">
                         Enhance Image
                      </Button>
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const StepSimulation = ({ data, updateData }: any) => {
  const [showPlacer, setShowPlacer] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleSimulate = async (composite: string) => {
    setShowPlacer(false);
    setIsSimulating(true);
    try {
      const res = await simulateTattooOnBody(composite, data.description);
      updateData({ aiSimulation: res }, true);
    } catch {
      alert("Simulation failed.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const r = new FileReader();
      r.onload = () => setTempImage(r.result as string);
      r.readAsDataURL(e.target.files[0]);
      e.target.value = ''; // Reset input to allow re-selection of the same file
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      {tempImage && <ImageCropper src={tempImage} onConfirm={(i) => {updateData({bodyPhoto: i}, true); setTempImage(null)}} onCancel={()=>setTempImage(null)} />}
      
      {showPlacer && (
        <TattooPlacer 
          bodyImage={data.bodyPhoto!} 
          tattooImage={data.aiGeneratedDesign || data.referenceImage} 
          onConfirm={handleSimulate} 
          onCancel={()=>setShowPlacer(false)} 
        />
      )}

      <SectionTitle title="Virtual Try-On" subtitle="Visualize the tattoo on your body using AR simulation." />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Visualizer */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl group">
          {isSimulating ? (
             <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse"/>
                  </div>
                </div>
                <div>
                   <h3 className="font-bold text-white mb-1">Rendering Simulation</h3>
                   <p className="text-sm text-zinc-500">Mapping skin texture and lighting...</p>
                </div>
             </div>
          ) : data.aiSimulation ? (
             <img src={data.aiSimulation} className="w-full h-full object-cover" />
          ) : data.bodyPhoto ? (
             <img src={data.bodyPhoto} className="w-full h-full object-cover opacity-60 grayscale-[0.2]" />
          ) : (
             <div className="text-center p-8 max-w-xs">
               <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                  <Camera className="w-8 h-8 text-zinc-600"/>
               </div>
               <h3 className="text-lg font-bold text-white mb-2">No Photo Selected</h3>
               <p className="text-zinc-500 text-sm">Upload a clear photo of the body part to start the simulation.</p>
             </div>
          )}

          {/* Floating Action Button for Upload */}
          {!data.aiSimulation && !isSimulating && (
             <label className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 cursor-pointer active:scale-95 transition hover:bg-zinc-200 w-max z-10 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <Camera className="w-5 h-5"/>
                {data.bodyPhoto ? "Retake Photo" : "Upload Body Photo"}
                <input type="file" className="hidden" onChange={handleFile} accept="image/*"/>
             </label>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="flex flex-col justify-center space-y-6">
           <div className="bg-zinc-900/80 backdrop-blur p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl">
              <h3 className="font-bold flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-primary"/> AI Reality Engine</h3>
              <ul className="space-y-4">
                 <li className="flex gap-4 items-start">
                    <div className="p-2 bg-zinc-800 rounded-lg"><Move className="w-4 h-4 text-zinc-400"/></div>
                    <div>
                      <span className="block font-medium text-white text-sm">Precise Placement</span>
                      <span className="text-xs text-zinc-500">Rotate and scale design on skin</span>
                    </div>
                 </li>
                 <li className="flex gap-4 items-start">
                    <div className="p-2 bg-zinc-800 rounded-lg"><Eye className="w-4 h-4 text-zinc-400"/></div>
                    <div>
                      <span className="block font-medium text-white text-sm">Texture Blending</span>
                      <span className="text-xs text-zinc-500">Ink appears under skin pores</span>
                    </div>
                 </li>
              </ul>
           </div>

           {data.bodyPhoto && (data.aiGeneratedDesign || data.referenceImage) && !isSimulating && (
             <Button onClick={() => setShowPlacer(true)} variant="accent" className="w-full py-5 text-lg shadow-accent/20 rounded-2xl">
                <PenTool className="w-5 h-5"/> Enter Placement Editor
             </Button>
           )}
           
           {data.aiSimulation && (
             <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={() => updateData({ aiSimulation: null })}>
                   <RefreshCw className="w-4 h-4"/> Reset
                </Button>
                <Button variant="outline" onClick={() => {
                   const a = document.createElement('a');
                   a.href = data.aiSimulation;
                   a.download = 'inkflow-sim.png';
                   a.click();
                }}>
                   <Download className="w-4 h-4"/> Download
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Landing Screen (API Key) ---

const Landing = ({ onConnect }: { onConnect: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[100dvh] h-full text-center p-6 space-y-10 animate-in fade-in zoom-in duration-500 bg-background">
    <div className="relative">
      <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="w-32 h-32 bg-zinc-900 rounded-3xl border border-white/10 flex items-center justify-center relative shadow-2xl rotate-3">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>
    </div>
    
    <div className="space-y-4 max-w-md">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">InkFlow AI</h1>
      <p className="text-zinc-400 text-lg leading-relaxed">
        Experience the future of tattoo design. <br/>Visualize your next ink with photorealistic AI simulation.
      </p>
    </div>
    
    <div className="p-8 bg-zinc-900/50 backdrop-blur rounded-3xl border border-white/5 max-w-sm w-full shadow-xl">
      <Button onClick={onConnect} className="w-full py-4 text-lg mb-4">
         Connect Gemini API
      </Button>
      <p className="text-xs text-zinc-500">
        Requires a valid Google Cloud API key with access to Gemini 1.5 Pro Vision models.
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="block mt-2 text-primary hover:underline">
          Get API Key &rarr;
        </a>
      </p>
    </div>
  </div>
);

// --- Main Widget Container ---

const InkFlowBookingWidget: React.FC<{ className?: string, onBookingComplete?: (data: BookingData) => void }> = ({ className = '', onBookingComplete }) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [step, setStep] = useState<Step>(Step.PERSONAL);
  const [history, setHistory] = useState<BookingData[]>([{
    placement: '', description: '', style: '', complexity: '', size: '', estimatedPrice: '',
    referenceImage: null, aiGeneratedDesign: null, aiSimulation: null, bodyPhoto: null,
    date: null, timeSlot: null, fullName: '', email: '', phone: ''
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const data = history[historyIndex];

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const updateData = (updates: Partial<BookingData>, saveSnapshot = false) => {
    const currentData = history[historyIndex];
    const newData = { ...currentData, ...updates };
    const newHistory = history.slice(0, historyIndex + 1);
    
    if (saveSnapshot) {
       newHistory.push(newData);
       setHistory(newHistory);
       setHistoryIndex(newHistory.length - 1);
    } else {
       newHistory[historyIndex] = newData;
       setHistory(newHistory);
    }
  };

  const steps = [
    { id: Step.PERSONAL, label: 'Info' },
    { id: Step.DATETIME, label: 'Date' },
    { id: Step.PAYMENT, label: 'Pay' },
    { id: Step.DESIGN, label: 'Design' },
    { id: Step.SIMULATION, label: 'Sim' },
    { id: Step.SUMMARY, label: 'Done' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const goNext = () => {
    if (step === Step.PERSONAL) setStep(Step.DATETIME);
    else if (step === Step.DATETIME) setStep(Step.PAYMENT);
    else if (step === Step.PAYMENT) setStep(Step.DESIGN);
    else if (step === Step.DESIGN) setStep(Step.SIMULATION);
    else if (step === Step.SIMULATION) setStep(Step.SUMMARY);
  };

  const goBack = () => {
    if (step === Step.DATETIME) setStep(Step.PERSONAL);
    else if (step === Step.PAYMENT) setStep(Step.DATETIME);
    else if (step === Step.DESIGN) setStep(Step.PAYMENT);
    else if (step === Step.SIMULATION) setStep(Step.DESIGN);
    else if (step === Step.SUMMARY) setStep(Step.SIMULATION);
  };

  const canContinue = () => {
    if (step === Step.PERSONAL) return data.fullName && data.email && data.phone;
    if (step === Step.DATETIME) return data.date && data.timeSlot;
    if (step === Step.PAYMENT) return true;
    if (step === Step.DESIGN) return data.aiGeneratedDesign || data.referenceImage;
    if (step === Step.SIMULATION) return !!data.aiSimulation;
    return true;
  };

  if (!hasApiKey) {
    return <Landing onConnect={handleConnect} />;
  }

  return (
    <div className={`bg-background text-white flex flex-col relative h-[100dvh] md:h-auto md:min-h-[800px] md:max-h-[900px] w-full max-w-6xl mx-auto md:rounded-[2.5rem] overflow-hidden shadow-2xl md:border border-zinc-800 ${className}`}>
      
      {/* Top Bar (Sticky) */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 md:h-20 flex items-center justify-between shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          {step !== Step.PERSONAL && (
            <button onClick={goBack} className="p-2.5 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition active:scale-95">
              <ChevronLeft className="w-6 h-6"/>
            </button>
          )}
          <span className="font-bold text-lg md:text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">INKFLOW</span>
        </div>
        <div className="flex gap-1 bg-zinc-900/80 rounded-xl p-1 border border-white/5">
           <button onClick={() => setHistoryIndex(i => Math.max(0, i - 1))} disabled={historyIndex === 0} className="p-2.5 text-zinc-400 hover:text-white disabled:opacity-30 transition rounded-lg hover:bg-white/5"><Undo className="w-5 h-5"/></button>
           <div className="w-px bg-white/10 my-1"></div>
           <button onClick={() => setHistoryIndex(i => Math.min(history.length - 1, i + 1))} disabled={historyIndex === history.length - 1} className="p-2.5 text-zinc-400 hover:text-white disabled:opacity-30 transition rounded-lg hover:bg-white/5"><Redo className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-zinc-900 w-full shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-800/50"></div>
        <div className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_0_15px_rgba(212,177,98,0.6)]" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-grow overflow-y-auto custom-scrollbar relative bg-gradient-to-b from-zinc-900/0 to-zinc-900/20">
        <div className="p-6 pb-40 md:p-12 md:pb-40 max-w-5xl mx-auto h-full">
           {step === Step.PERSONAL && <StepPersonal data={data} updateData={updateData} />}
           {step === Step.DATETIME && <StepDateTime data={data} updateData={updateData} />}
           {step === Step.PAYMENT && <StepPayment />}
           {step === Step.DESIGN && <StepDesign data={data} updateData={updateData} />}
           {step === Step.SIMULATION && <StepSimulation data={data} updateData={updateData} />}
           {step === Step.SUMMARY && (
              <div className="text-center space-y-10 animate-in zoom-in-95 py-10 md:py-20 flex flex-col items-center">
                 <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle className="w-16 h-16 text-green-500 relative z-10"/>
                 </div>
                 <div className="space-y-2">
                   <h2 className="text-3xl md:text-5xl font-bold text-white">Booking Confirmed</h2>
                   <p className="text-zinc-400 text-lg">Your design session is officially reserved.</p>
                 </div>
                 
                 {/* Ticket Card */}
                 <div className="bg-zinc-900 rounded-[2rem] p-8 border border-white/5 w-full max-w-sm shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>
                    
                    {/* Perforations */}
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-background rounded-full"></div>
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-background rounded-full"></div>
                    <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-zinc-800"></div>

                    <div className="space-y-6 relative z-10 pb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Client</span>
                        <span className="font-semibold text-lg">{data.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</span>
                        <span className="font-semibold text-lg">{data.date?.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10 pt-8">
                       <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Time</span>
                        <span className="font-semibold text-lg">{data.timeSlot}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-xl">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Deposit Paid</span>
                        <span className="font-bold text-xl text-green-400">$50.00</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                       <span className="text-[10px] text-zinc-600 font-mono">{Math.random().toString(36).substring(7).toUpperCase()} • AUTHORIZED</span>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Bottom Action Bar (Sticky within Container) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-4xl mx-auto">
          {step === Step.SUMMARY ? (
             <Button onClick={() => onBookingComplete?.(data)} className="w-full py-5 text-lg bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10 rounded-2xl">
               Finish & Download <Download className="w-5 h-5 ml-2"/>
             </Button>
          ) : (
             <Button 
               onClick={goNext} 
               disabled={!canContinue()} 
               className="w-full py-5 text-lg shadow-2xl rounded-2xl transition-transform active:scale-[0.98]"
               variant={canContinue() ? 'primary' : 'secondary'}
             >
               Continue <ChevronRight className="w-6 h-6 ml-1"/>
             </Button>
          )}
        </div>
      </div>

    </div>
  );
};

export default InkFlowBookingWidget;