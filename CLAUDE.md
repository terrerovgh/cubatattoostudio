# CLAUDE.md — Cuba Tattoo Studio Development Guide

## Project Overview

Cuba Tattoo Studio is a premium tattoo studio website + booking platform built with Astro 5, React 19, Tailwind v4, Stripe, and Cloudflare Workers/D1. It serves cubatattoostudio.com.

## Tech Stack

- **Framework:** Astro 5.17+ (static output, SSR per-route via `prerender = false`)
- **UI:** React 19 islands (client:only="react"), Tailwind v4 via Vite plugin
- **Payments:** Stripe SDK (server: `stripe@20`, client: `@stripe/stripe-js@8`)
- **Database:** Cloudflare D1 (SQLite), accessed via `locals.runtime.env.DB`
- **Storage:** Cloudflare R2 for images
- **State:** Nano Stores for cross-island communication
- **Animations:** GSAP ScrollTrigger, Three.js for WebGL backgrounds
- **Types:** TypeScript strict mode throughout

## Key Commands

```bash
npm run dev        # Dev server on localhost:4321
npm run build      # Production build (runs prebuild first)
npm run preview    # Local preview with Workers runtime
npm run deploy     # Build + deploy to Cloudflare
```

## Architecture Rules

1. **Landing page sections** are static Astro components rendered from Content Collections (`src/content/sections/*.md`)
2. **Interactive features** are React islands with `client:only="react"` directive
3. **API routes** use `export const prerender = false` and run as Cloudflare Workers
4. **Stripe** is imported dynamically in API routes: `const stripe = await import('stripe')`
5. **Vite config** has `ssr.external: ['stripe']` to prevent bundling issues
6. **All API responses** use `ApiResponse<T>` type with `satisfies` keyword

## File Organization

- `src/types/booking.ts` — All TypeScript interfaces (30+ types)
- `src/lib/pricing.ts` — Price calculation engine
- `src/lib/loyalty.ts` — Loyalty tiers, points, rewards
- `src/lib/aftercare.ts` — Post-tattoo message sequences
- `src/pages/api/` — All API endpoints (22 total)
- `src/components/booking/` — 5-step booking wizard
- `src/components/admin/` — Admin dashboard SPA
- `src/components/consent/` — Digital consent form
- `src/components/flash/` — Flash design drops
- `src/components/loyalty/` — Loyalty program widget

## Environment Variables (Cloudflare Workers)

Required for booking platform:
- `STRIPE_SECRET_KEY` — Stripe server-side API key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `ADMIN_PASSWORD` — Bearer token for admin API endpoints
- `DB` — Cloudflare D1 binding (configured in wrangler.jsonc)

## Database (D1)

10 tables: `clients`, `bookings`, `payments`, `consent_forms`, `flash_designs`, `flash_claims`, `loyalty_transactions`, `aftercare_messages`, `schedule_overrides`, `audit_log`.

D1 binding is currently commented out in `wrangler.jsonc` — needs database creation and ID.

## API Auth Pattern

Admin endpoints use Bearer token auth:
```typescript
function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization');
  if (!auth || !env.ADMIN_PASSWORD) return false;
  return auth.replace('Bearer ', '') === env.ADMIN_PASSWORD;
}
```

## Design System

- **Colors:** Dark theme, gold accent `#C8956C`, glassmorphism cards
- **Glass tokens:** `bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl`
- **Font:** Inter (Google Fonts), weights 300-900
- **Cards always float:** `mx-4 sm:mx-8 lg:mx-auto` — never touch viewport edges

## Common Patterns

### Adding a new API route
1. Create file in `src/pages/api/[domain]/[endpoint].ts`
2. Add `export const prerender = false;` at top
3. Export HTTP method handler: `export const GET/POST/PATCH: APIRoute`
4. Access D1 via `locals.runtime.env.DB`
5. Return `Response.json({ success, data/error } satisfies ApiResponse)`

### Adding a new page
1. Create `.astro` file in `src/pages/`
2. Use `BaseLayout` for consistent styling
3. For interactive content, create React component in `src/components/`
4. Use `client:only="react"` directive

## Important Notes

- Artists: David, Nina, Karli — all work Tue-Sat, closed Sun-Mon
- Pricing has style multipliers, schedule modifiers, and loyalty discounts
- The booking wizard handles the full flow: service → consultation → calendar → payment → confirmation
- Aftercare sends 5 automated messages over 30 days post-session
- Flash drops support early bird discounts for first N claims
