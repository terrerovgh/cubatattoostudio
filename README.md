# Cuba Tattoo Studio

Landing page premium para Cuba Tattoo Studio en Albuquerque, NM. Experiencia inmersiva tipo app nativa con glassmorphism oscuro, fondos dinámicos con crossfade, y navegación dock estilo iOS.

**Sitio en producción:** [cubatattoostudio.com](https://cubatattoostudio.com)

## Tabla de Contenidos

- [Visión del Proyecto](#visión-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rápido](#inicio-rápido)
- [Gestión de Contenido](#gestión-de-contenido)
- [Nuevas Funcionalidades](#nuevas-funcionalidades)
- [Sistema de Caché de Imágenes](#sistema-de-caché-de-imágenes)
- [API de Imágenes (R2)](#api-de-imágenes-r2)
- [Sistema de Diseño](#sistema-de-diseño)
- [Integración Instagram](#integración-instagram)
- [Despliegue](#despliegue)
- [Variables de Entorno](#variables-de-entorno)

---

## Visión del Proyecto

### Objetivo

Crear una landing page que impresione visualmente a clientes potenciales, muestre el trabajo de los artistas (David, Nina, Karli), y convierta visitas en consultas/bookings. El sitio debe sentirse como una aplicación móvil moderna con transiciones fluidas.

### Principios de Diseño

- Experiencia de tarjetas flotantes sobre fondo dinámico.
- Transiciones de fondo crossfade suaves.
- Paleta dark premium con acentos en Gold (#C8956C).
- Dock navigation simple e icónico tipo iOS.

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Astro** | 5.0+ | Framework SSG con soporte SSR por ruta |
| **React** | 19.0+ | Islands interactivos (client:only) |
| **Tailwind CSS** | 4.0+ | Estilos utility-first via Vite plugin |
| **Cloudflare D1** | SQLite | Base de datos para bookings, flash drops y usuarios |
| **Cloudflare R2** | Storage | Almacenamiento de imágenes de galería |
| **Stripe** | API | Procesamiento de pagos y depósitos |
| **GSAP** | 3.14+ | Animaciones y ScrollTrigger |
| **Nano Stores** | 1.1+ | State management entre islas |
| **Zod** | 3.23+ | Validación de esquemas y tipos |

---

## Arquitectura

### Patrón: Astro Islands + Cloudflare Workers

El sitio utiliza una arquitectura híbrida:
1. **SSG (Static Site Generation):** La mayoría de las secciones (Hero, Artists, Gallery) se generan estáticamente.
2. **SSR (Server Side Rendering):** Las rutas de API (`/api/*`), Admin (`/admin`), Flash Drops (`/flash`) y Booking se ejecutan en el borde (Cloudflare Workers).
3. **Islands:** Componentes React interactivos (`FlashDrops`, `AdminDashboard`, `FloatingDock`) se hidratan en el cliente.

### Base de Datos (D1)

Se utiliza Cloudflare D1 (SQLite distribuido) para manejar:
- **Bookings:** Citas, disponibilidad, estados.
- **Flash Drops:** Diseños disponibles, claims, conteo de stock.
- **Usuarios:** Autenticación de admin.
- **Clientes:** Información de contacto y lealtad.

---

## Estructura del Proyecto

```
cubatattoostudio/
├── wrangler.jsonc             # Configuración Cloudflare (D1, R2, Assets)
├── package.json               # Dependencias y scripts
├── .env.example               # Variables de entorno requeridas
│
├── scripts/
│   ├── fetch-insta.js         # Script prebuild: fetch Instagram posts
│   └── migrate-to-r2.js       # Migración de imágenes a R2
│
├── src/
│   ├── assets/                # Assets optimizados por Astro
│   │   ├── gallery/           # Imágenes de galería (git-tracked)
│   │   └── artists/           # Fotos de perfil
│   │
│   ├── content/               # Content Collections (Markdown)
│   │   └── sections/          # Definición de secciones (Home)
│   │
│   ├── lib/
│   │   ├── db/                # Esquemas y migraciones D1
│   │   ├── auth.ts            # Lógica de autenticación Admin
│   │   └── imageCache.ts      # Cliente IndexedDB
│   │
│   ├── pages/
│   │   ├── index.astro        # Home (SSG)
│   │   ├── admin/             # Dashboard administrativo (SSR)
│   │   ├── flash/             # Flash Drops (SSR)
│   │   ├── booking/           # Flujo de reserva (SSR)
│   │   └── api/               # API Endpoints (Workers)
│   │       ├── admin/         # Gestión de bookings/auth
│   │       ├── flash/         # Lógica de drops/claims
│   │       └── images/        # Upload/Serve imágenes R2
│   │
│   └── components/            # Componentes React y Astro
```

---

## Inicio Rápido

### Requisitos Previos

- Node.js 22+
- Cuenta de Cloudflare (para D1/R2)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus secretos (STRIPE, ADMIN_PASSWORD, etc.)

# Configurar Base de Datos (Local)
npx wrangler d1 execute cubatattoostudio-db --local --file=src/lib/db/schema.sql

# Iniciar desarrollo
npm run dev
```

### Scripts Principales

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor local con acceso a D1 local y R2 remoto (si configurado) |
| `npm run build` | Build de producción (incluye fetch de Instagram) |
| `npm run preview` | Vista previa usando wrangler dev |
| `npm run deploy` | Despliegue a Cloudflare Pages/Workers |
| `npm run migrate-r2` | Utilidad para mover imágenes locales a R2 |

---

## Nuevas Funcionalidades

### 🔐 Admin Dashboard
Accesible en `/admin`, protegido por contraseña (`ADMIN_PASSWORD`). Permite:
- Ver y gestionar solicitudes de citas.
- Administrar disponibilidad de artistas.
- Ver lista de clientes y su historial.
- Subir nuevas imágenes a la galería (R2).

### ⚡ Flash Drops
Sección `/flash` para lanzamientos de diseños exclusivos:
- **Drops Limitados:** Diseños con cantidad limitada.
- **Early Bird:** Descuentos automáticos para los primeros claims.
- **Countdown:** Temporizadores para próximos lanzamientos.
- **Claim System:** Reserva rápida sin pago inmediato (pago en estudio).

### 🏷️ Promos Section
Nueva sección en el Home gestionada desde `src/content/sections/` con layout `promo-grid`. Permite destacar ofertas, mercancía o eventos especiales.

---

## Gestión de Contenido

Todo el contenido del Home se gestiona via archivos Markdown en `src/content/sections/`.

### Layouts Soportados

| Layout | Uso |
|---|---|
| `hero-center` | Título grande + CTA |
| `profile-card` | Grid de artistas |
| `list-services` | Lista de precios/servicios |
| `grid-gallery` | Galería masónry con lightbox |
| `booking-cta` | CTA de reserva + contacto |
| `promo-grid` | Grid de promociones/anuncios |

---

## API de Imágenes (R2)

Las imágenes se sirven desde Cloudflare R2 para optimizar ancho de banda y permitir uploads dinámicos desde el Admin.

- **Upload:** `POST /api/images/upload` (Requiere `UPLOAD_SECRET`)
- **Serve:** `GET /api/images/{id}` (Soporta ETag/304 caching)

---

## Variables de Entorno

Ver `.env.example` para referencia.

| Variable | Descripción |
|---|---|
| `SITE_URL` | URL base del sitio (para SEO/OG) |
| `ADMIN_PASSWORD` | Contraseña para acceso al Dashboard |
| `STRIPE_SECRET_KEY` | Llave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secreto para webhooks de Stripe |
| `UPLOAD_SECRET` | Token Bearer para subir imágenes vía API |
| `R2_*` | Credenciales para Cloudflare R2 |
| `INSTAGRAM_*` | Credenciales para fetch de feed en build-time |

---

## Verificación y Testing

Para verificar que todo funcione correctamente:

1. **DB Local:** Asegúrate de ejecutar `wrangler d1 execute ... --local` antes de iniciar.
2. **Auth:** Intenta acceder a `/admin` con la contraseña configurada.
3. **Flash:** Verifica que `/flash` cargue los diseños (puedes insertar datos de prueba en D1).
4. **Booking:** Prueba el flujo de disponibilidad en `/booking`.
