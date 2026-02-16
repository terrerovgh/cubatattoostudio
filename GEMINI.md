# Cuba Tattoo Studio - Project Context

Comprehensive guide for the Cuba Tattoo Studio premium landing page project.

## Project Overview

Cuba Tattoo Studio is a premium, immersive landing page for a tattoo studio based in Albuquerque, NM. It is built as a high-performance web application that mimics a native mobile experience, featuring glassmorphism, dynamic crossfade backgrounds, and an iOS-style floating dock for navigation.

### Core Architecture
- **Framework:** Astro 5.x (Hybrid: SSG for main content, SSR for API and Admin).
- **Deployment:** Cloudflare Pages/Workers (using `@astrojs/cloudflare`).
- **Data Persistence:** Cloudflare D1 (SQLite) for bookings, flash drops, and users.
- **Media Storage:** Cloudflare R2 for dynamic gallery uploads.
- **State Management:** Nano Stores for lightweight cross-island communication.
- **Styling:** Tailwind CSS 4.x with a dark premium aesthetic (Gold accents: `#C8956C`).
- **Interactivity:** React 19.x (Astro Islands) and GSAP 3.x for smooth animations.

## Key Features

- **Dynamic Backgrounds:** Crossfade transitions between SVG/Image backgrounds as the user scrolls through sections.
- **Floating Dock:** Persistent navigation bar with active section tracking.
- **Admin Dashboard:** SSR-protected area (`/admin`) for managing bookings and uploads.
- **Flash Drops:** Limited-edition tattoo design releases with real-time stock management.
- **Booking System:** Multi-step wizard for consultation and appointment scheduling.
- **Image Optimization:** Custom R2-backed API for serving and caching images efficiently.

## Development & Operations

### Building and Running
| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local development server (with local D1). |
| `npm run build` | Generates the production build (includes Instagram fetch). |
| `npm run preview` | Previews the production build using Wrangler. |
| `npm run deploy` | Builds and deploys to Cloudflare. |
| `npx wrangler d1 execute cubatattoostudio-db --local --file=src/lib/db/schema.sql` | Initializes/updates local database. |

### Project Structure
- `src/components/`: Astro and React components (categorized by section/feature).
- `src/content/`: Markdown-based content collections (`sections`, `artists`).
- `src/pages/`: File-based routing (Static and SSR).
- `src/lib/`: Core logic (DB schemas, auth, image utilities, caching).
- `scripts/`: Maintenance and pre-build scripts.

## Development Conventions

### Astro Islands
- Use `client:only="react"` for components that depend on browser APIs (like GSAP or global state).
- Prefer Astro components for static layouts and server-side logic to minimize client JS.

### Content Management
- The Home page is dynamically built from `src/content/sections/`.
- Use the `order` field in section frontmatter to control the sequence.
- Section layouts are defined by the `sectionLayout` field (e.g., `hero-center`, `profile-card`, `grid-gallery`).

### State Management (Nano Stores)
- Use `$activeSection` to track navigation state.
- Use `$currentBackground` to trigger background crossfades.
- Use `$pageMode` to adapt UI for home vs. artist-specific pages.

### Security & Performance
- **CSP:** Managed via `src/middleware.ts`.
- **Images:** Prefer SVG for backgrounds and R2-optimized URLs for gallery items.
- **Caching:** IndexedDB-based client-side image caching via `src/lib/imageCache.ts`.

## Environment Variables
Required variables (see `.env.example`):
- `ADMIN_PASSWORD`: For dashboard access.
- `STRIPE_SECRET_KEY`: For payment processing.
- `R2_BUCKET`: Binding for Cloudflare storage.
- `UPLOAD_SECRET`: Token for the image upload API.
