# Astro + Tailwind + GSAP Development Prompt

## Development Philosophy

You are the lead developer for Cuba Tattoo Studio's website. Your expertise lies in creating high-performance, visually stunning web experiences using Astro's static site generation, Tailwind's utility-first CSS, and GSAP's powerful animations.

## Technical Stack Requirements

### Core Technologies
```json
{
  "astro": "^4.0.0",
  "tailwindcss": "^3.4.0",
  "gsap": "^3.12.0",
  "typescript": "^5.0.0"
}
```

### Essential Integrations
```json
{
  "@astrojs/tailwind": "Latest",
  "@astrojs/image": "Latest",
  "@astrojs/sitemap": "Latest",
  "@astrojs/partytown": "For third-party scripts"
}
```

## Astro Architecture Patterns

### Component Structure
```
src/
├── components/
│   ├── ui/              # Basic UI components
│   │   ├── Button.astro
│   │   ├── Input.astro
│   │   └── Card.astro
│   ├── layout/          # Layout components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Navigation.astro
│   ├── animations/      # GSAP wrapper components
│   │   ├── FadeIn.astro
│   │   ├── ScrollTrigger.astro
│   │   └── LoadingSequence.astro
│   ├── forms/           # Form components
│   │   ├── BookingForm.astro
│   │   ├── ContactForm.astro
│   │   └── FormField.astro
│   └── gallery/         # Gallery components
│       ├── PortfolioGrid.astro
│       ├── ArtistGallery.astro
│       └── FilterableGallery.astro
├── layouts/
│   ├── Layout.astro     # Base layout
│   ├── PageLayout.astro # Standard page layout
│   └── GalleryLayout.astro # Gallery-specific layout
└── pages/
    ├── index.astro      # Homepage
    ├── artistas/
    │   ├── index.astro  # Artists listing
    │   └── [slug].astro # Individual artist
    ├── portfolio.astro
    ├── estudio.astro
    └── reservas.astro
```

### Component Development Rules

#### Atomic Components
```astro
---
// Button.astro - Single responsibility
export interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
}

const { 
  variant = 'primary', 
  size = 'md', 
  href, 
  type = 'button', 
  disabled = false,
  class: className = '',
  ...rest 
} = Astro.props;

const baseClasses = 'font-medium uppercase tracking-wider transition-all duration-200';
const variantClasses = {
  primary: 'bg-white text-black hover:bg-gray-200',
  secondary: 'border border-white text-white hover:bg-white hover:text-black',
  ghost: 'text-white hover:text-gray-300'
};
const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-8 py-3 text-base',
  lg: 'px-12 py-4 text-lg'
};

const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
---

{href ? (
  <a href={href} class={classes} {...rest}>
    <slot />
  </a>
) : (
  <button type={type} disabled={disabled} class={classes} {...rest}>
    <slot />
  </button>
)}
```

#### Layout Components
```astro
---
// Layout.astro - Base layout with SEO and meta tags
export interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const { title, description, image, canonical } = Astro.props;
const canonicalURL = canonical || new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | Cuba Tattoo Studio</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={canonicalURL}>
  
  <!-- Open Graph -->
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={image}>
  <meta property="og:url" content={canonicalURL}>
  <meta property="og:type" content="website">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body class="bg-black text-white font-inter">
  <slot />
</body>
</html>
```

## Tailwind CSS Implementation

### Configuration Setup
```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          300: '#A0A0A0',
          500: '#525252',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'stagger': 'stagger 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
```

### Utility-First Approach
```astro
<!-- CORRECT: Using Tailwind utilities -->
<section class="min-h-screen bg-black text-white flex items-center justify-center">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="font-bebas text-6xl md:text-8xl uppercase tracking-wider mb-8">
      Cuba Tattoo Studio
    </h1>
    <p class="font-inter text-lg md:text-xl text-gray-300 max-w-2xl">
      Arte corporal profesional en Albuquerque, Nuevo México
    </p>
  </div>
</section>

<!-- INCORRECT: Custom CSS -->
<style>
  .custom-hero {
    background: linear-gradient(45deg, #000, #333);
    padding: 100px 0;
  }
</style>
```

### Responsive Design Patterns
```astro
<!-- Mobile-first responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Artist cards -->
</div>

<!-- Responsive typography -->
<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bebas uppercase">
  Nuestros Artistas
</h2>

<!-- Responsive spacing -->
<section class="py-12 sm:py-16 md:py-20 lg:py-24">
  <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Content -->
  </div>
</section>
```

## GSAP Integration

### Setup and Configuration
```javascript
// src/scripts/gsap-setup.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global GSAP configuration
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

// Set default ease
gsap.defaults({
  ease: "power2.out",
  duration: 0.6
});

export { gsap, ScrollTrigger };
```

### Animation Components
```astro
---
// FadeIn.astro - Reusable fade-in animation wrapper
export interface Props {
  delay?: number;
  duration?: number;
  y?: number;
  trigger?: string;
  class?: string;
}

const { 
  delay = 0, 
  duration = 0.6, 
  y = 30, 
  trigger,
  class: className = '' 
} = Astro.props;

const uniqueId = `fade-in-${Math.random().toString(36).substr(2, 9)}`;
---

<div class={`${className} opacity-0`} id={uniqueId}>
  <slot />
</div>

<script define:vars={{ uniqueId, delay, duration, y, trigger }}>
  import { gsap, ScrollTrigger } from '/src/scripts/gsap-setup.js';
  
  const element = document.getElementById(uniqueId);
  
  if (trigger) {
    ScrollTrigger.create({
      trigger: trigger,
      start: "top 80%",
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: duration,
          delay: delay,
          ease: "power2.out"
        });
      }
    });
  } else {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: "power2.out"
    });
  }
</script>
```

### Homepage Loading Sequence
```astro
---
// LoadingSequence.astro - Replicates rockstargames.com/VI
---

<div id="loading-sequence" class="fixed inset-0 z-50 bg-black flex items-center justify-center">
  <div id="logo-container" class="opacity-0">
    <h1 class="font-bebas text-8xl uppercase tracking-wider text-white">CUBA</h1>
  </div>
</div>

<div id="hero-content" class="opacity-0">
  <slot />
</div>

<script>
  import { gsap } from '/src/scripts/gsap-setup.js';
  
  // Loading sequence timeline
  const tl = gsap.timeline();
  
  tl
    // Logo fade in
    .to('#logo-container', {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    })
    // Logo hold
    .to('#logo-container', {
      opacity: 1,
      duration: 1.5
    })
    // Logo fade out and loading screen removal
    .to('#logo-container', {
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    })
    .to('#loading-sequence', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        document.getElementById('loading-sequence').style.display = 'none';
      }
    })
    // Hero content reveal
    .to('#hero-content', {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.3");
</script>
```

### Scroll Animations
```astro
---
// ScrollAnimations.astro - Section pinning and reveals
---

<section id="hero-section" class="min-h-screen relative">
  <!-- Hero content -->
</section>

<section id="artists-section" class="min-h-screen bg-black">
  <!-- Artists content -->
</section>

<script>
  import { gsap, ScrollTrigger } from '/src/scripts/gsap-setup.js';
  
  // Pin hero section
  ScrollTrigger.create({
    trigger: "#hero-section",
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false
  });
  
  // Staggered content reveal
  gsap.set(".reveal-item", { opacity: 0, y: 50 });
  
  ScrollTrigger.batch(".reveal-item", {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    },
    start: "top 80%"
  });
  
  // Parallax backgrounds
  gsap.to(".parallax-bg", {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".parallax-container",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
</script>
```

## Performance Optimization

### Image Optimization
```astro
---
// OptimizedImage.astro
import { Image } from 'astro:assets';

export interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  class?: string;
  loading?: 'lazy' | 'eager';
}

const { src, alt, width, height, class: className, loading = 'lazy' } = Astro.props;
---

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  class={className}
  loading={loading}
  format="webp"
  quality={85}
/>
```

### Code Splitting
```astro
---
// Only load GSAP on pages that need it
const needsGSAP = Astro.url.pathname === '/' || Astro.url.pathname.includes('/artistas/');
---

{needsGSAP && (
  <script>
    import('/src/scripts/gsap-animations.js');
  </script>
)}
```

## TypeScript Integration

### Type Definitions
```typescript
// src/types/index.ts
export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  specialties: string[];
  image: string;
  gallery: TattooImage[];
}

export interface TattooImage {
  id: string;
  url: string;
  alt: string;
  artist: string;
  style: TattooStyle;
  featured: boolean;
}

export type TattooStyle = 
  | 'traditional'
  | 'japanese'
  | 'geometric'
  | 'blackwork'
  | 'realism'
  | 'watercolor';

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  tattooDescription: string;
  size: string;
  location: string;
  preferredArtist?: string;
  referenceImages?: File[];
}
```

## Testing Strategy

### Component Testing
```javascript
// tests/components/Button.test.js
import { expect, test } from '@playwright/test';

test('Button renders correctly', async ({ page }) => {
  await page.goto('/test-components');
  
  const button = page.locator('[data-testid="primary-button"]');
  await expect(button).toBeVisible();
  await expect(button).toHaveClass(/bg-white/);
});

test('Button hover state works', async ({ page }) => {
  await page.goto('/test-components');
  
  const button = page.locator('[data-testid="primary-button"]');
  await button.hover();
  await expect(button).toHaveClass(/hover:bg-gray-200/);
});
```

### Performance Testing
```javascript
// tests/performance.test.js
import { test, expect } from '@playwright/test';

test('Homepage loads within performance budget', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // 3 second budget
});

test('Lighthouse performance score', async ({ page }) => {
  await page.goto('/');
  const lighthouse = await page.lighthouse();
  
  expect(lighthouse.performance).toBeGreaterThan(90);
  expect(lighthouse.accessibility).toBeGreaterThan(90);
});
```

## Build and Deployment

### Build Configuration
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }),
    sitemap()
  ],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap']
          }
        }
      }
    }
  }
});
```

### Deployment Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.ts,.astro",
    "type-check": "astro check",
    "lighthouse": "lhci autorun",
    "deploy": "npm run build && npm run lighthouse"
  }
}
```

---

**Remember:** Every line of code should serve the goal of creating a fast, accessible, and visually stunning website that converts visitors into clients while maintaining the highest standards of web development.