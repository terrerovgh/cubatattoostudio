# Cuba Tattoo Studio — Architecture

## Overview

The platform runs entirely on Cloudflare's edge network using Astro 5 with server-side rendering via the `@astrojs/cloudflare` adapter. Every page request and API call is handled by a single Cloudflare Worker compiled from the Astro build.

```
Browser → Cloudflare Edge → Worker (SSR) → D1 / R2 / KV / AI
                              ↓
                         Durable Objects (WebSocket Chat)
```

## Cloudflare Resources in Detail

### D1 — Relational Database

**Database:** `cubatattoostudio-db`
**Binding:** `DB`
**Schema:** `src/lib/db/schema.sql`

D1 provides serverless SQLite at the edge. All relational data lives here:

```sql
-- Core Tables
clients           -- Customer profiles + loyalty data
bookings          -- Appointments with scheduling + pricing
payments          -- Stripe payment records
consent_forms     -- Digital consent with signature data

-- Operations
flash_designs     -- Pre-drawn tattoo designs for drop events
flash_claims      -- Claims on flash designs (with early-bird)
schedule_overrides -- Artist availability exceptions
inventory_items   -- Studio supplies tracking

-- Programs
loyalty_transactions -- Points earn/redeem ledger
aftercare_messages   -- Automated follow-up message queue
referrals            -- Referral program tracking
gift_cards           -- Gift card/voucher management

-- Security
audit_log            -- Immutable action audit trail
chat_tokens          -- Temporary client chat access tokens
```

**Best Practices Applied:**
- All IDs use `lower(hex(randomblob(16)))` — URL-safe UUID equivalents
- Timestamps stored as ISO 8601 TEXT for timezone safety
- Indexes on all foreign keys and frequent query columns
- UNIQUE constraint on booking slots prevents double-booking
- CHECK constraints enforce valid status/type values

### R2 — Object Storage

**Bucket:** `cubatattoostudio`
**Binding:** `R2_BUCKET`

R2 stores all binary assets:

| Object Path | Content |
|---|---|
| `gallery/{id}.jpg` | Gallery images |
| `portfolio/{artist_id}/{id}.jpg` | Artist portfolio photos |
| `flash/{id}.jpg` | Flash design images |
| `consent/{booking_id}/signature.png` | Client consent signatures |
| `references/{booking_id}/{id}.jpg` | Client reference images |
| `avatars/{user_id}.jpg` | User profile photos |

**Access Pattern:**
- Admin uploads via `POST /api/images/upload` with auth
- Client reads via `/api/images/{id}` (proxied from R2)
- Cached at CDN layer with `Cache-Control: max-age=86400`

### KV — Key-Value Store

**Namespaces:**

#### AUTH_SESSIONS
```
Key:   session:{token}
Value: { userId, role, email, artistId?, expiresAt }
TTL:   86400 seconds (24 hours)
```

Sessions are created on login, validated on every protected request via `src/middleware.ts`, and destroyed on logout.

#### RATE_LIMITER
```
Key:   rl:{ip}:{endpoint}
Value: attempt count (string)
TTL:   900 seconds (15 minutes)
```

Max 5 attempts per 15 minutes on login/register endpoints. Returns `429 Too Many Requests` when exceeded.

### Durable Objects — ChatRoom

**Class:** `ChatRoom`
**Binding:** `CHAT_ROOM`
**Storage:** SQLite (via DO storage API)

Each booking gets its own `ChatRoom` Durable Object keyed by `room_id`. The DO persists messages and maintains WebSocket connections using the Hibernation API (connections survive across DO sleep cycles).

```
Client (WebSocket) → /api/chat/ws?room_id=X&sender_type=client&sender_id=Y
                          ↓
                    CHAT_ROOM.idFromName(room_id)
                          ↓
                    ChatRoom DO (WebSocket + SQLite)
                          ↑
Artist (WebSocket) → /api/chat/ws?room_id=X&sender_type=artist&sender_id=Y
```

**Fallback:** If WebSocket upgrade fails, `ChatWidget` falls back to REST polling via `GET /api/chat/messages?room_id=X` every 5 seconds.

### Workers AI

**Binding:** `AI`

Two AI endpoints:

#### `/api/ai/suggest`
```typescript
// POST body
{ type: 'aftercare' | 'reply' | 'description', context: string }

// Uses: @cf/meta/llama-3.1-8b-instruct
// Returns: { suggestion: string }
```

#### `/api/ai/assistant`
```typescript
// POST body
{ message: string, role?: 'admin' | 'artist' | 'client' }

// Returns: { answer: string }
```

## Authentication Flow

```
1. POST /api/auth/login { email, password }
      ↓
2. Rate limit check (RATE_LIMITER KV)
      ↓
3. Query D1 for user by email
      ↓
4. PBKDF2-SHA256 verify(password, stored_hash, stored_salt)
      ↓
5. Create session in AUTH_SESSIONS KV
      ↓
6. Set __Host-session cookie (HttpOnly, Secure, SameSite=Lax)
      ↓
7. Return { role, userId, email }
```

**Session Verification (middleware.ts):**
```
Every request to /admin/*, /artist/*, /api/admin/*, /api/artist/*
      ↓
Extract __Host-session cookie
      ↓
KV.get(session:{token}) → session data or null
      ↓
Validate role matches route prefix
      ↓
Attach to locals: { session, user }
```

## Booking Flow

```
Step 1: Service Selection (style, size, type)
Step 2: Details & Placement (description, body area, reference images)
Step 3: Artist & Date Selection (availability check via D1)
Step 4: Payment (Stripe deposit via PaymentIntent)
Step 5: Confirmation (consent form, booking created in D1)
```

**Availability Algorithm:**
```sql
SELECT scheduled_time FROM bookings
WHERE artist_id = ?
  AND scheduled_date = ?
  AND status NOT IN ('cancelled', 'no_show', 'rescheduled')
```
Blocked slots are subtracted from the artist's working hours to compute free slots.

## Image Upload Pipeline

```
Client → POST /api/images/upload (multipart/form-data)
              ↓
         Auth check (UPLOAD_SECRET or session)
              ↓
         Validate MIME type (image/jpeg, image/png, image/webp)
              ↓
         Generate path: {category}/{uuid}.{ext}
              ↓
         R2_BUCKET.put(path, body, { httpMetadata })
              ↓
         Register in D1 image_registry (if applicable)
              ↓
         Return { url: /api/images/{path} }
```

## Security Architecture

### Defense in Depth

```
Layer 1: Cloudflare WAF & DDoS protection (network level)
Layer 2: _headers CSP, HSTS, X-Frame-Options (transport level)
Layer 3: Middleware session validation (application level)
Layer 4: Per-endpoint auth checks (route level)
Layer 5: PBKDF2 + constant-time compare (credential level)
```

### Password Hashing

```typescript
// PBKDF2-SHA256, 100,000 iterations, 16-byte salt
hashPassword(password) → { hash: hex, salt: hex }
verifyPassword(password, hash, salt) → boolean (constant-time)
```

### CSRF Protection

```typescript
// HMAC-SHA256 of session token
generateCSRFTokenAsync(sessionToken) → 32-char hex
validateCSRFToken(token, sessionToken) → boolean
```

CSRF tokens are embedded in forms and validated on mutating requests (POST/PUT/DELETE).

### Rate Limiting

```typescript
// Per IP, per endpoint
checkRateLimit(ip, kv) → { allowed: boolean, remaining: number }

// Config: 5 attempts per 15 minutes
// Applied to: /api/auth/login, /api/auth/register
```

## CI/CD Pipeline

```
PR opened/updated
      ↓
ci.yml: typecheck + vitest + astro build
      ↓
preview.yml: wrangler versions upload (preview URL)
      ↓
PR merged to main
      ↓
deploy.yml:
  1. Build Astro
  2. Run tests
  3. D1 migration (wrangler d1 execute --remote)
  4. wrangler deploy
  5. Cloudflare cache purge
  6. Smoke test (HTTP 200 check)
```

## Performance

### Edge SSR
- All pages server-rendered at the edge — no cold starts
- `astro.config.mjs` splits: three.js, gsap, react, nanostores into separate chunks
- Static assets cached with `Cache-Control: immutable` (1 year)

### Islands Architecture
- React components hydrated with `client:only="react"` only where interactivity is needed
- FloatingDock, BookingWizard, ChatWidget, AdminDashboard, ArtistDashboard
- Everything else is static HTML — zero JS overhead

### Database
- D1 queries use prepared statements with `.bind()` — no SQL injection risk
- Indexed all frequent query columns
- UNIQUE constraint on booking slots eliminates race conditions

## Folder Conventions

| Pattern | Meaning |
|---|---|
| `src/pages/api/*.ts` | Cloudflare Workers API endpoints (Astro API routes) |
| `src/components/admin/tabs/*.tsx` | Admin dashboard tab panels |
| `src/components/artist/tabs/*.tsx` | Artist portal tab panels |
| `src/lib/*.ts` | Business logic (no Cloudflare deps) |
| `src/types/*.ts` | TypeScript interfaces shared across the app |
| `src/__tests__/*.test.ts` | Store and utility unit tests |
| `src/components/**/__tests__/*.test.tsx` | Component tests |
