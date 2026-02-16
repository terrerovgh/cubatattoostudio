import { useState, useEffect } from 'react';
import type { FlashDesign } from '../../types/booking';

export function FlashDrops() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<FlashDesign | null>(null);
  const [claimForm, setClaimForm] = useState({ email: '', first_name: '', last_name: '' });
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<any>(null);
  const [filterArtist, setFilterArtist] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, [filterArtist]);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: 'available' });
      if (filterArtist) params.set('artist_id', filterArtist);
      const res = await fetch(`/api/flash/drops?${params}`);
      const data = await res.json() as any;
      if (data.success) setDesigns(data.data.designs || []);
    } catch (err) {
      console.error('Failed to fetch flash designs:', err);
    }
    setLoading(false);
  };

  const handleClaim = async () => {
    if (!selectedDesign || !claimForm.email || !claimForm.first_name) return;
    setClaiming(true);
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
        alert(data.error || 'Failed to claim');
      }
    } catch (err) {
      alert('Something went wrong');
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Flash Designs</h2>
        <p className="text-white/50 max-w-lg mx-auto">
          Pre-drawn designs available at special prices. Claim yours before they're gone!
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2">
        {[
          { id: '', label: 'All Artists' },
          { id: 'david', label: 'David' },
          { id: 'nina', label: 'Nina' },
          { id: 'karli', label: 'Karli' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterArtist(f.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filterArtist === f.id
                ? 'bg-[#C8956C]/20 text-[#C8956C] border border-[#C8956C]/30'
                : 'bg-white/[0.03] text-white/50 border border-white/[0.06]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40">
          <div className="w-5 h-5 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin mr-3" />
          Loading designs...
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40 text-lg">No flash designs available right now</p>
          <p className="text-white/30 text-sm mt-2">Follow us on Instagram for drop announcements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => {
            const countdown = design.is_drop && design.drop_date ? getCountdown(design.drop_date) : null;
            const remaining = design.drop_quantity - design.claimed_count;

            return (
              <div
                key={design.id}
                className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-[#C8956C]/30 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-white/5">
                  <img
                    src={design.image_url}
                    alt={design.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Drop badge */}
                  {design.is_drop && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C8956C] text-black text-xs font-bold">
                      DROP
                    </div>
                  )}

                  {/* Countdown */}
                  {countdown && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                      {countdown}
                    </div>
                  )}

                  {/* Early bird */}
                  {design.early_bird_discount > 0 && design.claimed_count < design.early_bird_slots && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                      Early Bird -{design.early_bird_discount}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm">{design.title}</h3>
                      <p className="text-white/40 text-xs capitalize">{design.artist_id} — {design.style}</p>
                    </div>
                    <div className="text-right">
                      {design.original_price && design.original_price > design.price && (
                        <p className="text-white/30 text-xs line-through">${design.original_price}</p>
                      )}
                      <p className="text-[#C8956C] font-bold">${design.price}</p>
                    </div>
                  </div>

                  {design.description && (
                    <p className="text-white/50 text-xs">{design.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      {remaining > 0 ? `${remaining} left` : 'Sold out'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDesign(design);
                        setClaimResult(null);
                      }}
                      disabled={remaining <= 0 || !!countdown}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        remaining > 0 && !countdown
                          ? 'bg-[#C8956C] text-black hover:bg-[#D4A574]'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {countdown ? 'Coming Soon' : remaining > 0 ? 'Claim Now' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Modal */}
      {selectedDesign && !claimResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedDesign(null)}>
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#121214] border border-white/[0.08] space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-white text-lg">Claim: {selectedDesign.title}</h3>
            <p className="text-white/50 text-sm">Enter your info to claim this design</p>

            <div className="space-y-3">
              <input type="text" placeholder="First Name *" value={claimForm.first_name}
                onChange={(e) => setClaimForm((p) => ({ ...p, first_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
              <input type="text" placeholder="Last Name" value={claimForm.last_name}
                onChange={(e) => setClaimForm((p) => ({ ...p, last_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
              <input type="email" placeholder="Email *" value={claimForm.email}
                onChange={(e) => setClaimForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedDesign(null)} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleClaim}
                disabled={claiming || !claimForm.email || !claimForm.first_name}
                className="flex-1 py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#D4A574] transition-colors disabled:opacity-50"
              >
                {claiming ? 'Claiming...' : `Claim for $${selectedDesign.price}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Success */}
      {claimResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => { setClaimResult(null); setSelectedDesign(null); }}>
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#121214] border border-white/[0.08] text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">✓</div>
            <h3 className="font-bold text-white text-lg">{claimResult.message}</h3>
            {claimResult.data?.discount_percent > 0 && (
              <p className="text-green-400 text-sm">You saved {claimResult.data.discount_percent}%!</p>
            )}
            <p className="text-white/50 text-sm">
              Final price: <span className="text-[#C8956C] font-bold">${claimResult.data?.final_price}</span>
            </p>
            <a href="/booking" className="block py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#D4A574] transition-colors">
              Book Your Appointment
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
