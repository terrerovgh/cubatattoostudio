# Cuba Tattoo Studio

Landing page premium + plataforma completa de reservas para Cuba Tattoo Studio en Albuquerque, NM. Experiencia inmersiva tipo app nativa con glassmorphism oscuro, fondos dinamicos con crossfade, navegacion dock estilo iOS, sistema de booking multi-paso con pagos Stripe, panel de administracion, programa de lealtad y sistema de aftercare automatizado.

**Sitio en produccion:** [cubatattoostudio.com](https://cubatattoostudio.com)

## Tabla de Contenidos

- [Vision del Proyecto](#vision-del-proyecto)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rapido](#inicio-rapido)
- [Configuracion de Base de Datos](#configuracion-de-base-de-datos)
- [Configuracion de Stripe](#configuracion-de-stripe)
- [Gestion de Contenido](#gestion-de-contenido)
- [Plataforma de Booking](#plataforma-de-booking)
- [Sistema de Pagos (Stripe)](#sistema-de-pagos-stripe)
- [Panel de Administracion](#panel-de-administracion)
- [Programa de Lealtad](#programa-de-lealtad)
- [Flash Designs & Drops](#flash-designs--drops)
- [Sistema de Aftercare](#sistema-de-aftercare)
- [Consentimiento Digital](#consentimiento-digital)
- [API Reference](#api-reference)
- [Componentes](#componentes)
- [Sistema de Cache de Imagenes](#sistema-de-cache-de-imagenes)
- [Sistema de Diseno](#sistema-de-diseno)
- [Integracion Instagram](#integracion-instagram)
- [Flujos de Usuario](#flujos-de-usuario)
- [Despliegue](#despliegue)
- [CI/CD](#cicd)
- [Variables de Entorno](#variables-de-entorno)
- [Verificacion y Testing](#verificacion-y-testing)
- [Estado del Proyecto](#estado-del-proyecto)

---

## Vision del Proyecto

### Objetivo

Crear una plataforma completa para Cuba Tattoo Studio que combine una landing page visualmente impresionante con un sistema de reservas profesional, pagos integrados, gestion de clientes y herramientas de administracion. El sitio debe sentirse como una aplicacion movil moderna — no como una web tradicional.

### Audiencia

- **Principal**: Clientes potenciales buscando servicios de tatuaje de alta calidad en Albuquerque
- **Secundaria**: Administradores del estudio que gestionan reservas, clientes y contenido
- **Terciaria**: Clientes existentes usando el programa de lealtad y flash drops

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
| **Stripe** | 20.3+ | Procesamiento de pagos y depositos |
| **@stripe/stripe-js** | 8.7+ | SDK de Stripe para el cliente |
| **GSAP** | 3.14+ | ScrollTrigger para deteccion de secciones y animaciones |
| **Three.js** | 0.182+ | Fondos WebGL dinamicos (Color Bends, fluidos) |
| **Nano Stores** | 1.1+ | State management entre React islands |
| **Lucide React** | 0.563+ | Iconos para dock navigation |
| **idb** | 8.0+ | Wrapper Promise-based para IndexedDB (cache de imagenes) |
| **TypeScript** | Strict | Tipado en todo el proyecto |

### Infraestructura

| Servicio | Proposito |
|---|---|
| **Cloudflare Workers** | Hosting y runtime (SSR para API routes) |
| **Cloudflare D1** | Base de datos SQLite (bookings, clientes, pagos, lealtad) |
| **Cloudflare R2** | Almacenamiento de imagenes (upload/serve) |
| **Stripe** | Procesamiento de pagos y webhooks |
| **GitHub Actions** | CI/CD — deploy automatico en push a `main` |

### Dependencias de Desarrollo

| Dependencia | Proposito |
|---|---|
| `@astrojs/cloudflare` | Adapter para Cloudflare Workers |
| `wrangler` | CLI de Cloudflare para deploy y desarrollo local |
| `@cloudflare/workers-types` | Tipos TypeScript para Workers runtime |
| `@tailwindcss/vite` | Plugin Vite para Tailwind v4 |
| `@types/react` / `@types/react-dom` | Tipos TypeScript para React |

---

## Arquitectura

### Patron: Astro Islands + Nano Stores + Cloudflare D1

El sitio usa **Astro Islands Architecture**: la mayor parte del HTML es estatico (cero JS), y los componentes React se hidratan en el cliente para manejar interactividad. Las API routes corren como Cloudflare Workers con acceso a D1 (SQLite) y Stripe.

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌──────────────┐   Nano Stores   ┌────────────┐            │
│  │ScrollObserver│──$activeSection──▶│FloatingDock│            │
│  │   (GSAP)     │  $currentBg     │  (React)   │            │
│  └──────┬───────┘       │         └────────────┘            │
│         │               ▼                                    │
│         │     ┌──────────────────┐                           │
│         │     │BackgroundManager │                           │
│         │     │ (crossfade imgs) │                           │
│         │     └──────────────────┘                           │
│         │                                                    │
│  ┌──────▼──────────────────────────────────────────────┐     │
│  │                 Static HTML (Astro)                  │     │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌─────┐ │     │
│  │  │Hero    │ │Artists │ │Services│ │Promos│ │Book │ │     │
│  │  └────────┘ └────────┘ └────────┘ └──────┘ └─────┘ │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─────────────── Full-page React Apps ──────────────────┐   │
│  │ /booking    BookingWizard (5-step)                    │   │
│  │ /admin      AdminDashboard (analytics, manage)        │   │
│  │ /flash      FlashDrops (browse, claim)                │   │
│  │ /loyalty    LoyaltyWidget (points, rewards)           │   │
│  │ /consent/*  ConsentForm (digital waiver)              │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers (API)                   │
│                                                              │
│  /api/booking/*     Crear reservas, verificar disponibilidad │
│  /api/payments/*    Stripe intents, webhooks                 │
│  /api/admin/*       Dashboard, estadisticas, clientes        │
│  /api/loyalty/*     Puntos, canjear recompensas              │
│  /api/flash/*       Flash designs, claims                    │
│  /api/aftercare/*   Mensajes post-tatuaje                    │
│  /api/images/*      Upload/serve desde R2                    │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌────────────┐               │
│  │ D1 (SQLite)│  │ R2 (Blobs)│  │  Stripe    │               │
│  │ 10 tablas  │  │  imagenes  │  │  payments  │               │
│  └───────────┘  └───────────┘  └────────────┘               │
└──────────────────────────────────────────────────────────────┘
```

### Flujo de Datos (Landing Page)

1. **ScrollObserver** (React, client:only) usa GSAP ScrollTrigger para detectar cual seccion es visible
2. Actualiza `$activeSection` y `$currentBackground` en Nano Stores
3. **BackgroundManager** (React, client:only) escucha `$currentBackground` y hace crossfade de la imagen de fondo
4. **FloatingDock** (React, client:only) escucha `$activeSection` para highlight del icono activo
5. Todo el HTML de secciones es **estatico** — renderizado por Astro en build time desde Content Collections

### Flujo de Datos (Booking)

1. Cliente selecciona artista y servicio en el wizard multi-paso
2. API `/api/booking/availability` consulta D1 para slots disponibles
3. Cliente completa formulario y paga deposito via Stripe
4. API `/api/booking/create` crea booking + payment en D1, genera consent URL
5. Webhook de Stripe confirma pago y actualiza estado
6. Al completar sesion, se programan mensajes de aftercare

### Capas Z-Index

```
z-0   BackgroundManager (fixed, inset-0) — imagenes de fondo + overlay
z-10  <main> — contenido de secciones, GlassCards
z-50  FloatingDock (fixed, bottom) — navegacion dock
z-100 Lightbox Gallery / Modals (fixed) — cuando estan abiertos
```

### React Islands (Landing)

| Componente | Directiva | Razon |
|---|---|---|
| `BackgroundManager` | `client:only="react"` | Requiere DOM para crossfade de imagenes |
| `ScrollObserver` | `client:only="react"` | Requiere GSAP ScrollTrigger (browser API) |
| `FloatingDock` | `client:only="react"` | Requiere estado reactivo para hover/active |
| `GallerySection` | `client:visible` | Lightbox interactivo, lazy-loaded |
| `ColorBends` | `client:only="react"` | WebGL Three.js background |

### React Apps (Full-page)

| Componente | Pagina | Directiva |
|---|---|---|
| `BookingWizard` | `/booking` | `client:only="react"` |
| `AdminDashboard` | `/admin` | `client:only="react"` |
| `FlashDrops` | `/flash` | `client:only="react"` |
| `LoyaltyWidget` | `/loyalty` | `client:only="react"` |
| `ConsentForm` | `/consent/[bookingId]` | `client:only="react"` |

---

## Estructura del Proyecto

```
cubatattoostudio/
├── astro.config.mjs           # Astro config: React + Cloudflare adapter + Tailwind + Stripe SSR
├── wrangler.jsonc             # Cloudflare Workers: D1, R2, custom domains, Stripe vars
├── tsconfig.json              # TypeScript strict + workers-types
├── package.json               # Scripts: dev, build, preview, deploy
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
│   ├── logo.svg               # Logo principal
│   ├── .assetsignore           # Excluye _worker.js de assets publicos
│   ├── backgrounds/           # Imagenes de fondo por seccion
│   ├── gallery/               # Imagenes de galeria por artista
│   │   ├── david/
│   │   ├── karli/
│   │   ├── nina/
│   │   └── studio/
│   └── artists/               # Fotos de perfil de artistas
│
└── src/
    ├── env.d.ts               # Tipos TypeScript para Cloudflare bindings (D1, R2, ASSETS)
    ├── content.config.ts      # Schema de Content Collections (Zod)
    ├── store.ts               # Nano Stores: secciones, fondos, cache stats
    │
    ├── types/
    │   └── booking.ts         # Tipos: Client, Booking, Payment, Consent, Flash, Loyalty, etc.
    │
    ├── lib/
    │   ├── imageCache.ts      # Servicio IndexedDB: get, put, delete, clean, stats
    │   ├── imageUtils.ts      # Compresion, validacion, IDs de imagenes
    │   ├── pricing.ts         # Calculo de precios: base, estilo, schedule, depositos
    │   ├── aftercare.ts       # Generacion de mensajes post-tatuaje (5 pasos, 30 dias)
    │   └── loyalty.ts         # Tiers, puntos, descuentos, codigos de referido/gift card
    │
    ├── hooks/
    │   └── useImageCache.ts   # Hook React: cache-first image loading
    │
    ├── styles/
    │   └── global.css         # Tailwind v4 import + design tokens + scrollbar
    │
    ├── data/
    │   └── instagram.ts       # Datos Instagram (generado por prebuild script)
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
    │   └── BaseLayout.astro   # Layout base: head, fonts, OG tags, preloads
    │
    ├── pages/
    │   ├── index.astro               # Landing page principal
    │   ├── booking/index.astro       # Wizard de reservas (5 pasos)
    │   ├── admin/index.astro         # Panel de administracion (noindex)
    │   ├── consent/[bookingId].astro # Formulario de consentimiento digital
    │   ├── flash/index.astro         # Flash designs y drops
    │   ├── loyalty/index.astro       # Programa de lealtad
    │   ├── artists/[id].astro        # Perfiles individuales de artistas
    │   │
    │   └── api/                      # API Routes (SSR en Cloudflare Workers)
    │       ├── booking/
    │       │   ├── create.ts          # POST — crear reserva + pago
    │       │   ├── availability.ts    # GET — slots disponibles por artista/fecha
    │       │   └── consent.ts         # POST/GET — consentimiento digital
    │       ├── payments/
    │       │   ├── create-intent.ts   # POST — crear Stripe PaymentIntent
    │       │   └── webhook.ts         # POST — webhook de Stripe
    │       ├── admin/
    │       │   ├── bookings.ts        # GET/PATCH — listar/actualizar reservas
    │       │   ├── analytics.ts       # GET — estadisticas del dashboard
    │       │   └── clients.ts         # GET/PATCH — listar/actualizar clientes
    │       ├── loyalty/
    │       │   ├── points.ts          # GET/POST — consultar/agregar puntos
    │       │   └── redeem.ts          # GET/POST — catalogo/canjear recompensas
    │       ├── flash/
    │       │   ├── drops.ts           # GET/POST — listar/crear flash designs
    │       │   └── claim.ts           # POST — reclamar un flash design
    │       ├── aftercare/
    │       │   └── status.ts          # GET/POST — ver/programar aftercare
    │       └── images/
    │           ├── upload.ts          # POST — subir imagen a R2
    │           ├── [...id].ts         # GET/DELETE — servir/eliminar imagen
    │           └── cache-status.ts    # GET — listar imagenes en R2
    │
    └── components/
        ├── BackgroundManager.tsx      # Island: crossfade de fondos (z-0, fixed)
        ├── ScrollObserver.tsx         # Island: GSAP ScrollTrigger (invisible)
        ├── FloatingDock.tsx           # Island: dock iOS con glass-morphism
        ├── CachedImage.tsx            # Wrapper: cache IndexedDB para imagenes R2
        ├── GlassCard.astro            # Componente puro: tarjeta glassmorphism
        ├── SectionWrapper.astro       # Componente puro: wrapper de seccion
        ├── FrostedServiceCard.astro   # Componente puro: tarjeta de servicio
        ├── FlashDayModal.astro        # Modal: Flash Day promotions
        │
        ├── sections/
        │   ├── HeroSection.astro          # Hero: logo + WebGL background + CTA
        │   ├── ArtistsSection.astro       # Artistas: grid de profiles
        │   ├── ServicesSection.astro      # Servicios: frosted cards premium
        │   ├── PromosSection.astro        # Promos: marquee + flash day
        │   ├── GallerySection.tsx         # Galeria: grid + lightbox + cache
        │   ├── GallerySectionWrapper.astro
        │   └── BookingSection.astro       # CTA de reserva + contacto
        │
        ├── artist/
        │   ├── ArtistHero.astro           # Hero para pagina individual de artista
        │   └── ArtistBio.astro            # Bio y detalles del artista
        │
        ├── booking/
        │   ├── BookingWizard.tsx           # Wizard principal: 5 pasos
        │   ├── StepServiceSelect.tsx      # Paso 1: artista + servicio + estilo
        │   ├── StepConsultation.tsx       # Paso 2: descripcion + placement + size
        │   ├── BodySelector.tsx           # Selector visual de ubicacion corporal
        │   ├── StepCalendar.tsx           # Paso 3: fecha + hora + disponibilidad
        │   ├── StepPayment.tsx            # Paso 4: Stripe Elements + deposito
        │   └── StepConfirmation.tsx       # Paso 5: resumen + consent link
        │
        ├── admin/
        │   └── AdminDashboard.tsx         # Panel: stats, bookings, clientes
        │
        ├── consent/
        │   └── ConsentForm.tsx            # Consentimiento medico/legal + firma
        │
        ├── flash/
        │   └── FlashDrops.tsx             # Browse + claim flash designs
        │
        └── loyalty/
            └── LoyaltyWidget.tsx          # Puntos, tier, recompensas
```

---

## Inicio Rapido

### Requisitos Previos

- Node.js 22+
- npm
- Cuenta de Cloudflare (para D1 y deploy)
- Cuenta de Stripe (para pagos)

### Instalacion

```bash
# Clonar repositorio
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Instalar dependencias
npm install

# Configurar variables de entorno
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
| `npm run preview` | Preview local con Cloudflare Workers runtime (acceso a D1, R2) |
| `npm run deploy` | Build + deploy a Cloudflare Workers |
| `npm run migrate-r2` | Migrar imagenes locales de `public/gallery/` a R2 |
| `npm run astro` | CLI de Astro para comandos adicionales |

---

## Configuracion de Base de Datos

### Cloudflare D1

El sistema de booking usa Cloudflare D1 (SQLite distribuido). Para configurar:

```bash
# 1. Crear base de datos
wrangler d1 create cubatattoostudio-db

# 2. Copiar el database_id generado a wrangler.jsonc
# Descomentar el bloque d1_databases y pegar el ID

# 3. Crear las tablas (schema)
wrangler d1 execute cubatattoostudio-db --file=schema.sql
```

### Tablas de la Base de Datos

| Tabla | Proposito | Registros clave |
|---|---|---|
| `clients` | Clientes del estudio | email, loyalty_points, loyalty_tier, visit_count, total_spent |
| `bookings` | Reservas/citas | artist_id, status, scheduled_date, deposit_amount, consent_signed |
| `payments` | Pagos Stripe | stripe_payment_intent_id, amount, type, status |
| `consent_forms` | Consentimientos firmados | booking_id, signature_data, acknowledgements medicos |
| `flash_designs` | Disenos flash disponibles | artist_id, price, drop_date, claimed_count |
| `flash_claims` | Reclamaciones de flash | flash_design_id, client_id, discount_applied |
| `loyalty_transactions` | Historial de puntos | points, type, balance_after |
| `aftercare_messages` | Mensajes post-tatuaje | day_number, type, scheduled_for, status |
| `schedule_overrides` | Excepciones de horario | artist_id, override_date, is_available |
| `audit_log` | Log de auditorias | entity_type, action, actor, changes |

---

## Configuracion de Stripe

### Claves necesarias

```bash
# En wrangler.jsonc vars o como secrets de Cloudflare
STRIPE_SECRET_KEY=sk_test_...     # Secret key del dashboard de Stripe
STRIPE_WEBHOOK_SECRET=whsec_...   # Signing secret del endpoint de webhook
```

### Configurar Webhook

1. Ir a Stripe Dashboard > Webhooks
2. Crear endpoint: `https://cubatattoostudio.com/api/payments/webhook`
3. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copiar el signing secret a `STRIPE_WEBHOOK_SECRET`

### Modo Test vs Live

- Usar claves `sk_test_` y `pk_test_` para desarrollo
- Cambiar a `sk_live_` y `pk_live_` para produccion
- El webhook secret tambien cambia entre test y live

---

## Gestion de Contenido

### Content Collections

Todo el contenido de la landing page se gestiona via archivos Markdown en `src/content/sections/`.

### Schema de Seccion

Definido en `src/content.config.ts` con validacion Zod:

```typescript
{
  order: number,           // Orden de aparicion (1, 2, 3...)
  id: string,              // ID unico ('hero', 'artists', 'services'...)
  backgroundImage: string, // Ruta a imagen de fondo ('/backgrounds/hero.svg')
  layout: enum,            // Tipo de layout
  title?: string,
  subtitle?: string,
  artists?: Artist[],      // Solo para layout 'profile-card'
  services?: Service[],    // Solo para layout 'list-services'
  bookingUrl?: string,     // Solo para layout 'booking-cta'
  phone?: string,
  email?: string,
  address?: string,
}
```

### Layouts Soportados

| Layout | Componente | Uso |
|---|---|---|
| `hero-center` | `HeroSection.astro` | Titulo grande + CTA + WebGL |
| `profile-card` | `ArtistsSection.astro` | Grid de tarjetas de artistas |
| `list-services` | `ServicesSection.astro` | Lista tipo menu premium |
| `grid-gallery` | `GallerySectionWrapper.astro` | Grid de imagenes con lightbox |
| `booking-cta` | `BookingSection.astro` | CTA grande + info de contacto |

---

## Plataforma de Booking

### Wizard de 5 pasos (`/booking`)

| Paso | Componente | Descripcion |
|---|---|---|
| 1. Servicio | `StepServiceSelect.tsx` | Seleccion de artista, tipo de servicio y estilo |
| 2. Consulta | `StepConsultation.tsx` | Descripcion del tatuaje, ubicacion (body selector), tamano, imagenes de referencia |
| 3. Calendario | `StepCalendar.tsx` | Fecha y hora con disponibilidad en tiempo real |
| 4. Pago | `StepPayment.tsx` | Stripe Elements para deposito, resumen de precio |
| 5. Confirmacion | `StepConfirmation.tsx` | Resumen completo + link a formulario de consentimiento |

### Motor de Precios (`src/lib/pricing.ts`)

**Precios base por tamano:**

| Tamano | Rango | Dimensiones |
|---|---|---|
| Tiny | $50 - $100 | < 2" |
| Small | $100 - $250 | 2-4" |
| Medium | $250 - $500 | 4-6" |
| Large | $500 - $1,200 | 6-10" |
| XLarge | $1,200 - $3,000 | 10"+ |

**Multiplicadores por estilo:**

| Estilo | Multiplicador |
|---|---|
| Color Realism | 1.30x |
| Cover-ups | 1.40x |
| Black & Grey Realism | 1.20x |
| Neo-Traditional | 1.15x |
| Custom Tattoos | 1.15x |
| Pet Tattoos | 1.10x |
| Fine Line & Dotwork | 1.00x |
| Flash | 0.85x |

**Modificadores de horario:**
- Fin de semana: +15%
- Horario nocturno (6pm+): +20%
- Cover-up surcharge: +40%
- Touch-up discount: -50%

**Calculo de deposito:**
- Sesiones <= 3 horas: 30% del precio max (min $50, max $100)
- Sesiones > 3 horas: 25% del precio max (min $100, max $250)

### Horarios de Artistas

| Artista | Disponibilidad |
|---|---|
| David | Mar-Sab 11:00-19:00 |
| Nina | Mar-Vie 11:00-19:00, Sab 11:00-17:00 |
| Karli | Mar-Vie 11:00-19:00, Sab 11:00-17:00 |

Todos descansan Domingo y Lunes. Horarios sobreescribibles via tabla `schedule_overrides`.

---

## Sistema de Pagos (Stripe)

### Flujo de pago

```
Cliente llena wizard → selecciona fecha/hora → ve estimado de precio
    → Stripe Elements carga → ingresa tarjeta → confirma deposito
    → POST /api/booking/create (crea booking + PaymentIntent)
    → Stripe procesa pago → webhook confirma
    → booking.status = 'deposit_paid'
```

### Tipos de pago

| Tipo | Descripcion |
|---|---|
| `deposit` | Deposito inicial para reservar |
| `final` | Pago final al completar sesion |
| `tip` | Propina |
| `refund` | Reembolso |
| `gift_card` | Pago con gift card |

### Webhook Events

| Evento | Accion |
|---|---|
| `payment_intent.succeeded` | payment → `succeeded`, booking → `deposit_paid` |
| `payment_intent.payment_failed` | payment → `failed` |
| `charge.refunded` | Actualiza montos de refund (total o parcial) |

---

## Panel de Administracion

### Acceso (`/admin`)

- Protegido con Bearer token (`ADMIN_PASSWORD`)
- Pagina marcada con `noindex, nofollow`
- React SPA completa (`AdminDashboard.tsx`)

### Funcionalidades

**Dashboard:** Total bookings, bookings hoy, revenue mes/dia, pending bookings, avg booking value, no-show rate, top artista/servicio, revenue por artista, bookings por estado, ultimas 10 reservas.

**Gestion de Bookings:** Filtrar por estado/artista/fecha, paginacion, actualizar estado, notas de artista, precio final, cancelar con razon.

**Gestion de Clientes:** Buscar por nombre/email/telefono, filtrar por tier, ver historial completo (bookings, pagos, lealtad, consentimientos), editar notas.

---

## Programa de Lealtad

### Tiers (`src/lib/loyalty.ts`)

| Tier | Puntos | Descuento | Priority Booking | Birthday Bonus | Referral Bonus | Multiplicador |
|---|---|---|---|---|---|---|
| Standard | 0 | 0% | No | 50 pts | 25 pts | 1.0x |
| Silver | 500 | 5% | No | 100 pts | 35 pts | 1.25x |
| Gold | 1,500 | 10% | Si | 150 pts | 50 pts | 1.5x |
| VIP | 3,000 | 15% | Si | 250 pts | 75 pts | 2.0x |

### Como ganar puntos

| Accion | Puntos |
|---|---|
| Por cada $1 gastado | 1 punto (x multiplicador de tier) |
| Referir un amigo | 250 puntos |
| Dejar un review | 75 puntos |
| Compartir foto de tatuaje | 50 puntos |

### Recompensas canjeables

| Recompensa | Costo | Beneficio |
|---|---|---|
| 5% Discount | 200 pts | 5% off |
| 10% Discount | 400 pts | 10% off |
| 15% Discount | 600 pts | 15% off |
| Free Touch-up | 500 pts | 100% off touch-up |
| Priority Booking (1 mes) | 300 pts | Booking prioritario |

---

## Flash Designs & Drops

### Como funciona (`/flash`)

1. Artistas crean flash designs via API (admin auth requerido)
2. Designs pueden ser normales o "drops" con fecha de lanzamiento
3. Clientes navegan y reclaman designs en `/flash`
4. Early bird: los primeros N claims reciben descuento extra
5. Cuando se reclaman todos los slots, el design cambia a `claimed`

---

## Sistema de Aftercare

### Secuencia automatizada (`src/lib/aftercare.ts`)

Cuando una sesion se marca como `completed`, se programan 5 mensajes:

| Dia | Tipo | Contenido |
|---|---|---|
| 0 | `care_instructions` | Guia completa de aftercare (24h, dias 1-14, dias 14-30) |
| 3 | `check_in` | Check-in sobre el proceso de sanacion |
| 7 | `photo_request` | Solicitud de foto (+50 puntos de lealtad) |
| 14 | `review_request` | Solicitud de review en Google/Instagram (+75 puntos) |
| 30 | `followup_coupon` | Cupon 10% off siguiente sesion (COMEBACK10) |

---

## Consentimiento Digital

### Formulario (`/consent/[bookingId]`)

**Informacion recopilada:** Nombre completo, fecha de nacimiento, ID gubernamental, contacto de emergencia, alergias, condiciones medicas, embarazo, anticoagulantes, condiciones de piel, consumo de alcohol.

**Reconocimientos obligatorios:** Mayor de 18, sobrio, comprende aftercare, comprende riesgo de infeccion, no hay garantia de resultado exacto, aprueba diseno final.

**Firma digital:** Canvas, IP address, user agent, timestamp. Todo en D1 con audit log.

---

## API Reference

### Booking

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/booking/create` | POST | No | Crear reserva + procesar deposito |
| `/api/booking/availability?artist_id=X&date=Y` | GET | No | Consultar slots disponibles |
| `/api/booking/consent` | POST | No | Enviar consentimiento firmado |
| `/api/booking/consent?booking_id=X` | GET | No | Verificar consentimiento |

### Payments

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/payments/create-intent` | POST | No | Crear Stripe PaymentIntent |
| `/api/payments/webhook` | POST | Stripe Signature | Webhook de Stripe |

### Admin (requiere Bearer token)

| Endpoint | Metodo | Descripcion |
|---|---|---|
| `/api/admin/bookings` | GET | Listar bookings (filtros: status, artist_id, date_from, date_to, page, limit) |
| `/api/admin/bookings` | PATCH | Actualizar booking (status, artist_notes, final_price, cancellation_reason) |
| `/api/admin/analytics` | GET | Dashboard de estadisticas |
| `/api/admin/clients` | GET | Listar/buscar clientes |
| `/api/admin/clients?id=X` | GET | Detalle completo de un cliente |
| `/api/admin/clients` | PATCH | Actualizar cliente (notes, preferred_artist, loyalty_tier) |

### Loyalty

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/loyalty/points?email=X` | GET | No | Consultar puntos y tier |
| `/api/loyalty/points` | POST | No | Agregar puntos |
| `/api/loyalty/redeem` | GET | No | Catalogo de recompensas |
| `/api/loyalty/redeem` | POST | No | Canjear recompensa |

### Flash Designs

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/flash/drops` | GET | No | Listar flash designs |
| `/api/flash/drops` | POST | Bearer | Crear flash design (admin) |
| `/api/flash/claim` | POST | No | Reclamar un flash design |

### Aftercare

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/aftercare/status?booking_id=X` | GET | No | Ver aftercare programado |
| `/api/aftercare/status` | POST | No | Programar mensajes de aftercare |

### Images (R2)

| Endpoint | Metodo | Auth | Descripcion |
|---|---|---|---|
| `/api/images/upload` | POST | Bearer | Subir imagen a R2 |
| `/api/images/{id}` | GET | No | Servir imagen con ETag/304 |
| `/api/images/{id}` | DELETE | Bearer | Eliminar imagen |
| `/api/images/cache-status` | GET | No | Listar imagenes en R2 |

---

## Componentes

### Landing Page Islands

- **BackgroundManager** — Crossfade de fondos (1200ms), overlay oscuro, Nano Stores
- **ScrollObserver** — GSAP ScrollTriggers, animaciones `[data-animate]`
- **FloatingDock** — Dock iOS, magnificacion hover scale(1.25), items: Home/Artists/Services/Gallery/Book
- **GlassCard** — `bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl`
- **FrostedServiceCard** — Tarjeta de servicio con efecto frosted glass
- **FlashDayModal** — Modal de Flash Day promotions

### Booking Components

- **BookingWizard** — Wizard 5 pasos con barra de progreso
- **StepServiceSelect** — Seleccion de artista/servicio/estilo
- **StepConsultation** — Descripcion, placement, size
- **BodySelector** — Selector visual interactivo de ubicacion corporal
- **StepCalendar** — Fecha/hora con disponibilidad real
- **StepPayment** — Stripe Elements + resumen de deposito
- **StepConfirmation** — Resumen + consent link

### Management Components

- **AdminDashboard** — SPA completa: metricas, bookings, clientes, analytics
- **ConsentForm** — Formulario medico/legal con canvas para firma digital
- **FlashDrops** — Grid de flash designs con filtros y claims
- **LoyaltyWidget** — Puntos, tier, progreso, historial, recompensas

---

## Sistema de Cache de Imagenes

```
Navegador → IndexedDB cache (Blob) → API /api/images/* → Cloudflare R2
                                   ↘ /gallery/* (imagenes estaticas, sin cache)
```

- **Base de datos:** `cubatattoo-images` v1, TTL 7 dias, eviccion LRU a 50MB
- **API:** getCachedImage, putCachedImage, deleteCachedImage, clearCache, getCacheStats

---

## Sistema de Diseno

### Paleta de Colores

- **Gold accent:** `#C8956C` (CTAs, booking), light `#D4A574`, dark `#A87A55`
- **Fondos:** Negro `#000000`, grises oscuros `#0a0a0a`, `#111111`
- **Texto:** Blanco, blanco/70, blanco/50 para jerarquia
- **Glass:** `rgba(0,0,0,0.4)` fondo, `rgba(255,255,255,0.1)` borde

### Tipografia

- **Font:** Inter (Google Fonts), weights 300-900
- **Hero:** text-5xl sm:text-6xl lg:text-8xl font-black

### Tokens Glassmorphism

`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4 sm:mx-8 lg:mx-auto`

### Responsive

| Breakpoint | Viewport | Comportamiento |
|---|---|---|
| Default | < 640px | Cards full-width, dock compacto |
| `sm` | >= 640px | Cards con mx-8 |
| `md` | >= 768px | Grid 3 cols artistas |
| `lg` | >= 1024px | Cards max-w-4xl centrado |

---

## Integracion Instagram

Script `scripts/fetch-insta.js` se ejecuta en prebuild, fetch desde Instagram Basic Display API, guarda en `src/data/instagram.json`. Si falla, usa datos cacheados o array vacio — el build nunca falla.

---

## Flujos de Usuario

### Flujo 1: Nuevo cliente reserva online

```
cubatattoostudio.com → explora landing → "Book Your Session"
    → /booking → artista + servicio → descripcion + ubicacion
    → fecha/hora → deposito Stripe → confirmacion + consent link
    → /consent/[id] → firma digital → sesion → aftercare (30 dias)
```

### Flujo 2: Cliente recurrente

```
/loyalty → ve puntos/tier → /booking → email detectado
    → descuento automatico (5-10%) → puntos acumulados post-sesion
    → sube de tier → canjea recompensas
```

### Flujo 3: Flash Drop

```
Artista crea design (admin) → /flash → countdown al drop
    → primeros claims = early bird discount → reclama → reserva cita
```

### Flujo 4: Admin

```
/admin → auth → dashboard metricas → gestionar bookings/clientes
    → mark completed → actualiza stats → programa aftercare
```

---

## Despliegue

### Cloudflare Workers

```bash
npm run deploy  # astro build && wrangler deploy
```

**Dominios:** `cubatattoostudio.com` y `www.cubatattoostudio.com` (custom_domain: true)

---

## CI/CD

Cada push a `main` ejecuta `.github/workflows/deploy.yml`:

```
push → checkout → node 22 → npm ci → astro build → wrangler deploy
```

**Secrets GitHub:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

---

## Variables de Entorno

| Variable | Uso | Requerida |
|---|---|---|
| `STRIPE_SECRET_KEY` | API key de Stripe server-side | Si (pagos) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del webhook | Si (webhooks) |
| `ADMIN_PASSWORD` | Password para admin y APIs protegidas | Si |
| `SITE_URL` | URL base del sitio | No (default: cubatattoostudio.com) |
| `INSTAGRAM_ACCESS_TOKEN` | Fetch de posts en build time | No |
| `INSTAGRAM_RAPIDAPI_KEY` | API alternativa de Instagram | No |
| `UPLOAD_SECRET` | Token Bearer para uploads R2 | Solo R2 |
| `R2_ACCOUNT_ID` | Cuenta Cloudflare para R2 | Solo R2 |
| `R2_ACCESS_KEY_ID` | Credenciales R2 | Solo R2 |
| `R2_SECRET_ACCESS_KEY` | Secret key R2 | Solo R2 |
| `R2_BUCKET_NAME` | Nombre del bucket R2 | Solo R2 |
| `PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | No |
| `PUBLIC_SUPABASE_ANON_KEY` | Clave anonima Supabase | No |

---

## Verificacion y Testing

### Landing Page

- [ ] `npm run dev` — sitio carga sin errores
- [ ] Scroll — fondos crossfade entre secciones
- [ ] WebGL hero — Color Bends renderizan
- [ ] Dock — magnificacion hover, highlight activo
- [ ] Responsive — 375px, 768px, 1440px
- [ ] Galeria — filtro por artista, lightbox
- [ ] Artistas — paginas `/artists/[id]`

### Booking Platform

- [ ] `/booking` — 5 pasos del wizard
- [ ] Body selector interactivo
- [ ] Calendario con disponibilidad (requiere D1)
- [ ] Stripe Elements + deposito
- [ ] `/consent/[id]` — formulario + firma
- [ ] `/admin` — dashboard + gestion
- [ ] `/flash` — listar + reclamar
- [ ] `/loyalty` — puntos + recompensas
- [ ] Stripe webhook funcional

### Deploy

- [ ] `npm run build` — build exitoso
- [ ] `npm run deploy` — deploy exitoso
- [ ] CI/CD — push a main → deploy automatico
- [ ] D1 configurada y accesible
- [ ] Stripe webhooks configurados

---

## Estado del Proyecto

### Completado

- [x] Landing page premium con glassmorphism, crossfade backgrounds, dock iOS
- [x] WebGL backgrounds con Three.js (Color Bends, fluid simulations)
- [x] Paginas individuales de artistas con portfolios
- [x] Galeria con lightbox, filtros por artista y paginacion
- [x] Seccion de promociones con marquee y Flash Day modal
- [x] Content Collections para gestion de contenido via Markdown
- [x] Sistema de cache de imagenes con IndexedDB + R2
- [x] Integracion Instagram en build-time
- [x] CI/CD con GitHub Actions
- [x] Booking Wizard — reservas online en 5 pasos
- [x] Motor de precios — precios dinamicos por tamano, estilo, horario
- [x] Disponibilidad en tiempo real — calendario con slots por artista
- [x] Integracion Stripe — depositos, PaymentIntents, webhooks
- [x] Panel de administracion — dashboard con estadisticas y gestion
- [x] Programa de lealtad — 4 tiers, puntos, recompensas canjeables
- [x] Flash Designs & Drops — flash con early bird discounts
- [x] Consentimiento digital — formulario medico/legal con firma
- [x] Sistema de aftercare — 5 mensajes automatizados en 30 dias
- [x] Gestion de clientes — perfiles completos con historial
- [x] Audit logging — registro de acciones criticas
- [x] Body selector — selector visual de ubicacion corporal
- [x] Gift cards y referral system — tipos y estructura definidos
- [x] 22 API endpoints funcionales
- [x] 10+ componentes React interactivos
- [x] Tipos TypeScript completos (30+ interfaces/types)

### Pendiente / Mejoras Futuras

- [ ] Crear base de datos D1 en Cloudflare y ejecutar schema SQL
- [ ] Habilitar R2 binding en `wrangler.jsonc`
- [ ] Configurar Stripe webhook en produccion
- [ ] Configurar secrets en Cloudflare (ADMIN_PASSWORD, STRIPE keys)
- [ ] Implementar envio real de emails para aftercare
- [ ] Implementar SMS como canal alternativo
- [ ] Agregar Structured Data (LocalBusiness JSON-LD)
- [ ] Agregar @astrojs/sitemap
- [ ] Agregar analytics (GA / Plausible)
- [ ] Optimizar imagenes con srcset
- [ ] Gift cards como flujo completo (compra + redencion)
- [ ] Notificaciones push para flash drops

---

## Decisiones Arquitectonicas

1. **Astro `output: 'static'`** — SSR por ruta via `prerender = false` sin `output: 'hybrid'`
2. **Tailwind v4 via Vite plugin** — mejor rendimiento, CSS-first config
3. **client:only="react"** — evita SSR de componentes con browser APIs
4. **Nano Stores** — funciona entre islands independientes (no React Context)
5. **Cloudflare D1** — SQLite distribuido, zero cold starts
6. **Stripe import dinamico** — `await import('stripe')` para Workers compatibility
7. **Vite SSR external stripe** — `vite.ssr.external: ['stripe']` evita bundling issues
8. **Instagram en build-time** — sin CORS, sin API keys expuestas
9. **IndexedDB Blob storage** — 33% mas eficiente que base64
10. **Audit logging** — operaciones criticas registradas en D1
11. **Type-safe API** — `ApiResponse<T>` con `satisfies` para type checking
12. **Content Collections** — Content Layer API de Astro 5 con glob loader
