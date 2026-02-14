import type { SizeCategory, PriceEstimate } from '../types/booking';

// ─── Base Prices by Size ──────────────────────────────

const BASE_PRICES: Record<SizeCategory, { min: number; max: number }> = {
  tiny:   { min: 50,   max: 100 },   // < 2"
  small:  { min: 100,  max: 250 },   // 2-4"
  medium: { min: 250,  max: 500 },   // 4-6"
  large:  { min: 500,  max: 1200 },  // 6-10"
  xlarge: { min: 1200, max: 3000 },  // 10"+
  custom: { min: 200,  max: 5000 },
};

// ─── Style Multipliers ────────────────────────────────

const STYLE_MULTIPLIERS: Record<string, number> = {
  'Color Realism':        1.3,
  'Black & Grey Realism': 1.2,
  'Fine Line & Dotwork':  1.0,
  'Neo-Traditional':      1.15,
  'Cover-ups':            1.4,
  'Floral & Botanical':   1.0,
  'Pet Tattoos':          1.1,
  'Custom Tattoos':       1.15,
  'Flash':                0.85,
};

// ─── Duration Estimates (minutes) ─────────────────────

const DURATION_ESTIMATES: Record<SizeCategory, { min: number; max: number }> = {
  tiny:   { min: 30,  max: 60 },
  small:  { min: 60,  max: 120 },
  medium: { min: 120, max: 240 },
  large:  { min: 240, max: 480 },
  xlarge: { min: 480, max: 960 },
  custom: { min: 60,  max: 480 },
};

// ─── Schedule Modifiers ───────────────────────────────

export function getDateModifier(date: string): { modifier: number; label: string } {
  const d = new Date(date);
  const day = d.getDay();

  if (day === 6) return { modifier: 1.15, label: 'Weekend rate (+15%)' };
  if (day === 0) return { modifier: 1.15, label: 'Weekend rate (+15%)' };

  return { modifier: 1.0, label: '' };
}

export function getTimeModifier(time: string): { modifier: number; label: string } {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 18) return { modifier: 1.20, label: 'Evening rate (+20%)' };
  return { modifier: 1.0, label: '' };
}

// ─── Deposit Calculation ──────────────────────────────

export function calculateDeposit(estimatedMax: number, duration: number): number {
  if (duration <= 180) {
    return Math.min(Math.max(50, Math.round(estimatedMax * 0.3)), 100);
  }
  return Math.min(Math.max(100, Math.round(estimatedMax * 0.25)), 250);
}

// ─── Duration Estimation ──────────────────────────────

export function estimateDuration(
  size: SizeCategory,
  style: string,
  isCoverUp: boolean
): number {
  const base = DURATION_ESTIMATES[size];
  const avg = Math.round((base.min + base.max) / 2);
  const styleMultiplier = STYLE_MULTIPLIERS[style] || 1.0;
  const coverUpMultiplier = isCoverUp ? 1.3 : 1.0;
  return Math.round(avg * styleMultiplier * coverUpMultiplier);
}

// ─── Full Price Estimate ──────────────────────────────

export function calculatePriceEstimate(params: {
  size: SizeCategory;
  style: string;
  isCoverUp: boolean;
  isTouchUp: boolean;
  date?: string;
  time?: string;
  loyaltyDiscount?: number;
}): PriceEstimate {
  const { size, style, isCoverUp, isTouchUp, date, time, loyaltyDiscount = 0 } = params;

  const base = BASE_PRICES[size];
  const styleMultiplier = STYLE_MULTIPLIERS[style] || 1.0;
  const coverUpMultiplier = isCoverUp ? 1.4 : 1.0;
  const touchUpMultiplier = isTouchUp ? 0.5 : 1.0;

  let priceMin = Math.round(base.min * styleMultiplier * coverUpMultiplier * touchUpMultiplier);
  let priceMax = Math.round(base.max * styleMultiplier * coverUpMultiplier * touchUpMultiplier);

  const breakdown: { label: string; amount: number }[] = [
    { label: `Base price (${size})`, amount: base.min },
  ];

  if (styleMultiplier !== 1.0) {
    breakdown.push({ label: `${style} style`, amount: Math.round((styleMultiplier - 1) * base.min) });
  }
  if (isCoverUp) {
    breakdown.push({ label: 'Cover-up surcharge', amount: Math.round(0.4 * base.min) });
  }
  if (isTouchUp) {
    breakdown.push({ label: 'Touch-up discount', amount: -Math.round(0.5 * base.min) });
  }

  let scheduleModifier = 1.0;
  if (date) {
    const dm = getDateModifier(date);
    if (dm.modifier > 1) {
      scheduleModifier *= dm.modifier;
      breakdown.push({ label: dm.label, amount: Math.round((dm.modifier - 1) * priceMin) });
    }
  }
  if (time) {
    const tm = getTimeModifier(time);
    if (tm.modifier > 1) {
      scheduleModifier *= tm.modifier;
      breakdown.push({ label: tm.label, amount: Math.round((tm.modifier - 1) * priceMin) });
    }
  }

  priceMin = Math.round(priceMin * scheduleModifier);
  priceMax = Math.round(priceMax * scheduleModifier);

  if (loyaltyDiscount > 0) {
    const discountAmount = Math.round(priceMin * loyaltyDiscount);
    breakdown.push({ label: `Loyalty discount (${loyaltyDiscount * 100}%)`, amount: -discountAmount });
    priceMin -= discountAmount;
    priceMax -= Math.round(priceMax * loyaltyDiscount);
  }

  const duration = estimateDuration(size, style, isCoverUp);
  const deposit = calculateDeposit(priceMax, duration);

  return {
    base_min: base.min,
    base_max: base.max,
    modifier: scheduleModifier,
    deposit_required: deposit,
    total_min: Math.max(priceMin, 50),
    total_max: Math.max(priceMax, 100),
    breakdown,
  };
}

// ─── Loyalty Discount Tiers ───────────────────────────

export function getLoyaltyDiscount(visitCount: number): number {
  if (visitCount >= 3) return 0.10;
  if (visitCount >= 2) return 0.05;
  return 0;
}

export function getReferralCredit(): number {
  return 25;
}

export function getBirthdayDiscount(): number {
  return 0.15;
}
