# ⚡ Guía de Performance y Optimización

## Cuba Tattoo Studio - Performance Optimization Guide

---

## 📋 Índice

1. [Métricas de Performance](#-métricas-de-performance)
2. [Optimización de Imágenes](#-optimización-de-imágenes)
3. [Optimización de GSAP](#-optimización-de-gsap)
4. [Optimización de CSS](#-optimización-de-css)
5. [Optimización de JavaScript](#-optimización-de-javascript)
6. [Optimización de Fonts](#-optimización-de-fonts)
7. [Lazy Loading](#-lazy-loading)
8. [Caching Strategies](#-caching-strategies)
9. [Bundle Optimization](#-bundle-optimization)
10. [Monitoring y Testing](#-monitoring-y-testing)

---

## 📊 Métricas de Performance

### Core Web Vitals Objetivos

```javascript
// Objetivos de performance para Cuba Tattoo Studio
const PERFORMANCE_TARGETS = {
  // Largest Contentful Paint - Tiempo hasta que el contenido principal carga
  LCP: {
    good: 2500,      // < 2.5s
    needsWork: 4000, // 2.5s - 4s
    poor: 4000       // > 4s
  },
  
  // First Input Delay - Tiempo hasta que la página responde a interacción
  FID: {
    good: 100,       // < 100ms
    needsWork: 300,  // 100ms - 300ms
    poor: 300        // > 300ms
  },
  
  // Cumulative Layout Shift - Estabilidad visual
  CLS: {
    good: 0.1,       // < 0.1
    needsWork: 0.25, // 0.1 - 0.25
    poor: 0.25       // > 0.25
  },
  
  // First Contentful Paint
  FCP: {
    good: 1800,      // < 1.8s
    needsWork: 3000, // 1.8s - 3s
    poor: 3000       // > 3s
  },
  
  // Time to Interactive
  TTI: {
    good: 3800,      // < 3.8s
    needsWork: 7300, // 3.8s - 7.3s
    poor: 7300       // > 7.3s
  }
};
```

### Implementación de Web Vitals Monitoring

```javascript
// utils/performance-monitor.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    // Recopilar métricas
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
    
    // Métricas personalizadas
    this.measureCustomMetrics();
  }
  
  handleMetric(metric) {
    this.metrics[metric.name] = metric;
    
    // Enviar a Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        custom_map: {
          metric_rating: this.getRating(metric.name, metric.value)
        }
      });
    }
    
    // Log para debugging
    console.log(`${metric.name}: ${metric.value}`, this.getRating(metric.name, metric.value));
  }
  
  getRating(metricName, value) {
    const targets = PERFORMANCE_TARGETS[metricName];
    if (!targets) return 'unknown';
    
    if (value <= targets.good) return 'good';
    if (value <= targets.needsWork) return 'needs-improvement';
    return 'poor';
  }
  
  measureCustomMetrics() {
    // Tiempo de carga de GSAP
    const gsapLoadStart = performance.now();
    import('gsap').then(() => {
      const gsapLoadTime = performance.now() - gsapLoadStart;
      this.logCustomMetric('gsap_load_time', gsapLoadTime);
    });
    
    // Tiempo hasta primera animación
    window.addEventListener('gsap-first-animation', (e) => {
      this.logCustomMetric('first_animation_time', e.detail.time);
    });
    
    // Tiempo de carga de imágenes del portfolio
    this.measureImageLoadTimes();
  }
  
  measureImageLoadTimes() {
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    let loadedImages = 0;
    const startTime = performance.now();
    
    portfolioImages.forEach((img, index) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === portfolioImages.length) {
            const totalTime = performance.now() - startTime;
            this.logCustomMetric('portfolio_images_load_time', totalTime);
          }
        });
      }
    });
  }
  
  logCustomMetric(name, value) {
    console.log(`Custom Metric - ${name}: ${value}ms`);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'custom_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  }
  
  getReport() {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }
}

// Inicializar monitor
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
```

---

## 🖼️ Optimización de Imágenes

### Configuración de Astro Image

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { imageService } from '@astrojs/image/squoosh';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/squoosh',
      cacheDir: './.cache/image',
      logLevel: 'info'
    })
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          }
        }
      }
    }
  }
});
```

### Componente de Imagen Optimizada

```astro
---
// components/OptimizedImage.astro
import { Image } from '@astrojs/image/components';

export interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  class?: string;
  sizes?: string;
}

const { 
  src, 
  alt, 
  width, 
  height, 
  loading = 'lazy', 
  priority = false,
  class: className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
} = Astro.props;

// Generar múltiples tamaños para responsive
const responsiveSizes = [
  Math.round(width * 0.5),  // 50%
  Math.round(width * 0.75), // 75%
  width,                    // 100%
  Math.round(width * 1.5),  // 150% para pantallas de alta densidad
];
---

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  widths={responsiveSizes}
  sizes={sizes}
  loading={priority ? 'eager' : loading}
  format="webp"
  fallbackFormat="jpg"
  quality={85}
  class={`optimized-image ${className}`}
  style="aspect-ratio: auto;"
/>

<style>
  .optimized-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .optimized-image:hover {
    transform: scale(1.02);
  }
  
  /* Prevenir layout shift */
  .optimized-image[loading="lazy"] {
    content-visibility: auto;
  }
</style>
```

### Script de Optimización de Imágenes

```bash
#!/bin/bash
# scripts/optimize-images.sh

echo "🖼️  Optimizando imágenes para Cuba Tattoo Studio..."

# Crear directorios
mkdir -p public/images/optimized/{portfolio,artists,hero,thumbnails}

# Función para optimizar una imagen
optimize_image() {
    local input=$1
    local output_dir=$2
    local filename=$(basename "$input" | sed 's/\.[^.]*$//')
    local extension="${input##*.}"
    
    echo "Procesando: $input"
    
    # Generar múltiples tamaños
    # Thumbnail (400px)
    convert "$input" -resize 400x400^ -gravity center -extent 400x400 -quality 85 "$output_dir/${filename}-400.jpg"
    cwebp -q 85 "$output_dir/${filename}-400.jpg" -o "$output_dir/${filename}-400.webp"
    
    # Medium (800px)
    convert "$input" -resize 800x800^ -gravity center -extent 800x800 -quality 85 "$output_dir/${filename}-800.jpg"
    cwebp -q 85 "$output_dir/${filename}-800.jpg" -o "$output_dir/${filename}-800.webp"
    
    # Large (1200px)
    convert "$input" -resize 1200x1200^ -gravity center -extent 1200x1200 -quality 85 "$output_dir/${filename}-1200.jpg"
    cwebp -q 85 "$output_dir/${filename}-1200.jpg" -o "$output_dir/${filename}-1200.webp"
    
    # Extra Large (1600px) - solo para hero
    if [[ $output_dir == *"hero"* ]]; then
        convert "$input" -resize 1600x1600^ -gravity center -extent 1600x1600 -quality 90 "$output_dir/${filename}-1600.jpg"
        cwebp -q 90 "$output_dir/${filename}-1600.jpg" -o "$output_dir/${filename}-1600.webp"
    fi
    
    echo "✅ Completado: $filename"
}

# Optimizar imágenes del portfolio
for img in public/images/portfolio/*.{jpg,jpeg,png}; do
    [ -f "$img" ] && optimize_image "$img" "public/images/optimized/portfolio"
done

# Optimizar imágenes de artistas
for img in public/images/artists/*.{jpg,jpeg,png}; do
    [ -f "$img" ] && optimize_image "$img" "public/images/optimized/artists"
done

# Optimizar imágenes hero
for img in public/images/hero/*.{jpg,jpeg,png}; do
    [ -f "$img" ] && optimize_image "$img" "public/images/optimized/hero"
done

echo "🎉 Optimización de imágenes completada!"

# Generar reporte de tamaños
echo "📊 Reporte de tamaños:"
echo "Original:"
du -sh public/images/portfolio/ public/images/artists/ public/images/hero/ 2>/dev/null | grep -v "No such file"
echo "Optimizado:"
du -sh public/images/optimized/ 2>/dev/null
```

---

## ✨ Optimización de GSAP

### Configuración Optimizada de GSAP

```javascript
// utils/gsap-config.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins solo cuando se necesiten
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Configuración optimizada
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
    trialWarn: false
  });
  
  // Configuración de ScrollTrigger para mejor performance
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true
  });
  
  // Optimizar para dispositivos de baja potencia
  if (navigator.hardwareConcurrency <= 4) {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });
  }
}

export { gsap, ScrollTrigger };
```

### Animaciones Optimizadas

```javascript
// utils/optimized-animations.js
import { gsap, ScrollTrigger } from './gsap-config.js';

class OptimizedAnimations {
  constructor() {
    this.animations = new Map();
    this.observers = new Map();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Animación de entrada optimizada
  fadeInUp(elements, options = {}) {
    if (this.isReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }
    
    const defaults = {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
      stagger: 0.1
    };
    
    const config = { ...defaults, ...options };
    
    // Usar will-change para optimizar rendering
    gsap.set(elements, { willChange: 'transform, opacity' });
    
    const tl = gsap.timeline({
      onComplete: () => {
        // Limpiar will-change después de la animación
        gsap.set(elements, { willChange: 'auto' });
      }
    });
    
    tl.fromTo(elements, 
      { opacity: 0, y: config.y },
      {
        opacity: 1,
        y: 0,
        duration: config.duration,
        ease: config.ease,
        stagger: config.stagger
      }
    );
    
    return tl;
  }
  
  // ScrollTrigger optimizado con Intersection Observer fallback
  createScrollAnimation(element, animation, options = {}) {
    if (this.isReducedMotion) {
      animation.progress(1);
      return;
    }
    
    // Usar Intersection Observer para elementos fuera del viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Crear ScrollTrigger solo cuando el elemento es visible
            this.createScrollTrigger(element, animation, options);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });
      
      observer.observe(element);
      this.observers.set(element, observer);
    } else {
      // Fallback para navegadores sin Intersection Observer
      this.createScrollTrigger(element, animation, options);
    }
  }
  
  createScrollTrigger(element, animation, options) {
    const st = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      animation: animation,
      toggleActions: 'play none none reverse',
      ...options
    });
    
    this.animations.set(element, st);
  }
  
  // Parallax optimizado
  createParallax(element, speed = 0.5) {
    if (this.isReducedMotion) return;
    
    // Solo crear parallax en desktop
    if (window.innerWidth < 768) return;
    
    gsap.set(element, { willChange: 'transform' });
    
    const st = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const y = self.progress * speed * 100;
        gsap.set(element, { y: `${y}px` });
      },
      onToggle: (self) => {
        if (!self.isActive) {
          gsap.set(element, { willChange: 'auto' });
        }
      }
    });
    
    this.animations.set(element, st);
  }
  
  // Limpiar animaciones para prevenir memory leaks
  cleanup() {
    this.animations.forEach(animation => {
      if (animation.kill) animation.kill();
    });
    
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    this.animations.clear();
    this.observers.clear();
    
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
  
  // Refresh optimizado
  refresh() {
    // Debounce refresh calls
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    this.refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
}

// Instancia global
const optimizedAnimations = new OptimizedAnimations();

// Cleanup automático
window.addEventListener('beforeunload', () => {
  optimizedAnimations.cleanup();
});

export default optimizedAnimations;
```

---

## 🎨 Optimización de CSS

### Configuración Tailwind Optimizada

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      // Solo definir lo que realmente usamos
      colors: {
        'cuba': {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            400: '#A0A0A0',
            600: '#525252'
          }
        }
      },
      fontFamily: {
        'heading': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      // Animaciones optimizadas
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [
    // Plugin personalizado para utilidades de performance
    function({ addUtilities }) {
      const newUtilities = {
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'will-change': 'transform'
        },
        '.smooth-scroll': {
          'scroll-behavior': 'smooth'
        },
        '.content-visibility-auto': {
          'content-visibility': 'auto'
        },
        '.contain-layout': {
          'contain': 'layout'
        },
        '.contain-paint': {
          'contain': 'paint'
        }
      };
      
      addUtilities(newUtilities);
    }
  ],
  // Purge agresivo para producción
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
      './public/**/*.html'
    ],
    options: {
      safelist: [
        // Clases que se generan dinámicamente
        /^gsap-/,
        /^portfolio-/,
        /^artist-/
      ]
    }
  }
};
```

### CSS Crítico

```css
/* styles/critical.css - CSS crítico que se inlinea */

/* Reset mínimo */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Variables CSS para mejor performance */
:root {
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-400: #a0a0a0;
  --color-gray-600: #525252;
  
  --font-heading: 'Bebas Neue', 'Arial Black', sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
}

/* Estilos base críticos */
html {
  font-family: var(--font-body);
  background-color: var(--color-black);
  color: var(--color-white);
  scroll-behavior: smooth;
}

body {
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Optimizaciones de rendering */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

.contain-layout {
  contain: layout;
}

.contain-paint {
  contain: paint;
}

/* Hero section crítico */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  contain: layout paint;
}

/* Loading spinner crítico */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-600);
  border-top: 3px solid var(--color-white);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  will-change: transform;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Prevenir layout shift */
.aspect-ratio-16-9 {
  aspect-ratio: 16 / 9;
}

.aspect-ratio-1-1 {
  aspect-ratio: 1 / 1;
}

.aspect-ratio-4-3 {
  aspect-ratio: 4 / 3;
}
```

---

## 📦 Optimización de JavaScript

### Code Splitting Estratégico

```javascript
// utils/lazy-loader.js
class LazyLoader {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }
  
  // Cargar GSAP solo cuando se necesite
  async loadGSAP() {
    if (this.loadedModules.has('gsap')) {
      return this.loadedModules.get('gsap');
    }
    
    if (this.loadingPromises.has('gsap')) {
      return this.loadingPromises.get('gsap');
    }
    
    const loadPromise = import('gsap').then(module => {
      this.loadedModules.set('gsap', module);
      this.loadingPromises.delete('gsap');
      return module;
    });
    
    this.loadingPromises.set('gsap', loadPromise);
    return loadPromise;
  }
  
  // Cargar ScrollTrigger solo cuando se necesite
  async loadScrollTrigger() {
    if (this.loadedModules.has('scrolltrigger')) {
      return this.loadedModules.get('scrolltrigger');
    }
    
    const [gsapModule, scrollTriggerModule] = await Promise.all([
      this.loadGSAP(),
      import('gsap/ScrollTrigger')
    ]);
    
    gsapModule.gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
    this.loadedModules.set('scrolltrigger', scrollTriggerModule);
    
    return scrollTriggerModule;
  }
  
  // Cargar componentes de forma lazy
  async loadComponent(componentName) {
    if (this.loadedModules.has(componentName)) {
      return this.loadedModules.get(componentName);
    }
    
    try {
      const module = await import(`../components/${componentName}.js`);
      this.loadedModules.set(componentName, module);
      return module;
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      throw error;
    }
  }
  
  // Preload crítico
  preloadCritical() {
    // Precargar GSAP si estamos en la homepage
    if (window.location.pathname === '/') {
      this.loadGSAP();
    }
    
    // Precargar componentes críticos
    const criticalComponents = ['Navigation', 'Hero'];
    criticalComponents.forEach(component => {
      this.loadComponent(component).catch(() => {
        // Silently fail for non-critical preloads
      });
    });
  }
}

const lazyLoader = new LazyLoader();
export default lazyLoader;
```

### Debouncing y Throttling

```javascript
// utils/performance-helpers.js

// Debounce para eventos que no necesitan ejecutarse inmediatamente
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

// Throttle para eventos que necesitan ejecutarse regularmente
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// RequestAnimationFrame throttle para animaciones
export function rafThrottle(func) {
  let rafId = null;
  return function(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
}

// Intersection Observer helper
export function createIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const config = { ...defaultOptions, ...options };
  
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, config);
  } else {
    // Fallback para navegadores sin soporte
    console.warn('IntersectionObserver not supported');
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }
}

// Idle callback helper
export function runWhenIdle(callback, timeout = 5000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // Fallback
    setTimeout(callback, 1);
  }
}
```

---

## 🔤 Optimización de Fonts

### Estrategia de Carga de Fuentes

```html
<!-- En Layout.astro -->
<head>
  <!-- Preconnect a Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload de fuentes críticas -->
  <link rel="preload" href="/fonts/bebas-neue-v2-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/inter-v12-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Google Fonts con display=swap -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Fallback fonts -->
  <style>
    /* Fallback mientras cargan las fuentes */
    .font-heading {
      font-family: 'Bebas Neue', 'Arial Black', 'Arial Narrow', sans-serif;
      font-display: swap;
    }
    
    .font-body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-display: swap;
    }
    
    /* Prevenir layout shift con font-size-adjust */
    .font-heading {
      font-size-adjust: 0.5;
    }
    
    .font-body {
      font-size-adjust: 0.47;
    }
  </style>
</head>
```

### Self-hosted Fonts (Alternativa)

```css
/* styles/fonts.css */

/* Bebas Neue */
@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/bebas-neue-v2-latin-regular.woff2') format('woff2'),
       url('/fonts/bebas-neue-v2-latin-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Inter Regular */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2'),
       url('/fonts/inter-v12-latin-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Inter Medium */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v12-latin-500.woff2') format('woff2'),
       url('/fonts/inter-v12-latin-500.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Inter SemiBold */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v12-latin-600.woff2') format('woff2'),
       url('/fonts/inter-v12-latin-600.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

---

## 🔄 Lazy Loading

### Lazy Loading de Imágenes

```javascript
// utils/lazy-loading.js
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver(
        this.handleImageIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
      
      this.observeImages();
    } else {
      // Fallback: cargar todas las imágenes inmediatamente
      this.loadAllImages();
    }
  }
  
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }
  
  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        this.imageObserver.unobserve(img);
      }
    });
  }
  
  loadImage(img) {
    // Crear imagen temporal para precargar
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Aplicar efecto de fade-in
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      // Cambiar src
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      
      // Fade in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
      
      // Limpiar después de la transición
      setTimeout(() => {
        img.style.transition = '';
      }, 300);
    };
    
    tempImg.onerror = () => {
      // Fallback en caso de error
      img.src = '/images/placeholder.jpg';
      img.removeAttribute('data-src');
    };
    
    // Iniciar carga
    tempImg.src = img.dataset.src;
  }
  
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.loadImage(img);
    });
  }
  
  // Método para agregar nuevas imágenes dinámicamente
  observeNewImages(container) {
    if (!this.imageObserver) return;
    
    const newImages = container.querySelectorAll('img[data-src]');
    newImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }
  
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }
}

// Inicializar lazy loading
const lazyImageLoader = new LazyImageLoader();
export default lazyImageLoader;
```

### Lazy Loading de Componentes

```javascript
// utils/component-lazy-loader.js
class ComponentLazyLoader {
  constructor() {
    this.componentObserver = null;
    this.loadedComponents = new Set();
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.componentObserver = new IntersectionObserver(
        this.handleComponentIntersection.bind(this),
        {
          rootMargin: '100px 0px',
          threshold: 0
        }
      );
      
      this.observeComponents();
    }
  }
  
  observeComponents() {
    const lazyComponents = document.querySelectorAll('[data-lazy-component]');
    lazyComponents.forEach(element => {
      this.componentObserver.observe(element);
    });
  }
  
  async handleComponentIntersection(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const element = entry.target;
        const componentName = element.dataset.lazyComponent;
        
        if (!this.loadedComponents.has(componentName)) {
          await this.loadComponent(element, componentName);
          this.loadedComponents.add(componentName);
        }
        
        this.componentObserver.unobserve(element);
      }
    }
  }
  
  async loadComponent(element, componentName) {
    try {
      // Mostrar loading
      element.innerHTML = '<div class="loading-spinner"></div>';
      
      // Cargar componente
      const module = await import(`../components/${componentName}.js`);
      const Component = module.default;
      
      // Inicializar componente
      const instance = new Component(element);
      await instance.init();
      
      // Remover loading
      element.classList.add('component-loaded');
      
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      element.innerHTML = '<div class="error-message">Error loading component</div>';
    }
  }
}

const componentLazyLoader = new ComponentLazyLoader();
export default componentLazyLoader;
```

---

## 💾 Caching Strategies

### Service Worker para Caching

```javascript
// public/sw.js
const CACHE_NAME = 'cuba-tattoo-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Recursos para cachear inmediatamente
const STATIC_ASSETS = [
  '/',
  '/artistas',
  '/portfolio',
  '/estudio',
  '/reservas',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/fonts/bebas-neue-v2-latin-regular.woff2',
  '/fonts/inter-v12-latin-regular.woff2',
  '/images/logo.svg',
  '/images/hero-bg.jpg'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo cachear requests GET
  if (request.method !== 'GET') return;
  
  // Estrategia para diferentes tipos de recursos
  if (STATIC_ASSETS.includes(url.pathname)) {
    // Cache First para recursos estáticos
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/images/')) {
    // Cache First para imágenes
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    // Network First para APIs
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate para páginas
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);
  
  return cachedResponse || networkResponsePromise;
}
```

### Registro del Service Worker

```javascript
// utils/sw-register.js
class ServiceWorkerManager {
  constructor() {
    this.swRegistration = null;
    this.init();
  }
  
  async init() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Escuchar actualizaciones
        this.swRegistration.addEventListener('updatefound', () => {
          this.handleUpdate();
        });
        
        // Verificar actualizaciones periódicamente
        setInterval(() => {
          this.swRegistration.update();
        }, 60000); // Cada minuto
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }
  
  handleUpdate() {
    const newWorker = this.swRegistration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Mostrar notificación de actualización disponible
        this.showUpdateNotification();
      }
    });
  }
  
  showUpdateNotification() {
    // Crear notificación personalizada
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <p>Nueva versión disponible</p>
        <button id="update-btn">Actualizar</button>
        <button id="dismiss-btn">Más tarde</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Manejar clicks
    document.getElementById('update-btn').addEventListener('click', () => {
      this.applyUpdate();
    });
    
    document.getElementById('dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });
  }
  
  applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
}

// Inicializar Service Worker
const swManager = new ServiceWorkerManager();
export default swManager;
```

---

## 📊 Monitoring y Testing

### Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/artistas',
        'http://localhost:3000/portfolio',
        'http://localhost:3000/estudio',
        'http://localhost:3000/reservas'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### Performance Testing Script

```bash
#!/bin/bash
# scripts/performance-test.sh

echo "🚀 Iniciando tests de performance..."

# Build del proyecto
echo "📦 Building project..."
pnpm run build

# Iniciar servidor de preview
echo "🌐 Starting preview server..."
pnpm run preview &
SERVER_PID=$!

# Esperar a que el servidor esté listo
sleep 5

# Ejecutar Lighthouse CI
echo "🔍 Running Lighthouse CI..."
npx lhci autorun

# Ejecutar tests de bundle size
echo "📊 Analyzing bundle size..."
npx bundlesize

# Ejecutar tests de accesibilidad
echo "♿ Running accessibility tests..."
npx pa11y http://localhost:3000
npx pa11y http://localhost:3000/artistas
npx pa11y http://localhost:3000/portfolio

# Detener servidor
kill $SERVER_PID

echo "✅ Performance tests completed!"
```

### Bundle Size Monitoring

```json
// package.json - bundlesize configuration
{
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "100kb",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/*.css",
      "maxSize": "50kb",
      "compression": "gzip"
    },
    {
      "path": "./dist/images/**/*.{jpg,jpeg,png,webp}",
      "maxSize": "500kb"
    }
  ]
}
```

---

## 📈 Performance Budget

### Presupuesto de Performance

```javascript
// performance-budget.js
const PERFORMANCE_BUDGET = {
  // Métricas de tiempo (en milisegundos)
  timing: {
    firstContentfulPaint: 1800,
    largestContentfulPaint: 2500,
    firstInputDelay: 100,
    timeToInteractive: 3800,
    totalBlockingTime: 300
  },
  
  // Métricas de tamaño (en KB)
  resourceSizes: {
    totalJavaScript: 150,
    totalCSS: 50,
    totalImages: 1000,
    totalFonts: 100,
    totalHTML: 30
  },
  
  // Métricas de cantidad
  resourceCounts: {
    totalRequests: 50,
    javascriptRequests: 10,
    cssRequests: 5,
    imageRequests: 30,
    fontRequests: 4
  },
  
  // Core Web Vitals
  coreWebVitals: {
    cumulativeLayoutShift: 0.1,
    largestContentfulPaint: 2500,
    firstInputDelay: 100
  }
};

export default PERFORMANCE_BUDGET;
```

---

*Esta guía debe revisarse y actualizarse regularmente para mantener la performance óptima del sitio web.*