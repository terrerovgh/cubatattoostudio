-- Cuba Tattoo Studio — D1 Database Schema
-- Run with: wrangler d1 execute cubatattoostudio-db --file=src/lib/db/schema.sql

-- ─── Clients ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  preferred_artist TEXT,
  allergies TEXT,
  medical_notes TEXT,
  referral_source TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'standard' CHECK (loyalty_tier IN ('standard', 'silver', 'gold', 'vip')),
  total_spent REAL DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_loyalty_tier ON clients(loyalty_tier);

-- ─── Bookings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  client_id TEXT NOT NULL REFERENCES clients(id),
  artist_id TEXT NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'deposit_paid', 'in_progress',
    'completed', 'cancelled', 'no_show', 'rescheduled'
  )),

  -- Schedule
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  estimated_duration INTEGER NOT NULL DEFAULT 60,
  actual_duration INTEGER,

  -- Tattoo details
  description TEXT,
  placement TEXT,
  size_category TEXT CHECK (size_category IN ('tiny', 'small', 'medium', 'large', 'xlarge', 'custom')),
  size_inches TEXT,
  style TEXT,
  is_cover_up INTEGER DEFAULT 0,
  is_touch_up INTEGER DEFAULT 0,
  reference_images TEXT, -- JSON array of image URLs

  -- Pricing
  estimated_price_min REAL,
  estimated_price_max REAL,
  final_price REAL,
  deposit_amount REAL DEFAULT 0,
  deposit_paid INTEGER DEFAULT 0,
  price_modifier REAL DEFAULT 1.0, -- Weekend/night surcharge

  -- Consent
  consent_signed INTEGER DEFAULT 0,
  consent_signed_at TEXT,
  consent_ip TEXT,

  -- Metadata
  notes TEXT,
  artist_notes TEXT,
  cancellation_reason TEXT,
  flash_design_id TEXT REFERENCES flash_designs(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(artist_id, scheduled_date, scheduled_time) WHERE status NOT IN ('cancelled', 'no_show', 'rescheduled');

-- ─── Payments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'usd',
  type TEXT NOT NULL CHECK (type IN ('deposit', 'final', 'tip', 'refund', 'gift_card')),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'
  )),
  payment_method TEXT,
  refund_amount REAL DEFAULT 0,
  refund_reason TEXT,
  metadata TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ─── Consent Forms ────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_forms (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  client_id TEXT NOT NULL REFERENCES clients(id),

  -- Personal info snapshot
  full_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  government_id_type TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  -- Medical
  has_allergies INTEGER DEFAULT 0,
  allergies_detail TEXT,
  has_medical_conditions INTEGER DEFAULT 0,
  medical_conditions_detail TEXT,
  is_pregnant INTEGER DEFAULT 0,
  is_on_blood_thinners INTEGER DEFAULT 0,
  has_skin_conditions INTEGER DEFAULT 0,
  skin_conditions_detail TEXT,
  recent_alcohol INTEGER DEFAULT 0,

  -- Acknowledgements (all must be true)
  ack_age_18 INTEGER DEFAULT 0,
  ack_sober INTEGER DEFAULT 0,
  ack_aftercare INTEGER DEFAULT 0,
  ack_infection_risk INTEGER DEFAULT 0,
  ack_no_guarantee INTEGER DEFAULT 0,
  ack_photo_release INTEGER DEFAULT 0,
  ack_final_design INTEGER DEFAULT 0,

  -- Signature
  signature_data TEXT, -- Base64 SVG or image
  signed_at TEXT,
  ip_address TEXT,
  user_agent TEXT,

  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_consent_booking ON consent_forms(booking_id);

-- ─── Aftercare Tracking ──────────────────────────────
CREATE TABLE IF NOT EXISTS aftercare_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  day_number INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'care_instructions', 'check_in', 'photo_request', 'review_request', 'followup_coupon'
  )),
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'sms')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed')),
  scheduled_for TEXT NOT NULL,
  sent_at TEXT,
  content TEXT, -- JSON with email subject/body
  response TEXT, -- Client response if any
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_aftercare_booking ON aftercare_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_aftercare_scheduled ON aftercare_messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_aftercare_status ON aftercare_messages(status);

-- ─── Loyalty Program ─────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  client_id TEXT NOT NULL REFERENCES clients(id),
  booking_id TEXT REFERENCES bookings(id),
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'earn_booking', 'earn_referral', 'earn_review', 'earn_photo',
    'redeem_discount', 'redeem_gift', 'bonus', 'expiry', 'adjustment'
  )),
  description TEXT,
  balance_after INTEGER NOT NULL,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_loyalty_client ON loyalty_transactions(client_id);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  referrer_id TEXT NOT NULL REFERENCES clients(id),
  referred_id TEXT NOT NULL REFERENCES clients(id),
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_amount REAL DEFAULT 25.00,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- ─── Flash Designs / Drops ───────────────────────────
CREATE TABLE IF NOT EXISTS flash_designs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  artist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  style TEXT,
  placement_suggestion TEXT,
  size_category TEXT CHECK (size_category IN ('tiny', 'small', 'medium', 'large')),
  price REAL NOT NULL,
  original_price REAL,
  is_drop INTEGER DEFAULT 0,
  drop_date TEXT,
  drop_quantity INTEGER DEFAULT 1,
  claimed_count INTEGER DEFAULT 0,
  early_bird_discount REAL DEFAULT 0,
  early_bird_slots INTEGER DEFAULT 5,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired', 'archived')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_flash_artist ON flash_designs(artist_id);
CREATE INDEX IF NOT EXISTS idx_flash_status ON flash_designs(status);
CREATE INDEX IF NOT EXISTS idx_flash_drop_date ON flash_designs(drop_date);

CREATE TABLE IF NOT EXISTS flash_claims (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  flash_design_id TEXT NOT NULL REFERENCES flash_designs(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  booking_id TEXT REFERENCES bookings(id),
  claim_position INTEGER NOT NULL,
  discount_applied REAL DEFAULT 0,
  status TEXT DEFAULT 'claimed' CHECK (status IN ('claimed', 'booked', 'completed', 'expired')),
  claimed_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_claims_flash ON flash_claims(flash_design_id);
CREATE INDEX IF NOT EXISTS idx_claims_client ON flash_claims(client_id);

-- ─── Gift Cards / Vouchers ───────────────────────────
CREATE TABLE IF NOT EXISTS gift_cards (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  code TEXT NOT NULL UNIQUE,
  purchaser_email TEXT,
  recipient_email TEXT,
  recipient_name TEXT,
  original_amount REAL NOT NULL,
  remaining_amount REAL NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
  expires_at TEXT,
  message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);

-- ─── Artist Schedule Overrides ───────────────────────
CREATE TABLE IF NOT EXISTS schedule_overrides (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  artist_id TEXT NOT NULL,
  override_date TEXT NOT NULL,
  is_available INTEGER DEFAULT 0,
  start_time TEXT,
  end_time TEXT,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_overrides_artist_date ON schedule_overrides(artist_id, override_date);

-- ─── Inventory (basic tracking) ──────────────────────
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('ink', 'needles', 'supplies', 'aftercare', 'merch')),
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  unit_cost REAL,
  supplier TEXT,
  last_restocked TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ─── Audit Log ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT,
  changes TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
