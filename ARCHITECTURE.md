# Arquitectura del Proyecto

Este documento describe la arquitectura técnica del sitio web de Cuba Tattoo Studio.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura de Componentes](#arquitectura-de-componentes)
- [Sistema de Estilos](#sistema-de-estilos)
- [Sistema de Animaciones](#sistema-de-animaciones)
- [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)
- [Convenciones y Patrones](#convenciones-y-patrones)

## Visión General

Cuba Tattoo Studio es una **landing page de una sola página (SPA)** construida con Astro 5, aprovechando el enfoque "Islands Architecture" para componentes interactivos con React. El sitio prioriza:

- ⚡ **Performance**: Carga rápida con mínimo JavaScript
- 🎨 **Experiencia Visual**: Animaciones suaves y diseño premium
- 📱 **Responsive**: Optimizado para todos los tamaños de pantalla
- ♿ **Accesibilidad**: HTML semántico y navegación por teclado

## Stack Tecnológico

### Framework Principal

**Astro 5.16.0**
- Generación de sitios estáticos (SSG)
- Hidratación parcial para mejor rendimiento
- Islands Architecture para componentes interactivos
- Zero JavaScript por defecto

### UI y Componentes Interactivos

**React 19.2.0**
- Utilizado solo para componentes que requieren interactividad (iconos de Lucide)
- Hidratación bajo demanda con directivas de Astro

### Styling

**TailwindCSS 4.1.17**
- Framework CSS utility-first
- Configuración personalizada en `global.css` con `@theme`
- Integración via `@tailwindcss/vite` plugin

**Custom CSS**
- Animaciones personalizadas
- Efectos parallax
- Utilidades de reveal animations

### Herramientas de Build

**Vite**
- Build tool moderno y rápido
- Hot Module Replacement (HMR) en desarrollo
- Optimización de assets automática

**TypeScript**
- Tipado estático para mejor DX
- Configuración estricta (`astro/tsconfigs/strict`)
- JSX configurado para React

## Estructura del Proyecto

```
cubatattoostudio/
│
├── public/                      # Assets estáticos servidos directamente
│   ├── artists/                # Imágenes de perfiles de artistas
│   │   ├── david.png
│   │   ├── nina.png
│   │   └── karli.png
│   ├── tattoo/                 # Galería de trabajos (tattoo1-25.png)
│   ├── logo-stack.svg          # Logo principal del estudio
│   └── favicon.svg             # Favicon
│
├── src/
│   ├── components/             # Componentes Astro reutilizables
│   │   ├── Navbar.astro       # Navegación sticky con menú móvil
│   │   ├── Hero.astro         # Hero fullscreen con parallax
│   │   ├── Services.astro     # Grid de servicios/disciplinas
│   │   ├── Artists.astro      # Perfiles de artistas
│   │   ├── Gallery.astro      # Galería masonry responsive
│   │   ├── Booking.astro      # Formulario de contacto + mapa
│   │   └── Footer.astro       # Footer del sitio
│   │
│   ├── layouts/
│   │   └── Layout.astro       # Layout base con <head>, scripts globales
│   │
│   ├── pages/
│   │   └── index.astro        # Página principal (única página)
│   │
│   └── styles/
│       └── global.css         # Estilos globales, theme de Tailwind, animaciones
│
├── astro.config.mjs           # Configuración de Astro
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias y scripts
```

### Organización de Assets

- **`/public/artists/`**: Imágenes de alta calidad de los artistas (formato PNG)
- **`/public/tattoo/`**: Portfolio de trabajos realizados
- **SVGs**: Logo y favicon como SVG para escalabilidad

## Arquitectura de Componentes

### Patrón de Componentes

El proyecto utiliza **Astro Components** como componentes principales, aprovechando:

1. **Zero JavaScript por defecto**: Los componentes Astro se renderizan a HTML estático
2. **Hidratación selectiva**: Solo los componentes React (iconos) se hidratan en el cliente
3. **Component Islands**: Cada sección es independiente y auto-contenida

### Jerarquía de Componentes

```
Layout.astro (Base)
  └── index.astro (Página)
        ├── Navbar.astro
        ├── Hero.astro
        ├── Services.astro
        ├── Artists.astro
        ├── Gallery.astro
        ├── Booking.astro
        └── Footer.astro
```

### Layout Base (`Layout.astro`)

Responsabilidades:
- Configuración del `<head>` (meta tags, fonts, favicon)
- Importación de estilos globales
- Scripts de animación (Intersection Observer)
- Efecto parallax del hero
- Toggle de navegación móvil

**Scripts Internos:**
- **Intersection Observer**: Observa elementos con clase `.reveal-hidden` y añade `.reveal-visible` cuando están en viewport
- **Parallax**: Transforma el background del hero basado en scroll position
- **Mobile Menu**: Toggle del menú de navegación en móvil

### Componentes de Sección

Cada sección del sitio es un componente independiente:

#### **Navbar.astro**
- Navegación sticky con blur background
- Links de ancla a secciones
- CTA button prominente
- Menú hamburguesa responsive

#### **Hero.astro**
- Fullscreen hero con background parallax
- Logo SVG animado
- Texto descriptivo
- CTA scroll-to-artists

#### **Services.astro**
- Grid 3 columnas (responsive a 1 en móvil)
- Cards con imagen de fondo y hover effects
- Iconos de Lucide React (hidratados)

#### **Artists.astro**
- Layout alternado (imagen-texto, texto-imagen)
- Imágenes con efecto grayscale → color en hover
- Biografías y especialidades
- Links a portfolios

#### **Gallery.astro**
- Masonry grid CSS-based (`columns`)
- Imágenes con hover opacity
- Responsive breakpoints

#### **Booking.astro**
- Formulario de contacto (no funcional sin backend)
- Información del estudio
- Google Maps embed
- Horarios y contacto

## Sistema de Estilos

### TailwindCSS 4 Configuration

TailwindCSS 4 usa un nuevo sistema de configuración basado en `@theme` en archivos CSS:

```css
@theme {
    --color-brand-50: #f9fafb;
    --color-brand-100: #f3f4f6;
    --color-brand-900: #111827;
    --tracking-tighter: -0.04em;
    --tracking-tight: -0.02em;
}
```

### Paleta de Colores

El sitio utiliza una paleta monocromática oscura:

- **Base**: `bg-black`, `bg-neutral-950`, `bg-neutral-900`
- **Texto**: `text-neutral-100`, `text-neutral-300`, `text-neutral-400`, `text-neutral-500`
- **Acentos**: `text-white`, `bg-white` para CTAs

### Tipografía

**Fuente Principal**: Inter (Google Fonts)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)
- Aplicada globalmente vía `font-family: 'Inter', sans-serif`

**Utility Classes Personalizadas**:
- `tracking-tighter`: -0.04em
- `tracking-tight`: -0.02em
- Large headlines con `text-4xl`, `text-5xl`, `text-7xl`

### Responsive Design

Breakpoints de Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Patrón común: `class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"`

## Sistema de Animaciones

### Intersection Observer

Script en `Layout.astro` que implementa scroll-triggered animations:

```javascript
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // Solo anima una vez
        }
    });
}, { threshold: 0.15 });
```

### Clases de Animación

**`.reveal-hidden`**: Estado inicial
- `opacity: 0`
- `filter: blur(10px)`
- `transform: translateY(40px)`

**`.reveal-visible`**: Estado animado (añadido por Observer)
- `opacity: 1`
- `filter: blur(0)`
- `transform: translateY(0)`
- Transición: `1s cubic-bezier(0.16, 1, 0.3, 1)`

**Stagger Delays**: Para secuenciar animaciones
- `.stagger-delay-1`: `transition-delay: 0.1s`
- `.stagger-delay-2`: `transition-delay: 0.2s`
- `.stagger-delay-3`: `transition-delay: 0.3s`

### Efecto Parallax

Implementado en el background del Hero:

```javascript
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroBg = document.getElementById("hero-bg");
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1.1 - scrolled * 0.0002})`;
    }
});
```

- El background se mueve más lento que el scroll (factor 0.3)
- Escala disminuye ligeramente con scroll

### Hover Effects

Patrones comunes:
- **Imágenes**: `grayscale → grayscale-0`, `scale-105`
- **Botones**: `hover:bg-white/20`, `hover:scale-105`
- **Links**: `hover:text-white`, `hover:opacity-90`

## Optimizaciones de Rendimiento

### Estrategias de Carga

1. **Static Site Generation (SSG)**
   - Todo el HTML se genera en build time
   - Sin servidor necesario en producción

2. **Hidratación Parcial**
   - Solo componentes React específicos se hidratan
   - La mayoría del sitio es HTML estático

3. **Asset Optimization**
   - Imágenes locales en formato PNG (considera WebP para mejor compresión)
   - SVGs para logo e iconos (escalables sin pérdida)

4. **CSS Minification**
   - TailwindCSS purge automático de clases no usadas
   - CSS crítico inline en producción

### Métricas Objetivo

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 300ms

### Mejoras Potenciales

- [ ] Convertir imágenes PNG a WebP/AVIF
- [ ] Implementar lazy loading para imágenes fuera de viewport
- [ ] Añadir Service Worker para caching
- [ ] Optimizar fuentes con `font-display: swap`

## Convenciones y Patrones

### Naming Conventions

**Archivos:**
- Componentes: PascalCase (e.g., `Hero.astro`, `Navbar.astro`)
- Estilos: kebab-case (e.g., `global.css`)
- Configuración: kebab-case (e.g., `astro.config.mjs`)

**Classes CSS:**
- Tailwind utilities directo en JSX
- Custom classes en kebab-case (e.g., `.reveal-hidden`, `.custom-input`)

### Code Organization

**Imports Order:**
1. Componentes de Astro
2. Componentes de React (iconos)
3. Estilos

**Componente Structure:**
```astro
---
// Frontmatter: imports, logic TypeScript
import { Icon } from "lucide-react";
---

<!-- Template: HTML + directives de Astro -->
<section>
    <!-- contenido -->
</section>
```

### Best Practices

1. **Semantic HTML**: Usar `<section>`, `<nav>`, `<article>` apropiadamente
2. **Accessibility**: Incluir `alt` en imágenes, `aria-*` cuando necesario
3. **Performance**: Evitar JavaScript innecesario, usar Astro components por defecto
4. **Consistency**: Mantener spacing consistente (py-32 para secciones)
5. **Responsive-First**: Mobile-first approach con breakpoints `md:`, `lg:`

### ID y Anchor Pattern

Secciones tienen `id` para navegación:
```astro
<section id="artists">...</section>
<section id="services">...</section>
<section id="gallery">...</section>
<section id="booking">...</section>
```

Links usan anchors: `<a href="#artists">...</a>`

## Flujo de Datos

Como es un sitio estático sin backend:
- **No hay estado global** (no context, no stores)
- **No hay fetching de datos** (todo está hardcodeado en componentes)
- **Formulario de contacto** requiere integración externa (e.g., Formspree, Netlify Forms)

### Consideraciones Futuras

Si se necesita funcionalidad dinámica:
1. **CMS Headless**: Sanity, Strapi, ContentfulSpanish
2. **Backend para Formularios**: API Routes de Astro, Serverless functions
3. **Analytics**: PostHog, Google Analytics
4. **Sistema de Reservas**: Calendly integration, custom booking system

---

**Última actualización**: 2025-11-21
