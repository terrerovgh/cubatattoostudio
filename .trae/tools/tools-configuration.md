# Tools Configuration for Cuba Tattoo Studio

## Development Tools Setup

### 1. Package.json Configuration

#### Required Dependencies
```json
{
  "name": "cuba-tattoo-studio",
  "version": "1.0.0",
  "description": "Professional tattoo studio website built with Astro, Tailwind CSS, and GSAP",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint . --ext .js,.ts,.astro --fix",
    "lint:check": "eslint . --ext .js,.ts,.astro",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "astro check",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lighthouse": "node scripts/lighthouse-audit.js",
    "performance": "node scripts/performance-monitor.js",
    "accessibility": "node scripts/accessibility-test.js",
    "prepare": "husky install"
  },
  "dependencies": {
    "@astrojs/check": "^0.3.1",
    "@astrojs/tailwind": "^5.0.2",
    "@astrojs/sitemap": "^3.0.3",
    "@astrojs/image": "^0.18.0",
    "astro": "^4.0.0",
    "tailwindcss": "^3.3.6",
    "gsap": "^3.12.2",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "eslint": "^8.54.0",
    "eslint-plugin-astro": "^0.29.1",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "prettier": "^3.1.0",
    "prettier-plugin-astro": "^0.12.2",
    "prettier-plugin-tailwindcss": "^0.5.7",
    "husky": "^8.0.3",
    "lint-staged": "^15.1.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "lighthouse": "^11.4.0",
    "chrome-launcher": "^1.1.0",
    "@axe-core/playwright": "^4.8.2",
    "playwright": "^1.40.0"
  },
  "lint-staged": {
    "*.{js,ts,astro}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

### 2. Astro Configuration

#### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false, // We'll handle base styles manually
      },
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      cacheDir: './.cache/image',
      logLevel: 'debug',
    }),
  ],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap', 'gsap/ScrollTrigger'],
          },
        },
      },
    },
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  output: 'static',
  adapter: undefined, // Static site generation
});
```

### 3. Tailwind CSS Configuration

#### tailwind.config.cjs
```javascript
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Cuba Tattoo Studio B&W Palette
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Emergency colors (use sparingly)
        danger: '#DC2626',
        success: '#16A34A',
        warning: '#D97706',
      },
      fontFamily: {
        'bebas': ['Bebas Neue', ...defaultTheme.fontFamily.sans],
        'inter': ['Inter', ...defaultTheme.fontFamily.sans],
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

### 4. TypeScript Configuration

#### tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/data/*": ["./src/data/*"],
      "@/assets/*": ["./src/assets/*"]
    },
    "types": ["astro/client", "vite/client"]
  },
  "include": [
    "src/**/*",
    "astro.config.mjs",
    "tailwind.config.cjs"
  ],
  "exclude": [
    "node_modules",
    "dist",
    ".astro"
  ]
}
```

### 5. ESLint Configuration

#### .eslintrc.cjs
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Astro specific rules
        'astro/no-conflict-set-directives': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
      },
    },
  ],
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
};
```

### 6. Prettier Configuration

#### .prettierrc.cjs
```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  tailwindConfig: './tailwind.config.cjs',
};
```

### 7. Vitest Configuration

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },
    },
  })
);
```

### 8. Git Configuration

#### .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production
.env.staging

# macOS
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# Image optimization cache
.cache/

# Lighthouse reports
lighthouse-reports/

# Performance reports
performance-reports/
```

### 9. Husky Git Hooks

#### .husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged
npx lint-staged

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm run test -- --run
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix failing tests before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

#### .husky/pre-push
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Run build to ensure it works
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix build errors before pushing."
  exit 1
fi

# Run performance audit
npm run lighthouse
if [ $? -ne 0 ]; then
  echo "❌ Performance audit failed. Please optimize before pushing."
  exit 1
fi

echo "✅ All pre-push checks passed!"
```

### 10. VS Code Configuration

#### .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "astro": "html"
  },
  "files.associations": {
    "*.astro": "astro"
  },
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["class:list=\\{([^}]*)\\}", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["classList=\\{([^}]*)\\}", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

#### .vscode/extensions.json
```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

### 11. Performance Monitoring Scripts

#### scripts/lighthouse-audit.js
```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse('http://localhost:4321', options);
  
  // Save report
  const reportDir = './lighthouse-reports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `lighthouse-${timestamp}.html`);
  fs.writeFileSync(reportPath, runnerResult.report);
  
  // Check scores
  const scores = {
    performance: Math.round(runnerResult.lhr.categories.performance.score * 100),
    accessibility: Math.round(runnerResult.lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(runnerResult.lhr.categories['best-practices'].score * 100),
    seo: Math.round(runnerResult.lhr.categories.seo.score * 100),
  };
  
  console.log('\n📊 Lighthouse Audit Results:');
  console.log(`Performance: ${scores.performance}/100`);
  console.log(`Accessibility: ${scores.accessibility}/100`);
  console.log(`Best Practices: ${scores.bestPractices}/100`);
  console.log(`SEO: ${scores.seo}/100`);
  console.log(`\n📄 Report saved: ${reportPath}`);
  
  // Define thresholds
  const thresholds = {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90
  };
  
  let failed = false;
  Object.entries(thresholds).forEach(([category, threshold]) => {
    if (scores[category] < threshold) {
      console.error(`❌ ${category} score ${scores[category]} is below threshold ${threshold}`);
      failed = true;
    } else {
      console.log(`✅ ${category} score ${scores[category]} meets threshold ${threshold}`);
    }
  });
  
  await chrome.kill();
  
  if (failed) {
    console.error('\n❌ Lighthouse audit failed. Please improve scores before deploying.');
    process.exit(1);
  } else {
    console.log('\n✅ All Lighthouse thresholds met!');
  }
}

runLighthouseAudit().catch(console.error);
```

#### scripts/accessibility-test.js
```javascript
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

async function runAccessibilityTest() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const urls = [
    'http://localhost:4321',
    'http://localhost:4321/artistas',
    'http://localhost:4321/portfolio',
    'http://localhost:4321/estudio',
    'http://localhost:4321/reservas',
  ];
  
  let allPassed = true;
  
  for (const url of urls) {
    console.log(`\n🔍 Testing accessibility for: ${url}`);
    
    try {
      await page.goto(url);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      if (accessibilityScanResults.violations.length === 0) {
        console.log(`✅ No accessibility violations found`);
      } else {
        console.error(`❌ Found ${accessibilityScanResults.violations.length} accessibility violations:`);
        accessibilityScanResults.violations.forEach((violation, index) => {
          console.error(`\n${index + 1}. ${violation.id}: ${violation.description}`);
          console.error(`   Impact: ${violation.impact}`);
          console.error(`   Help: ${violation.helpUrl}`);
        });
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
      allPassed = false;
    }
  }
  
  await browser.close();
  
  if (!allPassed) {
    console.error('\n❌ Accessibility tests failed. Please fix violations before deploying.');
    process.exit(1);
  } else {
    console.log('\n✅ All accessibility tests passed!');
  }
}

runAccessibilityTest().catch(console.error);
```

### 12. Deployment Configuration

#### netlify.toml (for Netlify deployment)
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"

[[redirects]]
  from = "/admin/*"
  to = "/404"
  status = 404

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache images
[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

**This comprehensive tools configuration ensures a professional development environment with automated quality checks, performance monitoring, and deployment optimization for the Cuba Tattoo Studio website.**