# Cuba Tattoo Studio

> Full-stack tattoo studio management platform — Astro 5 + React 19 + Cloudflare Workers

[![Deploy](https://img.shields.io/github/actions/workflow/status/terrerovgh/cubatattoostudio/deploy.yml?label=deploy&logo=cloudflare)](https://github.com/terrerovgh/cubatattoostudio/actions/workflows/deploy.yml)
[![CI](https://img.shields.io/github/actions/workflow/status/terrerovgh/cubatattoostudio/ci.yml?label=CI&logo=github-actions)](https://github.com/terrerovgh/cubatattoostudio/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/github/actions/workflow/status/terrerovgh/cubatattoostudio/ci.yml?label=tests&logo=vitest)](https://github.com/terrerovgh/cubatattoostudio/actions)

**Live site:** [cubatattoostudio.com](https://cubatattoostudio.com)

## Overview

Cuba Tattoo Studio is a complete digital platform for a premium tattoo studio in Albuquerque, NM. It combines a public-facing landing page with a full back-office system for studio admins and artists, all running at the edge on Cloudflare's global network.

### Key Features

| Feature | Description |
|---|---|
| 🎨 **Landing Page** | Premium glass-morphism design with section-based navigation |
| 📅 **Booking Wizard** | 5-step booking flow with Stripe deposit payments |
| 💬 **Real-time Chat** | WebSocket chat per booking (client ↔ artist) |
| 🖼️ **Gallery** | R2-backed image CDN with GSAP animations |
| ⚡ **Flash Drops** | Limited-time tattoo design releases with early-bird pricing |
| 🏆 **Loyalty Program** | Points system with tiers (Standard → VIP) |
| 📋 **Admin Dashboard** | 12-tab admin panel (bookings, clients, artists, inventory, etc.) |
| 🎨 **Artist Portal** | 8-tab artist dashboard (calendar, portfolio, chat, flash, etc.) |
| 🤖 **AI Assistant** | Workers AI for aftercare advice and reply suggestions |
| 📝 **Consent Forms** | Digital consent with signature capture |

## Tech Stack

```
Frontend     Astro 5 (Islands Architecture) + React 19
Styling      Tailwind CSS v4 + custom glass-morphism design tokens
State        Nanostores (atomic stores)
Animations   GSAP ScrollTrigger + CSS transitions

Runtime      Cloudflare Workers (edge, global)
Database     Cloudflare D1 (SQLite at the edge)
Storage      Cloudflare R2 (images, signatures)
Cache/Auth   Cloudflare KV (sessions, rate limiting)
WebSockets   Cloudflare Durable Objects (ChatRoom)
AI           Cloudflare Workers AI (Llama 3.1 8B)

Payments     Stripe (deposit collection, webhooks)
Testing      Vitest + React Testing Library
CI/CD        GitHub Actions → Wrangler deploy
```

## Project Structure

```
cubatattoostudio/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Type check, tests, build on every PR
│       ├── deploy.yml      # Production deploy on push to main
│       ├── preview.yml     # Preview deploy on PRs
│       └── security.yml    # Weekly security audit + CodeQL
├── public/
│   ├── _headers            # Cloudflare security + cache headers
│   └── _redirects          # URL redirects (www → apex, legacy URLs)
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard (12 tabs)
│   │   ├── artist/         # Artist portal (8 tabs)
│   │   ├── booking/        # 5-step booking wizard
│   │   ├── chat/           # ChatWidget with WebSocket + polling
│   │   ├── sections/       # Landing page sections
│   │   └── FloatingDock.tsx # macOS-style floating nav
│   ├── lib/
│   │   ├── auth.ts         # PBKDF2 hashing, KV sessions, CSRF, rate limiting
│   │   ├── chat/           # ChatRoom Durable Object
│   │   ├── db/
│   │   │   ├── schema.sql  # D1 schema (15 tables)
│   │   │   └── migration-v2.sql
│   │   ├── pricing.ts      # Tattoo pricing calculator
│   │   ├── loyalty.ts      # Points + tier management
│   │   └── aftercare.ts    # Post-tattoo care message generator
│   ├── middleware.ts        # Route protection, session verification
│   ├── pages/
│   │   ├── api/
│   │   │   ├── admin/      # Admin CRUD endpoints
│   │   │   ├── artist/     # Artist endpoints
│   │   │   ├── auth/       # Login, logout, session, register
│   │   │   ├── booking/    # Create, availability, consent
│   │   │   ├── chat/       # REST + WebSocket upgrade
│   │   │   ├── ai/         # Suggest, assistant
│   │   │   ├── flash/      # Drops, claim
│   │   │   ├── loyalty/    # Points, redeem
│   │   │   └── payments/   # Stripe intents, webhooks
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── artist/         # Artist portal pages
│   │   └── chat/           # Client chat pages
│   ├── store.ts            # Nanostores global state
│   └── tests/setup.ts      # Vitest test setup
├── wrangler.jsonc          # Cloudflare Workers configuration
├── astro.config.mjs        # Astro + Cloudflare adapter config
├── vitest.config.ts        # Test runner configuration
└── ARCHITECTURE.md         # Deep-dive architecture doc
```

## Getting Started

### Prerequisites

- Node.js 22+
- Cloudflare account with Workers, D1, R2, KV enabled
- Wrangler CLI (`npm install -g wrangler`)

### Development

```bash
# Clone
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Install dependencies
npm install

# Login to Cloudflare (for local dev with bindings)
wrangler login

# Start dev server (proxies Cloudflare bindings locally)
npm run dev
# → http://localhost:4321
```

### Environment Setup

```bash
# Required secrets (set via wrangler)
wrangler secret put ADMIN_PASSWORD
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put UPLOAD_SECRET

# For GitHub Actions, add these repository secrets:
# CLOUDFLARE_API_TOKEN   — API token with Workers:Edit permission
# CLOUDFLARE_ACCOUNT_ID  — Your Cloudflare account ID
# CLOUDFLARE_ZONE_ID     — Zone ID for cache purging
# INSTAGRAM_TOKEN        — Instagram Graph API token (optional)
```

### Database Setup

```bash
# Create D1 database (first time only)
wrangler d1 create cubatattoostudio-db

# Apply schema
wrangler d1 execute cubatattoostudio-db --file=src/lib/db/schema.sql

# Apply v2 migrations
wrangler d1 execute cubatattoostudio-db --file=src/lib/db/migration-v2.sql

# Create admin user
npx tsx scripts/seed-admin.ts
```

### R2 Storage Setup

```bash
# Create R2 bucket
wrangler r2 bucket create cubatattoostudio

# Create preview bucket (for local dev)
wrangler r2 bucket create cubatattoostudio-preview
```

### KV Namespaces Setup

```bash
# Create KV namespaces and note the IDs
wrangler kv namespace create AUTH_SESSIONS
wrangler kv namespace create RATE_LIMITER

# Update the IDs in wrangler.jsonc
```

## Running Tests

```bash
# All tests (watch mode)
npm test

# Single run (CI mode)
npm test -- --run

# Coverage report
npm run test:coverage

# UI dashboard
npm run test:ui
```

## Deployment

### Automatic (GitHub Actions)

Every push to `main` triggers:
1. Type check + unit tests
2. D1 schema migration (idempotent)
3. `wrangler deploy` to production
4. Cloudflare cache purge
5. Smoke test

### Manual

```bash
# Build
npm run build

# Deploy production
npm run deploy

# Deploy staging
wrangler deploy --env staging
```

## Cloudflare Resources

| Resource | Name | Purpose |
|---|---|---|
| Workers | `cubatattoostudio` | Full-stack SSR + API |
| D1 | `cubatattoostudio-db` | Relational data |
| R2 | `cubatattoostudio` | Media storage |
| KV | `AUTH_SESSIONS` | Session store |
| KV | `RATE_LIMITER` | Rate limiting |
| DO | `ChatRoom` | WebSocket chat |
| AI | `AI` | LLM inference |

## API Reference

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full API documentation.

### Auth Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/session` | Get current session |
| `POST` | `/api/auth/register` | Register new artist/admin |

### Booking Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/booking/create` | Create booking |
| `GET` | `/api/booking/availability` | Check artist availability |
| `POST` | `/api/booking/consent` | Submit consent form |

### Admin Endpoints (auth required)

All admin endpoints require a valid session cookie with `role: admin`.

| Method | Path | Description |
|---|---|---|
| `GET/POST` | `/api/admin/bookings` | Manage bookings |
| `GET/POST` | `/api/admin/clients` | Manage clients |
| `GET/POST` | `/api/admin/artists` | Manage artists |
| `GET/POST` | `/api/admin/gallery` | Manage gallery |
| `GET/POST` | `/api/admin/flash` | Manage flash designs |
| `GET/POST` | `/api/admin/promotions` | Manage promotions |
| `GET/POST` | `/api/admin/chat` | Monitor chat rooms |
| `GET/POST` | `/api/admin/users` | Manage users |
| `GET` | `/api/admin/analytics` | Dashboard analytics |

## Security

- **Authentication**: PBKDF2-SHA256 password hashing, KV-backed sessions
- **Session Cookies**: `__Host-session` (HttpOnly, Secure, SameSite=Lax)
- **CSRF Protection**: Async HMAC-SHA256 tokens
- **Rate Limiting**: KV-based per-IP sliding window (5 req/15min on auth)
- **Security Headers**: CSP, HSTS, X-Frame-Options, Permissions-Policy
- **Route Protection**: Middleware validates sessions on all `/admin/*`, `/artist/*`
- **Secrets**: All sensitive values via `wrangler secret put` (never in code)

## License

Private — © 2026 Cuba Tattoo Studio. All rights reserved.
