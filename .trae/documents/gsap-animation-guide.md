# Guía de Animaciones GSAP - Cuba Tattoo Studio

## 🎯 Objetivo

Esta guía detalla la implementación de animaciones GSAP inspiradas en **rockstargames.com/VI**, replicando exactamente la experiencia visual y las transiciones para crear un impacto similar en el sitio de Cuba Tattoo Studio.

## 📋 Índice

1. [Configuración Base](#configuración-base)
2. [Animaciones de Carga](#animaciones-de-carga)
3. [Animaciones de Scroll](#animaciones-de-scroll)
4. [Efectos Parallax](#efectos-parallax)
5. [Micro-interacciones](#micro-interacciones)
6. [Optimización y Performance](#optimización-y-performance)
7. [Ejemplos Prácticos](#ejemplos-prácticos)

## ⚙️ Configuración Base

### Instalación y Setup

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    ssr: {
      external: ['gsap'] // Evitar SSR de GSAP
    }
  }
});
```

### Importaciones Esenciales

```javascript
// En componentes que usen animaciones
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'; // Licencia requerida

// Registrar plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);
```

### Configuración Global

```javascript
// src/utils/gsap-config.js
export const gsapConfig = {
  // Configuración por defecto
  defaults: {
    duration: 1,
    ease: "power2.out"
  },
  
  // Breakpoints para animaciones responsivas
  breakpoints: {
    mobile: "(max-width: 768px)",
    tablet: "(max-width: 1024px)",
    desktop: "(min-width: 1025px)"
  },
  
  // Configuración de ScrollTrigger
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
};
```

## 🚀 Animaciones de Carga

### Secuencia de Carga Principal (Inspirada en GTA VI)

```javascript
// components/animations/LoadingSequence.astro
<script>
  import { gsap } from 'gsap';
  
  // Timeline principal de carga
  const loadingTL = gsap.timeline();
  
  // 1. Pantalla negra inicial
  loadingTL.set('.loading-screen', { opacity: 1 })
  
  // 2. Logo aparece con fade-in
  .fromTo('.logo-loading', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
  )
  
  // 3. Logo se desvanece
  .to('.logo-loading', 
    { opacity: 0, duration: 0.8, delay: 1 }
  )
  
  // 4. Pantalla de carga se desvanece
  .to('.loading-screen', 
    { opacity: 0, duration: 1, ease: "power2.inOut" }
  )
  
  // 5. Hero background aparece con zoom-out
  .fromTo('.hero-background', 
    { scale: 1.1, opacity: 0 },
    { scale: 1, opacity: 1, duration: 2, ease: "power2.out" },
    "-=0.5" // Overlap con animación anterior
  )
  
  // 6. Elementos UI aparecen con stagger
  .fromTo('.ui-element', 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.2, 
      ease: "power2.out" 
    },
    "-=1"
  );
</script>
```

### Logo Animado

```javascript
// Animación del logo CUBA con efecto de escritura
const logoAnimation = () => {
  const letters = document.querySelectorAll('.logo-letter');
  
  gsap.fromTo(letters, 
    { 
      opacity: 0, 
      rotationX: -90,
      transformOrigin: "50% 50% -50px"
    },
    {
      opacity: 1,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)"
    }
  );
};
```

## 📜 Animaciones de Scroll

### Pinning de Secciones (Efecto GTA VI)

```javascript
// components/animations/PinnedSection.astro
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Pinning de la sección hero
  ScrollTrigger.create({
    trigger: ".hero-section",
    start: "top top",
    end: "+=100%", // Duración del pin
    pin: true,
    pinSpacing: false,
    
    onUpdate: (self) => {
      // Efecto de parallax en el contenido superpuesto
      const progress = self.progress;
      gsap.set('.hero-overlay-content', {
        y: progress * 100
      });
    }
  });
  
  // Animación del contenido superpuesto
  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 1 // Sincronizado con scroll
    }
  })
  .to('.hero-title', {
    y: -100,
    opacity: 0.5,
    scale: 0.9
  })
  .to('.hero-subtitle', {
    y: -150,
    opacity: 0
  }, 0.2);
</script>
```

### Revelado Escalonado (Stagger Reveal)

```javascript
// Revelado de secciones con stagger
const createStaggerReveal = (selector, options = {}) => {
  const defaults = {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
  };
  
  const config = { ...defaults, ...options };
  
  gsap.fromTo(selector, 
    { 
      y: config.y, 
      opacity: config.opacity 
    },
    {
      y: 0,
      opacity: 1,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

// Uso
createStaggerReveal('.artist-card');
createStaggerReveal('.portfolio-item', { stagger: 0.1 });
```

### Transiciones de Página

```javascript
// Transición suave entre páginas
const pageTransition = {
  enter: (element) => {
    return gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  },
  
  leave: (element) => {
    return gsap.to(element, 
      { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" }
    );
  }
};
```

## 🌊 Efectos Parallax

### Parallax Vertical

```javascript
// components/animations/ParallaxContainer.astro
<script>
  const createParallax = (element, speed = 0.5) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  };
  
  // Aplicar a elementos de fondo
  document.querySelectorAll('.parallax-bg').forEach(el => {
    createParallax(el, 0.5);
  });
  
  // Parallax más lento para elementos lejanos
  document.querySelectorAll('.parallax-far').forEach(el => {
    createParallax(el, 0.2);
  });
</script>
```

### Parallax Horizontal

```javascript
// Efecto de parallax horizontal para galerías
const horizontalParallax = () => {
  const container = document.querySelector('.horizontal-scroll');
  const items = container.querySelectorAll('.scroll-item');
  
  gsap.to(items, {
    xPercent: -100 * (items.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (items.length - 1),
      end: () => "+=" + container.offsetWidth
    }
  });
};
```

## 🎭 Micro-interacciones

### Hover Effects

```javascript
// Efectos hover para cards de artistas
const setupHoverEffects = () => {
  document.querySelectorAll('.artist-card').forEach(card => {
    const image = card.querySelector('.artist-image');
    const overlay = card.querySelector('.artist-overlay');
    
    // Timeline para hover
    const hoverTL = gsap.timeline({ paused: true });
    
    hoverTL
      .to(image, { scale: 1.1, duration: 0.4, ease: "power2.out" })
      .to(overlay, { opacity: 1, duration: 0.3 }, 0)
      .fromTo('.artist-info', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.1 },
        0.1
      );
    
    // Event listeners
    card.addEventListener('mouseenter', () => hoverTL.play());
    card.addEventListener('mouseleave', () => hoverTL.reverse());
  });
};
```

### Button Interactions

```javascript
// Animaciones de botones
const setupButtonAnimations = () => {
  document.querySelectorAll('.btn-animated').forEach(btn => {
    const ripple = btn.querySelector('.btn-ripple');
    
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gsap.set(ripple, { x, y, scale: 0 });
      gsap.to(ripple, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  });
};
```

### Loading States

```javascript
// Animación de loading para formularios
const createLoadingAnimation = (button) => {
  const spinner = button.querySelector('.loading-spinner');
  const text = button.querySelector('.btn-text');
  
  const loadingTL = gsap.timeline();
  
  loadingTL
    .to(text, { opacity: 0, duration: 0.2 })
    .set(spinner, { display: 'block' })
    .fromTo(spinner, 
      { rotation: 0, scale: 0 },
      { rotation: 360, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    )
    .to(spinner, {
      rotation: "+=360",
      duration: 1,
      repeat: -1,
      ease: "none"
    });
  
  return loadingTL;
};
```

## ⚡ Optimización y Performance

### Configuración de Performance

```javascript
// Configuración optimizada de GSAP
gsap.config({
  force3D: true,        // Forzar aceleración 3D
  nullTargetWarn: false // Evitar warnings en desarrollo
});

// Configuración de ScrollTrigger
ScrollTrigger.config({
  limitCallbacks: true, // Limitar callbacks para mejor performance
  syncInterval: 150     // Intervalo de sincronización
});
```

### Lazy Loading de Animaciones

```javascript
// Cargar animaciones solo cuando son necesarias
const lazyLoadAnimation = (element, animationFunction) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animationFunction(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(element);
};

// Uso
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  lazyLoadAnimation(el, createStaggerReveal);
});
```

### Cleanup de Animaciones

```javascript
// Limpieza de animaciones al cambiar de página
const cleanupAnimations = () => {
  // Matar todas las animaciones activas
  gsap.killTweensOf("*");
  
  // Limpiar ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Resetear elementos animados
  gsap.set("*", { clearProps: "all" });
};

// Ejecutar cleanup antes de navegación
window.addEventListener('beforeunload', cleanupAnimations);
```

## 💡 Ejemplos Prácticos

### Homepage Hero Section

```astro
---
// pages/index.astro
---

<section class="hero-section relative h-screen overflow-hidden">
  <!-- Loading Screen -->
  <div class="loading-screen fixed inset-0 bg-cuba-black z-50 flex items-center justify-center">
    <div class="logo-loading">
      <h1 class="text-8xl font-heading text-cuba-white">
        <span class="logo-letter">C</span>
        <span class="logo-letter">U</span>
        <span class="logo-letter">B</span>
        <span class="logo-letter">A</span>
      </h1>
    </div>
  </div>
  
  <!-- Hero Background -->
  <div class="hero-background absolute inset-0">
    <img src="/images/hero-bg.jpg" alt="" class="w-full h-full object-cover" />
  </div>
  
  <!-- Hero Content -->
  <div class="hero-overlay-content absolute inset-0 flex flex-col justify-center items-center text-center">
    <h1 class="hero-title text-6xl md:text-8xl font-heading text-cuba-white mb-4 ui-element">
      CUBA TATTOO STUDIO
    </h1>
    <p class="hero-subtitle text-xl text-cuba-gray-400 mb-8 ui-element">
      Arte corporal de alta calidad en Albuquerque
    </p>
    <button class="btn-primary ui-element">
      Reservar Cita
    </button>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Ejecutar secuencia de carga
  document.addEventListener('DOMContentLoaded', () => {
    // ... código de animación aquí
  });
</script>
```

### Portfolio Grid Animado

```astro
---
// components/gallery/AnimatedPortfolioGrid.astro
---

<div class="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {portfolioItems.map((item, index) => (
    <div class="portfolio-item opacity-0" data-index={index}>
      <img src={item.image} alt={item.title} class="w-full h-64 object-cover" />
      <div class="portfolio-overlay absolute inset-0 bg-cuba-black bg-opacity-80 opacity-0 flex items-center justify-center">
        <h3 class="text-cuba-white text-xl font-heading">{item.title}</h3>
      </div>
    </div>
  ))}
</div>

<script>
  // Animación de aparición escalonada
  gsap.fromTo('.portfolio-item', 
    { opacity: 0, y: 50, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );
  
  // Hover effects
  document.querySelectorAll('.portfolio-item').forEach(item => {
    const overlay = item.querySelector('.portfolio-overlay');
    
    item.addEventListener('mouseenter', () => {
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    });
  });
</script>
```

### Formulario con Validación Animada

```astro
---
// components/forms/AnimatedBookingForm.astro
---

<form class="booking-form space-y-6">
  <div class="form-group">
    <input type="text" class="form-input" placeholder=" " required />
    <label class="form-label">Nombre Completo</label>
    <div class="form-error opacity-0">Este campo es requerido</div>
  </div>
  
  <button type="submit" class="btn-submit">
    <span class="btn-text">Enviar Solicitud</span>
    <div class="loading-spinner hidden">⟳</div>
  </button>
</form>

<script>
  // Animación de labels flotantes
  document.querySelectorAll('.form-input').forEach(input => {
    const label = input.nextElementSibling;
    
    input.addEventListener('focus', () => {
      gsap.to(label, {
        y: -25,
        scale: 0.8,
        color: '#FFFFFF',
        duration: 0.3
      });
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        gsap.to(label, {
          y: 0,
          scale: 1,
          color: '#A0A0A0',
          duration: 0.3
        });
      }
    });
  });
  
  // Validación con animación
  const showError = (input) => {
    const error = input.parentNode.querySelector('.form-error');
    gsap.to(error, { opacity: 1, y: 0, duration: 0.3 });
    gsap.to(input, { borderColor: '#FF0000', duration: 0.3 });
  };
</script>
```

## 🎯 Checklist de Implementación

### Animaciones Obligatorias

- [ ] ✅ Secuencia de carga con logo animado
- [ ] ✅ Hero background con zoom-out
- [ ] ✅ Elementos UI con stagger fade-in
- [ ] ✅ Pinning de sección hero
- [ ] ✅ Revelado escalonado en scroll
- [ ] ✅ Efectos parallax en backgrounds
- [ ] ✅ Hover effects en cards de artistas
- [ ] ✅ Transiciones suaves entre páginas
- [ ] ✅ Micro-interacciones en botones
- [ ] ✅ Animaciones de formulario

### Performance Checklist

- [ ] ✅ GSAP configurado para SSR
- [ ] ✅ Plugins registrados correctamente
- [ ] ✅ Animaciones optimizadas para 60fps
- [ ] ✅ Cleanup de animaciones implementado
- [ ] ✅ Lazy loading de animaciones pesadas
- [ ] ✅ Responsive animations configuradas
- [ ] ✅ Fallbacks para dispositivos lentos

### Testing

- [ ] ✅ Animaciones funcionan en todos los navegadores
- [ ] ✅ Performance > 60fps en dispositivos móviles
- [ ] ✅ Accesibilidad respetada (prefers-reduced-motion)
- [ ] ✅ No hay memory leaks en navegación
- [ ] ✅ Animaciones se pausan cuando no están visibles