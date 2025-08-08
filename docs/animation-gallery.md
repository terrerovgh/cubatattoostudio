---
layout: default
title: Animation Gallery
description: Interactive showcase of GSAP animation components for Cuba Tattoo Studio - fade effects, scroll triggers, parallax, and more professional animations.
permalink: /animation-gallery/
---

<div class="animation-gallery">

# ✨ Animation Gallery

> Interactive showcase of GSAP animation components inspired by the Cuba Tattoo Studio aesthetic. Each component includes live demos, implementation code, and usage guidelines.

<div class="alert alert-info">
  <p><strong>🎯 Purpose:</strong> This gallery demonstrates the animation components used throughout the Cuba Tattoo Studio website, providing developers with ready-to-use code snippets and implementation examples.</p>
</div>

## 🚀 Quick Start

All animations require GSAP and ScrollTrigger to be loaded:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

---

## 📚 Animation Categories

<div class="doc-nav">
  <h3>🎬 Available Animations</h3>
  <ul>
    <li><a href="#fade-animations">Fade Animations</a></li>
    <li><a href="#slide-animations">Slide Animations</a></li>
    <li><a href="#stagger-animations">Stagger Animations</a></li>
    <li><a href="#scroll-triggered">Scroll Triggered</a></li>
    <li><a href="#parallax-effects">Parallax Effects</a></li>
    <li><a href="#loading-animations">Loading Animations</a></li>
    <li><a href="#hover-effects">Hover Effects</a></li>
    <li><a href="#text-animations">Text Animations</a></li>
  </ul>
</div>

---

## 🎭 Fade Animations {#fade-animations}

<div class="component-grid">

  <!-- Fade In Component -->
  <div class="component-card">
    <h3 class="component-title">Fade In</h3>
    <p class="component-description">Smooth fade-in effect perfect for revealing content on page load or scroll.</p>
    
    <div class="component-demo" id="fade-in-demo">
      <div class="demo-element" style="width: 100px; height: 100px; background-color: var(--cuba-white); border-radius: var(--radius-md);"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Basic Fade In
gsap.from(".element", {
  duration: 0.8,
  opacity: 0,
  ease: "power2.out"
});

// With Y movement
gsap.from(".element", {
  duration: 0.8,
  opacity: 0,
  y: 20,
  ease: "power2.out"
});
```

```css
/* Initial state */
.fade-element {
  opacity: 0;
}
```
    </details>
    
    <button class="btn btn-outline" onclick="replayFadeIn()">🔄 Replay</button>
  </div>

  <!-- Fade In Up Component -->
  <div class="component-card">
    <h3 class="component-title">Fade In Up</h3>
    <p class="component-description">Combines fade-in with upward movement for dynamic content reveals.</p>
    
    <div class="component-demo" id="fade-in-up-demo">
      <div class="demo-element" style="width: 120px; height: 60px; background-color: var(--cuba-gray-400); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--cuba-black); font-weight: bold;">CUBA</div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Fade In Up Animation
gsap.from(".element", {
  duration: 0.8,
  opacity: 0,
  y: 30,
  ease: "power2.out"
});

// With ScrollTrigger
gsap.from(".element", {
  scrollTrigger: {
    trigger: ".element",
    start: "top 85%",
    toggleActions: "play none none reverse"
  },
  duration: 0.8,
  opacity: 0,
  y: 30,
  ease: "power2.out"
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replayFadeInUp()">🔄 Replay</button>
  </div>

</div>

---

## 🎢 Slide Animations {#slide-animations}

<div class="component-grid">

  <!-- Slide In Left -->
  <div class="component-card">
    <h3 class="component-title">Slide In Left</h3>
    <p class="component-description">Elements slide in from the left side with smooth easing.</p>
    
    <div class="component-demo" id="slide-left-demo">
      <div class="demo-element" style="width: 80px; height: 80px; background-color: var(--cuba-white); border-radius: 50%;"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Slide In from Left
gsap.from(".element", {
  duration: 0.8,
  x: -100,
  opacity: 0,
  ease: "power2.out"
});

// With bounce effect
gsap.from(".element", {
  duration: 1.2,
  x: -100,
  opacity: 0,
  ease: "back.out(1.7)"
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replaySlideLeft()">🔄 Replay</button>
  </div>

  <!-- Slide In Right -->
  <div class="component-card">
    <h3 class="component-title">Slide In Right</h3>
    <p class="component-description">Elements slide in from the right side with professional timing.</p>
    
    <div class="component-demo" id="slide-right-demo">
      <div class="demo-element" style="width: 100px; height: 40px; background-color: var(--cuba-gray-600); border-radius: var(--radius-md);"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Slide In from Right
gsap.from(".element", {
  duration: 0.8,
  x: 100,
  opacity: 0,
  ease: "power2.out"
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replaySlideRight()">🔄 Replay</button>
  </div>

</div>

---

## 🎯 Stagger Animations {#stagger-animations}

<div class="component-grid">

  <!-- Stagger Fade In -->
  <div class="component-card">
    <h3 class="component-title">Stagger Fade In</h3>
    <p class="component-description">Multiple elements animate in sequence with controlled delays.</p>
    
    <div class="component-demo" id="stagger-demo">
      <div style="display: flex; gap: var(--spacing-sm); justify-content: center;">
        <div class="stagger-element" style="width: 20px; height: 60px; background-color: var(--cuba-white); border-radius: var(--radius-sm);"></div>
        <div class="stagger-element" style="width: 20px; height: 60px; background-color: var(--cuba-white); border-radius: var(--radius-sm);"></div>
        <div class="stagger-element" style="width: 20px; height: 60px; background-color: var(--cuba-white); border-radius: var(--radius-sm);"></div>
        <div class="stagger-element" style="width: 20px; height: 60px; background-color: var(--cuba-white); border-radius: var(--radius-sm);"></div>
        <div class="stagger-element" style="width: 20px; height: 60px; background-color: var(--cuba-white); border-radius: var(--radius-sm);"></div>
      </div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Stagger Animation
gsap.from(".stagger-element", {
  duration: 0.6,
  opacity: 0,
  y: 20,
  stagger: 0.1,
  ease: "power2.out"
});

// Advanced stagger with different properties
gsap.from(".stagger-element", {
  duration: 0.8,
  opacity: 0,
  scale: 0.8,
  rotation: 10,
  stagger: {
    amount: 0.5,
    from: "center",
    ease: "power2.inOut"
  }
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replayStagger()">🔄 Replay</button>
  </div>

</div>

---

## 📜 Scroll Triggered Animations {#scroll-triggered}

<div class="component-grid">

  <!-- Scroll Reveal -->
  <div class="component-card">
    <h3 class="component-title">Scroll Reveal</h3>
    <p class="component-description">Elements animate when they enter the viewport during scroll.</p>
    
    <div class="component-demo" id="scroll-reveal-demo" style="height: 120px; overflow-y: auto; border: 1px solid var(--cuba-gray-800);">
      <div style="height: 80px;"></div>
      <div class="scroll-element" style="width: 100px; height: 40px; background-color: var(--cuba-gray-400); border-radius: var(--radius-md); margin: var(--spacing-md) auto;"></div>
      <div style="height: 80px;"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// ScrollTrigger Animation
gsap.registerPlugin(ScrollTrigger);

gsap.from(".element", {
  scrollTrigger: {
    trigger: ".element",
    start: "top 85%",
    end: "bottom 15%",
    toggleActions: "play none none reverse",
    // markers: true // for debugging
  },
  duration: 0.8,
  opacity: 0,
  y: 50,
  ease: "power2.out"
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replayScrollReveal()">🔄 Replay</button>
  </div>

</div>

---

## 🌊 Parallax Effects {#parallax-effects}

<div class="component-grid">

  <!-- Simple Parallax -->
  <div class="component-card">
    <h3 class="component-title">Simple Parallax</h3>
    <p class="component-description">Background elements move at different speeds during scroll.</p>
    
    <div class="component-demo" id="parallax-demo" style="height: 120px; overflow-y: auto; position: relative; border: 1px solid var(--cuba-gray-800);">
      <div class="parallax-bg" style="position: absolute; width: 100%; height: 200px; background: linear-gradient(45deg, var(--cuba-gray-800), var(--cuba-gray-600)); opacity: 0.5;"></div>
      <div style="position: relative; z-index: 2; padding: var(--spacing-lg); color: var(--cuba-white); text-align: center;">
        <h4 style="margin: 0;">PARALLAX CONTENT</h4>
        <p style="margin: var(--spacing-sm) 0 0 0; font-size: 0.875rem;">Scroll to see effect</p>
      </div>
      <div style="height: 100px;"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Simple Parallax Effect
gsap.to(".parallax-bg", {
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  y: "-50%",
  ease: "none"
});

// Multi-layer Parallax
gsap.to(".parallax-slow", {
  scrollTrigger: {
    trigger: ".container",
    scrub: true
  },
  y: "-20%"
});

gsap.to(".parallax-fast", {
  scrollTrigger: {
    trigger: ".container",
    scrub: true
  },
  y: "-80%"
});
```
    </details>
    
    <button class="btn btn-outline" onclick="replayParallax()">🔄 Replay</button>
  </div>

</div>

---

## ⏳ Loading Animations {#loading-animations}

<div class="component-grid">

  <!-- Pulse Loading -->
  <div class="component-card">
    <h3 class="component-title">Pulse Loading</h3>
    <p class="component-description">Smooth pulsing animation for loading states and attention-grabbing elements.</p>
    
    <div class="component-demo" id="pulse-demo">
      <div class="pulse-element" style="width: 60px; height: 60px; background-color: var(--cuba-white); border-radius: 50%;"></div>
    </div>
    
    <details>
      <summary style="cursor: pointer; color: var(--cuba-white); margin-bottom: var(--spacing-md);">📋 View Code</summary>
      
```javascript
// Pulse Animation
gsap.to(".pulse-element", {
  duration: 1.5,
  scale: 1.2,
  opacity: 0.7,
  ease: "power2.inOut",
  yoyo: true,
  repeat: -1
});

// Breathing Effect
gsap.to(".element", {
  duration: 2,
  scale: 1.05,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});
```
    </details>
    
    <button class="btn btn-outline" onclick="togglePulse()">⏸️ Toggle</button>
  </div>

</div>

---

## 🚀 Advanced Animations {#advanced-animations}

{% include advanced-animations.html %}

---

## 🎨 Implementation Guidelines

<div class="alert">
  <h3 style="margin-top: 0;">🎯 Best Practices</h3>
  <ul>
    <li><strong>Performance:</strong> Use `transform` and `opacity` properties for smooth 60fps animations</li>
    <li><strong>Accessibility:</strong> Respect `prefers-reduced-motion` media query</li>
    <li><strong>Timing:</strong> Keep animations between 0.3s - 1.2s for optimal UX</li>
    <li><strong>Easing:</strong> Use `power2.out` for natural feeling animations</li>
    <li><strong>Cleanup:</strong> Always kill animations when components unmount</li>
  </ul>
</div>

### 🔧 Accessibility Implementation

```javascript
// Respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Run animations
  gsap.from(".element", {
    duration: 0.8,
    opacity: 0,
    y: 20
  });
} else {
  // Show elements immediately
  gsap.set(".element", { opacity: 1 });
}
```

### 🎬 Animation Cleanup

```javascript
// Store animation references
const animations = [];

// Create animation
const anim = gsap.from(".element", { /* properties */ });
animations.push(anim);

// Cleanup function
function cleanup() {
  animations.forEach(anim => anim.kill());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}
```

---

## 🚀 Next Steps

<div class="doc-nav">
  <h3>📚 Related Documentation</h3>
  <ul>
    <li><a href="{{ '/gsap-animation-guide/' | relative_url }}">🎬 Complete GSAP Guide</a></li>
    <li><a href="{{ '/component-guide/' | relative_url }}">🧩 Component Documentation</a></li>
    <li><a href="{{ '/technical-architecture/' | relative_url }}">🏗️ Technical Architecture</a></li>
    <li><a href="{{ '/contribution-guide/' | relative_url }}">👥 Contributing Guidelines</a></li>
  </ul>
</div>

<div style="text-align: center; margin: var(--spacing-2xl) 0;">
  <a href="{{ site.cuba.main_site | default: 'https://cubatattoostudio.com' }}" class="btn" target="_blank" rel="noopener">🌐 View Live Implementation</a>
</div>

</div>

<!-- Animation Scripts -->
<script>
// Animation replay functions
function replayFadeIn() {
  const element = document.querySelector('#fade-in-demo .demo-element');
  gsap.fromTo(element, { opacity: 0 }, { duration: 0.8, opacity: 1, ease: "power2.out" });
}

function replayFadeInUp() {
  const element = document.querySelector('#fade-in-up-demo .demo-element');
  gsap.fromTo(element, { opacity: 0, y: 30 }, { duration: 0.8, opacity: 1, y: 0, ease: "power2.out" });
}

function replaySlideLeft() {
  const element = document.querySelector('#slide-left-demo .demo-element');
  gsap.fromTo(element, { x: -100, opacity: 0 }, { duration: 0.8, x: 0, opacity: 1, ease: "power2.out" });
}

function replaySlideRight() {
  const element = document.querySelector('#slide-right-demo .demo-element');
  gsap.fromTo(element, { x: 100, opacity: 0 }, { duration: 0.8, x: 0, opacity: 1, ease: "power2.out" });
}

function replayStagger() {
  const elements = document.querySelectorAll('#stagger-demo .stagger-element');
  gsap.fromTo(elements, { opacity: 0, y: 20 }, { duration: 0.6, opacity: 1, y: 0, stagger: 0.1, ease: "power2.out" });
}

function replayScrollReveal() {
  const element = document.querySelector('#scroll-reveal-demo .scroll-element');
  gsap.fromTo(element, { opacity: 0, y: 20 }, { duration: 0.8, opacity: 1, y: 0, ease: "power2.out" });
}

function replayParallax() {
  const element = document.querySelector('#parallax-demo .parallax-bg');
  gsap.fromTo(element, { y: "0%" }, { duration: 2, y: "-20%", ease: "power2.inOut", yoyo: true, repeat: 1 });
}

let pulseAnimation;
function togglePulse() {
  const element = document.querySelector('#pulse-demo .pulse-element');
  const button = event.target;
  
  if (pulseAnimation && pulseAnimation.isActive()) {
    pulseAnimation.kill();
    gsap.set(element, { scale: 1, opacity: 1 });
    button.textContent = '▶️ Start';
  } else {
    pulseAnimation = gsap.to(element, {
      duration: 1.5,
      scale: 1.2,
      opacity: 0.7,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
    button.textContent = '⏸️ Stop';
  }
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
  // Start pulse animation
  const pulseElement = document.querySelector('#pulse-demo .pulse-element');
  if (pulseElement) {
    pulseAnimation = gsap.to(pulseElement, {
      duration: 1.5,
      scale: 1.2,
      opacity: 0.7,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  }
  
  // Initial animations for demo elements
  gsap.from('.component-card', {
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.2
  });
});
</script>