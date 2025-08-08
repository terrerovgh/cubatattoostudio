/**
 * Animation Gallery Interactive Examples
 * Cuba Tattoo Studio Documentation
 * 
 * Enhanced GSAP animations with interactive controls
 * and advanced effects for the animation gallery.
 */

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation state management
const AnimationGallery = {
  animations: new Map(),
  isInitialized: false,
  
  init() {
    if (this.isInitialized) return;
    
    this.setupScrollAnimations();
    this.setupInteractiveControls();
    this.setupAdvancedExamples();
    this.respectMotionPreferences();
    
    this.isInitialized = true;
    console.log('🎬 Animation Gallery initialized');
  },
  
  // Respect user motion preferences
  respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable complex animations
      gsap.globalTimeline.timeScale(0.1);
      document.body.classList.add('reduced-motion');
    }
  },
  
  // Setup scroll-triggered animations for the gallery
  setupScrollAnimations() {
    // Animate component cards on scroll
    gsap.from('.component-card', {
      scrollTrigger: {
        trigger: '.animation-gallery',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
      stagger: 0.15,
      ease: 'power2.out'
    });
    
    // Animate section headers
    gsap.from('h2[id]', {
      scrollTrigger: {
        trigger: 'h2[id]',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.6,
      opacity: 0,
      x: -30,
      ease: 'power2.out'
    });
  },
  
  // Setup interactive animation controls
  setupInteractiveControls() {
    // Enhanced replay functions with better timing
    window.replayFadeIn = () => this.replayAnimation('fade-in', () => {
      const element = document.querySelector('#fade-in-demo .demo-element');
      return gsap.fromTo(element, 
        { opacity: 0, scale: 0.9 }, 
        { duration: 1, opacity: 1, scale: 1, ease: 'back.out(1.7)' }
      );
    });
    
    window.replayFadeInUp = () => this.replayAnimation('fade-in-up', () => {
      const element = document.querySelector('#fade-in-up-demo .demo-element');
      return gsap.fromTo(element,
        { opacity: 0, y: 40, rotationX: 15 },
        { duration: 1, opacity: 1, y: 0, rotationX: 0, ease: 'power3.out' }
      );
    });
    
    window.replaySlideLeft = () => this.replayAnimation('slide-left', () => {
      const element = document.querySelector('#slide-left-demo .demo-element');
      return gsap.fromTo(element,
        { x: -120, opacity: 0, rotation: -10 },
        { duration: 1, x: 0, opacity: 1, rotation: 0, ease: 'back.out(1.4)' }
      );
    });
    
    window.replaySlideRight = () => this.replayAnimation('slide-right', () => {
      const element = document.querySelector('#slide-right-demo .demo-element');
      return gsap.fromTo(element,
        { x: 120, opacity: 0, rotation: 10 },
        { duration: 1, x: 0, opacity: 1, rotation: 0, ease: 'back.out(1.4)' }
      );
    });
    
    window.replayStagger = () => this.replayAnimation('stagger', () => {
      const elements = document.querySelectorAll('#stagger-demo .stagger-element');
      return gsap.fromTo(elements,
        { opacity: 0, y: 30, scale: 0.8 },
        { 
          duration: 0.8, 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: {
            amount: 0.6,
            from: 'center',
            ease: 'power2.out'
          },
          ease: 'back.out(1.4)'
        }
      );
    });
    
    window.replayScrollReveal = () => this.replayAnimation('scroll-reveal', () => {
      const element = document.querySelector('#scroll-reveal-demo .scroll-element');
      return gsap.fromTo(element,
        { opacity: 0, y: 30, scale: 0.9 },
        { duration: 1, opacity: 1, y: 0, scale: 1, ease: 'power2.out' }
      );
    });
    
    window.replayParallax = () => this.replayAnimation('parallax', () => {
      const bg = document.querySelector('#parallax-demo .parallax-bg');
      const content = document.querySelector('#parallax-demo h4');
      
      const tl = gsap.timeline();
      tl.fromTo(bg, { y: '0%', scale: 1 }, { duration: 2, y: '-30%', scale: 1.1, ease: 'power2.inOut' })
        .fromTo(content, { opacity: 0.5 }, { duration: 2, opacity: 1, ease: 'power2.inOut' }, 0);
      
      return tl;
    });
    
    // Enhanced pulse toggle with more control
    window.togglePulse = (event) => {
      const element = document.querySelector('#pulse-demo .pulse-element');
      const button = event.target;
      const animKey = 'pulse';
      
      if (this.animations.has(animKey)) {
        this.animations.get(animKey).kill();
        this.animations.delete(animKey);
        gsap.set(element, { scale: 1, opacity: 1 });
        button.textContent = '▶️ Start';
      } else {
        const anim = gsap.to(element, {
          duration: 1.8,
          scale: 1.3,
          opacity: 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        this.animations.set(animKey, anim);
        button.textContent = '⏸️ Stop';
      }
    };
  },
  
  // Setup advanced animation examples
  setupAdvancedExamples() {
    // Add morphing animation example
    this.createMorphingExample();
    
    // Add text reveal animation
    this.createTextRevealExample();
    
    // Add magnetic hover effect
    this.createMagneticHoverEffect();
  },
  
  // Create morphing animation example
  createMorphingExample() {
    const morphDemo = document.querySelector('#morph-demo');
    if (!morphDemo) return;
    
    const element = morphDemo.querySelector('.demo-element');
    if (!element) return;
    
    const morphAnimation = gsap.timeline({ repeat: -1, yoyo: true })
      .to(element, {
        duration: 2,
        borderRadius: '50%',
        rotation: 180,
        scale: 1.2,
        ease: 'power2.inOut'
      })
      .to(element, {
        duration: 1.5,
        borderRadius: '0%',
        rotation: 360,
        scale: 1,
        ease: 'power2.inOut'
      });
    
    this.animations.set('morph', morphAnimation);
  },
  
  // Create text reveal animation
  createTextRevealExample() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach((element, index) => {
      const text = element.textContent;
      element.innerHTML = text.split('').map(char => 
        `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      const chars = element.querySelectorAll('span');
      
      gsap.to(chars, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        duration: 0.05,
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: 'power2.out',
        delay: index * 0.2
      });
    });
  },
  
  // Create magnetic hover effect
  createMagneticHoverEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          duration: 0.3,
          x: x * 0.3,
          y: y * 0.3,
          ease: 'power2.out'
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          duration: 0.5,
          x: 0,
          y: 0,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  },
  
  // Utility function to replay animations with proper cleanup
  replayAnimation(key, animationFunction) {
    // Kill existing animation if running
    if (this.animations.has(key)) {
      this.animations.get(key).kill();
    }
    
    // Create and store new animation
    const animation = animationFunction();
    this.animations.set(key, animation);
    
    // Auto-cleanup after completion
    if (animation.then) {
      animation.then(() => this.animations.delete(key));
    } else {
      animation.eventCallback('onComplete', () => this.animations.delete(key));
    }
  },
  
  // Cleanup all animations
  cleanup() {
    this.animations.forEach(animation => animation.kill());
    this.animations.clear();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.isInitialized = false;
  }
};

// Performance monitoring
const PerformanceMonitor = {
  init() {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('animation-gallery-start');
      
      window.addEventListener('load', () => {
        performance.mark('animation-gallery-end');
        performance.measure('animation-gallery-load', 'animation-gallery-start', 'animation-gallery-end');
        
        const measure = performance.getEntriesByName('animation-gallery-load')[0];
        if (measure) {
          console.log(`🎬 Animation Gallery loaded in ${measure.duration.toFixed(2)}ms`);
        }
      });
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AnimationGallery.init();
    PerformanceMonitor.init();
  });
} else {
  AnimationGallery.init();
  PerformanceMonitor.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  AnimationGallery.cleanup();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationGallery, PerformanceMonitor };
}

// Global access
window.AnimationGallery = AnimationGallery;