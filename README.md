# Cuba Tattoo Studio

Landing page premium para Cuba Tattoo Studio en Albuquerque, NM. Experiencia inmersiva tipo app nativa con glassmorphism oscuro, fondos dinámicos con crossfade, y navegación dock estilo iOS.

## Tabla de Contenidos

- [Vision del Proyecto](#vision-del-proyecto)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rapido](#inicio-rapido)
- [Gestion de Contenido](#gestion-de-contenido)
- [Componentes](#componentes)
- [Sistema de Diseno](#sistema-de-diseno)
- [Integracion Instagram](#integracion-instagram)
- [Flujos de Usuario](#flujos-de-usuario)
- [Plan de Implementacion](#plan-de-implementacion)
- [Despliegue](#despliegue)
- [Verificacion y Testing](#verificacion-y-testing)

---

## Vision del Proyecto

### Objetivo

Crear una landing page que impresione visualmente a clientes potenciales, muestre el trabajo de los artistas (David, Nina, Karli), y convierta visitas en consultas/bookings. El sitio debe sentirse como una aplicacion movil moderna con transiciones fluidas — no como una web tradicional de bloques apilados.

### Audiencia

- **Principal**: Clientes potenciales buscando servicios de tatuaje de alta calidad en Albuquerque
- **Secundaria**: Administradores del estudio que gestionan contenido via archivos Markdown

### Principios de Diseno

- Experiencia de tarjetas flotantes sobre fondo dinamico (nunca bloques apilados)
- Transiciones de fondo crossfade suaves/liquidas (nunca bruscas)
- Motion sutil y premium (nunca sobrecargado)
- Paleta dark premium (nunca colores brillantes/saturados)
- Dock navigation simple e iconico tipo iOS
- Tarjetas siempre flotan con margin (nunca tocan bordes del viewport)
- Calidad nivel Behance/Awwwards

---

## Stack Tecnologico

| Tecnologia | Version | Proposito |
|---|---|---|
| **Astro** | 5.17+ | Framework SSG — genera HTML estatico |
| **React** | 19.2+ | Islands interactivos (client:only) |
| **Tailwind CSS** | 4.1+ | Estilos utility-first via Vite plugin |
| **GSAP** | 3.14+ | ScrollTrigger para deteccion de secciones y animaciones |
| **Nano Stores** | 1.1+ | State management entre React islands |
| **Lucide React** | 0.563+ | Iconos para dock navigation |
| **TypeScript** | Strict | Tipado en todo el proyecto |

### Dependencias de Desarrollo

| Dependencia | Proposito |
|---|---|
| `@tailwindcss/vite` | Plugin Vite para Tailwind v4 (reemplaza @astrojs/tailwind deprecado) |
| `@types/react` | Tipos TypeScript para React |
| `@types/react-dom` | Tipos TypeScript para React DOM |

---

## Arquitectura

### Patron: Astro Islands + Nano Stores

El sitio usa **Astro Islands Architecture**: la mayor parte del HTML es estatico (cero JS), y solo 3 componentes React se hidratan en el cliente para manejar interactividad.

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│  ┌──────────────┐    Nano Stores    ┌────────────┐  │
│  │ ScrollObserver│───$activeSection──▶│FloatingDock│  │
│  │   (GSAP)     │   $currentBg      │  (React)   │  │
│  └──────┬───────┘        │          └────────────┘  │
│         │                ▼                          │
│         │      ┌─────────────────┐                  │
│         │      │BackgroundManager│                  │
│         │      │ (crossfade imgs)│                  │
│         │      └─────────────────┘                  │
│         │                                           │
│  ┌──────▼──────────────────────────────────────┐    │
│  │              Static HTML (Astro)             │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │Hero     │ │Artists  │ │Services │ ...    │    │
│  │  │Section  │ │Section  │ │Section  │        │    │
│  │  └─────────┘ └─────────┘ └─────────┘       │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **ScrollObserver** (React, client:only) usa GSAP ScrollTrigger para detectar cual seccion es visible
2. Actualiza `$activeSection` y `$currentBackground` en Nano Stores
3. **BackgroundManager** (React, client:only) escucha `$currentBackground` y hace crossfade de la imagen de fondo
4. **FloatingDock** (React, client:only) escucha `$activeSection` para highlight del icono activo
5. Todo el HTML de secciones es **estatico** — renderizado por Astro en build time desde Content Collections

### Capas Z-Index

```
z-0   BackgroundManager (fixed, inset-0) — imagenes de fondo + overlay
z-10  <main> — contenido de secciones, GlassCards
z-50  FloatingDock (fixed, bottom) — navegacion dock
z-100 Lightbox Gallery (fixed, modal) — cuando esta abierto
```

### React Islands

| Componente | Directiva | Razon |
|---|---|---|
| `BackgroundManager` | `client:only="react"` | Requiere DOM para crossfade de imagenes |
| `ScrollObserver` | `client:only="react"` | Requiere GSAP ScrollTrigger (browser API) |
| `FloatingDock` | `client:only="react"` | Requiere estado reactivo para hover/active |
| `GallerySection` | `client:visible` | Lightbox interactivo, lazy-loaded |

---

## Estructura del Proyecto

```
cubatattoostudio/
├── astro.config.mjs           # Astro config: React integration + Tailwind Vite plugin
├── tsconfig.json              # TypeScript strict + path alias @/*
├── package.json               # Scripts: dev, prebuild, build, preview
├── .env.example               # Variables de entorno documentadas
├── .gitignore                 # node_modules, dist, .env, .astro
│
├── scripts/
│   └── fetch-insta.js         # Script prebuild: fetch Instagram posts → JSON
│
├── public/                    # Assets estaticos (copiados tal cual a dist/)
│   ├── favicon.svg            # Monograma "CT" en gold (#C8956C)
│   ├── backgrounds/           # Imagenes de fondo por seccion
│   │   ├── hero.svg           # Fondo hero (placeholder SVG oscuro)
│   │   ├── artists.svg        # Fondo artistas (tono purpura oscuro)
│   │   ├── services.svg       # Fondo servicios (tono azul oscuro)
│   │   ├── gallery.svg        # Fondo galeria (tono calido oscuro)
│   │   └── booking.svg        # Fondo booking (acento gold sutil)
│   └── artists/               # Fotos de artistas
│       ├── david.svg          # Placeholder avatar "D"
│       ├── nina.svg           # Placeholder avatar "N"
│       └── karli.svg          # Placeholder avatar "K"
│
└── src/
    ├── content.config.ts      # Schema de Content Collections (Zod)
    ├── store.ts               # Nano Stores: $activeSection, $currentBackground
    │
    ├── styles/
    │   └── global.css         # Tailwind v4 import + design tokens + scrollbar
    │
    ├── data/
    │   └── instagram.json     # Datos Instagram (generado por prebuild script)
    │
    ├── content/
    │   └── sections/          # Content Collection: secciones del sitio
    │       ├── 01-hero.md
    │       ├── 02-artists.md
    │       ├── 03-services.md
    │       ├── 04-gallery.md
    │       └── 05-booking.md
    │
    ├── layouts/
    │   └── BaseLayout.astro   # Layout base: head, fonts, OG tags, islands
    │
    ├── pages/
    │   └── index.astro        # Pagina principal: orquesta secciones desde collection
    │
    └── components/
        ├── BackgroundManager.tsx     # Island: crossfade de fondos (z-0, fixed)
        ├── ScrollObserver.tsx        # Island: GSAP ScrollTrigger (invisible)
        ├── FloatingDock.tsx          # Island: dock iOS con magnificacion
        ├── GlassCard.astro           # Componente puro: tarjeta glassmorphism
        ├── SectionWrapper.astro      # Componente puro: wrapper de seccion
        └── sections/
            ├── HeroSection.astro         # Seccion hero: titulo + CTA
            ├── ArtistsSection.astro      # Seccion artistas: grid de profiles
            ├── ServicesSection.astro      # Seccion servicios: lista premium
            ├── GallerySection.tsx        # Seccion galeria: grid + lightbox (React)
            ├── GallerySectionWrapper.astro # Wrapper Astro para GallerySection
            └── BookingSection.astro      # Seccion booking: CTA + contacto
```

---

## Inicio Rapido

### Requisitos Previos

- Node.js 18+
- npm o pnpm

### Instalacion

```bash
# Clonar repositorio
git clone <repo-url> cubatattoostudio
cd cubatattoostudio

# Instalar dependencias
npm install

# (Opcional) Configurar Instagram API
cp .env.example .env
# Editar .env con tu INSTAGRAM_ACCESS_TOKEN

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estara disponible en `http://localhost:4321`

### Comandos

| Comando | Accion |
|---|---|
| `npm run dev` | Servidor de desarrollo en localhost:4321 |
| `npm run build` | Build de produccion a `./dist/` (ejecuta prebuild primero) |
| `npm run preview` | Preview del build de produccion |
| `npm run astro` | CLI de Astro para comandos adicionales |

---

## Gestion de Contenido

### Content Collections

Todo el contenido del sitio se gestiona via archivos Markdown en `src/content/sections/`. Cada archivo representa una seccion de la pagina.

### Schema de Seccion

Definido en `src/content.config.ts` con validacion Zod:

```typescript
{
  order: number,           // Orden de aparicion (1, 2, 3...)
  id: string,              // ID unico ('hero', 'artists', 'services'...)
  backgroundImage: string, // Ruta a imagen de fondo ('/backgrounds/hero.svg')
  layout: enum,            // Tipo de layout (ver abajo)
  title?: string,          // Titulo de la seccion
  subtitle?: string,       // Subtitulo
  artists?: Artist[],      // Solo para layout 'profile-card'
  services?: Service[],    // Solo para layout 'list-services'
  bookingUrl?: string,     // Solo para layout 'booking-cta'
  phone?: string,          // Solo para layout 'booking-cta'
  email?: string,          // Solo para layout 'booking-cta'
  address?: string,        // Solo para layout 'booking-cta'
}
```

### Layouts Soportados

| Layout | Componente | Uso |
|---|---|---|
| `hero-center` | `HeroSection.astro` | Titulo grande centrado + CTA |
| `profile-card` | `ArtistsSection.astro` | Grid de tarjetas de artistas |
| `list-services` | `ServicesSection.astro` | Lista tipo menu premium |
| `grid-gallery` | `GallerySectionWrapper.astro` | Grid de imagenes con lightbox |
| `booking-cta` | `BookingSection.astro` | CTA grande + info de contacto |

### Agregar una Nueva Seccion

1. Crear archivo `src/content/sections/0X-nombre.md`
2. Definir frontmatter con los campos requeridos:

```yaml
---
order: 6
id: mi-nueva-seccion
backgroundImage: /backgrounds/nueva.svg
layout: hero-center
title: Mi Nueva Seccion
subtitle: Descripcion aqui
---
```

3. Agregar imagen de fondo en `public/backgrounds/`
4. Rebuild: `npm run build`

### Agregar un Nuevo Artista

Editar `src/content/sections/02-artists.md` y agregar al array `artists`:

```yaml
artists:
  - name: NuevoArtista
    role: Especialidad
    image: /artists/nuevo.svg
    instagram: "@nuevo_cubatattoo"
```

### Modificar Servicios

Editar `src/content/sections/03-services.md` y modificar el array `services`:

```yaml
services:
  - name: Nombre del Servicio
    description: Descripcion breve
    price: "$100+"  # Opcional
```

---

## Componentes

### BackgroundManager (`src/components/BackgroundManager.tsx`)

Capa de fondo fija que cubre todo el viewport. Escucha cambios en `$currentBackground` (Nano Store) y ejecuta transiciones crossfade.

**Funcionamiento:**
1. Mantiene 2 capas `<div>` superpuestas con `backgroundImage`
2. Cuando `$currentBackground` cambia, preload la nueva imagen via `new Image()`
3. Una vez cargada, activa CSS transition opacity de 1200ms
4. Al completar la transicion, swap: la capa "next" se convierte en "current"
5. Overlay oscuro permanente (gradient from-black/60 via-black/40 to-black/70)

**Props:** Ninguno (lee estado global via Nano Stores)

### ScrollObserver (`src/components/ScrollObserver.tsx`)

Componente invisible que registra GSAP ScrollTriggers para cada seccion del DOM.

**Funcionamiento:**
1. Al montar, busca todos los elementos con `[data-section]`
2. Lee `data-bg` de cada seccion para construir mapa seccion→fondo
3. Crea un ScrollTrigger por seccion: `start: 'top center'`, `end: 'bottom center'`
4. En `onEnter`/`onEnterBack`: actualiza `$activeSection` y `$currentBackground`
5. Tambien anima elementos con `[data-animate]`: fade-in + translateY + scale
6. **Cleanup**: en unmount, mata todos los ScrollTriggers

**Props:** Ninguno (invisible, no renderiza UI)

### FloatingDock (`src/components/FloatingDock.tsx`)

Barra de navegacion flotante estilo iOS dock en la parte inferior de la pantalla.

**Items:**
| Icono | Seccion | Notas |
|---|---|---|
| Home | `#hero` | |
| Users | `#artists` | |
| Palette | `#services` | |
| LayoutGrid | `#gallery` | |
| CalendarDays | `#booking` | Acento gold, mas grande (w-14 h-14) |

**Comportamiento:**
- Hover: magnificacion scale(1.25) + label visible
- Active: fondo `bg-white/10` + dot indicator
- Click: `scrollIntoView({ behavior: 'smooth' })`
- Booking: borde gold, icono gold, siempre destacado

### GlassCard (`src/components/GlassCard.astro`)

Componente Astro puro (zero JS) para tarjetas con efecto glassmorphism.

**Props:**
| Prop | Default | Descripcion |
|---|---|---|
| `class` | `''` | Clases CSS adicionales |
| `padding` | `'p-8 sm:p-10 lg:p-12'` | Padding interno |
| `maxWidth` | `'max-w-4xl'` | Ancho maximo |
| `animate` | `true` | Si se anima al entrar en viewport |

**Estilos fijos:**
- `bg-black/40 backdrop-blur-xl` — fondo difuminado
- `border border-white/10` — borde sutil
- `rounded-3xl shadow-2xl` — esquinas redondeadas + sombra
- `mx-4 sm:mx-8 lg:mx-auto` — margen para flotar (nunca toca edges)

### SectionWrapper (`src/components/SectionWrapper.astro`)

Wrapper para cada seccion de la pagina. Proporciona atributos `data-section` y `data-bg` que el ScrollObserver lee.

**Props:**
| Prop | Descripcion |
|---|---|
| `id` | ID de la seccion (usado para navegacion) |
| `backgroundImage` | URL de la imagen de fondo asociada |
| `class` | Clases CSS adicionales |

**Estilos:** `min-h-screen flex items-center justify-center py-20 lg:py-32`

---

## Sistema de Diseno

### Paleta de Colores

```css
/* Definidos en src/styles/global.css via @theme */
--color-gold: #C8956C;           /* Acento principal — CTAs, booking, highlights */
--color-gold-light: #D4A574;     /* Hover state del gold */
--color-gold-dark: #A87A55;      /* Pressed state del gold */
--color-glass-bg: rgba(0,0,0,0.4);         /* Fondo de glass cards */
--color-glass-border: rgba(255,255,255,0.1); /* Borde de glass cards */
```

**Dominantes:** Negro (#000000), grises oscuros (#0a0a0a, #111111)
**Texto:** Blanco (#FFFFFF), blanco/70, blanco/50 para jerarquia
**Acento:** Gold/copper (#C8956C) solo para CTAs y elementos destacados

### Tipografia

- **Font family:** Inter (Google Fonts), weights 300-900
- **Hero title:** text-5xl sm:text-6xl lg:text-8xl font-black
- **Section titles:** text-3xl sm:text-4xl lg:text-5xl font-bold
- **Body text:** text-base, text-white/70 o text-white/50
- **Labels:** text-sm, text-[9px] para dock labels

### Tokens Glassmorphism

```
Fondo:      bg-black/40
Blur:       backdrop-blur-xl
Borde:      border border-white/10
Esquinas:   rounded-3xl (24px)
Sombra:     shadow-2xl
Margen:     mx-4 sm:mx-8 lg:mx-auto (siempre flota)
```

### Animaciones

| Elemento | Animacion | Duracion |
|---|---|---|
| Background crossfade | opacity 0→1 | 1200ms ease-in-out |
| GlassCard entrada | opacity 0→1, y 40→0, scale 0.96→1 | 800ms power2.out |
| Dock hover | scale 1→1.25 | 200ms ease-out |
| Dock label | opacity 0→1 | 200ms |
| CTA hover | scale 1→1.05 | 300ms |

### Responsive Breakpoints

| Breakpoint | Viewport | Comportamiento |
|---|---|---|
| Default | < 640px | Cards full-width con mx-4, dock compacto |
| `sm` | >= 640px | Cards con mx-8, tipografia mas grande |
| `md` | >= 768px | Grid 3 cols para artistas |
| `lg` | >= 1024px | Cards max-w-4xl centrado, tipografia hero 8xl |

---

## Integracion Instagram

### Como Funciona

1. El script `scripts/fetch-insta.js` se ejecuta automaticamente antes de cada build (`prebuild`)
2. Llama a la Instagram Basic Display API con el token configurado
3. Filtra solo posts de tipo IMAGE y CAROUSEL_ALBUM (max 12)
4. Guarda el resultado en `src/data/instagram.json`
5. El componente `GallerySection` importa este JSON estaticamente

### Configuracion

```bash
# En .env
INSTAGRAM_ACCESS_TOKEN=tu_token_aqui
```

**Obtener token:** Seguir la [documentacion de Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started).

### Formato de Datos

```json
{
  "posts": [
    {
      "id": "17895695668004550",
      "imageUrl": "https://...",
      "caption": "Descripcion del post",
      "permalink": "https://instagram.com/p/...",
      "timestamp": "2026-01-15T10:30:00+0000"
    }
  ],
  "lastFetched": "2026-02-11T18:00:00.000Z"
}
```

### Fallback

Si no hay token o la API falla:
1. El script busca datos cacheados existentes
2. Si hay datos previos, los mantiene
3. Si no hay nada, escribe `{ "posts": [], "lastFetched": null }`
4. La galeria muestra placeholders grises con icono de imagen
5. **El build nunca falla por falta de datos de Instagram**

---

## Flujos de Usuario

### Flujo 1: Exploracion por Scroll

```
Visitante llega → Hero (impacto visual, CTA "Book a Consultation")
    ↓ scroll
Artistas (David, Nina, Karli — fotos, roles, Instagram links)
    ↓ scroll (fondo cambia con crossfade suave)
Servicios (lista tipo menu — Custom, Cover-ups, Fine Line...)
    ↓ scroll
Galeria (grid de Instagram, lightbox al click)
    ↓ scroll
Booking (CTA grande gold, telefono, email, redes sociales)
```

### Flujo 2: Navegacion Directa via Dock

```
Visitante ve dock flotante en bottom
    → Click en icono "Artists" → smooth scroll a seccion artistas
    → Click en icono "Book" (gold) → smooth scroll a booking
    → Fondo cambia automaticamente al llegar a cada seccion
```

### Flujo 3: Consulta/Booking

```
Visitante ve portfolio de artista → decide booking
    → Click "Book a Consultation" (hero) o icono dock "Book"
    → Llega a BookingSection → click CTA → redirige a bookingUrl
    → O usa telefono/email para contactar directamente
```

### Flujo 4: Admin — Actualizar Contenido

```
Admin edita src/content/sections/02-artists.md
    → Cambia nombre/rol/imagen de artista
    → npm run build
    → Deploy automatico (si CI/CD configurado)
    → Cambios visibles en produccion
```

---

## Plan de Implementacion

### Estado Actual: Completado

Todas las fases del plan original han sido implementadas:

| Fase | Estado | Descripcion |
|---|---|---|
| Phase 1 | Completada | Scaffold Astro, React, Tailwind v4, GSAP, Nano Stores |
| Phase 2 | Completada | Store, BackgroundManager, ScrollObserver, BaseLayout |
| Phase 3 | Completada | GlassCard, SectionWrapper, FloatingDock |
| Phase 4 | Completada | Content Collections schema + 5 secciones .md |
| Phase 5 | Completada | index.astro + 5 section components |
| Phase 6 | Completada | Instagram fetch script + placeholder data |
| Phase 7 | Completada | Animaciones GSAP, responsive, scrollbar styling |
| Phase 8 | Completada | SEO meta tags, OG tags, favicon, build exitoso |

### Decisiones Arquitectonicas Tomadas

1. **Tailwind v4 via Vite plugin** (no @astrojs/tailwind deprecado) — mejor rendimiento, CSS-first config
2. **client:only="react"** para los 3 islands principales — evita SSR de componentes que requieren browser APIs
3. **Nano Stores** en lugar de React Context — funciona entre islands independientes
4. **Content Collections con glob loader** — Content Layer API de Astro 5
5. **Instagram en build-time** — sin fetch client-side, sin CORS, sin API keys expuestas
6. **SVG placeholders** — permiten desarrollo sin fotos reales, reemplazables por WebP
7. **GlassCard como componente Astro puro** — zero JS, maximo rendimiento

### Pendientes / Mejoras Futuras

- [ ] Reemplazar SVG placeholders con fotos reales (WebP recomendado)
- [ ] Configurar Instagram API token en `.env`
- [ ] Configurar URL real de booking en `05-booking.md`
- [ ] Actualizar datos de contacto (telefono, email, direccion)
- [ ] Actualizar handles de Instagram de los artistas
- [ ] Agregar Structured Data (LocalBusiness schema JSON-LD)
- [ ] Agregar @astrojs/sitemap para SEO
- [ ] Configurar CI/CD para deploy automatico
- [ ] Agregar analytics (Google Analytics / Plausible)
- [ ] Optimizar imagenes con srcset para diferentes tamaños
- [ ] Agregar apple-touch-icon para iOS

---

## Despliegue

### Build de Produccion

```bash
npm run build
```

Esto ejecuta:
1. `prebuild` — fetch Instagram posts (o fallback)
2. `astro build` — genera HTML estatico en `./dist/`

### Preview Local

```bash
npm run preview
```

### Plataformas Recomendadas

El output es **HTML estatico puro** — compatible con cualquier hosting:

- **Vercel**: `npm run build`, output dir: `dist`
- **Netlify**: build command: `npm run build`, publish dir: `dist`
- **Cloudflare Pages**: framework preset: Astro
- **GitHub Pages**: deploy desde `dist/`

---

## Verificacion y Testing

### Checklist de Verificacion

```
[ ] npm run dev — sitio carga sin errores en localhost:4321
[ ] Scroll vertical — fondos cambian con crossfade suave entre secciones
[ ] Dock — navegacion funcional, magnificacion hover, highlight activo
[ ] Responsive 375px — dock compacto, cards full-width con margen
[ ] Responsive 768px — grid artistas 3 columnas
[ ] Responsive 1440px — cards centradas max-w-4xl
[ ] GlassCards — flotan con margen, nunca tocan bordes del viewport
[ ] Content — editar .md, rebuild, cambios reflejados
[ ] npm run build — build estatico exitoso sin errores
[ ] npm run preview — preview funcional en localhost
[ ] Lighthouse — performance score > 90
```

### Output del Build

```
dist/
├── index.html                    # Pagina principal
├── favicon.svg                   # Favicon
├── backgrounds/                  # Imagenes de fondo
├── artists/                      # Fotos de artistas
└── _astro/                       # JS bundles
    ├── client.Dc9Vh3na.js        # React runtime (~186KB gzip ~58KB)
    ├── ScrollObserver.BZXCjf-2.js # GSAP bundle (~115KB gzip ~45KB)
    ├── FloatingDock.CGutWVWS.js  # Dock + Lucide icons (~7KB)
    ├── GallerySection.vm3aiw3L.js # Gallery component (~4.6KB)
    ├── BackgroundManager.C54ieUGo.js # Background crossfade (~1KB)
    └── store.CrJuNOjd.js         # Nano Stores (~0.6KB)
```
