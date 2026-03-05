# Cuba Tattoo Studio - Project Context

Comprehensive guide for the Cuba Tattoo Studio premium landing page and management platform.

## Project Overview

Cuba Tattoo Studio is a high-performance, premium digital platform for a tattoo studio in Albuquerque, NM. It features an immersive, mobile-like landing page with glassmorphism, dynamic crossfade backgrounds, and an iOS-style floating dock. Beyond the landing page, it includes a full back-office system (Admin and Artist portals) running entirely on Cloudflare's edge network.

### Core Architecture
- **Framework:** [Astro 5.17+](https://astro.build/) (Hybrid: SSG for landing page, SSR for API and Admin/Artist dashboards).
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) via `@astrojs/cloudflare` adapter.
- **UI Library (MANDATORY):** [Cloudflare Kumo UI](https://kumo.cloudflare.design/) (`@cloudflare/kumo`) must be used for all interactive elements (Buttons, Inputs, Dialogs, Selects, Cards, etc.).
- **Interactivity:** React 19.2+ (Astro Islands) and [GSAP 3.14+](https://gsap.com/) for fluid animations.
- **Styling:** [Tailwind CSS 4.1+](https://tailwindcss.com/) with a dark premium aesthetic (Gold: `#C8956C`).
- **Icons:** [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`) as required by Kumo UI.
- **State Management:** [Nano Stores](https://github.com/nanostores/nanostores) for lightweight, cross-island communication.

## Infrastructure (Cloudflare Native)

- **D1 (Relational Database):** `cubatattoostudio-db`. SQLite at the edge.
  - *Core Tables (15 total):* `clients`, `bookings`, `payments`, `consent_forms`, `flash_designs`, `flash_claims`, `loyalty_transactions`, `aftercare_messages`, `schedule_overrides`, `inventory_items`, `audit_log`, `chat_tokens`.
- **R2 (Object Storage):** `cubatattoostudio`. Stores gallery images, portfolio photos, flash designs, signatures, and reference images.
- **KV (Key-Value Store):**
  - `AUTH_SESSIONS`: Session tokens (24h TTL).
  - `RATE_LIMITER`: Per-IP sliding-window counters (5 attempts per 15 minutes).
- **Durable Objects:** `ChatRoom` class. Handles real-time WebSocket chat per booking with Hibernation API and SQLite storage.
- **Workers AI:** `@cf/meta/llama-3.1-8b-instruct`. Used for aftercare advice, reply suggestions, and a studio assistant.

## Key Features

- **Dynamic Backgrounds:** Crossfade transitions between optimized SVG/Image backgrounds triggered by scroll ($currentBackground).
- **Floating Dock:** macOS-style navigation with active section tracking ($activeSection) and scroll progress.
- **Booking Wizard:** 5-step interactive flow with Stripe deposit collection and real-time availability checks.
- **Admin Dashboard:** SSR-protected 12-tab panel (`/admin`) for bookings, clients, artists, inventory, gallery, flash, etc.
- **Artist Portal:** SSR-protected 8-tab panel (`/artist`) for calendar, portfolio, chat, flash management, and settings.
- **Real-time Chat:** WebSocket-based client ↔ artist chat with REST polling fallback.
- **Flash Drops:** Limited-edition tattoo designs with claim management and early-bird pricing.
- **Loyalty Program:** Points-based system with tiers (Standard → VIP).
- **Image Optimization:** Custom R2-backed API with client-side IndexedDB caching (`src/lib/imageCache.ts`).

## Development Conventions

### UI & Components
- **Kumo UI Exclusivity:** Do not build custom UI components if Kumo UI provides an equivalent.
- **Hydration:** Use `client:only="react"` or `client:load` for Kumo-based islands. Always import `@cloudflare/kumo/styles` in the island or layout.
- **Accessibility (Mandatory):** Adhere to WCAG 2.1 Level AA. Every interactive element must be keyboard accessible and screen-reader friendly. Use semantic landmarks (`<nav>`, `<main>`, etc.).

### State Management (Nano Stores)
- `$activeSection`: Current section ID for navigation.
- `$currentBackground`: URL/Path for the active background.
- `$pageMode`: `home` vs `artist` context.
- `$bookingDraft`: Persisted booking form state in localStorage.

### Security
- **Authentication:** PBKDF2-SHA256 hashing, KV sessions, and `__Host-session` cookies (HttpOnly, Secure, SameSite=Lax).
- **CSRF:** Async HMAC-SHA256 tokens required for mutating requests.
- **Rate Limiting:** Applied to auth endpoints via KV.
- **Middleware:** Role-based access control for `/admin/*` and `/artist/*`.

### Content Management
- **Astro Collections:** `src/content/artists/` and `src/content/sections/`.
- **Dynamic Routing:** Artist pages generated from content collections.

## Operations & Deployment

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Local development with `wrangler` proxy for D1/R2/KV. |
| `npm run build` | Production build (Astro + DO patch). |
| `npm run deploy` | Full build and deploy to Cloudflare. |
| `npm test` | Run Vitest suite (135+ tests). |
| `npx tsx scripts/seed-admin.ts` | Initialize admin user in D1. |

## Folder Structure Highlights
- `src/components/`: Categorized UI (admin, artist, booking, chat, etc.).
- `src/lib/`: Business logic (auth, db, chat, loyalty, pricing).
- `src/pages/api/`: Cloudflare Worker API endpoints.
- `src/styles/global.css`: Tailwind 4 theme and premium glassmorphism utility classes.

## Testing & Quality
- **Unit/Component Testing:** Vitest + React Testing Library.
- **Coverage:** >80% target for critical paths (store, navigation, chat).
- **CI/CD:** GitHub Actions for type-checking, testing, and automated deployment.

## Environment Variables (Secrets)
- `ADMIN_PASSWORD`: Initial setup auth.
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`: Payment processing.
- `UPLOAD_SECRET`: Bearer token for image upload API.
- `INSTAGRAM_TOKEN`: Optional Graph API token for social feed.
