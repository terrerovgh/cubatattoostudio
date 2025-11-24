# Documentación de Componentes

Esta guía documenta todos los componentes del sitio de Cuba Tattoo Studio, tanto componentes Astro como componentes React/TSX.

## Tabla de Contenidos

### Componentes Astro (Frontend Público)
- [Layout](#layout)
- [Navbar](#navbar)
- [Hero](#hero)
- [Services](#services)
- [Artists](#artists)
- [Gallery](#gallery)
- [Booking](#booking)
- [Footer](#footer)

### Componentes React/TSX
- [Dashboard Administrativo](#dashboard-administrativo)
  - [DashboardPage](#dashboardpage)
  - [DashboardLayout](#dashboardlayout)
  - [DashboardStats](#dashboardstats)
  - [ActivityChart](#activitychart)
  - [DistributionChart](#distributionchart)
  - [RecentActivity](#recentactivity)
  - [Sidebar](#sidebar)
- [Autenticación](#autenticación)
  - [AuthProvider](#authprovider)
  - [Login](#login)
  - [ProtectedRoute](#protectedroute)
  - [AdminGuard](#adminguard)
- [Gestión de Contenido](#gestión-de-contenido)
  - [CRUD de Artistas](#crud-de-artistas)
  - [CRUD de Trabajos](#crud-de-trabajos)
  - [CRUD de Servicios](#crud-de-servicios)
  - [Editor de Contenido](#editor-de-contenido)
  - [Media Library](#media-library)
- [Editor Visual](#editor-visual)
  - [VisualEditor](#visualeditor)
  - [ComponentTree](#componenttree)
  - [PropertiesPanel](#propertiespanel)
  - [PreviewFrame](#previewframe)
- [Componentes UI](#componentes-ui)
  - [Button](#button)
  - [Card](#card)
  - [Input](#input)
  - [Label](#label)
- [Galería Interactiva](#galería-interactiva)
  - [DomeGallery](#domegallery)

---

# Componentes Astro

## Layout

**Archivo**: [`src/layouts/Layout.astro`](./src/layouts/Layout.astro)

### Descripción

Layout base que envuelve toda la aplicación. Proporciona la estructura HTML fundamental, configuración del `<head>`, estilos globales, y scripts para animaciones y navegación.

### Props

```typescript
interface Props {
    title: string; // Título de la página para <title> tag
}
```

### Uso

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Cuba Tattoo Studio | Albuquerque">
    <!-- Contenido de la página -->
</Layout>
```

### Características

- **Meta Tags**: Configuración SEO básica (charset, viewport, description, generator)
- **Google Fonts**: Carga de fuente Inter con weights 300, 400, 500, 600
- **Dark Mode**: Clase `dark` en `<html>` para forzar modo oscuro
- **Smooth Scroll**: Clase `scroll-smooth` para navegación suave por anclas
- **Scripts Internos**:
  - Intersection Observer para animaciones de scroll
  - Efecto parallax en hero background
  - Toggle de menú móvil de navegación

### Scripts Incluidos

#### 1. Intersection Observer (Scroll Animations)

```javascript
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
```

Observa elementos con clase `.reveal-hidden` y les añade `.reveal-visible` cuando aparecen en viewport.

#### 2. Parallax del Hero

```javascript
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroBg = document.getElementById("hero-bg");
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1.1 - scrolled * 0.0002})`;
    }
});
```

#### 3. Mobile Menu Toggle

Controla la visibilidad del menú de navegación en dispositivos móviles.

---

## Navbar

**Archivo**: [`src/components/Navbar.astro`](./src/components/Navbar.astro)

### Descripción

Barra de navegación sticky con logo, enlaces de navegación, CTA button, y menú hamburguesa para móviles.

### Props

Ninguna (componente autocontenido)

### Características

- **Posicionamiento**: `fixed` en la parte superior con `z-50`
- **Backdrop Blur**: Efecto de blur con `backdrop-blur-xl` y fondo semi-transparente
- **Responsive**: Menú hamburguesa en móvil (< 768px), inline en desktop
- **Navigation Links**:
  - Services (`#services`)
  - Artists (`#artists`)
  - Gallery (`#gallery`)
  - Studio (`#contact`)
- **CTA Button**: "Book Session" → `#booking`
- **Mobile Menu**: Se controla via script en Layout con data attribute `data-collapse-toggle`

### Estructura

```astro
<nav class="fixed w-full z-50 ...">
    <div class="max-w-7xl mx-auto ...">
        <!-- Logo -->
        <a href="#"><img src="/logo-stack.svg" /></a>
        
        <!-- Desktop CTA + Mobile Toggle -->
        <div class="flex md:order-2">
            <a href="#booking">Book Session</a>
            <button data-collapse-toggle="navbar-sticky">
                <Menu /> <!-- Lucide icon -->
            </button>
        </div>
        
        <!-- Navigation Links -->
        <div id="navbar-sticky" class="hidden md:flex">
            <ul>
                <li><a href="#services">Services</a></li>
                <!-- ... más links -->
            </ul>
        </div>
    </div>
</nav>
```

### Estilos Clave

- Fondo: `bg-black/80 backdrop-blur-xl`
- Border: `border-b border-white/10`
- Hover en links: `hover:text-white transition-colors`

---

## Hero

**Archivo**: [`src/components/Hero.astro`](./src/components/Hero.astro)

### Descripción

Sección hero fullscreen con background parallax, logo principal, tagline, y CTA para scroll a artistas.

### Props

Ninguna

### Características

- **Full Height**: `h-screen` para ocupar toda la altura del viewport
- **Parallax Background**: Imagen con efecto parallax controlado por script en Layout
- **Gradiente Overlay**: `bg-gradient-to-b from-black/20 via-transparent to-black`
- **Logo Animado**: Logo SVG con reveal animation
- **CTA Button**: Button con icono de flecha animada al hover

### Estructura

```astro
<section class="relative h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Parallax -->
    <div class="absolute inset-0 z-0">
        <img src="..." id="hero-bg" class="..." />
    </div>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b ..."></div>
    
    <!-- Content -->
    <div class="relative z-20 text-center">
        <h2>Albuquerque, NM</h2>
        <img src="/logo-stack.svg" alt="Cuba Tattoo Studio" />
        <p>Ideally located in the heart of the desert...</p>
        <a href="#artists">Meet the Artists <ArrowDown /></a>
    </div>
</section>
```

### Animaciones

- Elementos con clase `reveal-hidden` aparecen en fade-in
- Stagger delays: `.stagger-delay-1`, `.stagger-delay-2`, `.stagger-delay-3`
- Icono de flecha se mueve al hover: `group-hover:translate-y-1`

---

## Services

**Archivo**: [`src/components/Services.astro`](./src/components/Services.astro)

### Descripción

Grid de 3 servicios/disciplinas con imágenes de fondo y efectos hover.

### Props

Ninguna

### Características

- **Grid Layout**: 3 columnas en desktop, 1 en móvil
- **Cards con Imagen**: Background image que cambia de grayscale a color en hover
- **Iconos Interactivos**: Iconos de Lucide React (PenTool, Pencil, Feather)
- **Hover Effects**: Scale en imagen, fade-in en descripción e icono

### Servicios Incluidos

1. **Hyper Realism**
   - Icono: PenTool
   - Imagen: `/tattoo/tattoo2.png`
   - Descripción: "Portraits and nature with uncompromising detail."

2. **Fine Line**
   - Icono: Pencil
   - Imagen: `/tattoo/tattoo11.png`
   - Descripción: "Delicate, intricate, and minimal designs."

3. **Neo Traditional**
   - Icono: Feather
   - Imagen: `/tattoo/tattoo16.png`
   - Descripción: "Bold lines and vibrant colors with modern flair."

### Estructura de Card

```astro
<div class="group relative h-[400px] rounded-2xl overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-neutral-900">
        <img src="..." class="grayscale group-hover:grayscale-0" />
    </div>
    
    <!-- Content Overlay -->
    <div class="absolute inset-0 p-8 flex flex-col justify-end">
        <Icon className="opacity-0 group-hover:opacity-100 ..." />
        <h4>Service Title</h4>
        <p class="opacity-0 group-hover:opacity-100 ...">Description</p>
    </div>
</div>
```

---

## Artists

**Archivo**: [`src/components/Artists.astro`](./src/components/Artists.astro)

### Descripción

Sección de perfiles de artistas con layout alternado (imagen-texto, texto-imagen) para cada artista.

### Props

Ninguna

### Artistas Incluidos

#### 1. **David**
- **Especialidad**: Blackwork & Realism
- **Imagen**: `/artists/david.png`
- **Descripción**: "Mastering shadow and light, David specializes in high-contrast photorealism and large-scale blackwork projects."
- **Layout**: Imagen izquierda, texto derecha

#### 2. **Nina**
- **Especialidad**: Fine Line & Floral
- **Imagen**: `/artists/nina.png`
- **Descripción**: "Delicacy is strength. Nina brings botanical illustrations and single-needle geometry to life."
- **Layout**: Imagen derecha, texto izquierda

#### 3. **Karli**
- **Especialidad**: Neo Traditional & Color
- **Imagen**: `/artists/karli.png`
- **Descripción**: "Vibrant, bold, and timeless. Karli reinvents traditional motifs with a modern palette."
- **Layout**: Imagen izquierda, texto derecha

### Características

- **Alternating Layout**: `flex-row` y `flex-row-reverse` para alternar posiciones
- **Image Effects**: Grayscale por defecto, color en hover + scale
- **Typography**: Large headline con nombres (text-5xl md:text-7xl)
- **Portfolio Links**: Placeholder links a portfolios individuales

### Estructura de Perfil

```astro
<div class="flex flex-col md:flex-row items-center gap-12 mb-32 group">
    <!-- Image -->
    <div class="w-full md:w-1/2 relative aspect-[4/5] md:aspect-square">
        <img 
            src="/artists/david.png" 
            class="grayscale group-hover:grayscale-0 group-hover:scale-105"
        />
    </div>
    
    <!-- Text Content -->
    <div class="w-full md:w-1/2 md:pl-12">
        <span class="text-xs uppercase">Specialty</span>
        <h4 class="text-7xl">Name.</h4>
        <p class="text-neutral-400">Bio...</p>
        <a href="#">View Portfolio <ArrowRight /></a>
    </div>
</div>
```

---

## Gallery

**Archivo**: [`src/components/Gallery.astro`](./src/components/Gallery.astro)

### Descripción

Galería masonry de trabajos de tatuajes con layout responsive.

### Props

Ninguna

### Características

- **Masonry Layout**: CSS columns (`columns-1 md:columns-2 lg:columns-3`)
- **Responsive**: 1 columna en móvil, 2 en tablet, 3 en desktop
- **Images**: 6 imágenes destacadas del directorio `/public/tattoo/`
- **Hover Effect**: Ligera reducción de opacidad
- **Archive Link**: Link placeholder a galería completa

### Imágenes Mostradas

- `tattoo4.png`
- `tattoo6.png`
- `tattoo18.png`
- `tattoo1.png`
- `tattoo2.png`
- `tattoo3.png`

### Estructura

```astro
<section id="gallery" class="py-32 bg-black">
    <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-end mb-16">
            <h3>Selected Works.</h3>
            <a href="#">View Archive <ArrowRight /></a>
        </div>
        
        <!-- Masonry Grid -->
        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <div class="break-inside-avoid reveal-hidden stagger-delay-1">
                <img src="/tattoo/tattoo4.png" class="rounded-xl hover:opacity-90" />
            </div>
            <!-- ... más imágenes -->
        </div>
    </div>
</section>
```

### Consideraciones

- **Masonry**: El layout se basa en CSS columns, no JavaScript
- **Performance**: Considera lazy loading para mejor performance
- **Futura Expansión**: Podría integrarse con CMS para galería dinámica

---

## Booking

**Archivo**: [`src/components/Booking.astro`](./src/components/Booking.astro)

### Descripción

Sección de reservas con formulario de contacto y información del estudio incluyendo mapa.

### Props

Ninguna

### Características

#### Formulario de Contacto

- **Campos**:
  - Nombre (input text)
  - Email (input email)
  - Artista Preferido (select dropdown)
  - Tamaño del Tatuaje (range slider visual)
  - Message/Idea (textarea)
- **Submit Button**: "Request Appointment"
- **Estado**: No funcional (requiere backend o servicio como Formspree)

#### Información del Estudio

- **Dirección**: 123 Central Ave SW, Albuquerque, NM 87102
- **Horarios**:
  - Tue - Sat: 11:00 AM - 7:00 PM
  - Sun - Mon: Closed
- **Contacto**:
  - Email: hello@cubatattoo.com
  - Phone: (505) 555-0123
- **Google Maps Embed**: Mapa interactivo con hover effect (grayscale → color)

### Estructura

```astro
<section id="booking" class="py-32 bg-neutral-950">
    <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <!-- Booking Form -->
            <div>
                <h3>Book your session.</h3>
                <form class="space-y-8">
                    <!-- Campos del formulario -->
                    <input class="custom-input" />
                    <select>...</select>
                    <textarea>...</textarea>
                    <button type="submit">Request Appointment</button>
                </form>
            </div>
            
            <!-- Contact Info & Map -->
            <div id="contact">
                <div class="bg-neutral-900 p-8 rounded-3xl">
                    <h4>Visit the Studio</h4>
                    <p>Address...</p>
                    <p>Hours...</p>
                    
                    <!-- Google Maps -->
                    <iframe src="https://www.google.com/maps/embed?..." />
                    
                    <!-- Contact Links -->
                    <a href="mailto:..."><Mail /> Email</a>
                    <a href="tel:..."><Phone /> Phone</a>
                </div>
            </div>
        </div>
    </div>
</section>
```

### Custom Inputs

Clase `.custom-input` definida en `global.css`:
```css
.custom-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(115, 115, 115, 0.3);
    outline: none;
    transition: border-color 0.3s ease;
}

.custom-input:focus {
    border-bottom-color: currentColor;
}
```

### Integración de Formularios

Para hacer el formulario funcional, considera:
- **Formspree**: Servicio simplede formularios sin backend
- **Netlify Forms**: Si deployeas en Netlify
- **API Routes de Astro**: Para control total con endpoint custom
- **Serverless Functions**: Cloudflare Workers, AWS Lambda

---

## Footer

**Archivo**: [`src/components/Footer.astro`](./src/components/Footer.astro)

### Descripción

Footer del sitio con información adicional (si existe).

> **Nota**: Este componente puede no existir actualmente en el proyecto. Si se necesita, debería incluir:
> - Copyright notice
> - Social media links
> - Additional navigation
> - Legal links (Privacy Policy, Terms of Service)

### Estructura Sugerida

```astro
<footer class="bg-black border-t border-neutral-900 py-12">
    <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <img src="/logo-stack.svg" class="h-8" />
                <p class="text-neutral-400 text-sm mt-4">
                    Where precision meets permanence.
                </p>
            </div>
            <div>
                <h5 class="text-white font-medium mb-4">Quick Links</h5>
                <ul class="space-y-2 text-neutral-400 text-sm">
                    <li><a href="#services">Services</a></li>
                    <li><a href="#artists">Artists</a></li>
                    <li><a href="#gallery">Gallery</a></li>
                    <li><a href="#booking">Book</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-white font-medium mb-4">Contact</h5>
                <p class="text-neutral-400 text-sm">
                    123 Central Ave SW<br />
                    Albuquerque, NM 87102
                </p>
            </div>
        </div>
        <div class="mt-8 pt-8 border-t border-neutral-900 text-center text-neutral-500 text-sm">
            © 2025 Cuba Tattoo Studio. All rights reserved.
        </div>
    </div>
</footer>
```

---

## Patrones Comunes

### Animaciones

Todos los componentes usan reveal animations:
```astro
<div class="reveal-hidden">
    <!-- Este elemento aparecerá con fade-in al hacer scroll -->
</div>

<div class="reveal-hidden stagger-delay-1">
    <!-- Este elemento tendrá un delay de 0.1s -->
</div>
```

### Responsive Layout

Patrón común flex/grid:
```astro
<!-- Mobile vertical, Desktop horizontal -->
<div class="flex flex-col md:flex-row">
    ...
</div>

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    ...
</div>
```

### Secciones

Patrón estándar de spacing:
```astro
<section id="section-name" class="py-20 md:py-32 bg-black">
    <div class="max-w-7xl mx-auto px-6">
        <!-- Contenido -->
    </div>
</section>
```

### Iconos de Lucide

```astro
---
import { IconName } from "lucide-react";
---

<IconName className="w-6 h-6 text-white" />
```

---

## Personalización

### Añadir Nuevo Componente

1. Crear archivo `.astro` en `src/components/`
2. Seguir estructura estándar con frontmatter
3. Usar clases de Tailwind para estilos
4. Añadir `reveal-hidden` para animaciones
5. Importar y usar en `index.astro`

### Modificar Contenido

- **Imágenes**: Reemplazar en `/public/artists/` o `/public/tattoo/`
- **Texto**: Editar directamente en archivos `.astro`
- **Estilos**: Usar utility classes de Tailwind o añadir en `global.css`

### Best Practices

1. Mantener componentes autocontenidos
2. Usar semantic HTML (`<section>`, `<article>`, etc.)
3. Incluir `alt` text en todas las imágenes
4. Asegurar responsive design con breakpoints consistentes
5. Utilizar reveal animations para mejor UX

---

**Última actualización**: 2025-11-23

---

# Componentes React/TSX

El proyecto incluye una extensa coleción de componentes React TypeScript para el dashboard administrativo, autenticación, y funcionalidades interactivas.

## Dashboard Administrativo

### DashboardPage

**Archivo**: [`src/components/admin/DashboardPage.tsx`](./src/components/admin/DashboardPage.tsx)

#### Descripción

Página principal del dashboard administrativo que agrupa estadísticas, gráficos y actividad reciente.

#### Props

Ninguna (componente de página)

#### Características

- **Grid Responsivo**: Adapta el layout según el tamaño de pantalla
- **Estadísticas**: Muestra 3 cards con métricas clave
- **Gráficos**: Activity Chart (2 columnas) y Distribution Chart (1 columna)
- **Actividad**: Feed de actividad reciente del sistema

#### Estructura

```tsx
<DashboardLayout title="Dashboard">
  <DashboardStats />
  <ActivityChart />
  <DistributionChart />
  <RecentActivity />
</DashboardLayout>
```

---

### DashboardLayout

**Archivo**: [`src/layouts/DashboardLayout.tsx`](./src/layouts/DashboardLayout.tsx)

#### Descripción

Layout base para todas las páginas del dashboard administrativo.

#### Props

```typescript
interface Props {
  title: string;       // Título de la página
  children: ReactNode; // Contenido de la página
}
```

#### Características

- **Sidebar**: Navegación lateral con links a todas las secciones admin
- **Header**: Título de página y breadcrumbs
- **Content Area**: Área principal con padding y max-width
- **Responsive**: Sidebar colapsable en móvil

---

### DashboardStats

**Archivo**: [`src/components/admin/DashboardStats.tsx`](./src/components/admin/DashboardStats.tsx)

#### Descripción

Muestra 3 cards con estadísticas clave del sitio.

#### Características

- **Total Artists**: Número de artistas activos
- **Total Works**: Número de trabajos publicados  
- **Total Services**: Número de servicios ofrecidos
- **Iconos**: Iconos de Lucide para cada métrica
- **Trend Indicators**: Indicadores de cambio (opcional)

---

### ActivityChart

**Archivo**: [`src/components/admin/ActivityChart.tsx`](./src/components/admin/ActivityChart.tsx)

#### Descripción

Gráfico de líneas mostrando actividad a lo largo del tiempo usando Recharts.

#### Características

- **Recharts LineChart**: Gráfico de líneas interactivo
- **Responsive**: Se adapta al contenedor
- **Datos**: Actividad por día/semana
- **Tooltips**: Información detallada al hover

#### Uso

```tsx
<ActivityChart />
```

---

### DistributionChart

**Archivo**: [`src/components/admin/DistributionChart.tsx`](./src/components/admin/DistributionChart.tsx)

#### Descripción

Gráfico de torta mostrando distribución de contenido por categoría.

#### Características

- **Recharts PieChart**: Gráfico circular
- **Categorías**: Distribución por tipo de contenido o artista
- **Colores**: Paleta consistente con el diseño
- **Leyenda**: Labels para cada segmento

---

### RecentActivity

**Archivo**: [`src/components/admin/RecentActivity.tsx`](./src/components/admin/RecentActivity.tsx)

#### Descripción

Feed de actividad reciente del sistema (CRUD operations, logins, etc).

#### Características

- **Timeline**: Lista cronológica de eventos
- **Tipos de Eventos**: Create, Update, Delete, Login
- **Timestamps**: Tiempo relativo (hace 2 horas, etc.)
- **User Attribution**: Quién realizó cada acción

---

### Sidebar

**Archivo**: [`src/components/admin/Sidebar.tsx`](./src/components/admin/Sidebar.tsx)

#### Descripción

Barra lateral de navegación para el dashboard administrativo.

#### Características

- **Links de Navegación**:
  - Dashboard
  - Artists
  - Works
  - Services
  - Content
  - Media Library
  - Visual Editor
- **Iconos**: Iconos de Lucide para cada sección
- **Active State**: Highlighting del link activo
- **User Profile**: Información del usuario loggeado
- **Logout Button**: Botón para cerrar sesión

---

## Autenticación

### AuthProvider

**Archivo**: [`src/components/auth/AuthProvider.tsx`](./src/components/auth/AuthProvider.tsx)

#### Descripción

Context Provider de React para gestionar el estado de autenticación global.

#### Context API

```typescript
interface AuthContextType {
  user: User | null;                    // Usuario actual
  session: Session | null;              // Sesión de Supabase
  loading: boolean;                     // Estado de carga
  signInWithGoogle: () => Promise<any>; // Login con Google
  signInWithPassword: (email, password) => Promise<any>; // Login con email
  signOut: () => Promise<any>;          // Cerrar sesión
}
```

#### Uso

```tsx
import { AuthProvider, useAuth } from './components/auth/AuthProvider';

// En el root
<AuthProvider>
  <App />
</AuthProvider>

// En cualquier componente hijo
const { user, signOut } = useAuth();
```

#### Características

- **Auto-inicialización**: Verifica sesión activa al montar
- **Auth State Listener**: Escucha cambios en auth state
- **Helper Methods**: Métodos para sign in/out
- **TypeScript**: Tipado completo

---

### Login

**Archivo**: [`src/components/auth/Login.tsx`](./src/components/auth/Login.tsx)

#### Descripción

Componente de formulario de login con múltiples métodos de autenticación.

#### Características

- **Email/Password Form**: Campos de email y contraseña
- **Google OAuth Button**: Botón para login con Google
- **Error Handling**: Mensajes de error user-friendly
- **Loading States**: Indicadores de carga durante auth
- **Validation**: Validación de campos

#### Métodos Soportados

1. **Email y Contraseña**:
   ```tsx
   signInWithPassword(email, password)
   ```

2. **Google OAuth**:
   ```tsx
   signInWithGoogle()
   ```

---

### ProtectedRoute

**Archivo**: [`src/components/auth/ProtectedRoute.tsx`](./src/components/auth/ProtectedRoute.tsx)

#### Descripción

Higher-Order Component para proteger rutas que requieren autenticación.

#### Props

```typescript
interface Props {
  children: ReactNode;  // Contenido a proteger
  requiredRole?: 'admin' | 'artist'; // Rol requerido (opcional)
}
```

#### Uso

```tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

#### Características

- **Auth Check**: Verifica si hay usuario autenticado
- **Role Check**: Verifica rol del usuario si se especifica
- **Redirect**: Redirige a `/login` si no autenticado
- **Loading State**: Muestra loader mientras verifica

---

### AdminGuard

**Archivo**: [`src/components/admin/AdminGuard.tsx`](./src/components/admin/AdminGuard.tsx)

#### Descripción

Componente simple para verificar permisos de administrador.

#### Uso

```tsx
<AdminGuard>
  <SensitiveAdminContent />
</AdminGuard>
```

---

## Gestión de Contenido

### CRUD de Artistas

#### ArtistsTable

**Archivo**: [`src/components/admin/artists/ArtistsTable.tsx`](./src/components/admin/artists/ArtistsTable.tsx)

**Características**:
- Tabla con todos los artistas
- Columnas: Avatar, Nombre, Especialidad, Acciones
- Acciones: Editar, Eliminar
- Ordenamiento por columna
- Paginación

#### ArtistForm

**Archivo**: [`src/components/admin/artists/ArtistForm.tsx`](./src/components/admin/artists/ArtistForm.tsx)

**Props**:
```typescript
interface Props {
  artistId?: string;  // ID para edición, undefined para crear
  onSave?: () => void; // Callback al guardar
}
```

**Campos**:
- Nombre
- Slug (auto-generado)
- Especialidad
- Biografía (textarea)
- Avatar (upload de imagen)
- Portfolio URL
- Instagram handle
- Display Order
- Is Active (checkbox)

---

### CRUD de Trabajos

#### WorksTable

**Archivo**: [`src/components/admin/works/WorksTable.tsx`](./src/components/admin/works/WorksTable.tsx)

**Características**:
- Grid de trabajos con imágenes
- Filtros: Por artista, servicio, publicado
- Vista de tarjetas con imagen y metadatos
- Acciones rápidas: Publish/Unpublish, Feature, Edit, Delete

#### WorkForm

**Archivo**: [`src/components/admin/works/WorkForm.tsx`](./src/components/admin/works/WorkForm.tsx)

**Campos**:
- Título
- Descripción
- Imagen (drag & drop upload)
- Artista (select dropdown)
- Servicio (select dropdown)
- Tags (multi-input)
- Featured (toggle)
- Published (toggle)

---

### CRUD de Servicios

#### ServicesTable

**Archivo**: [`src/components/admin/services/ServicesTable.tsx`](./src/components/admin/services/ServicesTable.tsx)

#### ServiceForm

**Archivo**: [`src/components/admin/services/ServiceForm.tsx`](./src/components/admin/services/ServiceForm.tsx)

**Campos**:
- Título
- Slug
- Descripción
- Icono (selector de iconos de Lucide)
- Cover Image
- Display Order

---

### Editor de Contenido

#### ContentList

**Archivo**: [`src/components/admin/content/ContentList.tsx`](./src/components/admin/content/ContentList.tsx)

Lista de todas las secciones de contenido editables del sitio.

#### ContentEditor

**Archivo**: [`src/components/admin/content/ContentEditor.tsx`](./src/components/admin/content/ContentEditor.tsx)

Editor WYSIWYG para secciones de contenido del sitio.

**Características**:
- Rich text editing
- Preview en tiempo real
- Guardar/Publicar
- Media library integration

---

### Media Library

**Archivo**: [`src/components/admin/media/MediaLibrary.tsx`](./src/components/admin/media/MediaLibrary.tsx)

#### Descripción

Librería de medios para gestionar todas las imágenes y archivos del sitio.

#### Características

- **Drag & Drop Upload**: Subir archivos arrastrando
- **react-dropzone**: Librería para upload
- **Grid View**: Vista de galería de todos los archivos
- **Filters**: Filtrar por tipo de archivo
- **Search**: Buscar archivos por nombre
- **Preview**: Vista previa de imágenes
- **Actions**: Copiar URL, Eliminar, Descargar
- **Supabase Storage**: Integración con almacenamiento

#### Uso

```tsx
<MediaLibrary onSelect={(url) => setImageUrl(url)} />
```

---

## Editor Visual

El editor visual permite construir componentes y layouts mediante drag-and-drop.

### VisualEditor

**Archivo**: [`src/components/admin/editor/VisualEditor.tsx`](./src/components/admin/editor/VisualEditor.tsx)

#### Descripción

Componente principal del editor visual que integra tree, properties y preview.

#### Características

- **@dnd-kit/core**: Drag and drop core
- **@dnd-kit/sortable**: Sorting de elementos
- **Zustand Store**: Estado global compartido
- **3 Panel Layout**:
  - Component Tree (izquierda)
  - Preview Frame (centro)
  - Properties Panel (derecha)

#### Estado (Zustand)

```typescript
// src/lib/editor-store.ts
interface EditorState {
  components: Component[];      // Árbol de componentes
  selectedId: string | null;    // ID del componente seleccionado
  addComponent: (component) => void;
  updateComponent: (id, props) => void;
  deleteComponent: (id) => void;
  selectComponent: (id) => void;
}
```

---

### ComponentTree

**Archivo**: [`src/components/admin/editor/ComponentTree.tsx`](./src/components/admin/editor/ComponentTree.tsx)

#### Descripción

Árbol navegable de componentes en el editor visual.

#### Características

- **Hierarchical Tree**: Estructura anidada de componentes
- **Drag Handles**: Arrastrar para reordenar
- **Add/Delete**: Botones para añadir/eliminar
- **Selection**: Click para seleccionar
- **Icons**: Iconos por tipo de componente

---

### PropertiesPanel

**Archivo**: [`src/components/admin/editor/PropertiesPanel.tsx`](./src/components/admin/editor/PropertiesPanel.tsx)

#### Descripción

Panel lateral para editar propiedades del componente seleccionado.

#### Características

- **Dynamic Fields**: Campos según tipo de componente
- **Color Picker**: react-colorful para colores
- **Text Inputs**: Para textos y URLs
- **Number Inputs**: Para valores numéricos
- **Toggles**: Para booleanos
- **Live Update**: Cambios se reflejan en preview instantáneamente

---

### PreviewFrame

**Archivo**: [`src/components/admin/editor/PreviewFrame.tsx`](./src/components/admin/editor/PreviewFrame.tsx)

#### Descripción

Frame de preview que renderiza el resultado del editor en tiempo real.

#### Características

- **Live Rendering**: Renderizado en tiempo real
- **Responsive Toggle**: Vista desktop/tablet/mobile
- **Interactive**: Permite interactuar con componentes
- **Iframe (opcional)**: Isolación de estilos

---

## Componentes UI

Componentes UI basados en **Shadcn UI** y **Radix UI** primitives.

### Button

**Archivo**: [`src/components/ui/button.tsx`](./src/components/ui/button.tsx)

#### Props

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children: ReactNode;
}
```

#### Variantes

- `default`: Botón sólido negro/blanco
- `destructive`: Rojo para acciones destructivas
- `outline`: Borde con fondo transparente
- `ghost`: Sin borde ni fondo
- `link`: Estilo de link

#### Uso

```tsx
<Button variant="outline" size="lg">
  Click me
</Button>
```

---

### Card

**Archivo**: [`src/components/ui/card.tsx`](./src/components/ui/card.tsx)

#### Componentes

- `Card`: Contenedor principal
- `CardHeader`: Header del card
- `CardTitle`: Título
- `CardDescription`: Descripción/subtítulo
- `CardContent`: Contenido principal
- `CardFooter`: Footer con acciones

#### Uso

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Input

**Archivo**: [`src/components/ui/input.tsx`](./src/components/ui/input.tsx)

Input de texto estilizado con TailwindCSS.

#### Props

Todos los props nativos de `<input>` más estilos customizados.

#### Uso

```tsx
<Input type="email" placeholder="Email" />
```

---

### Label

**Archivo**: [`src/components/ui/label.tsx`](./src/components/ui/label.tsx)

Label para formularios basado en Radix UI.

#### Uso

```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

---

## Galería Interactiva

### DomeGallery

**Archivo**: [`src/components/DomeGallery.tsx`](./src/components/DomeGallery.tsx)

#### Descripción

Galería 3D interactiva con efecto de domo/carrusel usando `@use-gesture/react`.

#### Características

- **Gestos**: Arrastrar para rotar
- **Auto-rotation**: Rotación automática (pausable)
- **3D Transform**: Efectos CSS 3D
- **Performance**: Optimizado con `transform` y `will-change`
- **Responsive**: Se adapta a diferentes tamaños

#### Props

```typescript
interface Props {
  images: string[];     // Array de URLs de imágenes
  autoRotate?: boolean; // Auto-rotación (default: true)
  rotationSpeed?: number; // Velocidad (default: 0.5)
}
```

#### Uso

```tsx
<DomeGallery 
  images={['/tattoo/1.png', '/tattoo/2.png']}
  autoRotate={true}
/>
```

---

## Patrones de Uso

### Integración de Componentes Astro + React

Astro permite usar componentes React con directivas de hidratación:

```astro
---
import { DomeGallery } from '../components/DomeGallery';
---

<!-- Hydrate inmediatamente -->
<DomeGallery client:load images={images} />

<!-- Hydrate cuando visible -->
<DomeGallery client:visible images={images} />

<!-- Hydrate cuando idle -->
<DomeGallery client:idle images={images} />
```

### Fetch de Datos en Componentes Admin

```tsx
// En componentes admin, usar Supabase directamente
import { supabase } from '../../lib/supabase';

const ArtistsTable = () => {
  const [artists, setArtists] = useState([]);
  
  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase
        .from('artists')
        .select('*')
        .order('display_order');
      setArtists(data || []);
    };
    fetchArtists();
  }, []);
  
  // Render...
};
```

### Estilos Consistentes

Todos los componentes React usan TailwindCSS con la paleta del sitio:

- **Backgrounds**: `bg-zinc-900`, `bg-zinc-800`, `bg-black`
- **Borders**: `border-zinc-800`, `border-zinc-700`
- **Text**: `text-white`, `text-zinc-400`, `text-zinc-500`
- **Accent**: `bg-white text-black` para CTAs

---

**Última actualización**: 2025-11-23
