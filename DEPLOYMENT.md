# Deployment Guide — Cuba Tattoo Studio

## Prerequisites

```bash
node --version   # ≥ 22
wrangler --version  # ≥ 4.x
```

## First-Time Setup

### 1. Cloudflare Account Setup

```bash
# Login to Cloudflare via Wrangler
wrangler login

# Verify account
wrangler whoami
```

### 2. Create Cloudflare Resources

```bash
# D1 Database
wrangler d1 create cubatattoostudio-db
# → Copy the database_id to wrangler.jsonc

# R2 Buckets
wrangler r2 bucket create cubatattoostudio
wrangler r2 bucket create cubatattoostudio-preview   # For local dev

# KV Namespaces
wrangler kv namespace create AUTH_SESSIONS
wrangler kv namespace create RATE_LIMITER
# → Copy the namespace IDs to wrangler.jsonc
```

### 3. Apply Database Schema

```bash
# Production
wrangler d1 execute cubatattoostudio-db \
  --remote \
  --file=src/lib/db/schema.sql

# Local dev
wrangler d1 execute cubatattoostudio-db \
  --local \
  --file=src/lib/db/schema.sql

# V2 migrations (run after initial schema)
wrangler d1 execute cubatattoostudio-db \
  --remote \
  --file=src/lib/db/migration-v2.sql
```

### 4. Configure Secrets

```bash
# Admin portal password (for initial setup before DB users)
wrangler secret put ADMIN_PASSWORD

# Stripe payments
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET

# Image upload authentication
wrangler secret put UPLOAD_SECRET

# Optional: Instagram Graph API for posts
wrangler secret put INSTAGRAM_TOKEN
```

### 5. Create Initial Admin User

```bash
npx tsx scripts/seed-admin.ts
```

### 6. GitHub Actions Secrets

Go to **GitHub → Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers:Edit + D1:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_ZONE_ID` | Zone ID (for cache purging on deploy) |
| `INSTAGRAM_TOKEN` | Instagram Graph API token (optional) |

**Creating the Cloudflare API Token:**
1. Go to [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Add permissions: `D1:Edit`, `R2:Edit`, `Workers KV Storage:Edit`
5. Scope to your account

---

## Routine Deployments

### Automatic (Recommended)

Push to `main` → GitHub Actions deploys automatically:

```bash
git push origin main
```

Watch progress at: `github.com/terrerovgh/cubatattoostudio/actions`

### Manual Deploy

```bash
# Build + deploy production
npm run deploy

# Deploy staging only
wrangler deploy --env staging

# Deploy without building (use existing dist/)
wrangler deploy
```

---

## Database Migrations

All migrations use `IF NOT EXISTS` — safe to run multiple times.

```bash
# Run a specific migration file
wrangler d1 execute cubatattoostudio-db \
  --remote \
  --file=src/lib/db/your-migration.sql

# Interactive SQL console (production)
wrangler d1 execute cubatattoostudio-db \
  --remote \
  --command="SELECT count(*) FROM bookings"

# Local dev console
wrangler d1 execute cubatattoostudio-db \
  --local \
  --command="SELECT * FROM clients LIMIT 5"
```

### Migration Naming Convention

```
src/lib/db/
├── schema.sql          # v1 — full schema (idempotent)
├── migration-v2.sql    # v2 — additive changes only
├── migration-v3.sql    # v3 — ...
```

---

## R2 Storage Management

```bash
# List objects
wrangler r2 object list cubatattoostudio

# Upload a file
wrangler r2 object put cubatattoostudio/gallery/example.jpg \
  --file=./example.jpg \
  --content-type=image/jpeg

# Delete a file
wrangler r2 object delete cubatattoostudio/gallery/example.jpg
```

---

## KV Management

```bash
# Inspect sessions (don't abuse in production)
wrangler kv key list --namespace-id=15de9886c56148dc95b32460320b15b3

# Delete a specific session (force logout)
wrangler kv key delete "session:TOKEN_HERE" \
  --namespace-id=15de9886c56148dc95b32460320b15b3

# Clear rate limit for an IP
wrangler kv key delete "rl:192.168.1.1" \
  --namespace-id=0c1e22b8f2a44562907e6f2b208610c4
```

---

## Rollback Procedure

Wrangler keeps a version history. To rollback:

```bash
# List recent versions
wrangler versions list

# Deploy a specific version
wrangler versions deploy <version-id>
```

---

## Monitoring & Observability

### Real-time Logs

```bash
# Tail live production logs
wrangler tail cubatattoostudio

# Filter for errors only
wrangler tail cubatattoostudio --status=error

# Filter for specific paths
wrangler tail cubatattoostudio --search="/api/booking"
```

### Cloudflare Dashboard Metrics

1. Go to [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com)
2. Select `cubatattoostudio`
3. View: Requests, Errors, CPU time, Duration

### D1 Analytics

```bash
# Query usage stats
wrangler d1 info cubatattoostudio-db
```

---

## Local Development with Cloudflare Bindings

`astro dev` uses `wrangler`'s `getPlatformProxy()` to proxy all Cloudflare bindings locally:

```bash
npm run dev
# Reads from local D1 SQLite file
# Uses local R2 (mocked)
# Uses local KV (mocked)
```

**Note:** Durable Objects (ChatRoom) are not fully emulated locally. WebSocket chat falls back to REST polling in local dev.

---

## Environment Variables Reference

### Non-secret (in wrangler.jsonc)

| Variable | Value |
|---|---|
| `SITE_URL` | `https://cubatattoostudio.com` |
| `ENVIRONMENT` | `production` / `staging` |

### Secrets (via `wrangler secret put`)

| Secret | Required | Description |
|---|---|---|
| `ADMIN_PASSWORD` | ✅ | Legacy admin auth (transitional) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signature verification |
| `UPLOAD_SECRET` | ✅ | Bearer token for image uploads |
| `INSTAGRAM_TOKEN` | ⬜ | Instagram Graph API token |

---

## Stripe Webhook Setup

In the Stripe Dashboard:
1. Go to **Developers → Webhooks**
2. Add endpoint: `https://cubatattoostudio.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret → `wrangler secret put STRIPE_WEBHOOK_SECRET`

---

## Troubleshooting

### Build fails in CI

```bash
# Check if prebuild script fails
npm run prebuild  # runs scripts/fetch-insta.js

# Create fallback instagram data
echo "export const instagramPosts: any[] = [];" > src/data/instagram.ts
```

### Worker not starting

```bash
# Check for runtime errors
wrangler tail cubatattoostudio --status=error
```

### D1 migration fails

```bash
# Check for existing tables
wrangler d1 execute cubatattoostudio-db \
  --remote \
  --command=".tables"

# All migrations use IF NOT EXISTS — safe to re-run
```

### Session not persisting

- Check cookie domain matches the request origin
- Verify `__Host-session` requires HTTPS (use `wrangler dev --local-protocol=https` for testing)

### Rate limit stuck

```bash
wrangler kv key delete "rl:{your-ip}" \
  --namespace-id=0c1e22b8f2a44562907e6f2b208610c4
```
