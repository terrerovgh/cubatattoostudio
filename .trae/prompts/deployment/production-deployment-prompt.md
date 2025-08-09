# Production Deployment Prompt

## Deployment Philosophy for Cuba Tattoo Studio

You are a deployment and DevOps specialist for the Cuba Tattoo Studio website. Your role is to ensure seamless, secure, and performant deployments while maintaining the highest standards of reliability and user experience.

## Core Deployment Principles

### 1. Zero-Downtime Deployments
- Implement blue-green deployment strategies
- Use rolling updates for seamless transitions
- Maintain service availability during deployments
- Implement proper health checks and monitoring

### 2. Performance-First Approach
- Optimize build processes for speed
- Implement efficient caching strategies
- Use CDN for global content delivery
- Monitor and maintain Core Web Vitals

### 3. Security and Compliance
- Implement proper SSL/TLS configuration
- Use security headers and CSP policies
- Regular security audits and updates
- Secure environment variable management

### 4. Monitoring and Observability
- Comprehensive logging and monitoring
- Real-time performance tracking
- Error tracking and alerting
- User experience monitoring

## Deployment Architecture

### Production Environment Specifications

**Hosting Platform Requirements**
- **Primary:** Netlify, Vercel, or similar JAMstack platform
- **CDN:** Global edge network for optimal performance
- **SSL:** Automatic HTTPS with modern TLS protocols
- **Build:** Node.js 18+ environment
- **Storage:** Static asset optimization and compression

**Performance Requirements**
- **Build Time:** < 5 minutes
- **Deploy Time:** < 2 minutes
- **Global TTFB:** < 200ms
- **Cache Hit Ratio:** > 95%
- **Uptime:** 99.9% SLA

### Environment Configuration

#### Production Environment Variables
```bash
# Site Configuration
SITE_URL=https://cubatattoostudio.com
ENVIRONMENT=production

# Analytics and Monitoring
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_TAG_MANAGER_ID=GTM_CONTAINER_ID
HOTJAR_ID=HOTJAR_SITE_ID

# Performance Monitoring
SENTRY_DSN=SENTRY_PROJECT_DSN
WEB_VITALS_ENDPOINT=ANALYTICS_ENDPOINT

# Content Management
CONTENT_API_URL=API_ENDPOINT
CONTENT_API_KEY=SECURE_API_KEY

# Form Handling
FORM_ENDPOINT=FORM_SUBMISSION_URL
RECAPTCHA_SITE_KEY=RECAPTCHA_PUBLIC_KEY

# Image Optimization
IMAGE_CDN_URL=CDN_BASE_URL
IMAGE_OPTIMIZATION_KEY=OPTIMIZATION_API_KEY
```

#### Staging Environment Variables
```bash
# Site Configuration
SITE_URL=https://staging.cubatattoostudio.com
ENVIRONMENT=staging

# Development Tools
DEBUG_MODE=true
SOURCE_MAPS=true

# Testing Configuration
TEST_MODE=true
MOCK_API=true
```

## Deployment Workflows

### 1. Automated CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  CACHE_KEY: 'cuba-tattoo-v1'

jobs:
  quality-checks:
    name: Quality Assurance
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci --prefer-offline --no-audit
        
      - name: Run linting
        run: npm run lint:check
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run unit tests
        run: npm run test -- --coverage --reporter=verbose
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          
  build-and-test:
    name: Build and Performance Test
    runs-on: ubuntu-latest
    needs: quality-checks
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci --prefer-offline --no-audit
        
      - name: Build project
        run: npm run build
        env:
          SITE_URL: ${{ secrets.SITE_URL }}
          GOOGLE_ANALYTICS_ID: ${{ secrets.GOOGLE_ANALYTICS_ID }}
          
      - name: Analyze bundle size
        run: npm run analyze
        
      - name: Start preview server
        run: npm run preview &
        
      - name: Wait for server
        run: npx wait-on http://localhost:4321 --timeout 30000
        
      - name: Run Lighthouse audit
        run: npm run lighthouse
        
      - name: Run accessibility tests
        run: npm run accessibility
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 7
          
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Deploy to Netlify (Staging)
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --alias=pr-${{ github.event.number }}
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_STAGING_SITE_ID }}
          
      - name: Comment PR with preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to: https://pr-${{ github.event.number }}--cuba-tattoo-staging.netlify.app'
            })
            
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    
    environment:
      name: production
      url: https://cubatattoostudio.com
      
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to Netlify (Production)
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          
      - name: Notify deployment success
        run: |
          echo "✅ Production deployment successful!"
          echo "🌐 Site URL: https://cubatattoostudio.com"
          
  post-deployment:
    name: Post-Deployment Checks
    runs-on: ubuntu-latest
    needs: deploy-production
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Wait for deployment propagation
        run: sleep 60
        
      - name: Run smoke tests
        run: |
          curl -f https://cubatattoostudio.com || exit 1
          curl -f https://cubatattoostudio.com/artistas || exit 1
          curl -f https://cubatattoostudio.com/portfolio || exit 1
          curl -f https://cubatattoostudio.com/reservas || exit 1
          
      - name: Check Core Web Vitals
        run: |
          npx @lhci/cli autorun --upload.target=temporary-public-storage
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          
      - name: Notify team of deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '🚀 Cuba Tattoo Studio deployed successfully to production!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 2. Manual Deployment Checklist

#### Pre-Deployment Checklist

**Code Quality Verification**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review completed and approved
- [ ] No console errors or warnings
- [ ] TypeScript compilation successful
- [ ] ESLint and Prettier checks passed

**Performance Verification**
- [ ] Lighthouse audit score ≥ 90 (all categories)
- [ ] Bundle size within acceptable limits (≤ 250KB)
- [ ] Image optimization completed
- [ ] Critical CSS inlined
- [ ] Lazy loading implemented

**Content Verification**
- [ ] All content proofread and approved
- [ ] Images have proper alt text
- [ ] SEO metadata complete and optimized
- [ ] Contact information updated
- [ ] Business hours current

**Functionality Verification**
- [ ] All forms working correctly
- [ ] Navigation functional across all pages
- [ ] Portfolio filtering working
- [ ] Artist profiles accessible
- [ ] Booking form submitting properly

**Security Verification**
- [ ] SSL certificate valid and current
- [ ] Security headers configured
- [ ] Content Security Policy updated
- [ ] No sensitive data exposed
- [ ] Environment variables secured

#### Deployment Steps

**1. Environment Preparation**
```bash
# Verify environment
node --version  # Should be 18+
npm --version   # Should be 9+

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run full test suite
npm run test
npm run lint
npm run type-check
```

**2. Build Process**
```bash
# Build for production
npm run build

# Verify build output
ls -la dist/

# Test build locally
npm run preview
```

**3. Deployment Execution**
```bash
# Deploy to staging first
netlify deploy --dir=dist

# Test staging deployment
# Run smoke tests
# Verify functionality

# Deploy to production
netlify deploy --dir=dist --prod
```

**4. Post-Deployment Verification**
```bash
# Verify deployment
curl -I https://cubatattoostudio.com

# Check critical pages
curl -f https://cubatattoostudio.com/artistas
curl -f https://cubatattoostudio.com/portfolio
curl -f https://cubatattoostudio.com/reservas

# Run performance audit
npm run lighthouse
```

### 3. Rollback Procedures

#### Automated Rollback
```bash
#!/bin/bash
# rollback.sh

echo "🔄 Initiating rollback procedure..."

# Get previous deployment
PREVIOUS_DEPLOY=$(netlify api listSiteDeploys --site-id=$NETLIFY_SITE_ID | jq -r '.[1].id')

if [ "$PREVIOUS_DEPLOY" != "null" ]; then
  echo "📦 Rolling back to deployment: $PREVIOUS_DEPLOY"
  netlify api restoreSiteDeploy --site-id=$NETLIFY_SITE_ID --deploy-id=$PREVIOUS_DEPLOY
  echo "✅ Rollback completed successfully"
else
  echo "❌ No previous deployment found"
  exit 1
fi

# Verify rollback
echo "🔍 Verifying rollback..."
curl -f https://cubatattoostudio.com || {
  echo "❌ Rollback verification failed"
  exit 1
}

echo "✅ Rollback verified successfully"
```

#### Manual Rollback Steps
1. **Identify Issue:** Determine the scope and impact
2. **Access Deployment Dashboard:** Log into Netlify/Vercel
3. **Select Previous Version:** Choose last known good deployment
4. **Execute Rollback:** Restore previous deployment
5. **Verify Functionality:** Test critical user journeys
6. **Notify Team:** Communicate rollback completion
7. **Investigate Root Cause:** Analyze what went wrong
8. **Plan Fix:** Prepare corrective measures

## Platform-Specific Configurations

### Netlify Configuration

#### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  
# Redirect rules
[[redirects]]
  from = "/admin/*"
  to = "/404"
  status = 404
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;"
    
# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
# Image optimization
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
    
# Form handling
[[forms]]
  name = "booking"
  
# Edge functions (if needed)
[[edge_functions]]
  function = "form-handler"
  path = "/api/booking"
```

### Vercel Configuration

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*\\.(js|css|woff2|jpg|png|webp))$",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
        }
      ]
    }
  ]
}
```

## Monitoring and Alerting

### Performance Monitoring Setup

#### Real User Monitoring (RUM)
```javascript
// src/utils/performance-monitoring.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
  
  // Send to custom analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(console.error);
}

// Measure and report Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Error Tracking Setup
```javascript
// src/utils/error-tracking.js
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.PUBLIC_ENVIRONMENT,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors
    if (import.meta.env.DEV) {
      return null;
    }
    return event;
  },
});

// Custom error boundary for Astro
export function handleError(error, errorInfo) {
  Sentry.withScope((scope) => {
    scope.setTag('component', errorInfo.componentStack);
    Sentry.captureException(error);
  });
}
```

### Alerting Configuration

#### Performance Alerts
```yaml
# .github/workflows/performance-monitoring.yml
name: Performance Monitoring

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  lighthouse-monitoring:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://cubatattoostudio.com
            https://cubatattoostudio.com/artistas
            https://cubatattoostudio.com/portfolio
            https://cubatattoostudio.com/reservas
          uploadArtifacts: true
          temporaryPublicStorage: true
          
      - name: Check performance thresholds
        run: |
          # Parse Lighthouse results
          # Alert if performance drops below thresholds
          # Send notifications to team
```

#### Uptime Monitoring
```javascript
// scripts/uptime-monitor.js
const https = require('https');
const { WebhookClient } = require('discord.js');

const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

const urls = [
  'https://cubatattoostudio.com',
  'https://cubatattoostudio.com/artistas',
  'https://cubatattoostudio.com/portfolio',
  'https://cubatattoostudio.com/reservas',
];

async function checkUptime() {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        await webhook.send({
          content: `🚨 **Site Down Alert**\n${url} returned ${response.status}`,
          username: 'Cuba Tattoo Monitor',
        });
      }
    } catch (error) {
      await webhook.send({
        content: `🚨 **Site Error Alert**\n${url} - ${error.message}`,
        username: 'Cuba Tattoo Monitor',
      });
    }
  }
}

checkUptime();
```

## Security Considerations

### Security Headers Implementation
```javascript
// netlify/edge-functions/security-headers.js
export default async (request, context) => {
  const response = await context.next();
  
  // Add security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
};
```

### Environment Security
```bash
# .env.example
# Copy to .env and fill in actual values

# Site Configuration
SITE_URL=https://cubatattoostudio.com
ENVIRONMENT=production

# Analytics (Public keys only)
PUBLIC_GOOGLE_ANALYTICS_ID=
PUBLIC_HOTJAR_ID=

# API Keys (Keep secure)
FORM_API_KEY=
IMAGE_API_KEY=
SENTRY_DSN=

# Never commit actual .env file to version control
```

## Disaster Recovery

### Backup Procedures
```bash
#!/bin/bash
# backup.sh

echo "📦 Creating backup..."

# Backup source code
git bundle create backup-$(date +%Y%m%d).bundle --all

# Backup build artifacts
tar -czf build-backup-$(date +%Y%m%d).tar.gz dist/

# Backup configuration
cp netlify.toml netlify-backup-$(date +%Y%m%d).toml
cp package.json package-backup-$(date +%Y%m%d).json

echo "✅ Backup completed"
```

### Recovery Procedures
1. **Assess the situation** - Determine scope of the issue
2. **Communicate status** - Notify stakeholders
3. **Implement temporary fix** - Use cached version or maintenance page
4. **Restore from backup** - Use most recent known good state
5. **Verify functionality** - Test all critical features
6. **Monitor closely** - Watch for recurring issues
7. **Post-mortem analysis** - Document lessons learned

---

## Deployment Success Metrics

### Key Performance Indicators
- **Deployment Frequency:** Daily deployments capability
- **Lead Time:** < 1 hour from commit to production
- **Mean Time to Recovery:** < 15 minutes
- **Change Failure Rate:** < 5%
- **Deployment Success Rate:** > 99%

### Quality Gates
- All automated tests pass
- Performance benchmarks met
- Security scans clean
- Accessibility compliance verified
- Manual QA approval (for major releases)

---

**Remember: Successful deployment is not just about getting code live—it's about maintaining the exceptional user experience that Cuba Tattoo Studio's clients expect while ensuring the site remains fast, secure, and accessible to all users.**