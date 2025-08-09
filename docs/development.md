# Development Guide - Cuba Tattoo Studio

## 🎯 Development Philosophy

The Cuba Tattoo Studio website follows modern web development best practices with a focus on performance, maintainability, and user experience. This guide outlines the coding standards, workflows, and practices that ensure consistent, high-quality development.

## 🛠️ Development Environment

### Prerequisites

- **Node.js**: 20.x or higher
- **pnpm**: 8.x or higher (preferred package manager)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### DevContainer Setup

For consistent development environments, use the provided DevContainer:

```bash
# Open in VS Code
code .

# Command Palette: "Dev Containers: Reopen in Container"
# Or use the popup notification
```

### Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd cubatattoostudio

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:4321
```

## 📁 Project Structure

### Directory Organization

```
cubatattoostudio/
├── .devcontainer/          # Development container configuration
├── .github/                # GitHub workflows and templates
├── docs/                   # Project documentation
├── public/                 # Static assets
│   ├── images/            # Image assets
│   ├── icons/             # Icon files
│   └── fonts/             # Font files
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── animations/    # Animation components
│   │   ├── effects/       # Visual effects
│   │   ├── forms/         # Form components
│   │   ├── gallery/       # Gallery components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Basic UI components
│   ├── data/              # JSON data files
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   │   ├── api/           # API endpoints
│   │   └── artistas/      # Dynamic artist pages
│   ├── scripts/           # JavaScript utilities
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── astro.config.mjs       # Astro configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.astro`, `PortfolioGrid.astro`)
- **Pages**: kebab-case (e.g., `index.astro`, `portfolio.astro`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `validateEmail.js`)
- **Data files**: kebab-case (e.g., `artists.json`, `tattoo-styles.json`)
- **Assets**: kebab-case (e.g., `hero-background.webp`, `logo-white.svg`)

## 🎨 Coding Standards

### TypeScript Guidelines

#### Interface Definitions

```typescript
// src/types/index.ts
export interface Artist {
  id: string;
  name: string;
  slug: string;
  specialties: TattooStyle[];
  bio: string;
  experience: string;
  image: string;
  featured: boolean;
  portfolio: PortfolioItem[];
  contact?: ContactInfo;
}

export interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  style: TattooStyle;
  description: string;
  size: TattooSize;
  bodyPart: string;
  featured?: boolean;
}

export type TattooStyle = 
  | 'Japanese'
  | 'Blackwork'
  | 'Traditional'
  | 'Realism'
  | 'Geometric'
  | 'Minimalist'
  | 'Neo-Traditional'
  | 'Watercolor';

export type TattooSize = 'small' | 'medium' | 'large' | 'extra-large';
```

#### Component Props

```typescript
// Always define props interface
export interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// Use destructuring with defaults
const {
  title,
  description,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
} = Astro.props;
```

### Astro Component Guidelines

#### Component Structure

```astro
---
// 1. Imports
import Layout from '@/layouts/Layout.astro';
import Button from '@/components/ui/Button.astro';
import { formatDate } from '@/utils/date';

// 2. Props interface
export interface Props {
  title: string;
  date?: Date;
}

// 3. Props destructuring
const {
  title,
  date = new Date()
} = Astro.props;

// 4. Data processing
const formattedDate = formatDate(date);

// 5. SEO data
const seoData = {
  title: `${title} | Cuba Tattoo Studio`,
  description: `Learn about ${title} at Cuba Tattoo Studio`
};
---

<!-- 6. Template -->
<Layout {...seoData}>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <h1 class="text-4xl font-heading uppercase tracking-wider text-cuba-white">
        {title}
      </h1>
      <time class="text-cuba-gray-400 font-body">
        {formattedDate}
      </time>
    </header>
    
    <section class="prose prose-invert max-w-none">
      <slot />
    </section>
  </main>
</Layout>

<!-- 7. Scripts (if needed) -->
<script>
  // Component-specific JavaScript
  console.log('Component loaded');
</script>

<!-- 8. Styles (if needed) -->
<style>
  /* Component-specific styles */
  .custom-style {
    /* Avoid when possible, prefer Tailwind */
  }
</style>
```

#### Component Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use slots and props for flexibility
3. **Accessibility First**: Include ARIA labels and semantic HTML
4. **Performance**: Minimize JavaScript, prefer static generation
5. **Consistency**: Follow established patterns and naming conventions

### Tailwind CSS Guidelines

#### Utility Classes Organization

```astro
<!-- Group related utilities -->
<div class="
  <!-- Layout -->
  flex items-center justify-between
  <!-- Spacing -->
  px-6 py-4 mb-8
  <!-- Background & Borders -->
  bg-cuba-black border border-cuba-gray-600
  <!-- Typography -->
  text-cuba-white font-heading uppercase tracking-wider
  <!-- Effects -->
  transition-all duration-300 hover:scale-105
  <!-- Responsive -->
  sm:px-8 md:py-6 lg:mb-12
">
  Content
</div>
```

#### Custom Utilities

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Custom utilities for common patterns
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out'
      }
    }
  },
  plugins: [
    // Custom component classes
    function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply bg-cuba-white text-cuba-black px-6 py-3 font-heading uppercase tracking-wider transition-all duration-300 hover:scale-105': {}
        },
        '.section-padding': {
          '@apply py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8': {}
        }
      })
    }
  ]
};
```

### GSAP Animation Guidelines

#### Animation Organization

```javascript
// src/scripts/animations/homepage.js
class HomepageAnimations {
  constructor() {
    this.tl = gsap.timeline({ paused: true });
    this.init();
  }

  init() {
    this.setupInitialStates();
    this.createAnimationSequence();
    this.bindEvents();
  }

  setupInitialStates() {
    // Set initial states for all animated elements
    gsap.set('.hero-title', { opacity: 0, y: 50 });
    gsap.set('.hero-subtitle', { opacity: 0, y: 30 });
  }

  createAnimationSequence() {
    this.tl
      .to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      })
      .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.3');
  }

  bindEvents() {
    window.addEventListener('load', () => this.play());
  }

  play() {
    this.tl.play();
  }

  // Cleanup method
  destroy() {
    this.tl.kill();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}

// Export for use
export default HomepageAnimations;
```

#### Performance Best Practices

```javascript
// Optimize for performance
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

// Use transforms for better performance
gsap.to(element, {
  x: 100,        // Better than left: 100px
  y: 50,         // Better than top: 50px
  scale: 1.1,    // Better than width/height
  rotation: 45   // Better than transform: rotate(45deg)
});

// Batch DOM queries
const elements = gsap.utils.toArray('.animate-me');
elements.forEach((element, index) => {
  gsap.to(element, {
    opacity: 1,
    delay: index * 0.1
  });
});
```

## 🔧 Development Workflow

### Git Workflow

#### Branch Naming

- **Feature branches**: `feature/portfolio-filtering`
- **Bug fixes**: `fix/mobile-navigation-issue`
- **Hotfixes**: `hotfix/critical-booking-form-bug`
- **Documentation**: `docs/update-component-guide`

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description

# Examples
feat(portfolio): add filtering by tattoo style
fix(booking): resolve form validation issues
docs(readme): update installation instructions
style(header): improve mobile navigation layout
refactor(animations): optimize GSAP performance
test(components): add Button component tests
```

#### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

3. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   # Create PR through GitHub interface
   ```

4. **PR Requirements**
   - [ ] Descriptive title and description
   - [ ] Screenshots for UI changes
   - [ ] Tests pass (if applicable)
   - [ ] Code review approval
   - [ ] No merge conflicts

### Code Quality Tools

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Enforce consistent code style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    
    // Astro specific
    'astro/no-conflict-set-directives': 'error',
    'astro/no-unused-define-vars-in-style': 'error'
  }
};
```

#### Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
```

### Testing Strategy

#### Manual Testing Checklist

**Before Each Commit:**
- [ ] Page loads without errors
- [ ] All links work correctly
- [ ] Forms submit successfully
- [ ] Animations play smoothly
- [ ] Mobile layout looks correct
- [ ] Accessibility features work

**Before Each Release:**
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Performance audit (Lighthouse score >90)
- [ ] SEO audit (meta tags, structured data)
- [ ] Accessibility audit (WCAG 2.1 AA)

#### Automated Testing

```javascript
// src/tests/components/Button.test.js
import { test, expect } from '@playwright/test';

test.describe('Button Component', () => {
  test('renders with correct text', async ({ page }) => {
    await page.goto('/test-button');
    const button = page.locator('[data-testid="primary-button"]');
    await expect(button).toHaveText('Click Me');
  });

  test('handles click events', async ({ page }) => {
    await page.goto('/test-button');
    const button = page.locator('[data-testid="primary-button"]');
    await button.click();
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Performance Optimization

#### Image Optimization

```astro
---
// Use Astro's Image component for optimization
import { Image } from 'astro:assets';
import heroImage from '@/assets/hero-background.webp';
---

<!-- Optimized image with responsive sizes -->
<Image
  src={heroImage}
  alt="Cuba Tattoo Studio interior"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### Code Splitting

```javascript
// Dynamic imports for heavy components
const PortfolioGrid = lazy(() => import('@/components/gallery/PortfolioGrid.astro'));
const AnimationSystem = lazy(() => import('@/scripts/animations/homepage.js'));

// Conditional loading
if (window.innerWidth > 1024) {
  import('@/scripts/desktop-enhancements.js');
}
```

#### Bundle Analysis

```bash
# Analyze bundle size
pnpm build
pnpm run analyze

# Check for unused dependencies
npx depcheck

# Audit for vulnerabilities
pnpm audit
```

## 🚀 Build and Deployment

### Build Process

```bash
# Development build
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm astro check

# Lint code
pnpm lint

# Format code
pnpm format
```

### Environment Variables

```bash
# .env.local (development)
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_EMAIL=info@cubatattoostudio.com
BOOKING_WEBHOOK_URL=http://localhost:3001/webhook

# .env.production
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_GA_ID=G-REALTRACKINGID
CONTACT_EMAIL=info@cubatattoostudio.com
BOOKING_WEBHOOK_URL=https://api.cubatattoostudio.com/webhook
```

### Deployment Checklist

**Pre-deployment:**
- [ ] All tests pass
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Performance audit completed
- [ ] Security audit completed

**Post-deployment:**
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Forms work properly
- [ ] Analytics tracking active
- [ ] SEO meta tags correct

## 🐛 Debugging and Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .astro dist
pnpm install
pnpm build

# Check for TypeScript errors
pnpm astro check

# Verify imports
# Make sure all imports use correct paths
```

#### Animation Issues

```javascript
// Debug GSAP animations
gsap.globalTimeline.pause();
console.log('Active animations:', gsap.globalTimeline.getChildren());

// Check ScrollTrigger
ScrollTrigger.batch('.animate-me', {
  onEnter: (elements) => {
    console.log('Animating:', elements);
    gsap.from(elements, { opacity: 0, y: 50 });
  }
});
```

#### Performance Issues

```javascript
// Monitor performance
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Performance entry:', entry);
  });
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

### Development Tools

#### Browser DevTools

- **Performance Tab**: Monitor frame rates and identify bottlenecks
- **Network Tab**: Check asset loading and optimization
- **Lighthouse**: Audit performance, accessibility, and SEO
- **Console**: Debug JavaScript and view error messages

#### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Astro Dev Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/astro",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 📚 Learning Resources

### Documentation

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Best Practices

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Google SEO Guidelines](https://developers.google.com/search/docs)
- [Core Web Vitals](https://web.dev/vitals/)

---

*This development guide should be followed by all contributors to ensure consistent, high-quality code. Regular updates to this guide help maintain current best practices and standards.*