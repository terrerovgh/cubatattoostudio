# API Documentation — Cuba Tattoo Studio

The Cuba Tattoo Studio API is built on **Cloudflare Workers** using Astro's SSR mode (`output: 'server'`). It leverages **Cloudflare D1** for relational data, **R2** for object storage, and **KV** for session management and rate limiting.

## Authentication

### 🔐 Admin & Artist Portals
Endpoints under `/api/admin/*` and `/api/artist/*` are protected by session-based authentication managed via Cloudflare KV (`AUTH_SESSIONS`).
- **Method:** `__Host-session` cookie (HttpOnly, Secure).
- **Fallback:** API requests can also use a Bearer token if configured for automated tasks.

### 🖼️ Image Uploads
The upload endpoint requires a Bearer token for server-to-server or authenticated client uploads.
- **Header:** `Authorization: Bearer <UPLOAD_SECRET>`
- **Env Variable:** `UPLOAD_SECRET` must be set in the Cloudflare dashboard.

---

## Endpoints

### 📅 Booking System

#### `GET /api/booking/availability`
Checks availability for a specific artist and date. It cross-references the artist's base schedule with D1 `schedule_overrides` and existing `bookings` to prevent overlaps.

**Query Params:**
- `artist_id` (string): e.g., 'david', 'nina', 'karli'.
- `date` (string): ISO date (YYYY-MM-DD).

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-20",
    "slots": [
      { "time": "11:00", "available": true, "price_modifier": 1.0 },
      { "time": "12:00", "available": false, "price_modifier": 1.0 }
    ],
    "is_weekend": false,
    "price_modifier": 1.0
  }
}
```

#### `GET /api/booking/client-lookup`
Lookup existing client data by email to streamline the booking process.

**Query Params:**
- `email` (string): Client's email address.

**Response:**
```json
{
  "success": true,
  "data": {
    "client": { "first_name": "John", "last_name": "Doe", "phone": "(505) 555-0123" }
  }
}
```

#### `POST /api/booking/create`
Creates a new booking and initiates a Stripe Payment Intent. Supports file uploads for reference images via R2.

**Content-Type:** `multipart/form-data`

**Body (FormData):**
- `form_data`: JSON string containing client details, tattoo vision, and schedule.
- `stripe_payment_method_id` (optional): ID from Stripe Elements.
- `reference_image_{n}` (file): Up to 5 image files (JPG, PNG, WebP).

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": { "id": "uuid", "status": "deposit_paid", "consent_url": "..." },
    "payment_intent": { "client_secret": "pi_...", "amount": 50 }
  }
}
```

---

### ⚡ Flash Drops

#### `GET /api/flash/drops`
Lists available flash designs. Recommended polling interval: 30s for real-time stock updates.

**Query Params:**
- `artist_id` (optional): Filter by artist.
- `status` (optional): 'available' (default) or 'all'.

**Response:**
```json
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "uuid",
        "title": "Neo-Trad Dagger",
        "price": 180,
        "claimed_count": 2,
        "drop_quantity": 5,
        "early_bird_discount": 10
      }
    ]
  }
}
```

#### `POST /api/flash/claim`
Claims a specific flash design slot.

**Body:**
```json
{
  "flash_design_id": "uuid",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### 💰 Loyalty Program

#### `GET /api/loyalty/points`
Retrieve client's current points balance and tier status.

#### `POST /api/loyalty/redeem`
Redeem points for discounts or studio credit.

---

### 🖼️ Media Management (R2)

#### `POST /api/images/upload`
Uploads an image directly to the R2 bucket.
- **Path:** `/bookings/refs/` for booking references or `/gallery/` for portfolio.
- **Optimization:** Automatic format conversion to WebP via Astro pipeline when requested via `/api/images/...`.

#### `GET /api/images/[...id]`
Serves optimized images from R2 with ETag support for browser caching.

---

### 💳 Payments & Webhooks

#### `POST /api/payments/webhook`
Handles asynchronous events from Stripe.
- **Events:** `payment_intent.succeeded` (updates booking to `deposit_paid`), `payment_intent.payment_failed`, `charge.refunded`.
- **Security:** Requires `stripe-signature` header verification using `STRIPE_WEBHOOK_SECRET`.

---

## Database (Cloudflare D1)

The platform uses a single D1 instance `cubatattoostudio-db`.
- **Schema:** Defined in `src/lib/db/schema.sql`.
- **Total Tables:** 15 (including `bookings`, `payments`, `consent_forms`, `loyalty_transactions`, `inventory_items`).
