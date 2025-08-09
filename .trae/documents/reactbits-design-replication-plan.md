# 🎨 Plan de Replicación del Diseño ReactBits.dev
## Documentación Cuba Tattoo Studio

---

## 1. Análisis del Diseño Visual de ReactBits.dev

### 1.1 Paleta de Colores Principal

Basándome en el análisis de reactbits.dev, la paleta de colores sigue un esquema oscuro moderno:

```css
/* Colores Principales ReactBits.dev */
:root {
  /* Fondos */
  --bg-primary: #0a0a0a;        /* Negro profundo */
  --bg-secondary: #111111;      /* Negro suave */
  --bg-card: #1a1a1a;          /* Tarjetas */
  --bg-hover: #222222;         /* Estados hover */
  
  /* Textos */
  --text-primary: #ffffff;      /* Texto principal */
  --text-secondary: #a1a1aa;    /* Texto secundario */
  --text-muted: #71717a;        /* Texto deshabilitado */
  
  /* Acentos */
  --accent-primary: #3b82f6;    /* Azul principal */
  --accent-secondary: #8b5cf6;  /* Púrpura */
  --accent-success: #10b981;    /* Verde éxito */
  --accent-warning: #f59e0b;    /* Amarillo advertencia */
  
  /* Bordes */
  --border-primary: #27272a;    /* Bordes principales */
  --border-secondary: #3f3f46;  /* Bordes secundarios */
}
```

### 1.2 Tipografía Sistema

```css
/* Sistema Tipográfico ReactBits.dev */
:root {
  /* Fuentes Principales */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Tamaños de Fuente */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  
  /* Pesos de Fuente */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 1.3 Sistema de Espaciado y Layout

```css
/* Sistema de Espaciado ReactBits.dev */
:root {
  /* Espaciado */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Radios de Borde */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## 2. Estructura de Componentes Gráficos

### 2.1 Componentes de Navegación

#### Header Principal
```html
<!-- Estructura del Header ReactBits.dev -->
<header class="header-main">
  <div class="container">
    <div class="nav-brand">
      <img src="logo.svg" alt="Cuba Tattoo Studio" class="logo">
    </div>
    <nav class="nav-primary">
      <a href="/" class="nav-link active">Home</a>
      <a href="/components" class="nav-link">Components</a>
      <a href="/animations" class="nav-link">Animations</a>
      <a href="/gallery" class="nav-link">Gallery</a>
    </nav>
    <div class="nav-actions">
      <button class="btn-theme-toggle">🌙</button>
      <a href="/github" class="btn-secondary">GitHub</a>
    </div>
  </div>
</header>
```

#### Navegación Lateral
```html
<!-- Sidebar Navigation -->
<aside class="sidebar">
  <div class="sidebar-section">
    <h3 class="sidebar-title">Getting Started</h3>
    <ul class="sidebar-menu">
      <li><a href="/setup" class="sidebar-link">Setup</a></li>
      <li><a href="/installation" class="sidebar-link">Installation</a></li>
    </ul>
  </div>
  <div class="sidebar-section">
    <h3 class="sidebar-title">Components</h3>
    <ul class="sidebar-menu">
      <li><a href="/buttons" class="sidebar-link">Buttons</a></li>
      <li><a href="/cards" class="sidebar-link">Cards</a></li>
      <li><a href="/modals" class="sidebar-link">Modals</a></li>
    </ul>
  </div>
</aside>
```

### 2.2 Componentes de Contenido

#### Hero Section
```html
<!-- Hero Section ReactBits Style -->
<section class="hero">
  <div class="hero-background">
    <div class="hero-gradient"></div>
    <div class="hero-particles"></div>
  </div>
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="title-line">Cuba Tattoo Studio</span>
      <span class="title-line accent">Documentation</span>
    </h1>
    <p class="hero-description">
      Animated components and design system for professional tattoo studio websites
    </p>
    <div class="hero-actions">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">View Components</button>
    </div>
  </div>
</section>
```

#### Component Showcase Cards
```html
<!-- Component Cards Grid -->
<div class="components-grid">
  <div class="component-card">
    <div class="card-preview">
      <div class="preview-demo"><!-- Live Demo --></div>
    </div>
    <div class="card-content">
      <h3 class="card-title">Fade In Animation</h3>
      <p class="card-description">Smooth fade-in effect with customizable timing</p>
      <div class="card-tags">
        <span class="tag">GSAP</span>
        <span class="tag">CSS</span>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-copy">Copy Code</button>
      <button class="btn-demo">Live Demo</button>
    </div>
  </div>
</div>
```

### 2.3 Componentes Interactivos

#### Code Block con Syntax Highlighting
```html
<!-- Code Block Component -->
<div class="code-block">
  <div class="code-header">
    <div class="code-tabs">
      <button class="tab active">JavaScript</button>
      <button class="tab">CSS</button>
      <button class="tab">HTML</button>
    </div>
    <button class="btn-copy-code">Copy</button>
  </div>
  <div class="code-content">
    <pre><code class="language-javascript">
// GSAP Animation Example
gsap.from(".element", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out"
});
    </code></pre>
  </div>
</div>
```

---

## 3. Sistema de Animaciones GSAP

### 3.1 Animaciones de Entrada (Page Load)

```javascript
// Animaciones de Carga Inicial
const initPageAnimations = () => {
  // Timeline principal
  const tl = gsap.timeline();
  
  // Fade in del header
  tl.from(".header-main", {
    opacity: 0,
    y: -20,
    duration: 0.8,
    ease: "power2.out"
  })
  
  // Stagger de elementos del hero
  .from(".hero-title .title-line", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  }, "-=0.4")
  
  // Fade in de la descripción
  .from(".hero-description", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.3")
  
  // Animación de botones
  .from(".hero-actions .btn", {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)"
  }, "-=0.2");
};
```

### 3.2 Animaciones de Scroll (ScrollTrigger)

```javascript
// Animaciones Activadas por Scroll
const initScrollAnimations = () => {
  // Animación de tarjetas de componentes
  gsap.from(".component-card", {
    scrollTrigger: {
      trigger: ".components-grid",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });
  
  // Parallax en secciones
  gsap.to(".hero-background", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    },
    y: -100,
    ease: "none"
  });
  
  // Reveal de texto
  gsap.from(".section-title", {
    scrollTrigger: {
      trigger: ".section-title",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out"
  });
};
```

### 3.3 Animaciones de Hover e Interacción

```javascript
// Efectos de Hover
const initHoverAnimations = () => {
  // Hover en tarjetas de componentes
  document.querySelectorAll('.component-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.02,
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(card.querySelector('.card-preview'), {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(card.querySelector('.card-preview'), {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
  
  // Hover en botones
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
  });
};
```

---

## 4. Componentes Gráficos Adicionales

### 4.1 Efectos de Fondo Animados

#### Partículas Flotantes
```javascript
// Sistema de Partículas
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.init();
  }
  
  init() {
    for (let i = 0; i < 50; i++) {
      this.createParticle();
    }
    this.animate();
  }
  
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
    `;
    
    this.container.appendChild(particle);
    
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      opacity: Math.random() * 0.5 + 0.1
    });
    
    this.particles.push(particle);
    this.animateParticle(particle);
  }
  
  animateParticle(particle) {
    gsap.to(particle, {
      x: `+=${Math.random() * 200 - 100}`,
      y: `+=${Math.random() * 200 - 100}`,
      duration: Math.random() * 10 + 5,
      ease: "none",
      repeat: -1,
      yoyo: true
    });
  }
}
```

#### Gradientes Animados
```css
/* Gradientes Dinámicos */
.animated-gradient {
  background: linear-gradient(
    45deg,
    #0a0a0a 0%,
    #1a1a1a 25%,
    #0a0a0a 50%,
    #2a2a2a 75%,
    #0a0a0a 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 4.2 Elementos Interactivos Avanzados

#### Cursor Personalizado
```javascript
// Cursor Interactivo
class InteractiveCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
    
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    });
    
    // Efectos en hover
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(this.cursor, {
          scale: 1.5,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to(this.cursor, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }
}
```

#### Loading Animations
```javascript
// Animaciones de Carga
const createLoadingAnimation = () => {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-logo">
        <svg class="logo-svg" viewBox="0 0 100 100">
          <path class="logo-path" d="M10,50 Q50,10 90,50 Q50,90 10,50" 
                fill="none" stroke="#ffffff" stroke-width="2"/>
        </svg>
      </div>
      <div class="loader-text">Loading...</div>
      <div class="loader-progress">
        <div class="progress-bar"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(loader);
  
  // Animación del logo
  gsap.from('.logo-path', {
    drawSVG: '0%',
    duration: 2,
    ease: 'power2.inOut',
    repeat: -1
  });
  
  // Animación del texto
  gsap.from('.loader-text', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power2.out',
    delay: 0.5
  });
  
  // Barra de progreso
  gsap.to('.progress-bar', {
    width: '100%',
    duration: 3,
    ease: 'power2.inOut'
  });
};
```

---

## 5. Plan de Implementación Paso a Paso

### Fase 1: Configuración Base (Días 1-2)

#### 1.1 Actualización del Sistema de Colores
```scss
// _sass/reactbits-theme.scss
:root {
  // Implementar toda la paleta de colores de ReactBits.dev
  // Crear variables CSS personalizadas
  // Configurar modo oscuro por defecto
}
```

#### 1.2 Configuración Tipográfica
```scss
// Importar fuentes de Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

// Configurar sistema tipográfico
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--text-primary);
}
```

#### 1.3 Layout Base
```html
<!-- _layouts/reactbits.html -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} | Cuba Tattoo Studio Docs</title>
  <link rel="stylesheet" href="{{ '/assets/css/reactbits-theme.css' | relative_url }}">
</head>
<body>
  {% include reactbits-header.html %}
  <div class="page-container">
    {% include reactbits-sidebar.html %}
    <main class="main-content">
      {{ content }}
    </main>
  </div>
  {% include reactbits-scripts.html %}
</body>
</html>
```

### Fase 2: Componentes de Navegación (Días 3-4)

#### 2.1 Header Principal
```html
<!-- _includes/reactbits-header.html -->
<header class="header-main">
  <div class="container">
    <div class="nav-brand">
      <a href="{{ '/' | relative_url }}" class="brand-link">
        <img src="{{ '/assets/images/logo.svg' | relative_url }}" alt="Cuba Tattoo Studio" class="logo">
        <span class="brand-text">Cuba Docs</span>
      </a>
    </div>
    
    <nav class="nav-primary">
      {% for item in site.data.navigation.main %}
        <a href="{{ item.url | relative_url }}" 
           class="nav-link {% if page.url == item.url %}active{% endif %}">
          {{ item.title }}
        </a>
      {% endfor %}
    </nav>
    
    <div class="nav-actions">
      <button class="btn-theme-toggle" aria-label="Toggle theme">
        <svg class="theme-icon" width="20" height="20" viewBox="0 0 20 20">
          <path fill="currentColor" d="M10 2L13 9L20 10L13 11L10 18L7 11L0 10L7 9L10 2Z"/>
        </svg>
      </button>
      <a href="https://github.com/cubatattoostudio" class="btn-secondary" target="_blank">
        <svg class="github-icon" width="20" height="20" viewBox="0 0 20 20">
          <path fill="currentColor" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
        </svg>
        GitHub
      </a>
    </div>
  </div>
</header>
```

#### 2.2 Sidebar Navigation
```html
<!-- _includes/reactbits-sidebar.html -->
<aside class="sidebar">
  <div class="sidebar-content">
    {% for section in site.data.navigation.sidebar %}
      <div class="sidebar-section">
        <h3 class="sidebar-title">{{ section.title }}</h3>
        <ul class="sidebar-menu">
          {% for item in section.items %}
            <li class="sidebar-item">
              <a href="{{ item.url | relative_url }}" 
                 class="sidebar-link {% if page.url == item.url %}active{% endif %}">
                {% if item.icon %}
                  <svg class="sidebar-icon" width="16" height="16" viewBox="0 0 16 16">
                    <use href="#{{ item.icon }}"></use>
                  </svg>
                {% endif %}
                {{ item.title }}
              </a>
            </li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </div>
</aside>
```

### Fase 3: Componentes de Contenido (Días 5-7)

#### 3.1 Hero Section
```html
<!-- _includes/reactbits-hero.html -->
<section class="hero">
  <div class="hero-background">
    <div class="hero-gradient"></div>
    <div class="hero-particles" id="particles-container"></div>
  </div>
  
  <div class="hero-content">
    <div class="hero-text">
      <h1 class="hero-title">
        <span class="title-line">{{ page.hero.title.line1 | default: 'Cuba Tattoo Studio' }}</span>
        <span class="title-line accent">{{ page.hero.title.line2 | default: 'Documentation' }}</span>
      </h1>
      <p class="hero-description">
        {{ page.hero.description | default: 'Professional tattoo studio design system with animated components and modern UI patterns.' }}
      </p>
    </div>
    
    <div class="hero-actions">
      <a href="{{ page.hero.primary_cta.url | default: '/getting-started/' | relative_url }}" 
         class="btn-primary">
        {{ page.hero.primary_cta.text | default: 'Get Started' }}
      </a>
      <a href="{{ page.hero.secondary_cta.url | default: '/components/' | relative_url }}" 
         class="btn-secondary">
        {{ page.hero.secondary_cta.text | default: 'View Components' }}
      </a>
    </div>
  </div>
  
  <div class="hero-stats">
    <div class="stat-item">
      <div class="stat-number">50+</div>
      <div class="stat-label">Components</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">100%</div>
      <div class="stat-label">Free & Open Source</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">∞</div>
      <div class="stat-label">Customizable</div>
    </div>
  </div>
</section>
```

#### 3.2 Component Showcase
```html
<!-- _includes/component-showcase.html -->
<section class="component-showcase">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Featured Components</h2>
      <p class="section-description">
        Explore our collection of animated components designed for modern tattoo studio websites.
      </p>
    </div>
    
    <div class="components-grid">
      {% for component in site.data.components.featured %}
        <div class="component-card" data-category="{{ component.category }}">
          <div class="card-preview">
            <div class="preview-demo">
              {% include components/{{ component.demo_file }} %}
            </div>
            <div class="preview-overlay">
              <button class="btn-preview" data-component="{{ component.id }}">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M10 12.5L5.5 8L6.5 7L10 10.5L13.5 7L14.5 8L10 12.5Z"/>
                </svg>
                Live Demo
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ component.title }}</h3>
              <div class="card-tags">
                {% for tag in component.tags %}
                  <span class="tag tag-{{ tag | downcase }}">{{ tag }}</span>
                {% endfor %}
              </div>
            </div>
            
            <p class="card-description">{{ component.description }}</p>
            
            <div class="card-meta">
              <div class="meta-item">
                <svg class="meta-icon" width="16" height="16" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"/>
                </svg>
                <span class="meta-text">{{ component.complexity }}</span>
              </div>
              <div class="meta-item">
                <svg class="meta-icon" width="16" height="16" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 1L10.09 5.26L15 6L11 9.74L11.91 14.5L8 12.27L4.09 14.5L5 9.74L1 6L5.91 5.26L8 1Z"/>
                </svg>
                <span class="meta-text">{{ component.rating }}/5</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="btn-copy" data-code="{{ component.id }}">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M4 2V1C4 0.4 4.4 0 5 0H14C14.6 0 15 0.4 15 1V10C15 10.6 14.6 11 14 11H13V12C13 12.6 12.6 13 12 13H2C1.4 13 1 12.6 1 12V4C1 3.4 1.4 3 2 3H4V2ZM5 3H12V10H13V1H5V3ZM2 4V12H12V4H2Z"/>
              </svg>
              Copy Code
            </button>
            <a href="{{ component.docs_url | relative_url }}" class="btn-docs">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M1 2.5C1 1.67 1.67 1 2.5 1H8.5C9.33 1 10 1.67 10 2.5V4H13.5C14.33 4 15 4.67 15 5.5V13.5C15 14.33 14.33 15 13.5 15H2.5C1.67 15 1 14.33 1 13.5V2.5ZM2.5 2C2.22 2 2 2.22 2 2.5V13.5C2 13.78 2.22 14 2.5 14H13.5C13.78 14 14 13.78 14 13.5V5.5C14 5.22 13.78 5 13.5 5H10V2.5C10 2.22 9.78 2 9.5 2H2.5Z"/>
              </svg>
              Docs
            </a>
          </div>
        </div>
      {% endfor %}
    </div>
    
    <div class="showcase-actions">
      <a href="{{ '/components/' | relative_url }}" class="btn-primary">
        View All Components
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path fill="currentColor" d="M8.5 2.5L13 7L8.5 11.5L7.5 10.5L10.5 7.5H3V6.5H10.5L7.5 3.5L8.5 2.5Z"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

### Fase 4: Sistema de Animaciones (Días 8-10)

#### 4.1 Configuración GSAP
```javascript
// assets/js/reactbits-animations.js

// Configuración global de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin);

// Configuración de ScrollTrigger
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  ignoreMobileResize: true
});

// Variables globales
const ANIMATION_DEFAULTS = {
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.1
};

// Clase principal para animaciones
class ReactBitsAnimations {
  constructor() {
    this.isInitialized = false;
    this.animations = new Map();
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.initPageAnimations();
    this.initScrollAnimations();
    this.initHoverAnimations();
    this.initInteractiveElements();
    
    this.isInitialized = true;
    
    // Evento personalizado para indicar que las animaciones están listas
    document.dispatchEvent(new CustomEvent('reactbits:animations:ready'));
  }
  
  // Animaciones de carga de página
  initPageAnimations() {
    const tl = gsap.timeline({ paused: true });
    
    // Fade in del header
    tl.from(".header-main", {
      opacity: 0,
      y: -20,
      duration: ANIMATION_DEFAULTS.duration,
      ease: ANIMATION_DEFAULTS.ease
    })
    
    // Hero title animation
    .from(".hero-title .title-line", {
      opacity: 0,
      y: 30,
      duration: ANIMATION_DEFAULTS.duration,
      stagger: 0.2,
      ease: ANIMATION_DEFAULTS.ease
    }, "-=0.4")
    
    // Hero description
    .from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: ANIMATION_DEFAULTS.ease
    }, "-=0.3")
    
    // Hero buttons
    .from(".hero-actions .btn", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      stagger: ANIMATION_DEFAULTS.stagger,
      ease: "back.out(1.7)"
    }, "-=0.2")
    
    // Hero stats
    .from(".hero-stats .stat-item", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: ANIMATION_DEFAULTS.stagger,
      ease: ANIMATION_DEFAULTS.ease
    }, "-=0.3");
    
    // Reproducir animación
    tl.play();
    
    this.animations.set('pageLoad', tl);
  }
  
  // Animaciones activadas por scroll
  initScrollAnimations() {
    // Component cards
    gsap.from(".component-card", {
      scrollTrigger: {
        trigger: ".components-grid",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 50,
      duration: ANIMATION_DEFAULTS.duration,
      stagger: 0.2,
      ease: ANIMATION_DEFAULTS.ease
    });
    
    // Section titles
    gsap.utils.toArray(".section-title").forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: ANIMATION_DEFAULTS.ease
      });
    });
    
    // Parallax backgrounds
    gsap.utils.toArray(".hero-background").forEach(bg => {
      gsap.to(bg, {
        scrollTrigger: {
          trigger: bg.closest('.hero'),
          start: "top top",
          end: "bottom top",
          scrub: 1
        },
        y: -100,
        ease: "none"
      });
    });
    
    // Code blocks reveal
    gsap.utils.toArray(".code-block").forEach(block => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: ANIMATION_DEFAULTS.ease
      });
    });
  }
  
  // Animaciones de hover
  initHoverAnimations() {
    // Component cards hover
    document.querySelectorAll('.component-card').forEach(card => {
      const preview = card.querySelector('.card-preview');
      const overlay = card.querySelector('.preview-overlay');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (preview) {
          gsap.to(preview, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        }
        
        if (overlay) {
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        
        if (preview) {
          gsap.to(preview, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
        
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
    });
    
    // Button hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
    
    // Navigation links hover
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          x: 5,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          x: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }
  
  // Elementos interactivos
  initInteractiveElements() {
    // Copy code buttons
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCopyCode(btn);
      });
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.btn-theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.handleThemeToggle();
      });
    }
    
    // Live demo buttons
    document.querySelectorAll('.btn-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLiveDemo(btn);
      });
    });
  }
  
  // Manejar copia de código
  handleCopyCode(btn) {
    const componentId = btn.dataset.code;
    const codeBlock = document.querySelector(`[data-code-block="${componentId}"]`);
    
    if (codeBlock) {
      const code = codeBlock.textContent;
      navigator.clipboard.writeText(code).then(() => {
        // Animación de confirmación
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path fill="currentColor" d="M13.5 2L6 9.5L2.5 6L1 7.5L6 12.5L15 4.5L13.5 2Z"/>
          </svg>
          Copied!
        `;
        
        gsap.to(btn, {
          scale: 1.1,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
        
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      });
    }
  }
  
  // Manejar toggle de tema
  handleThemeToggle() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    // Animación del botón
    const themeBtn = document.querySelector('.btn-theme-toggle');
    if (themeBtn) {
      gsap.to(themeBtn, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }
  
  // Manejar demo en vivo
  handleLiveDemo(btn) {
    const componentId = btn.dataset.component;
    const demoContainer = btn.closest('.component-card').querySelector('.preview-demo');
    
    if (demoContainer) {
      // Reiniciar animación del componente
      const animationElements = demoContainer.querySelectorAll('[data-animate]');
      animationElements.forEach(el => {
        gsap.fromTo(el, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      });
    }
  }
  
  // Método para limpiar animaciones
  destroy() {
    this.animations.forEach(animation => {
      if (animation.kill) animation.kill();
    });
    this.animations.clear();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    this.isInitialized = false;
  }
}

// Inicializar animaciones
const reactBitsAnimations = new ReactBitsAnimations();

// Exportar para uso global
window.ReactBitsAnimations = ReactBitsAnimations;
window.reactBitsAnimations = reactBitsAnimations;
```

### Fase 5: Componentes Gráficos Avanzados (Días 11-14)

#### 5.1 Sistema de Partículas
```javascript
// assets/js/particle-system.js

class ParticleSystem {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      console.warn('ParticleSystem: Container not found');
      return;
    }
    
    this.options = {
      count: 50,
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 2 },
      opacity: { min: 0.1, max: 0.5 },
      color: '#ffffff',
      interactive: true,
      ...options
    };
    
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.isRunning = false;
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.start();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particle-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
  }
  
  createParticles() {
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.options.speed.max,
        vy: (Math.random() - 0.5) * this.options.speed.max,
        size: Math.random() * (this.options.size.max - this.options.size.min) + this.options.size.min,
        opacity: Math.random() * (this.options.opacity.max - this.options.opacity.min) + this.options.opacity.min,
        originalOpacity: 0
      });
    }
    
    // Guardar opacidad original
    this.particles.forEach(particle => {
      particle.originalOpacity = particle.opacity;
    });
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    if (this.options.interactive) {
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      
      this.container.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }
  }
  
  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  update() {
    this.particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Mantener dentro del canvas
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Interacción con el mouse
      if (this.options.interactive) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.opacity = particle.originalOpacity + force * 0.5;
          
          // Repulsión suave
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.1;
          particle.vy -= Math.sin(angle) * force * 0.1;
        } else {
          particle.opacity = particle.originalOpacity;
        }
      }
    });
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.hexToRgba(this.options.color, particle.opacity);
      this.ctx.fill();
    });
    
    // Dibujar conexiones entre partículas cercanas
    if (this.options.connections !== false) {
      this.drawConnections();
    }
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          const opacity = (80 - distance) / 80 * 0.1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.hexToRgba(this.options.color, opacity);
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }
  
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  animate() {
    if (!this.isRunning) return;
    
    this.update();
    this.draw();
    
    requestAnimationFrame(() => this.animate());
  }
  
  start() {
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Inicializar partículas en el hero
document.addEventListener('DOMContentLoaded', () => {
  const heroParticles = document.getElementById('particles-container');
  if (heroParticles) {
    new ParticleSystem(heroParticles, {
      count: 80,
      size: { min: 1, max: 2 },
      speed: { min: 0.2, max: 1 },
      opacity: { min: 0.05, max: 0.2 },
      color: '#ffffff',
      interactive: true
    });
  }
});

// Exportar para uso global
window.ParticleSystem = ParticleSystem;
```

#### 5.2 Cursor Personalizado
```javascript
// assets/js/interactive-cursor.js

class InteractiveCursor {
  constructor(options = {}) {
    this.options = {
      size: 20,
      color: '#ffffff',
      mixBlendMode: 'difference',
      zIndex: 9999,
      ...options
    };
    
    this.cursor = null;
    this.isVisible = false;
    this.isActive = false;
    
    this.init();
  }
  
  init() {
    this.createCursor();
    this.bindEvents();
  }
  
  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'interactive-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      width: ${this.options.size}px;
      height: ${this.options.size}px;
      background: ${this.options.color};
      border-radius: 50%;
      pointer-events: none;
      z-index: ${this.options.zIndex};
      mix-blend-mode: ${this.options.mixBlendMode};
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.2s ease;
    `;
    
    document.body.appendChild(this.cursor);
  }
  
  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      if (!this.isVisible) {
        this.show();
      }
      
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    });
    
    document.addEventListener('mouseenter', () => this.show());
    document.addEventListener('mouseleave', () => this.hide());
    
    // Efectos en elementos interactivos
    document.querySelectorAll('a, button, .interactive').forEach(el => {
      el.addEventListener('mouseenter', () => this.activate());
      el.addEventListener('mouseleave', () => this.deactivate());
    });
  }
  
  show() {
    this.isVisible = true;
    gsap.to(this.cursor, {
      scale: 1,
      duration: 0.2,
      ease: "back.out(1.7)"
    });
  }
  
  hide() {
    this.isVisible = false;
    gsap.to(this.cursor, {
      scale: 0,
      duration: 0.2,
      ease: "power2.out"
    });
  }
  
  activate() {
    this.isActive = true;
    gsap.to(this.cursor, {
      scale: 1.5,
      duration: 0.2,
      ease: "power2.out"
    });
  }
  
  deactivate() {
    this.isActive = false;
    gsap.to(this.cursor, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  }
}

// Inicializar cursor personalizado
if (window.innerWidth > 768) {
  new InteractiveCursor();
}
```

#### 5.3 Loading Animations
```javascript
// assets/js/loading-animations.js

class LoadingAnimations {
  static createPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">
          <svg class="logo-svg" width="60" height="60" viewBox="0 0 60 60">
            <circle class="logo-circle" cx="30" cy="30" r="25" 
                    fill="none" stroke="#ffffff" stroke-width="2"/>
            <path class="logo-path" d="M15,30 L25,40 L45,20" 
                  fill="none" stroke="#ffffff" stroke-width="2"/>
          </svg>
        </div>
        <div class="loader-text">Loading Cuba Docs...</div>
        <div class="loader-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    `;
    
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    document.body.appendChild(loader);
    
    // Animaciones
    const tl = gsap.timeline();
    
    tl.from('.loader-logo', {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .from('.logo-circle', {
      drawSVG: '0%',
      duration: 1.5,
      ease: 'power2.inOut'
    }, '-=0.4')
    .from('.logo-path', {
      drawSVG: '0%',
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8')
    .from('.loader-text', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.5')
    .from('.loader-progress', {
      scaleX: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.progress-bar', {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut'
    }, '-=0.2');
    
    return {
      element: loader,
      timeline: tl,
      hide: () => {
        gsap.to(loader, {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }
        });
      }
    };
  }
  
  static createComponentLoader(container) {
    const loader = document.createElement('div');
    loader.className = 'component-loader';
    loader.innerHTML = `
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
    `;
    
    container.appendChild(loader);
    
    gsap.to('.spinner-ring', {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1,
      stagger: 0.2
    });
    
    return {
      element: loader,
      hide: () => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }
        });
      }
    };
  }
}

// Mostrar loader al cargar la página
const pageLoader = LoadingAnimations.createPageLoader();

// Ocultar loader cuando la página esté lista
window.addEventListener('load', () => {
  setTimeout(() => {
    pageLoader.hide();
  }, 1000);
});
```

---

## 6. Estilos CSS Completos

### 6.1 Variables CSS Globales
```scss
// _sass/reactbits-variables.scss

:root {
  // === COLORES PRINCIPALES ===
  // Fondos
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-card: #1a1a1a;
  --bg-hover: #222222;
  --bg-active: #2a2a2a;
  
  // Textos
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-disabled: #52525b;
  
  // Acentos
  --accent-primary: #3b82f6;
  --accent-secondary: #8b5cf6;
  --accent-success: #10b981;
  --accent-warning: #f59e0b;
  --accent-error: #ef4444;
  
  // Bordes
  --border-primary: #27272a;
  --border-secondary: #3f3f46;
  --border-accent: #52525b;
  
  // === TIPOGRAFÍA ===
  // Fuentes
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  // Tamaños
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  
  // Pesos
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  // === ESPACIADO ===
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  // === BORDES Y RADIOS ===
  --radius-none: 0;
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
  
  // === SOMBRAS ===
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  
  // === TRANSICIONES ===
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
  
  // === Z-INDEX ===
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
  --z-toast: 1070;
}

// Tema claro (opcional)
.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-card: #ffffff;
  --bg-hover: #f8fafc;
  --bg-active: #f1f5f9;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --text-disabled: #94a3b8;
  
  --border-primary: #e2e8f0;
   --border-secondary: #cbd5e1;
   --border-accent: #94a3b8;
 }
 ```

### 6.2 Estilos Base
```scss
// _sass/reactbits-base.scss

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// === TIPOGRAFÍA ===
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  line-height: 1.2;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

h1 {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  
  @media (max-width: 768px) {
    font-size: var(--text-4xl);
  }
}

h2 {
  font-size: var(--text-4xl);
  
  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
}

h3 {
  font-size: var(--text-3xl);
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
}

h4 {
  font-size: var(--text-2xl);
}

h5 {
  font-size: var(--text-xl);
}

h6 {
  font-size: var(--text-lg);
}

p {
  margin-bottom: var(--space-4);
  color: var(--text-secondary);
}

// === ENLACES ===
a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--accent-secondary);
  }
  
  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

// === LISTAS ===
ul, ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
  
  li {
    margin-bottom: var(--space-2);
    color: var(--text-secondary);
  }
}

// === CÓDIGO ===
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-primary);
}

pre {
  font-family: var(--font-mono);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
  overflow-x: auto;
  margin-bottom: var(--space-4);
  
  code {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
  }
}

// === IMÁGENES ===
img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

// === TABLAS ===
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-4);
  
  th, td {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    border-bottom: 1px solid var(--border-primary);
  }
  
  th {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
  
  td {
    color: var(--text-secondary);
  }
}

// === UTILIDADES ===
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  
  @media (max-width: 768px) {
    padding: 0 var(--space-3);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-gradient {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 6.3 Componentes UI
```scss
// _sass/reactbits-components.scss

// === BOTONES ===
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-normal);
  user-select: none;
  
  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background-color: var(--accent-primary);
  color: white;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-secondary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
  
  &:hover:not(:disabled) {
    background-color: var(--bg-hover);
    border-color: var(--border-accent);
    transform: translateY(-1px);
  }
}

.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
  
  &:hover:not(:disabled) {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
}

// === TARJETAS ===
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: var(--transition-normal);
  
  &:hover {
    border-color: var(--border-secondary);
    box-shadow: var(--shadow-lg);
  }
}

.card-header {
  margin-bottom: var(--space-4);
  
  .card-title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-2);
  }
  
  .card-description {
    color: var(--text-muted);
    margin-bottom: 0;
  }
}

.card-content {
  margin-bottom: var(--space-4);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

// === BADGES/TAGS ===
.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.tag-primary {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--accent-primary);
  border-color: rgba(59, 130, 246, 0.2);
}

.tag-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--accent-success);
  border-color: rgba(16, 185, 129, 0.2);
}

.tag-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--accent-warning);
  border-color: rgba(245, 158, 11, 0.2);
}

// === INPUTS ===
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
}

// === NAVEGACIÓN ===
.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }
  
  &.active {
    color: var(--accent-primary);
    background-color: rgba(59, 130, 246, 0.1);
  }
}

// === CÓDIGO ===
.code-block {
  position: relative;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.code-tabs {
  display: flex;
  gap: var(--space-2);
  
  .tab {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-sm);
    color: var(--text-muted);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition-normal);
    
    &.active {
      color: var(--text-primary);
      background-color: var(--bg-hover);
    }
  }
}

.code-content {
  padding: var(--space-4);
  overflow-x: auto;
  
  pre {
    margin: 0;
    background: none;
    border: none;
    padding: 0;
  }
}

// === LOADING ===
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
  
  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    &:nth-child(2) {
      animation-delay: 0.1s;
      border-top-color: var(--accent-secondary);
    }
    
    &:nth-child(3) {
      animation-delay: 0.2s;
      border-top-color: var(--accent-success);
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 7. Cronograma de Implementación

### Semana 1: Configuración Base
**Días 1-2: Setup Inicial**
- [ ] Configurar variables CSS de ReactBits.dev
- [ ] Importar fuentes (Inter, JetBrains Mono)
- [ ] Crear estructura de archivos SCSS
- [ ] Configurar layout base con header y sidebar

**Días 3-4: Componentes Base**
- [ ] Implementar sistema de botones
- [ ] Crear componentes de tarjetas
- [ ] Desarrollar sistema de navegación
- [ ] Configurar tags y badges

**Días 5-7: Hero Section**
- [ ] Crear hero section con gradientes
- [ ] Implementar sistema de partículas
- [ ] Configurar animaciones de entrada
- [ ] Optimizar para responsive

### Semana 2: Componentes Avanzados
**Días 8-10: Gallery de Componentes**
- [ ] Crear grid de componentes
- [ ] Implementar preview interactivo
- [ ] Configurar sistema de filtros
- [ ] Añadir funcionalidad de copia de código

**Días 11-14: Animaciones GSAP**
- [ ] Configurar ScrollTrigger
- [ ] Implementar animaciones de scroll
- [ ] Crear efectos de hover
- [ ] Optimizar performance

### Semana 3: Funcionalidades Interactivas
**Días 15-17: Elementos Gráficos**
- [ ] Implementar cursor personalizado
- [ ] Crear loading animations
- [ ] Configurar theme toggle
- [ ] Añadir efectos de parallax

**Días 18-21: Optimización**
- [ ] Optimizar animaciones para mobile
- [ ] Mejorar accesibilidad
- [ ] Testing cross-browser
- [ ] Performance optimization

---

## 8. Checklist de Implementación

### ✅ Diseño Visual
- [ ] Paleta de colores ReactBits.dev implementada
- [ ] Tipografía Inter configurada correctamente
- [ ] Sistema de espaciado consistente
- [ ] Bordes y sombras aplicados
- [ ] Tema oscuro por defecto

### ✅ Componentes UI
- [ ] Header con navegación principal
- [ ] Sidebar con menú de documentación
- [ ] Hero section con partículas
- [ ] Grid de componentes interactivo
- [ ] Code blocks con syntax highlighting
- [ ] Botones con efectos hover
- [ ] Tags y badges estilizados

### ✅ Animaciones GSAP
- [ ] Animaciones de carga de página
- [ ] ScrollTrigger configurado
- [ ] Efectos de hover en tarjetas
- [ ] Parallax en backgrounds
- [ ] Stagger animations
- [ ] Loading animations

### ✅ Interactividad
- [ ] Cursor personalizado (desktop)
- [ ] Copy to clipboard funcional
- [ ] Theme toggle operativo
- [ ] Navegación suave
- [ ] Filtros de componentes
- [ ] Live demos interactivos

### ✅ Responsive Design
- [ ] Mobile-first approach
- [ ] Breakpoints optimizados
- [ ] Touch interactions
- [ ] Performance en móviles

### ✅ Performance
- [ ] Lazy loading de imágenes
- [ ] Optimización de animaciones
- [ ] Minificación de assets
- [ ] Lighthouse score > 90

---

## 9. Recursos y Referencias

### Documentación Técnica
- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Guide](https://greensock.com/scrolltrigger/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

### Inspiración de Diseño
- [ReactBits.dev](https://reactbits.dev) - Referencia principal
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Radix UI](https://www.radix-ui.com/) - Componentes
- [Tailwind UI](https://tailwindui.com/) - Patrones de diseño

### Herramientas de Desarrollo
- [GSAP CodePen Collection](https://codepen.io/collection/DYPwGM)
- [CSS Grid Generator](https://cssgrid-generator.netlify.app/)
- [Color Palette Generator](https://coolors.co/)
- [Google Fonts](https://fonts.google.com/)

---

**Nota Final:** Esta planificación está diseñada para transformar completamente la documentación de Cuba Tattoo Studio en una réplica visual de ReactBits.dev, manteniendo la funcionalidad específica del estudio de tatuajes mientras se adopta la estética moderna y las animaciones sofisticadas de la referencia.