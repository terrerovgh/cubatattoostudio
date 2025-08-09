# Development Workflow Templates

## Workflow Templates for Cuba Tattoo Studio

### 1. Feature Development Workflow

#### Template: New Page Development
```markdown
# New Page Development: [PAGE_NAME]

## Pre-Development Checklist
- [ ] Review design specifications in `.trae/documents/`
- [ ] Check component specifications in `.trae/context/`
- [ ] Verify technical requirements in architecture docs
- [ ] Ensure GSAP animation requirements are understood

## Development Steps

### 1. Setup and Planning
- [ ] Create page file in `src/pages/[page-name].astro`
- [ ] Plan component structure (atomic design)
- [ ] Identify required animations (GSAP)
- [ ] Plan responsive breakpoints

### 2. Component Development
- [ ] Create atomic components (buttons, inputs, cards)
- [ ] Build molecular components (forms, navigation)
- [ ] Develop organism components (sections, galleries)
- [ ] Implement layout components

### 3. Styling Implementation
- [ ] Apply Tailwind utility classes
- [ ] Ensure B&W color palette compliance
- [ ] Implement responsive design (mobile-first)
- [ ] Add hover and focus states

### 4. Animation Integration
- [ ] Setup GSAP timeline for page load
- [ ] Implement ScrollTrigger animations
- [ ] Add interactive element animations
- [ ] Test animation performance (60fps)

### 5. Content Integration
- [ ] Add semantic HTML structure
- [ ] Implement proper heading hierarchy
- [ ] Add alt text for all images
- [ ] Ensure proper ARIA labels

### 6. Testing and Optimization
- [ ] Test on mobile devices
- [ ] Verify keyboard navigation
- [ ] Run Lighthouse audit (>90 score)
- [ ] Test with screen readers
- [ ] Validate HTML and accessibility

### 7. Final Review
- [ ] Code review with team
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Documentation updates

## Quality Gates
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 95
- ✅ All animations at 60fps
- ✅ Mobile-first responsive
- ✅ B&W palette compliance
- ✅ Semantic HTML structure
```

#### Template: Component Development
```markdown
# Component Development: [COMPONENT_NAME]

## Component Specifications
- **Type:** [Atom/Molecule/Organism]
- **Purpose:** [Brief description]
- **Dependencies:** [List dependencies]
- **Props Interface:** [Define TypeScript interface]

## Development Checklist

### 1. Component Structure
- [ ] Create component file in appropriate directory
- [ ] Define TypeScript interface for props
- [ ] Implement component logic
- [ ] Add proper JSDoc comments

### 2. Styling
- [ ] Apply Tailwind utility classes
- [ ] Ensure B&W color compliance
- [ ] Implement responsive variants
- [ ] Add interaction states (hover, focus, active)

### 3. Accessibility
- [ ] Add proper ARIA attributes
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Verify color contrast ratios

### 4. Testing
- [ ] Write unit tests
- [ ] Test different prop combinations
- [ ] Visual regression testing
- [ ] Accessibility testing

### 5. Documentation
- [ ] Update component guide
- [ ] Add usage examples
- [ ] Document props and variants
- [ ] Include accessibility notes

## Quality Standards
- ✅ TypeScript strict mode compliance
- ✅ Accessibility score 100%
- ✅ Unit test coverage > 80%
- ✅ Performance budget < 5KB
- ✅ Zero console errors/warnings
```

### 2. Animation Development Workflow

#### Template: GSAP Animation Implementation
```markdown
# GSAP Animation: [ANIMATION_NAME]

## Animation Specifications
- **Type:** [Loading/Scroll/Interaction]
- **Duration:** [Time in seconds]
- **Trigger:** [Scroll/Click/Load]
- **Performance Target:** 60fps

## Implementation Steps

### 1. Planning
- [ ] Study reference animation (rockstargames.com/VI)
- [ ] Break down animation into steps
- [ ] Identify performance considerations
- [ ] Plan fallbacks for low-end devices

### 2. Setup
- [ ] Import required GSAP modules
- [ ] Setup timeline or tween
- [ ] Configure ScrollTrigger (if needed)
- [ ] Add performance monitoring

### 3. Implementation
- [ ] Create base animation
- [ ] Add easing and timing
- [ ] Implement responsive behavior
- [ ] Add loading states

### 4. Optimization
- [ ] Use transform and opacity only
- [ ] Implement will-change CSS property
- [ ] Add reduced motion support
- [ ] Test on mobile devices

### 5. Testing
- [ ] Performance testing (60fps)
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Accessibility compliance

## Performance Checklist
- ✅ Maintains 60fps on mobile
- ✅ Uses GPU-accelerated properties
- ✅ Respects prefers-reduced-motion
- ✅ Graceful degradation
- ✅ Memory efficient
```

### 3. Content Management Workflow

#### Template: Artist Profile Creation
```markdown
# Artist Profile: [ARTIST_NAME]

## Content Requirements

### 1. Basic Information
- [ ] Full name
- [ ] Professional photo (high-res, B&W)
- [ ] Specialties/styles
- [ ] Years of experience
- [ ] Brief biography (150-300 words)

### 2. Portfolio Images
- [ ] Minimum 20 high-quality images
- [ ] Various styles and sizes
- [ ] Proper image optimization
- [ ] Alt text for each image
- [ ] Image categorization by style

### 3. Technical Implementation
- [ ] Create artist data file
- [ ] Generate optimized images
- [ ] Create artist page route
- [ ] Implement gallery component
- [ ] Add SEO metadata

### 4. Quality Assurance
- [ ] Image quality review
- [ ] Content accuracy check
- [ ] SEO optimization
- [ ] Mobile responsiveness
- [ ] Performance testing

## File Structure
```
src/
├── data/artists/[artist-slug].json
├── pages/artistas/[artist-slug].astro
└── assets/images/artists/[artist-slug]/
    ├── profile.webp
    └── portfolio/
        ├── image-001.webp
        ├── image-002.webp
        └── ...
```
```

### 4. Deployment Workflow

#### Template: Production Deployment
```markdown
# Production Deployment Checklist

## Pre-Deployment

### 1. Code Quality
- [ ] All tests passing
- [ ] ESLint/Prettier checks passed
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings

### 2. Performance Audit
- [ ] Lighthouse score > 90 (all metrics)
- [ ] Bundle size analysis
- [ ] Image optimization verified
- [ ] Critical CSS inlined

### 3. Content Review
- [ ] All content proofread
- [ ] Images have proper alt text
- [ ] SEO metadata complete
- [ ] Contact information updated

### 4. Functionality Testing
- [ ] All forms working
- [ ] Navigation functional
- [ ] Animations performing well
- [ ] Mobile responsiveness verified

## Deployment Steps

### 1. Build Process
```bash
# Install dependencies
npm ci

# Run tests
npm run test

# Build for production
npm run build

# Preview build
npm run preview
```

### 2. Pre-deployment Testing
- [ ] Test build locally
- [ ] Verify all routes work
- [ ] Check asset loading
- [ ] Test form submissions

### 3. Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify deployment success

### 4. Post-Deployment
- [ ] Monitor performance metrics
- [ ] Check error logs
- [ ] Verify analytics tracking
- [ ] Test critical user journeys

## Rollback Plan
- [ ] Previous version backup ready
- [ ] Rollback procedure documented
- [ ] Database backup (if applicable)
- [ ] DNS/CDN rollback plan
```

### 5. Maintenance Workflow

#### Template: Regular Maintenance Tasks
```markdown
# Weekly Maintenance Checklist

## Performance Monitoring
- [ ] Check Lighthouse scores
- [ ] Review Core Web Vitals
- [ ] Monitor page load times
- [ ] Check mobile performance

## Content Updates
- [ ] Review portfolio images
- [ ] Update artist information
- [ ] Check contact details
- [ ] Verify business hours

## Technical Health
- [ ] Update dependencies
- [ ] Check for security vulnerabilities
- [ ] Review error logs
- [ ] Test form submissions

## SEO Maintenance
- [ ] Check search rankings
- [ ] Review Google Search Console
- [ ] Update meta descriptions
- [ ] Check for broken links

## Accessibility Audit
- [ ] Run automated accessibility tests
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
```

### 6. Bug Fix Workflow

#### Template: Bug Resolution Process
```markdown
# Bug Fix: [BUG_TITLE]

## Bug Information
- **Severity:** [Critical/High/Medium/Low]
- **Browser:** [Chrome/Firefox/Safari/Edge]
- **Device:** [Desktop/Mobile/Tablet]
- **Reporter:** [Name/Email]
- **Date Reported:** [Date]

## Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[Description of expected behavior]

## Actual Behavior
[Description of actual behavior]

## Investigation

### 1. Root Cause Analysis
- [ ] Identify affected components
- [ ] Review recent changes
- [ ] Check browser compatibility
- [ ] Analyze error logs

### 2. Impact Assessment
- [ ] Determine user impact
- [ ] Identify affected features
- [ ] Assess business impact
- [ ] Prioritize fix urgency

## Resolution

### 1. Fix Implementation
- [ ] Develop fix
- [ ] Write/update tests
- [ ] Test fix locally
- [ ] Code review

### 2. Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing
- [ ] Cross-browser testing

### 3. Deployment
- [ ] Deploy to staging
- [ ] Verify fix works
- [ ] Deploy to production
- [ ] Monitor for regressions

## Prevention
- [ ] Add regression tests
- [ ] Update documentation
- [ ] Review development process
- [ ] Share learnings with team
```

### 7. Performance Optimization Workflow

#### Template: Performance Optimization Sprint
```markdown
# Performance Optimization: [FOCUS_AREA]

## Current Metrics
- **Lighthouse Performance:** [Score]
- **First Contentful Paint:** [Time]
- **Largest Contentful Paint:** [Time]
- **Cumulative Layout Shift:** [Score]
- **First Input Delay:** [Time]

## Target Metrics
- **Lighthouse Performance:** >90
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Cumulative Layout Shift:** <0.1
- **First Input Delay:** <100ms

## Optimization Areas

### 1. Image Optimization
- [ ] Implement next-gen formats (WebP, AVIF)
- [ ] Add responsive images
- [ ] Implement lazy loading
- [ ] Optimize image sizes

### 2. Code Optimization
- [ ] Bundle size analysis
- [ ] Remove unused code
- [ ] Implement code splitting
- [ ] Optimize critical CSS

### 3. Animation Performance
- [ ] Use GPU-accelerated properties
- [ ] Optimize GSAP animations
- [ ] Implement will-change property
- [ ] Add performance monitoring

### 4. Loading Strategy
- [ ] Implement resource hints
- [ ] Optimize font loading
- [ ] Preload critical resources
- [ ] Defer non-critical scripts

## Testing and Validation
- [ ] Before/after metrics comparison
- [ ] Mobile device testing
- [ ] Slow network testing
- [ ] Real user monitoring setup

## Success Criteria
- ✅ All Core Web Vitals in green
- ✅ Lighthouse score >90
- ✅ Mobile performance equivalent to desktop
- ✅ No performance regressions
```

---

## Workflow Automation Scripts

### Development Setup Script
```bash
#!/bin/bash
# setup-dev.sh

echo "🚀 Setting up Cuba Tattoo Studio development environment..."

# Install dependencies
npm install

# Setup Git hooks
npx husky install

# Run initial build
npm run build

# Start development server
npm run dev

echo "✅ Development environment ready!"
echo "📱 Open http://localhost:3000 to view the site"
```

### Pre-commit Hook Script
```bash
#!/bin/bash
# .husky/pre-commit

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors before committing."
  exit 1
fi

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix failing tests before committing."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

### Performance Monitoring Script
```javascript
// scripts/performance-monitor.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runPerformanceAudit() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  const scores = {
    performance: runnerResult.lhr.categories.performance.score * 100,
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
    bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
    seo: runnerResult.lhr.categories.seo.score * 100,
  };
  
  console.log('📊 Lighthouse Scores:');
  console.log(`Performance: ${scores.performance}`);
  console.log(`Accessibility: ${scores.accessibility}`);
  console.log(`Best Practices: ${scores.bestPractices}`);
  console.log(`SEO: ${scores.seo}`);
  
  // Fail if any score is below threshold
  const thresholds = { performance: 90, accessibility: 95, bestPractices: 90, seo: 90 };
  let failed = false;
  
  Object.entries(thresholds).forEach(([category, threshold]) => {
    if (scores[category] < threshold) {
      console.error(`❌ ${category} score ${scores[category]} is below threshold ${threshold}`);
      failed = true;
    }
  });
  
  await chrome.kill();
  
  if (failed) {
    process.exit(1);
  } else {
    console.log('✅ All performance thresholds met!');
  }
}

runPerformanceAudit().catch(console.error);
```

---

**These workflow templates ensure consistent, high-quality development practices while maintaining the strict design and performance standards required for the Cuba Tattoo Studio website.**