# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Cuba Tattoo Studio is a single-page landing site for a tattoo studio in Albuquerque, NM. Built with Astro 5 using Islands Architecture, React 19 for interactive components, and TailwindCSS 4 for styling. The site emphasizes performance (static generation), visual experience (smooth animations), and is optimized for Cloudflare Pages deployment.

**Tech Stack**: Astro 5.16 (SSG), React 19.2, TailwindCSS 4.1, TypeScript, Supabase (planned)

## Common Commands

### Development
```bash
npm run dev          # Start dev server at localhost:4321 with HMR
npm run build        # Build for production in ./dist/
npm run preview      # Preview production build locally
npm run astro check  # TypeScript type-checking
```

### Astro CLI
```bash
npm run astro add <integration>    # Add Astro integration
npm run astro ...                  # Run any Astro CLI command
```

### Future Supabase Commands
```bash
supabase login                                          # Login to Supabase
supabase gen types typescript --project-id <id> > src/types/supabase.ts  # Generate database types
```

## High-Level Architecture

### Framework Patterns

**Islands Architecture**: The site uses Astro's partial hydration model. Most components are static HTML with zero JavaScript. Only React components (currently just Lucide icons) are hydrated on the client.

**File-based Routing**: Pages in `src/pages/` map to routes. Currently single-page app with only `index.astro`.

**Component Hierarchy**:
```
Layout.astro (base layout with global scripts)
  └── index.astro (main page)
        ├── Navbar.astro (sticky navigation)
        ├── Hero.astro (fullscreen hero with parallax)
        ├── Services.astro (disciplines grid)
        ├── Artists.astro (artist profiles)
        ├── Gallery.astro (masonry grid)
        ├── Booking.astro (contact form + map)
        └── Footer.astro
```

### Animation System

The site uses a **custom Intersection Observer-based animation system** implemented in `Layout.astro`:

- Elements with `.reveal-hidden` class automatically animate when scrolling into viewport
- Observer adds `.reveal-visible` class when element is 15% visible
- Stagger delays (`.stagger-delay-1`, `.stagger-delay-2`, `.stagger-delay-3`) for sequential animations
- Parallax effect on hero background via scroll event listener
- Mobile menu toggle via custom script

**Key animation CSS variables** in `global.css`:
```css
--reveal-distance: 40px;    /* translateY distance */
--reveal-duration: 1s;      /* animation duration */
```

### Styling Architecture

**TailwindCSS 4**: Uses new `@theme` directive in `global.css` for configuration instead of `tailwind.config.js`. All custom theme variables are defined with `--` prefix.

**Color Palette**: Monochromatic dark theme
- Backgrounds: `bg-black`, `bg-neutral-950`, `bg-neutral-900`
- Text: `text-neutral-100/300/400/500`, `text-white`
- CTAs: White backgrounds/text for contrast

**Typography**: Inter font (Google Fonts) with weights 300-600. Large headlines use `tracking-tighter` (-0.04em) and `tracking-tight` (-0.02em).

**Responsive Pattern**: Mobile-first approach with Tailwind breakpoints (`md:`, `lg:`). Common pattern: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

### Data Architecture (Current and Future)

**Current State**: Static content hardcoded in components. Images served from `/public/` directory.

**Planned Supabase Integration**:
- PostgreSQL database with tables: `artists`, `services`, `works`, `site_content`, `site_config`
- Row Level Security (RLS) policies for access control
- Storage buckets: `avatars/`, `works/`, `site-assets/`
- Authentication: Email/password + Google OAuth
- User roles: `public`, `artist`, `admin` with granular permissions

**Data Flow Pattern**:
1. Build time: Astro fetches from Supabase during SSG
2. Runtime: Client-side auth and admin dashboard interactions
3. Rebuild triggers: Webhooks from Supabase content changes

## File Organization

```
/
├── public/                    # Static assets (images, SVGs)
│   ├── artists/              # Artist profile images
│   ├── tattoo/               # Gallery portfolio images (tattoo1-25.png)
│   ├── logo-stack.svg        # Studio logo
│   └── favicon.svg
├── src/
│   ├── components/           # Astro components (one per section)
│   ├── layouts/              # Layout.astro (base template)
│   ├── pages/                # File-based routes (only index.astro)
│   ├── styles/               # global.css (Tailwind + custom CSS)
│   ├── content/              # Future: Content collections
│   └── lib/                  # Future: Supabase client, utilities
├── docs/                     # Technical documentation
├── ARCHITECTURE.md           # Detailed architecture
├── DEVELOPMENT.md            # Development guide
├── COMPONENTS.md             # Component documentation
└── astro.config.mjs          # Astro + React + TailwindCSS config
```

## Development Guidelines

### Component Structure

Follow this pattern for Astro components:

```astro
---
// 1. Imports
import { Icon } from "lucide-react";

// 2. Props interface (if needed)
interface Props {
    title: string;
}

// 3. Logic
const { title } = Astro.props;
---

<!-- 4. Template -->
<section id="section-id" class="py-20 md:py-32 bg-black">
    <div class="max-w-7xl mx-auto px-6">
        <!-- Content -->
    </div>
</section>

<!-- 5. Scoped styles (optional) -->
```

### Tailwind Class Ordering

1. Layout (display, position, flex/grid)
2. Sizing (width, height, padding, margin)
3. Typography (font, text)
4. Visual (color, background, border)
5. Effects (shadow, opacity, transform)
6. Animations (transition, animate)

### Adding Animations

To animate an element on scroll:
```astro
<div class="reveal-hidden">
    <!-- Automatically animates when in viewport -->
</div>

<!-- With staggered delays -->
<div class="reveal-hidden stagger-delay-1">First</div>
<div class="reveal-hidden stagger-delay-2">Second</div>
```

### Working with Images

1. Place images in `/public/directory/`
2. Reference with absolute path: `<img src="/directory/image.png" alt="..." />`
3. For optimized images, use Astro's Image component:
```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---
<Image src={myImage} alt="..." />
```

### TypeScript Configuration

- Uses `astro/tsconfigs/strict` base
- JSX configured for React
- Types should be inferred when possible
- Use interfaces for component props
- Avoid `any`, prefer `unknown` if needed

### Script Location

All page-level JavaScript (Intersection Observer, parallax, mobile menu toggle) lives in `Layout.astro` at the bottom of the file. Component-specific scripts should be in the component itself using Astro's `<script>` tag.

## Important Patterns

### Navigation Links

Use anchor links for single-page sections:
```astro
<a href="#artists">Meet Artists</a>
```

Sections must have corresponding `id` attributes:
```astro
<section id="artists">...</section>
```

### Hover Effects with Groups

For coordinated hover effects:
```astro
<div class="group">
    <img class="grayscale group-hover:grayscale-0" />
    <p class="opacity-50 group-hover:opacity-100">Text</p>
</div>
```

### Responsive Images

Artist and gallery images use aspect ratios and cover patterns:
```astro
<div class="relative aspect-square overflow-hidden rounded-2xl">
    <img class="w-full h-full object-cover" />
</div>
```

## Critical Technical Details

### Layout.astro Responsibilities

This component is the backbone of the site:
- Manages `<head>` with meta tags, fonts, favicon
- Imports `global.css` (Tailwind + custom styles)
- Contains Intersection Observer setup for `.reveal-hidden` elements
- Implements parallax scroll effect for hero background
- Mobile menu toggle logic

### TailwindCSS 4 Migration

This project uses TailwindCSS 4 which has breaking changes:
- No `tailwind.config.js` file
- Configuration via `@theme {}` in CSS files
- Integration via `@tailwindcss/vite` plugin in `astro.config.mjs`

### Build Output

Astro generates static HTML to `./dist/`:
- Zero JavaScript for most of the site
- Hydrated React components bundled separately
- Assets optimized and hashed
- Ready for deployment to static hosts (Cloudflare Pages)

## Future Development Notes

### Supabase Integration

When implementing Supabase:
1. Install dependencies: `@supabase/supabase-js`, `@supabase/auth-helpers-astro`
2. Create `src/lib/supabase.ts` client
3. Add environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
4. Fetch data in component frontmatter at build time
5. Implement middleware for protected routes in `src/middleware/auth.ts`

See `docs/supabase-integration.md` and `docs/authentication.md` for detailed implementation plans.

### Admin Dashboard

Planned dashboard (`/admin` route) for content management:
- CRUD for artists, works, services
- Image upload with drag & drop
- WYSIWYG editor for site content
- Role-based access (admin and artist roles)

See `docs/admin-dashboard.md` for specifications.

## Troubleshooting Quick Reference

- **Dev server won't start**: Clear `.astro` and `node_modules`, reinstall
- **Changes not reflecting**: Hard refresh (Cmd+Shift+R) or restart dev server
- **TypeScript errors**: Run `npm run astro check` and clear `.astro` directory
- **Animations not working**: Verify Intersection Observer script in `Layout.astro`
- **Images 404**: Check path starts with `/`, file is in `/public/`, case matches exactly
- **Tailwind classes not applying**: Verify `@import "tailwindcss"` in `global.css` and it's imported in `Layout.astro`

## Key Documentation Files

- `ARCHITECTURE.md` - Complete technical architecture including database schema, RLS policies, authentication flows
- `DEVELOPMENT.md` - Step-by-step development guide with code examples
- `COMPONENTS.md` - Detailed component API and usage documentation
- `DEPLOYMENT.md` - Cloudflare Pages deployment instructions
- `docs/supabase-integration.md` - Supabase setup and integration guide
- `docs/authentication.md` - Auth system implementation details
- `docs/admin-dashboard.md` - Admin dashboard specifications
