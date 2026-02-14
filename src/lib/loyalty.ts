import type { LoyaltyTier, LoyaltyTransactionType } from '../types/booking';

// ─── Tier Thresholds ──────────────────────────────────

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  standard: 0,
  silver: 500,
  gold: 1500,
  vip: 3000,
};

const TIER_BENEFITS: Record<LoyaltyTier, {
  discount: number;
  priority_booking: boolean;
  birthday_bonus: number;
  referral_bonus: number;
  points_multiplier: number;
}> = {
  standard: {
    discount: 0,
    priority_booking: false,
    birthday_bonus: 50,
    referral_bonus: 25,
    points_multiplier: 1.0,
  },
  silver: {
    discount: 0.05,
    priority_booking: false,
    birthday_bonus: 100,
    referral_bonus: 35,
    points_multiplier: 1.25,
  },
  gold: {
    discount: 0.10,
    priority_booking: true,
    birthday_bonus: 150,
    referral_bonus: 50,
    points_multiplier: 1.5,
  },
  vip: {
    discount: 0.15,
    priority_booking: true,
    birthday_bonus: 250,
    referral_bonus: 75,
    points_multiplier: 2.0,
  },
};

// ─── Points Earning Rules ─────────────────────────────

const POINTS_PER_DOLLAR = 1;
const REFERRAL_POINTS = 250;
const REVIEW_POINTS = 75;
const PHOTO_SHARE_POINTS = 50;

// ─── Tier Calculation ─────────────────────────────────

export function calculateTier(totalPoints: number): LoyaltyTier {
  if (totalPoints >= TIER_THRESHOLDS.vip) return 'vip';
  if (totalPoints >= TIER_THRESHOLDS.gold) return 'gold';
  if (totalPoints >= TIER_THRESHOLDS.silver) return 'silver';
  return 'standard';
}

export function getTierBenefits(tier: LoyaltyTier) {
  return TIER_BENEFITS[tier];
}

export function getNextTier(tier: LoyaltyTier): { tier: LoyaltyTier; pointsNeeded: number } | null {
  const tiers: LoyaltyTier[] = ['standard', 'silver', 'gold', 'vip'];
  const idx = tiers.indexOf(tier);
  if (idx >= tiers.length - 1) return null;
  const nextTier = tiers[idx + 1];
  return { tier: nextTier, pointsNeeded: TIER_THRESHOLDS[nextTier] };
}

// ─── Points Calculation ───────────────────────────────

export function calculateBookingPoints(amount: number, tier: LoyaltyTier): number {
  const multiplier = TIER_BENEFITS[tier].points_multiplier;
  return Math.round(amount * POINTS_PER_DOLLAR * multiplier);
}

export function getPointsForAction(action: LoyaltyTransactionType): number {
  switch (action) {
    case 'earn_referral': return REFERRAL_POINTS;
    case 'earn_review': return REVIEW_POINTS;
    case 'earn_photo': return PHOTO_SHARE_POINTS;
    default: return 0;
  }
}

// ─── Discount Rules by Visit ──────────────────────────

export function getVisitDiscount(visitCount: number): { discount: number; label: string } {
  if (visitCount === 1) return { discount: 0.05, label: '5% off 2nd session' };
  if (visitCount === 2) return { discount: 0.10, label: '10% off 3rd session' };
  if (visitCount >= 3) return { discount: 0, label: '' };
  return { discount: 0, label: '' };
}

// ─── Referral Code Generation ─────────────────────────

export function generateReferralCode(clientName: string): string {
  const clean = clientName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CUBA-${clean}-${random}`;
}

// ─── Gift Card Code Generation ────────────────────────

export function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GC-';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (i < 3) code += '-';
  }
  return code;
}
