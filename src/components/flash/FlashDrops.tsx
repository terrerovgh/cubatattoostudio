import { useState, useEffect } from 'react';
import type { FlashDesign } from '../../types/booking';
import { Button, Badge, Input } from '@cloudflare/kumo';
import { Clock, Tag, User, Info, CheckCircle2 } from 'lucide-react';

export function FlashDrops() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<FlashDesign | null>(null);
  const [claimForm, setClaimForm] = useState({ email: '', first_name: '', last_name: '' });
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [filterArtist, setFilterArtist] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigns();
    
    // Polling for real-time stock updates every 30 seconds
    const interval = setInterval(fetchDesigns, 30000);
    return () => clearInterval(interval);
  }, [filterArtist]);

  const fetchDesigns = async () => {
    try {
      const params = new URLSearchParams({ status: 'available' });
      if (filterArtist) params.set('artist_id', filterArtist);
      const res = await fetch(`/api/flash/drops?${params}`);
      const data = await res.json() as any;
      if (data.success) setDesigns(data.data.designs || []);
    } catch (err) {
      console.error('Failed to fetch flash designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedDesign || !claimForm.email || !claimForm.first_name) return;
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch('/api/flash/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flash_design_id: selectedDesign.id,
          ...claimForm,
        }),
      });
      const data = await res.json() as any;
      if (data.success) {
        setClaimResult(data);
        fetchDesigns();
      } else {
        setError(data.error || 'Failed to claim design');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    }
    setClaiming(false);
  };

  const getCountdown = (dropDate: string) => {
    const diff = new Date(dropDate).getTime() - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">Flash Designs</h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base font-light">
          Limited edition designs available for immediate claiming. Secure your favorite before it's gone forever.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-max mx-auto overflow-x-auto scrollbar-hide">
        {[
          { id: '', label: 'All Artists' },
          { id: 'david', label: 'David' },
          { id: 'nina', label: 'Nina' },
          { id: 'karli', label: 'Karli' },
        ].map((f) => (
          <Button
            client:load
            key={f.id}
            variant="ghost"
            onClick={() => setFilterArtist(f.id)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterArtist === f.id
                ? 'bg-[#C8956C] text-black shadow-[0_4px_15px_rgba(200,149,108,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading && designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/40 space-y-4">
          <div className="w-8 h-8 border-3 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-widest uppercase">Loading designs...</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
          <Tag className="w-12 h-12 text-white/10 mx-auto mb-4" strokeWidth={1} />
          <p className="text-white/40 text-lg font-light">No designs available currently</p>
          <p className="text-white/20 text-sm mt-2">Check back soon or follow us for drops!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-stagger-wave>
          {designs.map((design) => {
            const countdown = design.is_drop && design.drop_date ? getCountdown(design.drop_date) : null;
            const remaining = design.drop_quantity - design.claimed_count;
            const isSoldOut = remaining <= 0;

            return (
              <div
                key={design.id}
                className="group relative rounded-[2rem] bg-[#0a0a0d] border border-white/[0.05] overflow-hidden hover:border-[#C8956C]/40 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_20px_50px_rgba(200,149,108,0.15)] card-hover-lift flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <img
                    src={design.image_url}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="flex flex-col gap-2">
                      {design.is_drop && (
                        <Badge client:load className="bg-[#C8956C] text-black border-0 font-black tracking-tighter px-3 shadow-lg">
                          DROP
                        </Badge>
                      )}
                      {design.early_bird_discount > 0 && design.claimed_count < design.early_bird_slots && (
                        <Badge client:load className="bg-emerald-500 text-white border-0 font-bold px-3 shadow-lg flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Early Bird -{design.early_bird_discount}%
                        </Badge>
                      )}
                    </div>
                    {countdown && (
                      <Badge client:load className="bg-red-500/90 text-white border-0 font-bold px-3 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                        <Clock size={12} />
                        {countdown}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Sold Out Overlay */}
                  {isSoldOut && (
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <p className="text-white/90 text-2xl font-black tracking-[0.2em] uppercase -rotate-12 border-4 border-white/20 px-6 py-2">
                        Sold Out
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-lg sm:text-xl tracking-tight truncate">{design.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-white/40 text-xs font-medium uppercase tracking-widest">
                        <User size={12} className="text-[#C8956C]" />
                        <span>{design.artist_id}</span>
                        <span className="opacity-30">•</span>
                        <span>{design.style}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {design.original_price && design.original_price > design.price && (
                        <p className="text-white/20 text-xs line-through mb-0.5">${design.original_price}</p>
                      )}
                      <p className="text-[#C8956C] text-xl font-black tracking-tight">${design.price}</p>
                    </div>
                  </div>

                  {design.description && (
                    <p className="text-white/50 text-sm font-light leading-relaxed line-clamp-2">{design.description}</p>
                  )}

                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold uppercase tracking-widest ${isSoldOut ? 'text-white/20' : 'text-white/40'}`}>
                        Inventory
                      </span>
                      <span className={`text-sm font-medium ${isSoldOut ? 'text-white/10' : 'text-white/60'}`}>
                        {isSoldOut ? 'Unavailable' : `${remaining} Designs Left`}
                      </span>
                    </div>
                    
                    <Button
                      client:load
                      onClick={() => {
                        setSelectedDesign(design);
                        setClaimResult(null);
                      }}
                      disabled={isSoldOut || !!countdown}
                      className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-500 shadow-xl ${
                        !isSoldOut && !countdown
                          ? 'bg-[#C8956C] text-black hover:bg-white hover:shadow-[0_10px_30px_rgba(200,149,108,0.4)] hover:-translate-y-1'
                          : 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {countdown ? 'Coming Soon' : isSoldOut ? 'Out of Stock' : 'Claim Now'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Modal */}
      {selectedDesign && !claimResult && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.4s_ease-out]" 
          onClick={() => setSelectedDesign(null)}
        >
          <div 
            className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#0a0a0d] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C8956C]/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <Badge client:load className="bg-[#C8956C]/10 text-[#C8956C] border-[#C8956C]/20 mb-2">Claim Reservation</Badge>
                <h3 className="font-black text-white text-2xl tracking-tight leading-tight uppercase">
                  {selectedDesign.title}
                </h3>
                <p className="text-white/40 text-sm font-light">Confirm your details to claim this work.</p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <Info size={14} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input client:load type="text" placeholder="First" value={claimForm.first_name}
                      onChange={(e: any) => setClaimForm((p) => ({ ...p, first_name: e.target.value }))}
                      className="bg-white/5 border-white/10 focus:border-[#C8956C]/50 text-white rounded-xl h-12" />
                    <Input client:load type="text" placeholder="Last" value={claimForm.last_name}
                      onChange={(e: any) => setClaimForm((p) => ({ ...p, last_name: e.target.value }))}
                      className="bg-white/5 border-white/10 focus:border-[#C8956C]/50 text-white rounded-xl h-12" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                  <Input client:load type="email" placeholder="you@example.com" value={claimForm.email}
                    onChange={(e: any) => setClaimForm((p) => ({ ...p, email: e.target.value }))}
                    className="bg-white/5 border-white/10 focus:border-[#C8956C]/50 text-white rounded-xl h-12 w-full" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  client:load
                  variant="ghost"
                  onClick={() => setSelectedDesign(null)} 
                  className="flex-1 h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  client:load
                  onClick={handleClaim}
                  disabled={claiming || !claimForm.email || !claimForm.first_name}
                  className="flex-1 h-12 rounded-xl bg-[#C8956C] text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50"
                >
                  {claiming ? 'Processing...' : `Secure for $${selectedDesign.price}`}
                </Button>
              </div>
              
              <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.2em]">
                By claiming you agree to our booking terms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claim Success */}
      {claimResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.5s_ease-out]">
          <div className="w-full max-w-md p-10 rounded-[3rem] bg-[#0a0a0d] border border-[#C8956C]/20 text-center space-y-8 shadow-[0_50px_150px_rgba(200,149,108,0.2)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#C8956C]/10 flex items-center justify-center text-[#C8956C] border border-[#C8956C]/20 text-3xl animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-black text-white text-3xl tracking-tight uppercase">{claimResult.message}</h3>
              <p className="text-white/50 font-light">Your design has been reserved exclusively for you.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 space-y-3">
              {claimResult.data?.discount_percent > 0 && (
                <div className="flex justify-between text-emerald-400 text-sm font-bold uppercase tracking-widest">
                  <span>Early Bird Discount</span>
                  <span>-{claimResult.data.discount_percent}%</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-white/40 text-xs uppercase tracking-widest font-bold">Reservation Price</span>
                <span className="text-[#C8956C] text-3xl font-black">${claimResult.data?.final_price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                client:load
                as="a" 
                href="/booking" 
                className="block w-full py-5 rounded-[1.5rem] bg-[#C8956C] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:shadow-[0_15px_40px_rgba(200,149,108,0.4)] transition-all"
              >
                Schedule Appointment
              </Button>
              <Button 
                client:load
                variant="ghost"
                onClick={() => { setClaimResult(null); setSelectedDesign(null); }} 
                className="block w-full text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Back to Designs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
