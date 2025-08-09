# Animation System - Cuba Tattoo Studio

## 🎬 Animation Philosophy

The Cuba Tattoo Studio website features a sophisticated animation system inspired by **Rockstar Games' GTA VI website**, creating a cinematic experience that reflects the artistry and professionalism of the studio. All animations are built with GSAP (GreenSock Animation Platform) for maximum performance and cross-browser compatibility.

## 🎯 Animation Principles

### Core Principles
1. **Cinematic Quality** - Smooth, film-like transitions and sequences
2. **Performance First** - 60fps target with hardware acceleration
3. **Meaningful Motion** - Animations enhance UX, never distract
4. **Progressive Enhancement** - Graceful degradation without JavaScript
5. **Accessibility Aware** - Respect user motion preferences
6. **Mobile Optimized** - Efficient animations on all devices

### Motion Design Guidelines
- **Easing**: Custom cubic-bezier curves for natural motion
- **Duration**: 0.3s for micro-interactions, 0.6-1.2s for major transitions
- **Stagger**: 0.1-0.2s delays for sequential animations
- **Scale**: Subtle transforms (1.02-1.05x) for hover effects
- **Opacity**: Smooth fade transitions (0-1)

## 🛠️ GSAP Configuration

### Core Setup

```javascript
// src/scripts/gsap-config.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, MorphSVGPlugin);

// Global GSAP settings
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

// Default easing curves
gsap.defaults({
  ease: "power2.out",
  duration: 0.6
});

// Respect user motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0.1);
}

export { gsap, ScrollTrigger };
```

### Performance Optimization

```javascript
// Optimize for performance
gsap.set('[data-animate]', {
  willChange: 'transform, opacity'
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.globalTimeline.clear();
});
```

## 🎭 Homepage Cinematic Sequence

### Loading Animation

**Inspired by**: Rockstar Games GTA VI website entry sequence

```javascript
// src/scripts/homepage-intro.js
class HomepageIntro {
  constructor() {
    this.tl = gsap.timeline({ paused: true });
    this.init();
  }

  init() {
    // Initial state - everything hidden
    gsap.set([
      '.hero-logo',
      '.hero-title',
      '.hero-subtitle',
      '.hero-cta',
      '.nav-logo',
      '.nav-links'
    ], {
      opacity: 0,
      y: 50
    });

    // Create the cinematic sequence
    this.createSequence();
    
    // Start animation when page loads
    window.addEventListener('load', () => {
      this.play();
    });
  }

  createSequence() {
    this.tl
      // 1. Logo fade in with scale
      .to('.hero-logo', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out'
      })
      // 2. Title stagger animation
      .to('.hero-title .char', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.7)'
      }, '-=0.5')
      // 3. Subtitle slide up
      .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.3')
      // 4. CTA button with bounce
      .to('.hero-cta', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.2')
      // 5. Navigation fade in
      .to(['.nav-logo', '.nav-links'], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.4');
  }

  play() {
    this.tl.play();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new HomepageIntro();
});
```

### Hero Section Parallax

```javascript
// Hero background parallax effect
gsap.to('.hero-background', {
  yPercent: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// Hero content fade out on scroll
gsap.to('.hero-content', {
  opacity: 0,
  y: -100,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'center center',
    end: 'bottom center',
    scrub: 1
  }
});
```

## 📜 Scroll-Triggered Animations

### Section Reveal System

```javascript
// src/scripts/scroll-animations.js
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupSectionReveals();
    this.setupStaggeredElements();
    this.setupParallaxElements();
    this.setupPinnedSections();
  }

  setupSectionReveals() {
    // Fade in sections as they enter viewport
    gsap.utils.toArray('.fade-in-section').forEach(section => {
      const delay = section.dataset.delay || 0;
      const intensity = section.dataset.intensity || 'medium';
      
      const yOffset = {
        low: 20,
        medium: 50,
        high: 100
      }[intensity];

      gsap.fromTo(section, 
        {
          opacity: 0,
          y: yOffset
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: parseFloat(delay),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  setupStaggeredElements() {
    // Staggered animations for grids and lists
    gsap.utils.toArray('.stagger-container').forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      const staggerDelay = container.dataset.stagger || 0.1;

      gsap.fromTo(items,
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: parseFloat(staggerDelay),
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  setupParallaxElements() {
    // Parallax backgrounds
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
      const speed = bg.dataset.speed || 0.5;
      
      gsap.to(bg, {
        yPercent: -50 * parseFloat(speed),
        ease: 'none',
        scrollTrigger: {
          trigger: bg.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  setupPinnedSections() {
    // Pin sections during scroll (like GTA VI site)
    gsap.utils.toArray('.pin-section').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false
      });
    });
  }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});
```

## 🎨 Component Animations

### FadeInSection Component

**File**: `src/components/animations/FadeInSection.astro`

```astro
---
export interface Props {
  delay?: number;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}

const {
  delay = 0,
  duration = 1,
  intensity = 'medium',
  class: className = ''
} = Astro.props;
---

<div 
  class={`fade-in-section ${className}`}
  data-delay={delay}
  data-duration={duration}
  data-intensity={intensity}
>
  <slot />
</div>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Animation logic handled by ScrollAnimations class
</script>
```

### StaggerText Component

**File**: `src/components/animations/StaggerText.astro`

```astro
---
export interface Props {
  text: string;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
  class?: string;
}

const {
  text,
  element = 'p',
  delay = 0,
  staggerDelay = 0.05,
  class: className = ''
} = Astro.props;

// Split text into characters for animation
const chars = text.split('').map((char, index) => ({
  char: char === ' ' ? '&nbsp;' : char,
  index
}));

const Tag = element;
---

<Tag class={`stagger-text ${className}`} data-delay={delay} data-stagger={staggerDelay}>
  {chars.map(({ char, index }) => (
    <span class="char" data-char={index} set:html={char} />
  ))}
</Tag>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  document.querySelectorAll('.stagger-text').forEach(element => {
    const chars = element.querySelectorAll('.char');
    const delay = parseFloat(element.dataset.delay || '0');
    const stagger = parseFloat(element.dataset.stagger || '0.05');
    
    // Initial state
    gsap.set(chars, {
      opacity: 0,
      y: 20,
      rotationX: -90
    });
    
    // Animation
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.6,
      delay: delay,
      stagger: stagger,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
</script>

<style>
  .stagger-text {
    overflow: hidden;
  }
  
  .char {
    display: inline-block;
    transform-origin: 50% 100%;
  }
</style>
```

### SlideInImage Component

**File**: `src/components/animations/SlideInImage.astro`

```astro
---
export interface Props {
  src: string;
  alt: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  class?: string;
}

const {
  src,
  alt,
  direction = 'up',
  delay = 0,
  class: className = ''
} = Astro.props;
---

<div class={`slide-in-image-container ${className}`} data-direction={direction} data-delay={delay}>
  <div class="image-mask">
    <img src={src} alt={alt} class="slide-in-image" />
  </div>
</div>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  document.querySelectorAll('.slide-in-image-container').forEach(container => {
    const image = container.querySelector('.slide-in-image');
    const mask = container.querySelector('.image-mask');
    const direction = container.dataset.direction || 'up';
    const delay = parseFloat(container.dataset.delay || '0');
    
    // Direction mappings
    const directions = {
      up: { x: 0, y: 100 },
      down: { x: 0, y: -100 },
      left: { x: 100, y: 0 },
      right: { x: -100, y: 0 }
    };
    
    const { x, y } = directions[direction];
    
    // Initial state
    gsap.set(image, {
      xPercent: x,
      yPercent: y
    });
    
    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
    
    tl.to(image, {
      xPercent: 0,
      yPercent: 0,
      duration: 1.2,
      delay: delay,
      ease: 'power3.out'
    });
  });
</script>

<style>
  .slide-in-image-container {
    overflow: hidden;
  }
  
  .image-mask {
    overflow: hidden;
  }
  
  .slide-in-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
```

### ParallaxContainer Component

**File**: `src/components/animations/ParallaxContainer.astro`

```astro
---
export interface Props {
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}

const {
  speed = 0.5,
  intensity = 'medium',
  class: className = ''
} = Astro.props;
---

<div class={`parallax-container ${className}`} data-speed={speed} data-intensity={intensity}>
  <div class="parallax-bg"></div>
  <div class="parallax-content">
    <slot />
  </div>
</div>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Handled by ScrollAnimations class
</script>

<style>
  .parallax-container {
    position: relative;
    overflow: hidden;
  }
  
  .parallax-bg {
    position: absolute;
    top: -20%;
    left: 0;
    width: 100%;
    height: 120%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .parallax-content {
    position: relative;
    z-index: 1;
  }
</style>
```

## 🎮 Interactive Animations

### Hover Effects

```javascript
// src/scripts/hover-effects.js
class HoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupButtonHovers();
    this.setupCardHovers();
    this.setupImageHovers();
    this.setupMagneticEffects();
  }

  setupButtonHovers() {
    document.querySelectorAll('.btn-hover').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  setupCardHovers() {
    document.querySelectorAll('.card-hover').forEach(card => {
      const image = card.querySelector('img');
      const content = card.querySelector('.card-content');
      
      card.addEventListener('mouseenter', () => {
        const tl = gsap.timeline();
        
        tl.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        })
        .to(image, {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        }, 0)
        .to(content, {
          y: -5,
          duration: 0.4,
          ease: 'power2.out'
        }, 0.1);
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to([card, image, content], {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  }

  setupMagneticEffects() {
    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', () => {
  new HoverEffects();
});
```

## 📱 Mobile Optimizations

### Touch-Friendly Animations

```javascript
// Detect touch devices and adjust animations
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
  // Reduce animation complexity on touch devices
  gsap.globalTimeline.timeScale(0.8);
  
  // Disable hover effects on touch
  document.body.classList.add('touch-device');
  
  // Use touch events instead of mouse events
  document.querySelectorAll('.interactive').forEach(element => {
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
  });
}

function handleTouchStart(e) {
  gsap.to(e.currentTarget, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out'
  });
}

function handleTouchEnd(e) {
  gsap.to(e.currentTarget, {
    scale: 1,
    duration: 0.2,
    ease: 'back.out(1.7)'
  });
}
```

### Performance Monitoring

```javascript
// Monitor animation performance
class AnimationPerformance {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.init();
  }

  init() {
    this.monitorFPS();
    this.adjustQuality();
  }

  monitorFPS() {
    const tick = (currentTime) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Adjust animation quality based on FPS
        if (this.fps < 30) {
          this.reduceAnimationQuality();
        } else if (this.fps > 55) {
          this.increaseAnimationQuality();
        }
      }
      
      requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }

  reduceAnimationQuality() {
    // Disable complex animations on low-end devices
    gsap.globalTimeline.timeScale(0.5);
    document.body.classList.add('reduced-animations');
  }

  increaseAnimationQuality() {
    // Enable full animations on capable devices
    gsap.globalTimeline.timeScale(1);
    document.body.classList.remove('reduced-animations');
  }
}

// Initialize performance monitoring
new AnimationPerformance();
```

## ♿ Accessibility Considerations

### Respecting User Preferences

```javascript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotion(mediaQuery) {
  if (mediaQuery.matches) {
    // Disable or reduce animations
    gsap.globalTimeline.timeScale(0.1);
    document.body.classList.add('reduced-motion');
    
    // Replace animations with instant transitions
    gsap.set('[data-animate]', {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    });
  } else {
    // Enable full animations
    gsap.globalTimeline.timeScale(1);
    document.body.classList.remove('reduced-motion');
  }
}

// Initial check
handleReducedMotion(prefersReducedMotion);

// Listen for changes
prefersReducedMotion.addEventListener('change', handleReducedMotion);
```

### Focus Management

```javascript
// Ensure focus is visible during animations
function preserveFocusVisibility() {
  document.addEventListener('focusin', (e) => {
    const focusedElement = e.target;
    
    // Ensure focused element is visible during animations
    gsap.set(focusedElement, {
      opacity: 1,
      scale: 1,
      clearProps: 'transform'
    });
    
    // Add focus ring
    focusedElement.classList.add('focus-visible');
  });
  
  document.addEventListener('focusout', (e) => {
    e.target.classList.remove('focus-visible');
  });
}

preserveFocusVisibility();
```

## 🔧 Animation Utilities

### Custom Easing Functions

```javascript
// Custom easing curves for brand consistency
const customEases = {
  cubaEaseOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cubaEaseIn: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
  cubaEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  cubaBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Register custom eases
Object.entries(customEases).forEach(([name, ease]) => {
  gsap.registerEase(name, ease);
});
```

### Animation Presets

```javascript
// Reusable animation presets
const animationPresets = {
  fadeIn: (element, options = {}) => {
    return gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'cubaEaseOut',
        ...options 
      }
    );
  },
  
  slideIn: (element, direction = 'up', options = {}) => {
    const directions = {
      up: { y: 50 },
      down: { y: -50 },
      left: { x: 50 },
      right: { x: -50 }
    };
    
    return gsap.fromTo(element,
      { opacity: 0, ...directions[direction] },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'cubaEaseOut',
        ...options
      }
    );
  },
  
  scaleIn: (element, options = {}) => {
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'cubaBounce',
        ...options
      }
    );
  }
};

// Export for use in components
window.animationPresets = animationPresets;
```

## 📊 Performance Metrics

### Animation Performance Targets

- **Frame Rate**: 60fps consistently
- **Animation Duration**: 0.3-1.2s for most transitions
- **Stagger Delays**: 0.05-0.2s between elements
- **Memory Usage**: <50MB for animation objects
- **CPU Usage**: <30% during animations

### Monitoring Tools

```javascript
// Performance monitoring for animations
class AnimationProfiler {
  constructor() {
    this.metrics = {
      totalAnimations: 0,
      activeAnimations: 0,
      averageFPS: 60,
      memoryUsage: 0
    };
    
    this.startProfiling();
  }
  
  startProfiling() {
    // Monitor GSAP timeline
    gsap.ticker.add(this.updateMetrics.bind(this));
    
    // Log performance data
    setInterval(() => {
      console.log('Animation Metrics:', this.metrics);
    }, 5000);
  }
  
  updateMetrics() {
    this.metrics.activeAnimations = gsap.globalTimeline.getChildren().length;
    this.metrics.memoryUsage = performance.memory?.usedJSHeapSize || 0;
  }
}

// Enable in development
if (process.env.NODE_ENV === 'development') {
  new AnimationProfiler();
}
```

---

*This animation system documentation provides the foundation for creating cinematic, performant animations throughout the Cuba Tattoo Studio website. All animations should follow these patterns and principles to maintain consistency and quality.*