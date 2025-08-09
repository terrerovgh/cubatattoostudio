# Deployment Guide - Cuba Tattoo Studio

## 🚀 Deployment Overview

The Cuba Tattoo Studio website is optimized for deployment on modern edge platforms with static site generation. This guide covers deployment to various platforms with Cloudflare Pages as the recommended solution.

## 🎯 Deployment Targets

### Recommended: Cloudflare Pages
- **Edge deployment** with global CDN
- **Automatic builds** from Git
- **Custom domains** with SSL
- **Analytics** and performance monitoring
- **Zero configuration** for Astro projects

### Alternative Platforms
- **Vercel**: Zero-config deployment with excellent DX
- **Netlify**: Popular JAMstack platform
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3 + CloudFront**: Enterprise-grade solution

## ☁️ Cloudflare Pages Deployment

### Prerequisites

- Cloudflare account ([Sign up](https://dash.cloudflare.com/sign-up))
- GitHub repository with the project
- Domain name (optional, can use *.pages.dev subdomain)

### Step-by-Step Deployment

#### 1. Connect Repository

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Pages" in the sidebar

2. **Create New Project**
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose "GitHub" as your Git provider

3. **Authorize Cloudflare**
   - Grant Cloudflare access to your GitHub account
   - Select the `cubatattoostudio` repository

#### 2. Configure Build Settings

```yaml
# Build configuration
Framework preset: Astro
Build command: pnpm build
Build output directory: dist
Root directory: (leave empty)
Node.js version: 20
```

#### 3. Environment Variables

Set up environment variables in Cloudflare Pages:

```bash
# Production environment variables
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_EMAIL=info@cubatattoostudio.com
BOOKING_WEBHOOK_URL=https://api.cubatattoostudio.com/webhook
NODE_ENV=production
```

**How to set environment variables:**
1. Go to your Pages project dashboard
2. Navigate to "Settings" > "Environment variables"
3. Add each variable with its value
4. Set variables for "Production" environment

#### 4. Custom Domain Setup

1. **Add Custom Domain**
   - In Pages project settings
   - Go to "Custom domains"
   - Click "Set up a custom domain"
   - Enter your domain: `cubatattoostudio.com`

2. **DNS Configuration**
   ```bash
   # Add CNAME record in your DNS provider
   Type: CNAME
   Name: @ (or your subdomain)
   Value: your-project.pages.dev
   ```

3. **SSL Certificate**
   - Cloudflare automatically provisions SSL certificates
   - Certificate will be active within 24 hours
   - Force HTTPS redirect is enabled by default

#### 5. Deploy

1. **Trigger Deployment**
   - Push changes to your main branch
   - Cloudflare automatically detects changes
   - Build process starts automatically

2. **Monitor Build**
   - Watch build logs in Cloudflare dashboard
   - Build typically takes 2-5 minutes
   - Deployment is automatic after successful build

### Cloudflare Pages Configuration

#### Build Settings File

Create `_headers` file in `public/` directory:

```bash
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.avif
  Cache-Control: public, max-age=31536000, immutable
```

Create `_redirects` file in `public/` directory:

```bash
# public/_redirects
# Redirect old URLs (if any)
/old-page /new-page 301

# SPA fallback (not needed for Astro SSG)
# /* /index.html 200
```

## 🔧 Alternative Deployments

### Vercel Deployment

#### Quick Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # From project root
   vercel
   
   # Follow prompts:
   # - Link to existing project or create new
   # - Set up project settings
   # - Deploy
   ```

#### GitHub Integration

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub

2. **Configure Build**
   ```yaml
   Framework Preset: Astro
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   ```

3. **Environment Variables**
   ```bash
   PUBLIC_SITE_URL=https://your-domain.vercel.app
   PUBLIC_GA_ID=G-XXXXXXXXXX
   CONTACT_EMAIL=info@cubatattoostudio.com
   ```

### Netlify Deployment

#### Drag and Drop

1. **Build Locally**
   ```bash
   pnpm build
   ```

2. **Deploy**
   - Go to [Netlify](https://app.netlify.com/)
   - Drag `dist` folder to deploy area
   - Site will be live immediately

#### Git Integration

1. **Connect Repository**
   - Click "New site from Git"
   - Choose GitHub and select repository

2. **Build Settings**
   ```yaml
   Build command: pnpm build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add production environment variables

#### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--prefix=/dev/null"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages Deployment

#### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build site
        run: pnpm build
        env:
          PUBLIC_SITE_URL: https://your-username.github.io/cubatattoostudio
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Enable GitHub Pages

1. **Repository Settings**
   - Go to repository settings
   - Navigate to "Pages" section
   - Source: "GitHub Actions"

2. **Configure Base URL**
   ```javascript
   // astro.config.mjs
   export default defineConfig({
     site: 'https://your-username.github.io',
     base: '/cubatattoostudio',
     // ... other config
   });
   ```

## 🔒 Security Configuration

### Content Security Policy

```html
<!-- Add to Layout.astro head -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https: blob:;
               font-src 'self' https://fonts.gstatic.com;
               connect-src 'self' https://www.google-analytics.com;
               frame-ancestors 'none';
               base-uri 'self';
               form-action 'self';">
```

### Security Headers

```bash
# Add to _headers file
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## 📊 Performance Optimization

### Build Optimization

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
    assetsPrefix: 'https://cdn.cubatattoostudio.com' // Optional CDN
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap'],
            vendor: ['astro']
          }
        }
      }
    }
  }
});
```

### Image Optimization

```astro
---
// Use Astro's Image component
import { Image } from 'astro:assets';
---

<Image
  src={heroImage}
  alt="Cuba Tattoo Studio"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading="lazy"
/>
```

### Caching Strategy

```bash
# Cache static assets for 1 year
/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

# Cache images for 1 month
/*.webp
  Cache-Control: public, max-age=2592000

/*.avif
  Cache-Control: public, max-age=2592000

# Cache HTML for 1 hour
/*.html
  Cache-Control: public, max-age=3600
```

## 🔍 Monitoring and Analytics

### Google Analytics 4

```astro
---
// src/components/Analytics.astro
const GA_ID = import.meta.env.PUBLIC_GA_ID;
---

{GA_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
    <script is:inline define:vars={{ GA_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_ID);
    </script>
  </>
)}
```

### Core Web Vitals Monitoring

```javascript
// src/scripts/vitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🚨 Deployment Checklist

### Pre-Deployment

- [ ] **Code Quality**
  - [ ] All tests pass
  - [ ] No TypeScript errors
  - [ ] No linting errors
  - [ ] Code formatted with Prettier

- [ ] **Performance**
  - [ ] Lighthouse score >90 on all metrics
  - [ ] Images optimized (WebP/AVIF)
  - [ ] Bundle size analyzed
  - [ ] Core Web Vitals meet targets

- [ ] **SEO**
  - [ ] Meta tags configured
  - [ ] Structured data implemented
  - [ ] Sitemap generated
  - [ ] Robots.txt configured

- [ ] **Security**
  - [ ] Security headers configured
  - [ ] CSP policy implemented
  - [ ] No sensitive data exposed
  - [ ] HTTPS enforced

- [ ] **Content**
  - [ ] All content reviewed
  - [ ] Images have alt text
  - [ ] Links work correctly
  - [ ] Forms function properly

### Post-Deployment

- [ ] **Functionality**
  - [ ] Site loads correctly
  - [ ] All pages accessible
  - [ ] Navigation works
  - [ ] Forms submit successfully
  - [ ] Animations play smoothly

- [ ] **Performance**
  - [ ] Page load times acceptable
  - [ ] Images load properly
  - [ ] No console errors
  - [ ] Mobile performance good

- [ ] **Analytics**
  - [ ] Google Analytics tracking
  - [ ] Search Console configured
  - [ ] Error monitoring active
  - [ ] Performance monitoring setup

- [ ] **SEO**
  - [ ] Search engines can crawl
  - [ ] Meta tags display correctly
  - [ ] Social media previews work
  - [ ] Local SEO configured

## 🐛 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Error: "Build failed"
# Check build logs for specific errors

# Common solutions:
# 1. Check Node.js version
# 2. Verify all dependencies installed
# 3. Check for TypeScript errors
# 4. Verify environment variables
```

#### Asset Loading Issues

```bash
# Error: "Assets not loading"
# Check asset paths and build output

# Solutions:
# 1. Verify public folder structure
# 2. Check asset import paths
# 3. Verify build output directory
# 4. Check CDN configuration
```

#### Environment Variable Issues

```bash
# Error: "Environment variables not working"
# Check variable names and values

# Solutions:
# 1. Verify variable names (PUBLIC_ prefix for client-side)
# 2. Check deployment platform configuration
# 3. Verify build-time vs runtime variables
# 4. Check for typos in variable names
```

### Rollback Procedures

#### Cloudflare Pages

1. **Rollback to Previous Deployment**
   - Go to project dashboard
   - Navigate to "Deployments" tab
   - Find previous successful deployment
   - Click "Rollback to this deployment"

2. **Emergency Rollback**
   ```bash
   # Revert Git commit
   git revert HEAD
   git push origin main
   
   # Cloudflare will automatically deploy the reverted version
   ```

#### Manual Rollback

```bash
# Create rollback branch
git checkout -b rollback-emergency
git reset --hard <previous-commit-hash>
git push origin rollback-emergency

# Update deployment to use rollback branch
# Then fix issues on main branch
```

## 📞 Support

For deployment issues:

- **Platform Documentation**:
  - [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
  - [Vercel Docs](https://vercel.com/docs)
  - [Netlify Docs](https://docs.netlify.com/)

- **Community Support**:
  - [Astro Discord](https://astro.build/chat)
  - [GitHub Discussions](https://github.com/your-org/cubatattoostudio/discussions)

- **Professional Support**:
  - Email: [dev@cubatattoostudio.com](mailto:dev@cubatattoostudio.com)
  - Create issue: [GitHub Issues](https://github.com/your-org/cubatattoostudio/issues)

---

*This deployment guide covers the most common deployment scenarios. Choose the platform that best fits your needs and follow the specific instructions for your chosen platform.*