# GSAP Animations - Rockstar Games VI Style Prompt

## Animation Philosophy

You are the animation specialist for Cuba Tattoo Studio. Your mission is to replicate the exact visual experience and animation sequences from `https://www.rockstargames.com/VI`, adapting them to the tattoo studio context while maintaining the same level of polish and impact.

## Reference Analysis: Rockstar Games VI

### Key Animation Sequences to Replicate

#### 1. Initial Loading Sequence
- **Logo Fade-In:** Clean, centered logo appears with smooth opacity transition
- **Logo Hold:** Brief pause to establish brand presence
- **Logo Fade-Out:** Smooth transition to main content
- **Background Reveal:** Hero background appears with subtle zoom-out effect
- **UI Stagger:** Navigation and interface elements appear in sequence

#### 2. Scroll-Triggered Animations
- **Section Pinning:** Hero section remains fixed while content scrolls over
- **Content Reveals:** New sections appear with staggered fade-ins
- **Parallax Effects:** Background elements move at different speeds
- **Text Animations:** Headlines and copy animate in with precision timing

#### 3. Interactive Elements
- **Hover Effects:** Subtle but noticeable state changes
- **Click Feedback:** Immediate visual response to user actions
- **Smooth Transitions:** All state changes are fluid and purposeful

## Technical Implementation

### GSAP Setup and Configuration

```javascript
// src/scripts/animations/gsap-config.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText'; // If using GSAP Club plugins

// Register all plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global GSAP configuration matching Rockstar's smooth feel
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

// Set default easing to match Rockstar's style
gsap.defaults({
  ease: "power2.out",
  duration: 0.8
});

// Custom eases for specific animations
const customEases = {
  rockstarEase: "power2.inOut",
  smoothEntry: "power3.out",
  quickSnap: "power2.in",
  elasticOut: "elastic.out(1, 0.3)"
};

export { gsap, ScrollTrigger, customEases };
```

### Homepage Loading Sequence

```astro
---
// components/animations/RockstarLoadingSequence.astro
---

<div id="loading-overlay" class="fixed inset-0 z-50 bg-black flex items-center justify-center">
  <div id="logo-animation" class="opacity-0 transform scale-95">
    <h1 class="font-bebas text-6xl sm:text-8xl md:text-9xl uppercase tracking-wider text-white text-center">
      CUBA
    </h1>
    <div class="w-full h-1 bg-white mt-4 transform scale-x-0 origin-left" id="logo-underline"></div>
  </div>
</div>

<div id="main-content" class="opacity-0">
  <slot />
</div>

<script>
  import { gsap, customEases } from '/src/scripts/animations/gsap-config.js';
  
  // Rockstar-style loading sequence
  const loadingTimeline = gsap.timeline({
    onComplete: () => {
      // Remove loading overlay after animation
      document.getElementById('loading-overlay').style.display = 'none';
      // Initialize scroll animations
      initScrollAnimations();
    }
  });
  
  loadingTimeline
    // Logo scale and fade in (matching Rockstar timing)
    .to('#logo-animation', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: customEases.smoothEntry
    })
    // Underline animation
    .to('#logo-underline', {
      scaleX: 1,
      duration: 0.8,
      ease: customEases.rockstarEase
    }, "-=0.4")
    // Hold the logo (Rockstar does this for brand impact)
    .to('#logo-animation', {
      opacity: 1,
      duration: 1.5
    })
    // Logo fade out with slight scale
    .to('#logo-animation', {
      opacity: 0,
      scale: 1.05,
      duration: 0.8,
      ease: customEases.quickSnap
    })
    // Loading overlay fade
    .to('#loading-overlay', {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    })
    // Main content reveal (hero background zoom-out effect)
    .fromTo('#main-content', 
      {
        opacity: 0,
        scale: 1.1
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: customEases.smoothEntry
      }, "-=0.3");
  
  function initScrollAnimations() {
    // Initialize scroll-based animations after loading
    import('/src/scripts/animations/scroll-animations.js');
  }
</script>
```

### Scroll-Triggered Animations

```javascript
// src/scripts/animations/scroll-animations.js
import { gsap, ScrollTrigger, customEases } from './gsap-config.js';

// Hero Section Pinning (exact Rockstar behavior)
function initHeroPinning() {
  const heroSection = document.querySelector('#hero-section');
  
  if (heroSection) {
    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Subtle parallax on hero background during pin
        const progress = self.progress;
        gsap.set('.hero-bg', {
          yPercent: progress * -20,
          scale: 1 + (progress * 0.1)
        });
      }
    });
  }
}

// Staggered Content Reveals (Rockstar-style)
function initContentReveals() {
  // Set initial states
  gsap.set('.reveal-item', {
    opacity: 0,
    y: 60,
    scale: 0.95
  });
  
  // Batch animation for performance
  ScrollTrigger.batch('.reveal-item', {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: {
          amount: 0.6,
          from: "start"
        },
        ease: customEases.smoothEntry
      });
    },
    start: "top 85%",
    once: true
  });
}

// Text Animation (Rockstar-style headline reveals)
function initTextAnimations() {
  const headlines = document.querySelectorAll('.animate-headline');
  
  headlines.forEach((headline) => {
    // Split text into characters for animation
    const chars = headline.textContent.split('');
    headline.innerHTML = chars.map(char => 
      `<span class="inline-block" style="opacity: 0; transform: translateY(50px);">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    const charElements = headline.querySelectorAll('span');
    
    ScrollTrigger.create({
      trigger: headline,
      start: "top 80%",
      onEnter: () => {
        gsap.to(charElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: {
            amount: 0.8,
            from: "start"
          },
          ease: customEases.smoothEntry
        });
      },
      once: true
    });
  });
}

// Parallax Backgrounds (subtle, like Rockstar)
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  parallaxElements.forEach((element) => {
    gsap.to(element, {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: element.closest('.parallax-container'),
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2, // Smooth scrubbing
        invalidateOnRefresh: true
      }
    });
  });
}

// Navigation Animation (appears after loading)
function initNavigationAnimation() {
  const navItems = document.querySelectorAll('.nav-item');
  const logo = document.querySelector('.nav-logo');
  
  // Staggered navigation appearance
  gsap.fromTo([logo, ...navItems], 
    {
      opacity: 0,
      y: -30
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: customEases.smoothEntry,
      delay: 2.5 // After loading sequence
    }
  );
}

// Gallery Hover Effects (Rockstar-style)
function initGalleryAnimations() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item) => {
    const image = item.querySelector('img');
    const overlay = item.querySelector('.overlay');
    
    // Hover in
    item.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: customEases.rockstarEase
      });
      
      gsap.to(overlay, {
        opacity: 0.8,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    // Hover out
    item.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: customEases.rockstarEase
      });
      
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });
}

// Button Animations (Rockstar-style feedback)
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.animated-button');
  
  buttons.forEach((button) => {
    // Click animation
    button.addEventListener('click', (e) => {
      // Ripple effect
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
      `;
      
      button.appendChild(ripple);
      
      gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      });
    });
    
    // Hover animations
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: customEases.rockstarEase
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: customEases.rockstarEase
      });
    });
  });
}

// Page Transition Animations
function initPageTransitions() {
  // Smooth page transitions (SPA-like feel)
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Fade out current content
      gsap.to('main', {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: customEases.quickSnap,
        onComplete: () => {
          window.location.href = href;
        }
      });
    });
  });
}

// Initialize all animations
function initAllAnimations() {
  initHeroPinning();
  initContentReveals();
  initTextAnimations();
  initParallaxEffects();
  initNavigationAnimation();
  initGalleryAnimations();
  initButtonAnimations();
  initPageTransitions();
  
  // Refresh ScrollTrigger after all animations are set
  ScrollTrigger.refresh();
}

// Performance optimization
function optimizeAnimations() {
  // Reduce animations on mobile for performance
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Disable heavy animations on mobile
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scrub) {
        trigger.kill();
      }
    });
  }
  
  // Pause animations when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
}

// Cleanup function for page navigation
function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
}

// Export functions
export {
  initAllAnimations,
  optimizeAnimations,
  cleanupAnimations
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAllAnimations();
    optimizeAnimations();
  });
} else {
  initAllAnimations();
  optimizeAnimations();
}
```

### Component-Level Animations

```astro
---
// components/animations/AnimatedSection.astro
export interface Props {
  class?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'stagger';
  delay?: number;
  trigger?: boolean;
}

const { 
  class: className = '',
  animationType = 'fade',
  delay = 0,
  trigger = true
} = Astro.props;

const sectionId = `animated-section-${Math.random().toString(36).substr(2, 9)}`;
---

<section 
  id={sectionId}
  class={`${className} ${trigger ? 'reveal-item' : ''}`}
  data-animation={animationType}
  data-delay={delay}
>
  <slot />
</section>

{!trigger && (
  <script define:vars={{ sectionId, animationType, delay }}>
    import { gsap, customEases } from '/src/scripts/animations/gsap-config.js';
    
    const element = document.getElementById(sectionId);
    
    const animations = {
      fade: () => {
        gsap.fromTo(element, 
          { opacity: 0 },
          { opacity: 1, duration: 0.8, delay, ease: customEases.smoothEntry }
        );
      },
      slide: () => {
        gsap.fromTo(element,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, delay, ease: customEases.smoothEntry }
        );
      },
      scale: () => {
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, delay, ease: customEases.elasticOut }
        );
      },
      stagger: () => {
        const children = element.children;
        gsap.fromTo(children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            delay,
            stagger: 0.1,
            ease: customEases.smoothEntry 
          }
        );
      }
    };
    
    animations[animationType]();
  </script>
)}
```

## Performance Considerations

### Optimization Strategies

```javascript
// src/scripts/animations/performance.js
import { gsap, ScrollTrigger } from './gsap-config.js';

// Intersection Observer for better performance
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Trigger animation
      const element = entry.target;
      const animationType = element.dataset.animation;
      
      triggerAnimation(element, animationType);
      
      // Stop observing this element
      animationObserver.unobserve(element);
    }
  });
}, observerOptions);

// Observe all animation elements
function observeAnimationElements() {
  const elements = document.querySelectorAll('[data-animation]');
  elements.forEach(el => animationObserver.observe(el));
}

// Memory management
function cleanupOnPageUnload() {
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf('*');
    animationObserver.disconnect();
  });
}

export { observeAnimationElements, cleanupOnPageUnload };
```

### Mobile Optimization

```javascript
// src/scripts/animations/mobile-optimizations.js
import { gsap } from './gsap-config.js';

function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;
  const isLowPowerMode = navigator.hardwareConcurrency < 4;
  
  if (isMobile || isLowPowerMode) {
    // Reduce animation complexity
    gsap.defaults({
      duration: 0.4, // Faster animations
      ease: "power2.out"
    });
    
    // Disable parallax on mobile
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(el => {
      el.style.transform = 'none';
    });
    
    // Simplify scroll animations
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scrub) {
        trigger.kill(); // Remove scrub animations
      }
    });
  }
}

export { optimizeForMobile };
```

## Quality Assurance

### Animation Testing Checklist

- [ ] **Loading sequence** matches Rockstar timing (logo hold ~1.5s)
- [ ] **Smooth 60fps** performance on all animations
- [ ] **ScrollTrigger** works correctly on all devices
- [ ] **Mobile optimization** reduces complexity appropriately
- [ ] **Accessibility** - respects `prefers-reduced-motion`
- [ ] **Memory cleanup** prevents leaks on navigation
- [ ] **Cross-browser** compatibility (Chrome, Firefox, Safari)
- [ ] **Touch interactions** work on mobile devices

### Performance Metrics

- **First Contentful Paint:** < 1.5s
- **Animation Frame Rate:** Consistent 60fps
- **Memory Usage:** No memory leaks after navigation
- **CPU Usage:** < 30% during animations
- **Battery Impact:** Minimal on mobile devices

---

**Remember:** Every animation should feel purposeful and enhance the user experience. The goal is to create the same emotional impact as Rockstar Games VI while serving the specific needs of Cuba Tattoo Studio's brand and conversion goals.