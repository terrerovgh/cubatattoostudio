// ─── Client Types ─────────────────────────────────────

export interface Client {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  preferred_artist?: string;
  allergies?: string;
  medical_notes?: string;
  referral_source?: string;
  loyalty_points: number;
  loyalty_tier: LoyaltyTier;
  total_spent: number;
  visit_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type LoyaltyTier = 'standard' | 'silver' | 'gold' | 'vip';

// ─── Booking Types ────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'deposit_paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type SizeCategory = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'custom';

export interface Booking {
  id: string;
  client_id: string;
  artist_id: string;
  service_type: string;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  actual_duration?: number;
  description?: string;
  placement?: string;
  size_category?: SizeCategory;
  size_inches?: string;
  style?: string;
  is_cover_up: boolean;
  is_touch_up: boolean;
  reference_images?: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  final_price?: number;
  deposit_amount: number;
  deposit_paid: boolean;
  price_modifier: number;
  consent_signed: boolean;
  consent_signed_at?: string;
  consent_ip?: string;
  notes?: string;
  artist_notes?: string;
  cancellation_reason?: string;
  flash_design_id?: string;
  created_at: string;
  updated_at: string;
}

// ─── Payment Types ────────────────────────────────────

export type PaymentType = 'deposit' | 'final' | 'tip' | 'refund' | 'gift_card';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';

export interface Payment {
  id: string;
  booking_id: string;
  client_id: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  payment_method?: string;
  refund_amount: number;
  refund_reason?: string;
  metadata?: string;
  created_at: string;
}

// ─── Consent Types ────────────────────────────────────

export interface ConsentForm {
  id: string;
  booking_id: string;
  client_id: string;
  full_name: string;
  date_of_birth: string;
  government_id_type?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  has_allergies: boolean;
  allergies_detail?: string;
  has_medical_conditions: boolean;
  medical_conditions_detail?: string;
  is_pregnant: boolean;
  is_on_blood_thinners: boolean;
  has_skin_conditions: boolean;
  skin_conditions_detail?: string;
  recent_alcohol: boolean;
  ack_age_18: boolean;
  ack_sober: boolean;
  ack_aftercare: boolean;
  ack_infection_risk: boolean;
  ack_no_guarantee: boolean;
  ack_photo_release: boolean;
  ack_final_design: boolean;
  signature_data?: string;
  signed_at?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ─── Flash Design Types ───────────────────────────────

export interface FlashDesign {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  image_url: string;
  style?: string;
  placement_suggestion?: string;
  size_category?: SizeCategory;
  price: number;
  original_price?: number;
  is_drop: boolean;
  drop_date?: string;
  drop_quantity: number;
  claimed_count: number;
  early_bird_discount: number;
  early_bird_slots: number;
  status: 'available' | 'claimed' | 'expired' | 'archived';
  created_at: string;
}

export interface FlashClaim {
  id: string;
  flash_design_id: string;
  client_id: string;
  booking_id?: string;
  claim_position: number;
  discount_applied: number;
  status: 'claimed' | 'booked' | 'completed' | 'expired';
  claimed_at: string;
}

// ─── Loyalty Types ────────────────────────────────────

export type LoyaltyTransactionType =
  | 'earn_booking'
  | 'earn_referral'
  | 'earn_review'
  | 'earn_photo'
  | 'redeem_discount'
  | 'redeem_gift'
  | 'bonus'
  | 'expiry'
  | 'adjustment';

export interface LoyaltyTransaction {
  id: string;
  client_id: string;
  booking_id?: string;
  points: number;
  type: LoyaltyTransactionType;
  description?: string;
  balance_after: number;
  expires_at?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired';
  reward_amount: number;
  created_at: string;
}

// ─── Gift Card Types ──────────────────────────────────

export interface GiftCard {
  id: string;
  code: string;
  purchaser_email?: string;
  recipient_email?: string;
  recipient_name?: string;
  original_amount: number;
  remaining_amount: number;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  expires_at?: string;
  message?: string;
  created_at: string;
}

// ─── Aftercare Types ──────────────────────────────────

export type AftercareMessageType =
  | 'care_instructions'
  | 'check_in'
  | 'photo_request'
  | 'review_request'
  | 'followup_coupon';

export interface AftercareMessage {
  id: string;
  booking_id: string;
  client_id: string;
  day_number: number;
  type: AftercareMessageType;
  channel: 'email' | 'sms';
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
  scheduled_for: string;
  sent_at?: string;
  content?: string;
  response?: string;
  created_at: string;
}

// ─── Booking Wizard Types ─────────────────────────────

export interface ArtistInfo {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  instagram?: string;
  availability: WeeklySchedule;
}

export interface WeeklySchedule {
  [day: string]: { start: string; end: string } | null;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price_modifier: number;
}

export interface BookingFormData {
  // Step 1: Service & Artist
  artist_id: string;
  service_type: string;
  style: string;

  // Step 2: Consultation
  description: string;
  placement: string;
  size_category: SizeCategory;
  size_inches: string;
  is_cover_up: boolean;
  is_touch_up: boolean;
  reference_images: File[];

  // Step 3: Calendar
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;

  // Step 4: Payment
  deposit_amount: number;
  payment_method: string;
  gift_card_code?: string;
  loyalty_discount?: number;

  // Client info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

export interface PriceEstimate {
  base_min: number;
  base_max: number;
  modifier: number;
  deposit_required: number;
  total_min: number;
  total_max: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

// ─── Admin Types ──────────────────────────────────────

export interface DashboardStats {
  total_bookings: number;
  bookings_today: number;
  revenue_month: number;
  revenue_today: number;
  pending_bookings: number;
  avg_booking_value: number;
  no_show_rate: number;
  conversion_rate: number;
  top_artist: string;
  top_service: string;
}

export interface BookingWithClient extends Booking {
  client: Client;
}

// ─── API Response Types ───────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AvailabilityResponse {
  date: string;
  artist_id: string;
  slots: TimeSlot[];
  is_weekend: boolean;
  price_modifier: number;
}

export interface CreateBookingRequest {
  form_data: BookingFormData;
  stripe_payment_method_id?: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  payment_intent?: {
    client_secret: string;
    amount: number;
  };
  consent_url: string;
}
