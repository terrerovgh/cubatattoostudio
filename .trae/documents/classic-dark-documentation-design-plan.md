# Plan de Diseño: Documentación Clásica Oscura y Profesional

## 1. Análisis de Referencia

### Sitios de Inspiración
- **GitHub Docs**: Layout limpio, navegación lateral fija, tipografía clara
- **GitLab Documentation**: Estructura jerárquica, búsqueda prominente, breadcrumbs
- **MDN Web Docs**: Contenido técnico bien organizado, código destacado
- **Stripe Docs**: Diseño minimalista, ejemplos de código claros

### Características Clave a Replicar
- Header fijo con logo y navegación principal
- Sidebar de navegación con estructura jerárquica
- Área de contenido principal con tipografía legible
- Table of contents (TOC) flotante en páginas largas
- Bloques de código con syntax highlighting
- Búsqueda global prominente
- Breadcrumbs para navegación contextual

## 2. Paleta de Colores Profesional

### Colores Principales
```css
/* Fondos */
--bg-primary: #0d1117;      /* Fondo principal (GitHub dark) */
--bg-secondary: #161b22;    /* Sidebar y elementos secundarios */
--bg-tertiary: #21262d;     /* Cards, code blocks */
--bg-hover: #30363d;        /* Estados hover */

/* Texto */
--text-primary: #f0f6fc;    /* Texto principal */
--text-secondary: #8b949e;  /* Texto secundario */
--text-muted: #6e7681;      /* Texto deshabilitado */

/* Acentos */
--accent-blue: #58a6ff;     /* Enlaces y elementos interactivos */
--accent-green: #3fb950;    /* Estados de éxito */
--accent-orange: #d29922;   /* Advertencias */
--accent-red: #f85149;      /* Errores */

/* Bordes */
--border-default: #30363d;  /* Bordes principales */
--border-muted: #21262d;    /* Bordes sutiles */
```

## 3. Tipografía Profesional

### Fuentes
```css
/* Texto principal */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Código */
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;

/* Encabezados */
--font-heading: 'Inter', sans-serif; /* Más legible que Bebas Neue para docs */
```

### Escalas Tipográficas
```css
/* Encabezados */
--text-h1: 2.25rem;   /* 36px */
--text-h2: 1.875rem;  /* 30px */
--text-h3: 1.5rem;    /* 24px */
--text-h4: 1.25rem;   /* 20px */
--text-h5: 1.125rem;  /* 18px */
--text-h6: 1rem;      /* 16px */

/* Cuerpo */
--text-base: 1rem;      /* 16px */
--text-sm: 0.875rem;    /* 14px */
--text-xs: 0.75rem;     /* 12px */

/* Código */
--text-code: 0.875rem;  /* 14px */
```

## 4. Layout y Estructura

### Arquitectura de Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Header (Fixed)                       │
│  Logo | Search | Navigation | Theme Toggle | GitHub     │
├─────────────────┬───────────────────────┬───────────────┤
│                 │                       │               │
│    Sidebar      │    Main Content       │  Table of     │
│   (Fixed)       │                       │  Contents     │
│                 │                       │  (Sticky)     │
│  - Home         │  ┌─────────────────┐  │               │
│  - Setup        │  │   Breadcrumbs   │  │  - Section 1  │
│  - Components   │  └─────────────────┘  │  - Section 2  │
│  - Animations   │                       │  - Section 3  │
│  - GSAP Guide   │  ┌─────────────────┐  │               │
│  - Architecture │  │                 │  │               │
│  - Contributing │  │   Page Content  │  │               │
│                 │  │                 │  │               │
│                 │  └─────────────────┘  │               │
│                 │                       │               │
├─────────────────┴───────────────────────┴───────────────┤
│                      Footer                             │
└─────────────────────────────────────────────────────────┘
```

### Dimensiones
```css
--header-height: 64px;
--sidebar-width: 280px;
--toc-width: 240px;
--content-max-width: 800px;
--container-padding: 24px;
```

## 5. Componentes Clave

### 5.1 Header
```html
<header class="docs-header">
  <div class="header-left">
    <img src="logo.svg" alt="Cuba Tattoo Studio" class="logo">
    <span class="docs-title">Documentation</span>
  </div>
  
  <div class="header-center">
    <div class="search-container">
      <input type="search" placeholder="Search documentation...">
      <kbd>⌘K</kbd>
    </div>
  </div>
  
  <div class="header-right">
    <nav class="main-nav">
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
      <a href="/components">Components</a>
    </nav>
    <button class="theme-toggle" aria-label="Toggle theme">
      <svg><!-- moon/sun icon --></svg>
    </button>
    <a href="https://github.com/..." class="github-link">
      <svg><!-- GitHub icon --></svg>
    </a>
  </div>
</header>
```

### 5.2 Sidebar Navigation
```html
<aside class="docs-sidebar">
  <nav class="sidebar-nav">
    <div class="nav-section">
      <h3 class="nav-section-title">Getting Started</h3>
      <ul class="nav-list">
        <li><a href="/docs" class="nav-link active">Introduction</a></li>
        <li><a href="/docs/installation" class="nav-link">Installation</a></li>
        <li><a href="/docs/setup" class="nav-link">Setup Guide</a></li>
      </ul>
    </div>
    
    <div class="nav-section">
      <h3 class="nav-section-title">Components</h3>
      <ul class="nav-list">
        <li><a href="/docs/components" class="nav-link">Overview</a></li>
        <li><a href="/docs/components/animations" class="nav-link">Animations</a></li>
        <li><a href="/docs/components/gallery" class="nav-link">Gallery</a></li>
      </ul>
    </div>
    
    <div class="nav-section">
      <h3 class="nav-section-title">Advanced</h3>
      <ul class="nav-list">
        <li><a href="/docs/gsap" class="nav-link">GSAP Guide</a></li>
        <li><a href="/docs/architecture" class="nav-link">Architecture</a></li>
        <li><a href="/docs/contributing" class="nav-link">Contributing</a></li>
      </ul>
    </div>
  </nav>
</aside>
```

### 5.3 Main Content Area
```html
<main class="docs-main">
  <div class="content-wrapper">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        <li><a href="/docs">Documentation</a></li>
        <li><a href="/docs/components">Components</a></li>
        <li aria-current="page">Animation Gallery</li>
      </ol>
    </nav>
    
    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">Animation Gallery</h1>
      <p class="page-description">
        A comprehensive collection of GSAP animations and interactive components
        for the Cuba Tattoo Studio website.
      </p>
    </header>
    
    <!-- Content -->
    <div class="page-content">
      <!-- Markdown content rendered here -->
    </div>
    
    <!-- Page Navigation -->
    <nav class="page-nav" aria-label="Page navigation">
      <a href="/docs/components" class="nav-prev">
        <span class="nav-direction">Previous</span>
        <span class="nav-title">Components Overview</span>
      </a>
      <a href="/docs/gsap" class="nav-next">
        <span class="nav-direction">Next</span>
        <span class="nav-title">GSAP Guide</span>
      </a>
    </nav>
  </div>
</main>
```

### 5.4 Table of Contents
```html
<aside class="docs-toc">
  <div class="toc-container">
    <h4 class="toc-title">On this page</h4>
    <nav class="toc-nav">
      <ul class="toc-list">
        <li><a href="#introduction" class="toc-link active">Introduction</a></li>
        <li><a href="#basic-animations" class="toc-link">Basic Animations</a></li>
        <li>
          <a href="#advanced-effects" class="toc-link">Advanced Effects</a>
          <ul class="toc-sublist">
            <li><a href="#scroll-triggers" class="toc-link">Scroll Triggers</a></li>
            <li><a href="#morphing" class="toc-link">SVG Morphing</a></li>
          </ul>
        </li>
        <li><a href="#examples" class="toc-link">Examples</a></li>
      </ul>
    </nav>
  </div>
</aside>
```

## 6. Componentes Interactivos

### 6.1 Code Blocks
```html
<div class="code-block">
  <div class="code-header">
    <span class="code-language">javascript</span>
    <button class="copy-button" data-copy="...">
      <svg><!-- copy icon --></svg>
      Copy
    </button>
  </div>
  <pre class="code-content"><code class="language-javascript">
// GSAP Animation Example
gsap.from(".hero-title", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power2.out"
});
  </code></pre>
</div>
```

### 6.2 Callout Boxes
```html
<div class="callout callout-info">
  <div class="callout-icon">
    <svg><!-- info icon --></svg>
  </div>
  <div class="callout-content">
    <p><strong>Note:</strong> This animation requires GSAP ScrollTrigger plugin.</p>
  </div>
</div>

<div class="callout callout-warning">
  <div class="callout-icon">
    <svg><!-- warning icon --></svg>
  </div>
  <div class="callout-content">
    <p><strong>Warning:</strong> Performance may be affected on mobile devices.</p>
  </div>
</div>
```

### 6.3 Search Functionality
```javascript
// Search implementation
class DocsSearch {
  constructor() {
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    this.init();
  }
  
  init() {
    this.searchInput.addEventListener('input', this.handleSearch.bind(this));
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
      this.hideResults();
      return;
    }
    
    const results = this.searchContent(query);
    this.displayResults(results);
  }
  
  handleKeyboard(e) {
    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.searchInput.focus();
    }
  }
}
```

## 7. Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (max-width: 768px) {
  .docs-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .docs-sidebar.open {
    transform: translateX(0);
  }
  
  .docs-toc {
    display: none;
  }
  
  .docs-main {
    margin-left: 0;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .docs-toc {
    display: none;
  }
  
  .docs-main {
    margin-right: 0;
  }
}

@media (min-width: 1201px) {
  /* Full desktop layout */
}
```

### Mobile Navigation
```html
<button class="mobile-menu-toggle" aria-label="Toggle navigation">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

<div class="mobile-overlay"></div>
```

## 8. Accesibilidad

### Características de Accesibilidad
- **Navegación por teclado**: Tab, Enter, Escape para todos los elementos interactivos
- **Screen readers**: Etiquetas ARIA apropiadas, landmarks semánticos
- **Contraste**: Cumple WCAG 2.1 AA (4.5:1 para texto normal, 3:1 para texto grande)
- **Focus visible**: Indicadores claros de foco para navegación por teclado
- **Skip links**: Enlaces para saltar al contenido principal

### Implementación ARIA
```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Landmarks -->
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main" id="main-content">
<aside role="complementary" aria-label="Table of contents">

<!-- Live regions for search -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="search-status"></div>

<!-- Expandable sections -->
<button aria-expanded="false" aria-controls="nav-section-1">
  Getting Started
</button>
<ul id="nav-section-1" aria-hidden="true">
```

## 9. Performance y SEO

### Optimizaciones
- **Lazy loading**: Imágenes y componentes no críticos
- **Code splitting**: JavaScript modular por página
- **CSS crítico**: Inline CSS para above-the-fold content
- **Preload**: Fuentes y recursos críticos
- **Service Worker**: Caching para navegación offline

### Meta Tags
```html
<meta name="description" content="Complete documentation for Cuba Tattoo Studio components and animations">
<meta property="og:title" content="Cuba Tattoo Studio - Documentation">
<meta property="og:description" content="Professional tattoo studio documentation">
<meta property="og:image" content="/images/docs-preview.jpg">
<meta name="twitter:card" content="summary_large_image">
```

## 10. Implementación Técnica

### Jekyll Configuration
```yaml
# _config.yml
title: "Cuba Tattoo Studio Documentation"
description: "Professional documentation for Cuba Tattoo Studio"
baseurl: "/docs"
url: "https://cubatattoostudio.github.io"

# Collections
collections:
  docs:
    output: true
    permalink: /:collection/:name/

# Plugins
plugins:
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-feed
  - jekyll-redirect-from

# Markdown
markdown: kramdown
highlighter: rouge
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
    span:
      line_numbers: false
    block:
      line_numbers: true
```

### File Structure
```
docs/
├── _config.yml
├── _layouts/
│   ├── default.html
│   ├── docs.html
│   └── page.html
├── _includes/
│   ├── header.html
│   ├── sidebar.html
│   ├── toc.html
│   └── footer.html
├── _sass/
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _layout.scss
│   ├── _components.scss
│   └── _syntax.scss
├── assets/
│   ├── css/
│   │   └── main.scss
│   ├── js/
│   │   ├── search.js
│   │   ├── navigation.js
│   │   └── toc.js
│   └── images/
├── _docs/
│   ├── index.md
│   ├── installation.md
│   ├── components/
│   └── advanced/
└── index.md
```

## 11. Plan de Implementación

### Fase 1: Estructura Base (Semana 1)
- [ ] Configurar Jekyll con nueva estructura
- [ ] Crear layouts base (default, docs, page)
- [ ] Implementar sistema de colores y tipografía
- [ ] Desarrollar header y navegación principal

### Fase 2: Navegación y Contenido (Semana 2)
- [ ] Implementar sidebar con navegación jerárquica
- [ ] Crear sistema de breadcrumbs
- [ ] Desarrollar table of contents automático
- [ ] Migrar contenido existente al nuevo formato

### Fase 3: Funcionalidades Avanzadas (Semana 3)
- [ ] Implementar búsqueda con JavaScript
- [ ] Añadir syntax highlighting para código
- [ ] Crear componentes interactivos (callouts, tabs)
- [ ] Optimizar para móvil y accesibilidad

### Fase 4: Pulido y Testing (Semana 4)
- [ ] Testing de accesibilidad completo
- [ ] Optimización de performance
- [ ] Testing en múltiples dispositivos
- [ ] Documentación del sistema de diseño

## 12. Checklist de Calidad

### Design System
- [ ] Paleta de colores consistente
- [ ] Tipografía escalable y legible
- [ ] Espaciado sistemático
- [ ] Componentes reutilizables

### Funcionalidad
- [ ] Navegación intuitiva
- [ ] Búsqueda funcional
- [ ] Links internos correctos
- [ ] Responsive en todos los breakpoints

### Performance
- [ ] Lighthouse score > 90
- [ ] Tiempo de carga < 3s
- [ ] Imágenes optimizadas
- [ ] CSS y JS minificados

### Accesibilidad
- [ ] Navegación por teclado completa
- [ ] Screen reader compatible
- [ ] Contraste WCAG AA
- [ ] Focus indicators visibles

### SEO
- [ ] Meta tags apropiados
- [ ] Estructura semántica HTML
- [ ] Sitemap generado
- [ ] URLs amigables

Este plan transformará la documentación actual en una experiencia profesional, accesible y moderna, manteniendo la identidad visual de Cuba Tattoo Studio pero con un enfoque más técnico y orientado a la documentación.