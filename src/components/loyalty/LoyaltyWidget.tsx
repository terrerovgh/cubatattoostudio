import { useState } from 'react';
import type { LoyaltyTier } from '../../types/booking';

export function LoyaltyWidget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [showRewards, setShowRewards] = useState(false);

  const lookupPoints = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const [pointsRes, rewardsRes] = await Promise.all([
        fetch(`/api/loyalty/points?email=${encodeURIComponent(email)}`),
        fetch('/api/loyalty/redeem'),
      ]);
      const pointsData = await pointsRes.json() as any;
      const rewardsData = await rewardsRes.json() as any;

      if (pointsData.success) setData(pointsData.data);
      if (rewardsData.success) setRewards(rewardsData.data.rewards || []);
    } catch (err) {
      console.error('Lookup failed:', err);
    }
    setLoading(false);
  };

  const TIER_COLORS: Record<LoyaltyTier, string> = {
    standard: 'bg-white/10 text-white/60',
    silver: 'bg-gray-400/20 text-gray-300',
    gold: 'bg-yellow-500/20 text-yellow-400',
    vip: 'bg-purple-500/20 text-purple-400',
  };

  const TIER_THRESHOLDS = [
    { tier: 'standard', min: 0 },
    { tier: 'silver', min: 500 },
    { tier: 'gold', min: 1500 },
    { tier: 'vip', min: 3000 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Loyalty Program</h2>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          Earn points with every session, referral, and review. Unlock exclusive discounts and perks.
        </p>
      </div>

      {/* Lookup */}
      {!data && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4">
          <p className="text-sm text-white/60">Enter your email to check your points balance</p>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupPoints()}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50"
            />
            <button
              onClick={lookupPoints}
              disabled={loading || !email}
              className="px-5 py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#D4A574] transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Check'}
            </button>
          </div>
        </div>
      )}

      {/* Points Display */}
      {data && (
        <div className="max-w-lg mx-auto space-y-6">
          {/* Points Card */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center space-y-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${TIER_COLORS[data.tier as LoyaltyTier] || TIER_COLORS.standard}`}>
              {data.tier} Member
            </span>
            <div>
              <p className="text-5xl font-bold text-[#C8956C]">{data.points}</p>
              <p className="text-white/40 text-sm mt-1">Loyalty Points</p>
            </div>

            {/* Progress to next tier */}
            {data.next_tier && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span className="capitalize">{data.tier}</span>
                  <span className="capitalize">{data.next_tier.tier} ({data.next_tier.pointsNeeded} pts)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C8956C] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((data.points / data.next_tier.pointsNeeded) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-lg font-bold text-white">{data.visit_count}</p>
                <p className="text-xs text-white/40">Visits</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">${data.total_spent?.toFixed(0) || 0}</p>
                <p className="text-xs text-white/40">Total Spent</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{data.benefits?.discount ? `${data.benefits.discount * 100}%` : '—'}</p>
                <p className="text-xs text-white/40">Tier Discount</p>
              </div>
            </div>

            {data.is_birthday_month && (
              <div className="p-3 rounded-xl bg-[#C8956C]/10 border border-[#C8956C]/20 text-sm text-[#C8956C]">
                Happy Birthday Month! Enjoy 15% off your next session.
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="font-bold text-white mb-4">Your Benefits</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Tier Discount</span>
                <span className="text-white">{data.benefits?.discount ? `${data.benefits.discount * 100}%` : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Priority Booking</span>
                <span className={data.benefits?.priority_booking ? 'text-green-400' : 'text-white/30'}>{data.benefits?.priority_booking ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Birthday Bonus</span>
                <span className="text-white">{data.benefits?.birthday_bonus} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Points Multiplier</span>
                <span className="text-white">{data.benefits?.points_multiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Referral Bonus</span>
                <span className="text-white">${data.benefits?.referral_bonus}</span>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <button onClick={() => setShowRewards(!showRewards)} className="w-full flex justify-between items-center">
              <h3 className="font-bold text-white">Redeem Rewards</h3>
              <span className="text-white/40">{showRewards ? '▲' : '▼'}</span>
            </button>
            {showRewards && (
              <div className="mt-4 space-y-3">
                {rewards.map((r) => (
                  <div key={r.id} className={`p-4 rounded-xl flex justify-between items-center ${data.points >= r.points_cost ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white/[0.01] border border-white/[0.03] opacity-50'}`}>
                    <div>
                      <p className="text-sm font-medium text-white">{r.name}</p>
                      <p className="text-xs text-[#C8956C]">{r.points_cost} points</p>
                    </div>
                    <button
                      disabled={data.points < r.points_cost}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${data.points >= r.points_cost ? 'bg-[#C8956C] text-black hover:bg-[#D4A574]' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                    >
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How to Earn */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="font-bold text-white mb-4">How to Earn Points</h3>
            <div className="space-y-3">
              {[
                { action: 'Complete a session', points: '1 pt per $1 spent', icon: '✦' },
                { action: 'Refer a friend', points: '250 pts', icon: '◇' },
                { action: 'Leave a review', points: '75 pts', icon: '★' },
                { action: 'Share healed photo', points: '50 pts', icon: '📸' },
              ].map((item) => (
                <div key={item.action} className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-[#C8956C]/10 flex items-center justify-center text-[#C8956C]">{item.icon}</span>
                  <span className="text-white/70 flex-1">{item.action}</span>
                  <span className="text-[#C8956C] font-medium">{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Table */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="font-bold text-white mb-4">Tier Levels</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {TIER_THRESHOLDS.map((t) => (
                <div key={t.tier} className={`p-3 rounded-xl ${data.tier === t.tier ? 'bg-[#C8956C]/10 border border-[#C8956C]/30' : 'bg-white/[0.02]'}`}>
                  <p className={`text-xs font-bold capitalize ${data.tier === t.tier ? 'text-[#C8956C]' : 'text-white/50'}`}>{t.tier}</p>
                  <p className="text-[10px] text-white/30 mt-1">{t.min}+ pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
