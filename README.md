# Cuba Tattoo Studio

Landing page premium para Cuba Tattoo Studio en Albuquerque, NM. Experiencia inmersiva tipo app nativa con glassmorphism oscuro, fondos dinámicos con crossfade, y navegación dock estilo iOS.

**Sitio en produccion:** [cubatattoostudio.com](https://cubatattoostudio.com)

## Tabla de Contenidos

- [Vision del Proyecto](#vision-del-proyecto)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rapido](#inicio-rapido)
- [Gestion de Contenido](#gestion-de-contenido)
- [Componentes](#componentes)
- [Sistema de Cache de Imagenes](#sistema-de-cache-de-imagenes)
- [API de Imagenes (R2)](#api-de-imagenes-r2)
- [Sistema de Diseno](#sistema-de-diseno)
- [Integracion Instagram](#integracion-instagram)
- [Flujos de Usuario](#flujos-de-usuario)
- [Despliegue](#despliegue)
- [CI/CD](#cicd)
- [Variables de Entorno](#variables-de-entorno)
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
| **Astro** | 5.17+ | Framework SSG con soporte SSR por ruta |
| **React** | 19.2+ | Islands interactivos (client:only) |
| **Tailwind CSS** | 4.1+ | Estilos utility-first via Vite plugin |
| **GSAP** | 3.14+ | ScrollTrigger para deteccion de secciones y animaciones |
| **Nano Stores** | 1.1+ | State management entre React islands |
| **Lucide React** | 0.563+ | Iconos para dock navigation |
| **idb** | 8.0+ | Wrapper Promise-based para IndexedDB (cache de imagenes) |
| **TypeScript** | Strict | Tipado en todo el proyecto |

### Infraestructura

| Servicio | Proposito |
|---|---|
| **Cloudflare Workers** | Hosting y runtime (SSR para API routes) |
| **Cloudflare R2** | Almacenamiento de imagenes (upload/serve) |
| **GitHub Actions** | CI/CD — deploy automatico en push a `main` |

### Dependencias de Desarrollo

| Dependencia | Proposito |
|---|---|
| `@astrojs/cloudflare` | Adapter para Cloudflare Workers |
| `wrangler` | CLI de Cloudflare para deploy y desarrollo local |
| `@cloudflare/workers-types` | Tipos TypeScript para Workers runtime |
| `@tailwindcss/vite` | Plugin Vite para Tailwind v4 |
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

### API Routes (SSR)

Las rutas bajo `src/pages/api/` usan `export const prerender = false` para ejecutarse como Cloudflare Workers en runtime (no pre-renderizadas).

---

## Estructura del Proyecto

```
cubatattoostudio/
├── astro.config.mjs           # Astro config: React + Cloudflare adapter + Tailwind
├── wrangler.jsonc             # Cloudflare Workers config: R2, custom domains, assets
├── tsconfig.json              # TypeScript strict + workers-types
├── package.json               # Scripts: dev, build, preview, deploy, migrate-r2
├── .env.example               # Variables de entorno documentadas
├── .gitignore                 # node_modules, dist, .env, .astro
│
├── .github/workflows/
│   └── deploy.yml             # CI/CD: build + deploy a Cloudflare en push a main
│
├── scripts/
│   ├── fetch-insta.js         # Script prebuild: fetch Instagram posts → JSON
│   └── migrate-to-r2.js      # Migrar imagenes locales a Cloudflare R2
│
├── public/                    # Assets estaticos (copiados tal cual a dist/)
│   ├── logo.svg               # Logo principal (hero, favicon, OG image)
│   ├── .assetsignore          # Excluye _worker.js de assets publicos
│   ├── backgrounds/           # Imagenes de fondo por seccion (SVG)
│   ├── gallery/               # Imagenes de galeria
│   │   ├── david/             # Trabajos de David
│   │   ├── karli/             # Trabajos de Karli
│   │   ├── nina/              # Trabajos de Nina
│   │   └── studio/            # Fotos del estudio
│   └── artists/               # Fotos de perfil de artistas (JPG)
│
└── src/
    ├── env.d.ts               # Tipos TypeScript para Cloudflare bindings (R2, ASSETS)
    ├── content.config.ts      # Schema de Content Collections (Zod)
    ├── store.ts               # Nano Stores: secciones, fondos, cache stats
    │
    ├── lib/
    │   ├── imageCache.ts      # Servicio IndexedDB: get, put, delete, clean, stats
    │   └── imageUtils.ts      # Compresion, validacion, IDs de imagenes
    │
    ├── hooks/
    │   └── useImageCache.ts   # Hook React: cache-first image loading
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
    │   └── BaseLayout.astro   # Layout base: head, fonts, OG tags, preloads, islands
    │
    ├── pages/
    │   ├── index.astro        # Pagina principal: orquesta secciones desde collection
    │   └── api/images/        # API routes (SSR en Cloudflare Workers)
    │       ├── upload.ts      # POST — subir imagen a R2
    │       ├── [...id].ts     # GET/DELETE — servir/eliminar imagen de R2
    │       └── cache-status.ts # GET — listar imagenes en R2
    │
    └── components/
        ├── BackgroundManager.tsx     # Island: crossfade de fondos (z-0, fixed)
        ├── ScrollObserver.tsx        # Island: GSAP ScrollTrigger (invisible)
        ├── FloatingDock.tsx          # Island: dock iOS con glass-morphism inline
        ├── CachedImage.tsx           # Wrapper: cache IndexedDB para imagenes R2
        ├── GlassCard.astro           # Componente puro: tarjeta glassmorphism
        ├── SectionWrapper.astro      # Componente puro: wrapper de seccion
        └── sections/
            ├── HeroSection.astro         # Seccion hero: logo + CTA
            ├── ArtistsSection.astro      # Seccion artistas: grid de profiles
            ├── ServicesSection.astro      # Seccion servicios: lista premium
            ├── GallerySection.tsx        # Seccion galeria: grid + lightbox + cache
            ├── GallerySectionWrapper.astro # Wrapper Astro para GallerySection
            └── BookingSection.astro      # Seccion booking: CTA + contacto
```

---

## Inicio Rapido

### Requisitos Previos

- Node.js 22+
- npm

### Instalacion

```bash
# Clonar repositorio
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Instalar dependencias
npm install

# (Opcional) Configurar variables de entorno
cp .env.example .env
# Editar .env con tus tokens

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estara disponible en `http://localhost:4321`

### Comandos

| Comando | Accion |
|---|---|
| `npm run dev` | Servidor de desarrollo en localhost:4321 |
| `npm run build` | Build de produccion a `./dist/` (ejecuta prebuild primero) |
| `npm run preview` | Preview local con Cloudflare Workers runtime (acceso a R2) |
| `npm run deploy` | Build + deploy a Cloudflare Workers |
| `npm run migrate-r2` | Migrar imagenes locales de `public/gallery/` a R2 |
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

### CachedImage (`src/components/CachedImage.tsx`)

Componente wrapper que decide automaticamente si cachear una imagen en IndexedDB.

**Comportamiento:**
- Si `src` empieza con `/api/images/` → usa `useImageCache` hook (imagen R2, cacheada en IndexedDB)
- De lo contrario → renderiza `<img>` normal (imagen estatica, sin overhead de cache)
- Muestra spinner mientras carga desde cache/red

**Props:**
| Prop | Descripcion |
|---|---|
| `imageId` | ID unico de la imagen |
| `src` | URL de la imagen |
| `alt` | Texto alternativo |
| `artist?` | Nombre del artista (para metadata de cache) |
| `className?` | Clases CSS |
| `loading?` | `'lazy'` o `'eager'` |

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

## Sistema de Cache de Imagenes

### Arquitectura

```
Navegador → IndexedDB cache (Blob) → API /api/images/* → Cloudflare R2
                                   ↘ /gallery/* (imagenes estaticas, sin cache)
```

### IndexedDB (`src/lib/imageCache.ts`)

- **Base de datos:** `cubatattoo-images`, version 1
- **Object store:** `images` con keyPath `id`
- **Indices:** `by-expiry`, `by-artist`, `by-cached-at`
- **TTL:** 7 dias por defecto, verificacion lazy al leer
- **Eviccion LRU:** limpieza automatica al alcanzar 50MB
- **SSR guard:** rechaza operaciones si `window` no esta definido

**API publica:**

| Funcion | Descripcion |
|---|---|
| `getCachedImage(id)` | Obtener imagen cacheada (verifica TTL) |
| `putCachedImage(entry)` | Guardar imagen en cache |
| `deleteCachedImage(id)` | Eliminar imagen del cache |
| `getAllCachedImages()` | Listar todas las imagenes cacheadas |
| `clearCache()` | Limpiar todo el cache |
| `getCacheStats()` | Obtener conteo y tamaño total |
| `cleanExpired()` | Eliminar entradas expiradas |

### Hook React (`src/hooks/useImageCache.ts`)

```typescript
const { imageUrl, loading, error, fromCache } = useImageCache(imageId, networkUrl, options?)
```

**Resolucion:** IndexedDB cache → fetch de red → URL raw como fallback.
Crea `URL.createObjectURL(blob)` para renderizar, limpia URLs al desmontar.

### Utilidades (`src/lib/imageUtils.ts`)

| Funcion | Descripcion |
|---|---|
| `compressImage(blob, options)` | Redimensionar via Canvas, configurable |
| `generateImageId(artist)` | ID unico desde timestamp + random |
| `getMimeType(file)` | Deteccion MIME desde File.type o extension |
| `validateImageFile(file, maxSizeMB)` | Validacion de tipo y tamaño |

---

## API de Imagenes (R2)

Todas las rutas usan `export const prerender = false` y se ejecutan como Cloudflare Workers.

| Endpoint | Metodo | Auth | Descripcion |
|----------|--------|------|-------------|
| `/api/images/upload` | POST | Bearer token | Subir imagen (FormData: file, artist, caption) |
| `/api/images/{id}` | GET | No | Servir imagen con ETag/304 |
| `/api/images/{id}` | DELETE | Bearer token | Eliminar imagen de R2 |
| `/api/images/cache-status` | GET | No | Listar imagenes en R2 |

### Upload

```bash
curl -X POST \
  -F "file=@imagen.jpg" \
  -F "artist=david" \
  -F "caption=Nuevo trabajo" \
  -H "Authorization: Bearer <UPLOAD_SECRET>" \
  https://cubatattoostudio.com/api/images/upload
```

**Respuesta:** `{ id, url, artist, caption }`

### Servir imagen

```bash
curl https://cubatattoostudio.com/api/images/gallery/david/1234567890-abc123.jpg
```

Soporta `If-None-Match` (ETag) para respuestas 304 Not Modified.

> **Nota:** Las API routes de R2 requieren que el binding `r2_buckets` este habilitado en `wrangler.jsonc`. Actualmente esta comentado pendiente de que el API token tenga el permiso R2 Storage: Edit.

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
Visitante llega → Hero (logo + CTA "Reserva tu Consulta")
    ↓ scroll
Artistas (David, Nina, Karli — fotos, roles, Instagram links)
    ↓ scroll (fondo cambia con crossfade suave)
Servicios (lista tipo menu — Custom, Cover-ups, Fine Line...)
    ↓ scroll
Galeria (grid filtrable por artista, lightbox al click)
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
    → Click "Reserva tu Consulta" (hero) o icono dock "Book"
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

## Despliegue

### Cloudflare Workers

El sitio se despliega como Cloudflare Worker con assets estaticos. La configuracion esta en `wrangler.jsonc`.

**Dominios configurados:**
- `cubatattoostudio.com` (principal)
- `www.cubatattoostudio.com`

Ambos usan `custom_domain: true` — Cloudflare crea y gestiona los registros DNS automaticamente.

### Deploy manual

```bash
npm run deploy
```

Esto ejecuta `astro build && wrangler deploy`. Requiere autenticacion via `wrangler login` o las variables `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`.

### Build de produccion (solo build)

```bash
npm run build
```

Ejecuta:
1. `prebuild` — fetch Instagram posts (o fallback)
2. `astro build` — genera output en `./dist/`

### Preview local con Workers runtime

```bash
npm run preview
```

Usa `wrangler dev` para ejecutar localmente con acceso a R2 y el runtime de Cloudflare Workers.

---

## CI/CD

### GitHub Actions

Cada push a `main` ejecuta automaticamente el workflow `.github/workflows/deploy.yml`:

```
push a main → checkout → setup node 22 → npm ci → astro build → wrangler deploy
```

Tiempo tipico: ~45 segundos.

### Secrets requeridos en GitHub

| Secret | Descripcion |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token API de Cloudflare con permisos Workers Scripts: Edit |
| `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta de Cloudflare |

Configurar en: GitHub repo → Settings → Secrets and variables → Actions.

---

## Variables de Entorno

Ver `.env.example` para la lista completa.

| Variable | Uso | Requerida |
|----------|-----|-----------|
| `INSTAGRAM_ACCESS_TOKEN` | Fetch de posts de Instagram en build time | No |
| `INSTAGRAM_RAPIDAPI_KEY` | API alternativa de Instagram via RapidAPI | No |
| `R2_ACCOUNT_ID` | Cuenta de Cloudflare para R2 | Solo para R2 |
| `R2_ACCESS_KEY_ID` | Credenciales de acceso a R2 | Solo para R2 |
| `R2_SECRET_ACCESS_KEY` | Secret key de R2 | Solo para R2 |
| `R2_BUCKET_NAME` | Nombre del bucket R2 | Solo para R2 |
| `UPLOAD_SECRET` | Token Bearer para autenticar uploads via API | Solo para uploads |

### Decisiones Arquitectonicas

1. **Astro `output: 'static'` con Cloudflare adapter** — Astro 5 soporta SSR por ruta via `prerender = false` sin necesidad de `output: 'hybrid'`
2. **Tailwind v4 via Vite plugin** (no @astrojs/tailwind deprecado) — mejor rendimiento, CSS-first config
3. **client:only="react"** para islands — evita SSR de componentes que requieren browser APIs
4. **Nano Stores** en lugar de React Context — funciona entre islands independientes
5. **Content Collections con glob loader** — Content Layer API de Astro 5
6. **Instagram en build-time** — sin fetch client-side, sin CORS, sin API keys expuestas
7. **IndexedDB con Blob storage** — 33% mas eficiente que base64, TTL + LRU nativo
8. **`custom_domain: true`** en Wrangler — Cloudflare gestiona DNS automaticamente
9. **`public/.assetsignore`** — previene exposicion de `_worker.js` en assets publicos
10. **Imagenes en git** — gallery images tracked en git para que CI/CD builds las incluyan

### Pendientes / Mejoras Futuras

- [ ] Habilitar R2 binding en `wrangler.jsonc` (requiere permiso R2 Storage: Edit en API token)
- [ ] Agregar Structured Data (LocalBusiness schema JSON-LD)
- [ ] Agregar @astrojs/sitemap para SEO
- [ ] Agregar analytics (Google Analytics / Plausible)
- [ ] Optimizar imagenes con srcset para diferentes tamaños

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
[ ] Galeria — filtro por artista funcional, lightbox abre/cierra
[ ] Imagenes — todas las imagenes cargan en /gallery/ (sin 404)
[ ] Content — editar .md, rebuild, cambios reflejados
[ ] npm run build — build exitoso sin errores
[ ] npm run deploy — deploy a Cloudflare sin errores
[ ] CI/CD — push a main → GitHub Actions → deploy exitoso
[ ] Produccion — cubatattoostudio.com carga correctamente
[ ] Cache — DevTools → Application → IndexedDB → cubatattoo-images (si R2 activo)
```
