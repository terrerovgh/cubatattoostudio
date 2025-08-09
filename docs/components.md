# Component Library - Cuba Tattoo Studio

## 🧩 Component Overview

The Cuba Tattoo Studio website uses a comprehensive component library built with Astro, designed for reusability, consistency, and performance. All components follow the monochromatic design system and are optimized for accessibility and mobile-first responsive design.

## 🎨 Design System Foundation

### Color Tokens
```css
:root {
  --cuba-black: #000000;
  --cuba-white: #FFFFFF;
  --cuba-gray-400: #A0A0A0;
  --cuba-gray-600: #525252;
}
```

### Typography Scale
```css
/* Headings - Bebas Neue */
.font-heading {
  font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Body Text - Inter */
.font-body {
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
}
```

### Spacing Scale
```css
/* Tailwind CSS spacing scale */
/* 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px */
```

## 🏗️ Component Architecture

### Component Categories

```
src/components/
├── ui/                  # Basic UI elements
├── layout/              # Layout components
├── forms/               # Form components
├── gallery/             # Portfolio and gallery
├── animations/          # GSAP animation wrappers
└── effects/             # Visual effects
```

## 🎯 UI Components

### Button Component

**File**: `src/components/ui/Button.astro`

#### Props Interface
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Primary button -->
<Button variant="primary" size="lg">
  Book Appointment
</Button>

<!-- Link button -->
<Button variant="secondary" href="/portfolio">
  View Portfolio
</Button>

<!-- Full width button -->
<Button variant="outline" fullWidth>
  Contact Us
</Button>
```

#### Variants
- **Primary**: White background, black text, main CTA
- **Secondary**: Transparent background, white border and text
- **Outline**: Transparent background, gray border
- **Ghost**: No background or border, text only

#### Implementation
```astro
---
export interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  class?: string;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled = false,
  fullWidth = false,
  class: className = ''
} = Astro.props;

const baseClasses = `
  inline-flex items-center justify-center
  font-heading uppercase tracking-wider
  transition-all duration-300 ease-out
  focus:outline-none focus:ring-2 focus:ring-cuba-white focus:ring-offset-2 focus:ring-offset-cuba-black
  disabled:opacity-50 disabled:cursor-not-allowed
  ${fullWidth ? 'w-full' : ''}
`;

const variantClasses = {
  primary: `
    bg-cuba-white text-cuba-black
    hover:bg-cuba-gray-400 hover:scale-105
    active:scale-95
  `,
  secondary: `
    bg-transparent text-cuba-white border-2 border-cuba-white
    hover:bg-cuba-white hover:text-cuba-black hover:scale-105
    active:scale-95
  `,
  outline: `
    bg-transparent text-cuba-white border border-cuba-gray-600
    hover:border-cuba-white hover:scale-105
    active:scale-95
  `,
  ghost: `
    bg-transparent text-cuba-white
    hover:text-cuba-gray-400 hover:scale-105
    active:scale-95
  `
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
};

const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
---

{href ? (
  <a href={href} class={classes} aria-disabled={disabled}>
    <slot />
  </a>
) : (
  <button type={type} class={classes} disabled={disabled}>
    <slot />
  </button>
)}
```

### Card Component

**File**: `src/components/ui/Card.astro`

#### Props Interface
```typescript
interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Artist card -->
<Card variant="elevated" hover>
  <img src="/images/artists/david.jpg" alt="David" />
  <h3>David</h3>
  <p>Japanese, Blackwork, Traditional</p>
</Card>

<!-- Portfolio item card -->
<Card variant="outlined" padding="sm">
  <img src="/images/portfolio/dragon.jpg" alt="Dragon tattoo" />
  <div class="p-4">
    <h4>Japanese Dragon</h4>
    <p>Full arm sleeve</p>
  </div>
</Card>
```

#### Implementation
```astro
---
export interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  class?: string;
}

const {
  variant = 'default',
  padding = 'md',
  hover = false,
  class: className = ''
} = Astro.props;

const baseClasses = `
  bg-cuba-black border-cuba-gray-600
  transition-all duration-300 ease-out
  ${hover ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' : ''}
`;

const variantClasses = {
  default: 'border-0',
  elevated: 'border-0 shadow-lg hover:shadow-2xl',
  outlined: 'border border-cuba-gray-600 hover:border-cuba-white'
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;
---

<div class={classes}>
  <slot />
</div>
```

### Input Component

**File**: `src/components/ui/Input.astro`

#### Props Interface
```typescript
interface Props {
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  rows?: number; // for textarea
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Text input -->
<Input 
  type="text" 
  name="fullName" 
  label="Full Name" 
  placeholder="Enter your full name"
  required 
/>

<!-- Email input with error -->
<Input 
  type="email" 
  name="email" 
  label="Email Address" 
  placeholder="your@email.com"
  error="Please enter a valid email address"
  required 
/>

<!-- Textarea -->
<Input 
  type="textarea" 
  name="description" 
  label="Tattoo Description" 
  placeholder="Describe your tattoo idea..."
  rows={4}
  required 
/>
```

#### Implementation
```astro
---
export interface Props {
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  rows?: number;
  class?: string;
}

const {
  type = 'text',
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  value,
  rows = 3,
  class: className = ''
} = Astro.props;

const baseClasses = `
  w-full px-4 py-3
  bg-transparent border-2 border-cuba-gray-600
  text-cuba-white placeholder-cuba-gray-400
  font-body
  transition-all duration-300
  focus:outline-none focus:border-cuba-white focus:ring-1 focus:ring-cuba-white
  disabled:opacity-50 disabled:cursor-not-allowed
  ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
`;

const classes = `${baseClasses} ${className}`;
const id = `input-${name}`;
---

<div class="space-y-2">
  {label && (
    <label for={id} class="block text-sm font-heading uppercase tracking-wider text-cuba-white">
      {label}
      {required && <span class="text-red-500 ml-1">*</span>}
    </label>
  )}
  
  {type === 'textarea' ? (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      class={classes}
    >{value}</textarea>
  ) : (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={value}
      class={classes}
    />
  )}
  
  {error && (
    <p class="text-red-500 text-sm font-body">
      {error}
    </p>
  )}
</div>
```

### Badge Component

**File**: `src/components/ui/Badge.astro`

#### Props Interface
```typescript
interface Props {
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Tattoo style badges -->
<Badge variant="outline" size="sm">Japanese</Badge>
<Badge variant="outline" size="sm">Blackwork</Badge>
<Badge variant="filled" size="md">Featured Artist</Badge>
```

## 🎬 Animation Components

### FadeInSection Component

**File**: `src/components/animations/FadeInSection.astro`

#### Props Interface
```typescript
interface Props {
  delay?: number;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Basic fade in -->
<FadeInSection>
  <h2>About Our Studio</h2>
  <p>We are passionate about creating exceptional tattoo art...</p>
</FadeInSection>

<!-- Delayed high-intensity fade -->
<FadeInSection delay={0.5} intensity="high">
  <img src="/images/studio.jpg" alt="Studio interior" />
</FadeInSection>
```

### StaggerText Component

**File**: `src/components/animations/StaggerText.astro`

#### Props Interface
```typescript
interface Props {
  text: string;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Staggered heading animation -->
<StaggerText 
  text="CUBA TATTOO STUDIO" 
  element="h1" 
  delay={0.2}
  staggerDelay={0.1}
  class="text-6xl font-heading"
/>
```

### ParallaxContainer Component

**File**: `src/components/animations/ParallaxContainer.astro`

#### Props Interface
```typescript
interface Props {
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Parallax background section -->
<ParallaxContainer speed={0.5} intensity="medium" class="min-h-screen">
  <div class="relative z-10">
    <h2>Our Philosophy</h2>
    <p>Every tattoo tells a story...</p>
  </div>
</ParallaxContainer>
```

## 🖼️ Gallery Components

### PortfolioGrid Component

**File**: `src/components/gallery/PortfolioGrid.astro`

#### Props Interface
```typescript
interface Props {
  items: PortfolioItem[];
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  class?: string;
}
```

#### Usage Examples
```astro
---
import { artists } from '@/data/artists.json';
const portfolioItems = artists.flatMap(artist => artist.portfolio);
---

<!-- Portfolio grid with filters -->
<PortfolioGrid 
  items={portfolioItems} 
  columns={3} 
  showFilters={true}
/>
```

### PortfolioFilters Component

**File**: `src/components/gallery/PortfolioFilters.astro`

#### Props Interface
```typescript
interface Props {
  artists: Artist[];
  styles: TattooStyle[];
  class?: string;
}
```

#### Usage Examples
```astro
---
import { artists } from '@/data/artists.json';
import { styles } from '@/data/tattoo-styles.json';
---

<!-- Filter controls -->
<PortfolioFilters 
  artists={artists} 
  styles={styles}
  class="mb-8"
/>
```

## 📝 Form Components

### BookingForm Component

**File**: `src/components/forms/BookingForm.astro`

#### Features
- **Client-side validation** with real-time feedback
- **File upload** for reference images
- **Artist selection** dropdown
- **Responsive design** for all devices
- **Accessibility** compliant form structure

#### Usage Examples
```astro
<!-- Complete booking form -->
<BookingForm />
```

#### Form Fields
1. **Personal Information**
   - Full Name (required)
   - Email Address (required)
   - Phone Number (required)

2. **Tattoo Details**
   - Tattoo Description (required)
   - Size Category (small/medium/large)
   - Body Placement (required)
   - Reference Images (optional)

3. **Artist Preference**
   - Preferred Artist (dropdown)
   - "No Preference" option

4. **Additional Information**
   - Special Requests (optional)
   - Preferred Appointment Date (optional)

## 🎨 Layout Components

### Header Component

**File**: `src/components/layout/Header.astro`

#### Features
- **Fixed positioning** with backdrop blur
- **Responsive navigation** with mobile menu
- **Active page highlighting**
- **Smooth scroll animations**
- **Accessibility** keyboard navigation

#### Navigation Items
```javascript
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/artistas', label: 'Artists' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/estudio', label: 'Studio' },
  { href: '/reservas', label: 'Booking' }
];
```

### Footer Component

**File**: `src/components/layout/Footer.astro`

#### Sections
1. **Studio Information**
   - Logo and tagline
   - Brief description
   - Social media links

2. **Quick Links**
   - Main navigation
   - Important pages

3. **Contact Information**
   - Address
   - Phone number
   - Email address
   - Business hours

4. **Legal**
   - Copyright notice
   - Privacy policy link
   - Terms of service link

## 🎭 Effect Components

### ParticleSystem Component

**File**: `src/components/effects/ParticleSystem.astro`

#### Props Interface
```typescript
interface Props {
  count?: number;
  speed?: number;
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Subtle background particles -->
<ParticleSystem 
  count={50} 
  speed={0.5} 
  size="sm" 
  opacity={0.1}
/>
```

## 🔧 Utility Components

### MicroInteractions Component

**File**: `src/components/ui/MicroInteractions.astro`

#### Props Interface
```typescript
interface Props {
  type?: 'magnetic' | 'tilt' | 'glow' | 'scale';
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}
```

#### Usage Examples
```astro
<!-- Magnetic hover effect -->
<MicroInteractions type="magnetic" intensity="medium">
  <Button variant="primary">Book Now</Button>
</MicroInteractions>

<!-- Tilt effect for cards -->
<MicroInteractions type="tilt" intensity="low">
  <Card>
    <img src="/images/portfolio/tattoo.jpg" alt="Tattoo" />
  </Card>
</MicroInteractions>
```

### VisualEffects Component

**File**: `src/components/ui/VisualEffects.astro`

#### Features
- **Background gradients** and overlays
- **Noise textures** for visual interest
- **Animated backgrounds** with CSS animations
- **Performance optimized** with CSS transforms

## 📱 Responsive Behavior

### Breakpoint Strategy

All components follow a mobile-first responsive design approach:

```css
/* Mobile First (default) */
.component {
  /* Mobile styles */
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### Component Responsiveness

#### Grid Systems
- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid
- **Large Desktop**: Up to 6 columns for galleries

#### Typography Scaling
- **Mobile**: Base font sizes
- **Tablet**: 1.125x scaling
- **Desktop**: 1.25x scaling
- **Large Desktop**: 1.5x scaling

#### Spacing Adjustments
- **Mobile**: Compact spacing (16px, 24px)
- **Tablet**: Medium spacing (24px, 32px)
- **Desktop**: Generous spacing (32px, 48px, 64px)

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance

All components include:

1. **Semantic HTML** structure
2. **ARIA labels** and descriptions
3. **Keyboard navigation** support
4. **Focus management** and indicators
5. **Color contrast** compliance
6. **Screen reader** compatibility

### Accessibility Examples

```astro
<!-- Accessible button -->
<button 
  type="button"
  aria-label="Open portfolio gallery"
  aria-describedby="portfolio-description"
  class="focus:ring-2 focus:ring-cuba-white focus:outline-none"
>
  View Portfolio
</button>
<p id="portfolio-description" class="sr-only">
  Opens a gallery showing our artists' completed tattoo work
</p>

<!-- Accessible form input -->
<label for="email" class="block text-sm font-medium">
  Email Address
  <span class="text-red-500" aria-label="required">*</span>
</label>
<input 
  id="email"
  type="email"
  name="email"
  required
  aria-describedby="email-error"
  aria-invalid={error ? 'true' : 'false'}
/>
{error && (
  <p id="email-error" role="alert" class="text-red-500 text-sm">
    {error}
  </p>
)}
```

## 🚀 Performance Considerations

### Component Optimization

1. **Lazy Loading** - Images and heavy components
2. **Code Splitting** - Dynamic imports for large components
3. **CSS Purging** - Remove unused Tailwind classes
4. **Image Optimization** - WebP/AVIF formats with fallbacks
5. **Animation Performance** - Hardware-accelerated transforms

### Bundle Size Management

```javascript
// Dynamic imports for heavy components
const PortfolioGrid = lazy(() => import('./PortfolioGrid.astro'));
const ParticleSystem = lazy(() => import('./ParticleSystem.astro'));

// Conditional loading based on viewport
if (window.innerWidth > 1024) {
  import('./DesktopEnhancements.astro');
}
```

---

*This component library documentation should be referenced when building new features or modifying existing components. All components should maintain consistency with the established patterns and design system.*