# Design System - Cuba Tattoo Studio

## 🎨 Design Philosophy

The Cuba Tattoo Studio design system embodies the bold, artistic, and professional nature of the tattoo industry while maintaining accessibility and usability. The system is built on a foundation of **monochromatic elegance** with **cinematic interactions** that reflect the studio's commitment to high-quality artistry.

## 🎯 Design Principles

### Core Principles

1. **Monochromatic Mastery** - Strict black and white palette with strategic grayscale accents
2. **Cinematic Experience** - Smooth, film-like animations and transitions
3. **Artistic Expression** - Bold typography and impactful visual hierarchy
4. **Professional Trust** - Clean, modern layouts that inspire confidence
5. **Accessibility First** - Inclusive design for all users
6. **Mobile Excellence** - Seamless experience across all devices

### Visual Hierarchy

```
Primary (Hero Elements)
├── Large headings (Bebas Neue, 4xl-8xl)
├── Key CTAs (White buttons, high contrast)
└── Featured imagery (High-quality, full-width)

Secondary (Content)
├── Section headings (Bebas Neue, 2xl-4xl)
├── Body text (Inter, readable sizes)
└── Supporting imagery (Portfolio, artists)

Tertiary (UI Elements)
├── Navigation (Clean, minimal)
├── Form elements (Functional, accessible)
└── Footer content (Informational)
```

## 🎨 Color System

### Primary Palette

The design system uses a strictly monochromatic approach with carefully selected grayscale values.

```css
:root {
  /* Primary Colors */
  --cuba-black: #000000;     /* Pure black - backgrounds, primary text */
  --cuba-white: #FFFFFF;     /* Pure white - text on dark, CTAs */
  
  /* Grayscale Palette */
  --cuba-gray-50: #FAFAFA;   /* Lightest gray - subtle backgrounds */
  --cuba-gray-100: #F5F5F5;  /* Very light gray - borders */
  --cuba-gray-200: #EEEEEE;  /* Light gray - disabled states */
  --cuba-gray-300: #E0E0E0;  /* Medium light gray - dividers */
  --cuba-gray-400: #A0A0A0;  /* Medium gray - secondary text */
  --cuba-gray-500: #757575;  /* Medium dark gray - placeholders */
  --cuba-gray-600: #525252;  /* Dark gray - borders, icons */
  --cuba-gray-700: #404040;  /* Darker gray - secondary backgrounds */
  --cuba-gray-800: #262626;  /* Very dark gray - elevated surfaces */
  --cuba-gray-900: #171717;  /* Almost black - deep backgrounds */
}
```

### Color Usage Guidelines

#### Primary Usage
- **Cuba Black (#000000)**: Main backgrounds, primary text on light surfaces
- **Cuba White (#FFFFFF)**: Text on dark surfaces, primary CTAs, highlights

#### Secondary Usage
- **Gray 400 (#A0A0A0)**: Secondary text, captions, metadata
- **Gray 600 (#525252)**: Borders, dividers, inactive states
- **Gray 800 (#262626)**: Card backgrounds, elevated surfaces

#### Accessibility Compliance

All color combinations meet WCAG 2.1 AA standards:

```css
/* High Contrast Combinations */
.text-primary { color: #FFFFFF; background: #000000; } /* 21:1 ratio */
.text-secondary { color: #A0A0A0; background: #000000; } /* 7.3:1 ratio */
.text-tertiary { color: #525252; background: #FFFFFF; } /* 8.1:1 ratio */
```

### Semantic Colors

For functional states, minimal color is used:

```css
:root {
  /* Semantic Colors (used sparingly) */
  --success: #10B981;        /* Success states, confirmations */
  --error: #EF4444;          /* Error states, validation */
  --warning: #F59E0B;        /* Warning states, cautions */
  --info: #3B82F6;           /* Information, links */
}
```

## ✍️ Typography System

### Font Stack

#### Primary Typeface: Bebas Neue
**Usage**: Headings, CTAs, branding elements
**Characteristics**: Condensed, uppercase, impactful

```css
.font-heading {
  font-family: 'Bebas Neue', 'Arial Black', 'Arial Narrow', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.1;
}
```

#### Secondary Typeface: Inter
**Usage**: Body text, UI elements, readable content
**Characteristics**: Clean, readable, modern

```css
.font-body {
  font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: -0.01em;
}
```

### Typography Scale

```css
/* Typography Scale */
.text-xs { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }    /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }     /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }  /* 36px */
.text-5xl { font-size: 3rem; line-height: 1; }          /* 48px */
.text-6xl { font-size: 3.75rem; line-height: 1; }       /* 60px */
.text-7xl { font-size: 4.5rem; line-height: 1; }        /* 72px */
.text-8xl { font-size: 6rem; line-height: 1; }          /* 96px */
```

### Typography Hierarchy

#### Headings

```css
/* H1 - Page Titles */
.heading-1 {
  font-family: 'Bebas Neue';
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 0.9;
  color: var(--cuba-white);
}

/* H2 - Section Titles */
.heading-2 {
  font-family: 'Bebas Neue';
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
  color: var(--cuba-white);
}

/* H3 - Subsection Titles */
.heading-3 {
  font-family: 'Bebas Neue';
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.1;
  color: var(--cuba-white);
}
```

#### Body Text

```css
/* Primary Body Text */
.body-large {
  font-family: 'Inter';
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.7;
  color: var(--cuba-gray-400);
}

/* Standard Body Text */
.body-regular {
  font-family: 'Inter';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--cuba-gray-400);
}

/* Small Body Text */
.body-small {
  font-family: 'Inter';
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--cuba-gray-400);
}
```

## 📐 Spacing System

### Spacing Scale

Based on an 8px grid system for consistency:

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Layout Spacing

```css
/* Section Spacing */
.section-padding {
  padding-top: var(--space-16);    /* 64px */
  padding-bottom: var(--space-16); /* 64px */
}

@media (min-width: 768px) {
  .section-padding {
    padding-top: var(--space-20);    /* 80px */
    padding-bottom: var(--space-20); /* 80px */
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-top: var(--space-24);    /* 96px */
    padding-bottom: var(--space-24); /* 96px */
  }
}

/* Container Spacing */
.container-padding {
  padding-left: var(--space-4);  /* 16px */
  padding-right: var(--space-4); /* 16px */
}

@media (min-width: 640px) {
  .container-padding {
    padding-left: var(--space-6);  /* 24px */
    padding-right: var(--space-6); /* 24px */
  }
}

@media (min-width: 1024px) {
  .container-padding {
    padding-left: var(--space-8);  /* 32px */
    padding-right: var(--space-8); /* 32px */
  }
}
```

## 🔲 Component Styles

### Buttons

#### Primary Button

```css
.btn-primary {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  
  /* Typography */
  font-family: 'Bebas Neue';
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  
  /* Appearance */
  background-color: var(--cuba-white);
  color: var(--cuba-black);
  border: 2px solid var(--cuba-white);
  border-radius: 0;
  
  /* Interaction */
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: var(--cuba-gray-400);
  border-color: var(--cuba-gray-400);
  transform: scale(1.05);
}

.btn-primary:active {
  transform: scale(0.95);
}

.btn-primary:focus {
  outline: 2px solid var(--cuba-white);
  outline-offset: 2px;
}
```

#### Secondary Button

```css
.btn-secondary {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  
  /* Typography */
  font-family: 'Bebas Neue';
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  
  /* Appearance */
  background-color: transparent;
  color: var(--cuba-white);
  border: 2px solid var(--cuba-white);
  border-radius: 0;
  
  /* Interaction */
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: var(--cuba-white);
  color: var(--cuba-black);
  transform: scale(1.05);
}
```

### Form Elements

#### Input Fields

```css
.form-input {
  /* Layout */
  width: 100%;
  padding: var(--space-3) var(--space-4);
  
  /* Typography */
  font-family: 'Inter';
  font-size: 1rem;
  font-weight: 400;
  
  /* Appearance */
  background-color: transparent;
  color: var(--cuba-white);
  border: 2px solid var(--cuba-gray-600);
  border-radius: 0;
  
  /* Interaction */
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: var(--cuba-gray-400);
}

.form-input:focus {
  outline: none;
  border-color: var(--cuba-white);
  box-shadow: 0 0 0 1px var(--cuba-white);
}

.form-input:invalid {
  border-color: var(--error);
}
```

#### Labels

```css
.form-label {
  /* Layout */
  display: block;
  margin-bottom: var(--space-2);
  
  /* Typography */
  font-family: 'Bebas Neue';
  font-size: 0.875rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cuba-white);
}
```

### Cards

#### Portfolio Card

```css
.portfolio-card {
  /* Layout */
  position: relative;
  overflow: hidden;
  
  /* Appearance */
  background-color: var(--cuba-gray-800);
  border: 1px solid var(--cuba-gray-600);
  
  /* Interaction */
  transition: all 0.3s ease;
  cursor: pointer;
}

.portfolio-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: var(--cuba-white);
}

.portfolio-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio-card:hover img {
  transform: scale(1.1);
}
```

#### Artist Card

```css
.artist-card {
  /* Layout */
  position: relative;
  text-align: center;
  
  /* Appearance */
  background-color: var(--cuba-black);
  
  /* Interaction */
  transition: all 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-4px);
}

.artist-card-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.artist-card:hover .artist-card-image {
  filter: grayscale(0%);
}
```

## 📱 Responsive Design

### Breakpoint System

```css
:root {
  /* Breakpoints */
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Medium devices */
  --breakpoint-lg: 1024px;  /* Large devices */
  --breakpoint-xl: 1280px;  /* Extra large devices */
  --breakpoint-2xl: 1536px; /* 2X large devices */
}
```

### Mobile-First Approach

```css
/* Mobile First (default) */
.hero-title {
  font-size: 2.5rem;
  line-height: 1;
  margin-bottom: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero-title {
    font-size: 4rem;
    margin-bottom: var(--space-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 6rem;
    margin-bottom: var(--space-8);
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .hero-title {
    font-size: 8rem;
  }
}
```

### Grid System

```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}

/* Grid */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  .lg\:grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
}
```

## 🎭 Animation System

### Easing Functions

```css
:root {
  /* Custom Easing */
  --ease-out-cubic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-cubic: cubic-bezier(0.55, 0.06, 0.68, 0.19);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Transition Patterns

```css
/* Standard Transitions */
.transition-fast {
  transition: all 0.15s var(--ease-out-cubic);
}

.transition-normal {
  transition: all 0.3s var(--ease-out-cubic);
}

.transition-slow {
  transition: all 0.6s var(--ease-out-cubic);
}

/* Hover Effects */
.hover-lift {
  transition: transform 0.3s var(--ease-out-cubic);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale {
  transition: transform 0.3s var(--ease-out-cubic);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

### Loading States

```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--cuba-gray-800) 25%,
    var(--cuba-gray-700) 50%,
    var(--cuba-gray-800) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fade In Animation */
.fade-in {
  opacity: 0;
  animation: fade-in 0.6s var(--ease-out-cubic) forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
```

## ♿ Accessibility Guidelines

### Focus States

```css
/* Focus Ring */
.focus-ring:focus {
  outline: 2px solid var(--cuba-white);
  outline-offset: 2px;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--cuba-white);
  color: var(--cuba-black);
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support

```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .btn-primary {
    border: 3px solid var(--cuba-white);
  }
  
  .form-input {
    border-width: 3px;
  }
}
```

### Reduced Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 🖼️ Imagery Guidelines

### Image Styles

```css
/* Portfolio Images */
.portfolio-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%) contrast(1.1);
  transition: filter 0.3s ease;
}

.portfolio-image:hover {
  filter: grayscale(0%) contrast(1.2);
}

/* Artist Photos */
.artist-photo {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2);
  transition: filter 0.3s ease;
}

.artist-photo:hover {
  filter: grayscale(0%) contrast(1.1);
}
```

### Image Optimization

- **Format**: WebP with JPEG fallback
- **Quality**: 85% for photographs, 95% for graphics
- **Sizes**: Multiple responsive sizes
- **Loading**: Lazy loading for non-critical images
- **Alt Text**: Descriptive alternative text for all images

## 📏 Layout Patterns

### Hero Section

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--cuba-black);
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  padding: var(--space-8);
  z-index: 2;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  z-index: 1;
}
```

### Section Layout

```css
.section {
  padding: var(--space-16) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-family: 'Bebas Neue';
  font-size: clamp(2rem, 6vw, 4rem);
  color: var(--cuba-white);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-family: 'Inter';
  font-size: 1.125rem;
  color: var(--cuba-gray-400);
  max-width: 600px;
  margin: 0 auto;
}
```

## 🎨 Design Tokens

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cuba': {
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#A0A0A0',
            500: '#757575',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717'
          }
        }
      },
      fontFamily: {
        'heading': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }
    }
  }
};
```

## 📋 Design Checklist

### Component Design Review

- [ ] **Visual Consistency**
  - [ ] Uses design system colors
  - [ ] Follows typography hierarchy
  - [ ] Consistent spacing applied
  - [ ] Proper visual hierarchy

- [ ] **Accessibility**
  - [ ] Sufficient color contrast (4.5:1 minimum)
  - [ ] Focus states visible
  - [ ] Screen reader friendly
  - [ ] Keyboard navigation support

- [ ] **Responsive Design**
  - [ ] Mobile-first approach
  - [ ] Proper breakpoint usage
  - [ ] Touch-friendly targets (44px minimum)
  - [ ] Readable text on all devices

- [ ] **Performance**
  - [ ] Optimized images
  - [ ] Efficient animations
  - [ ] Minimal custom CSS
  - [ ] Proper loading states

- [ ] **Brand Consistency**
  - [ ] Monochromatic palette maintained
  - [ ] Typography guidelines followed
  - [ ] Animation style consistent
  - [ ] Professional appearance

---

*This design system serves as the foundation for all visual and interactive elements of the Cuba Tattoo Studio website. Adherence to these guidelines ensures consistency, accessibility, and brand alignment across the entire user experience.*