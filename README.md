# Cuba Tattoo Studio

Una landing page moderna y de alto rendimiento para un estudio de tatuajes en Albuquerque, NM. Construida con Astro 5, React 19 y TailwindCSS 4.

![Cuba Tattoo Studio](https://img.shields.io/badge/Astro-5.16-FF5D01?style=flat&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 🌟 Características

- **Diseño Moderno Dark Mode**: Interfaz elegante y profesional con paleta de colores oscuros
- **Animaciones Suaves**: Sistema de animaciones basado en Intersection Observer con efectos de revelado
- **Parallax Effects**: Efecto parallax en el hero para una experiencia visual inmersiva
- **Responsive Design**: Completamente optimizado para dispositivos móviles, tablets y desktop
- **Performance Optimizado**: Carga rápida y rendimiento excepcional
- **SEO Friendly**: Estructura semántica y metadatos optimizados

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+ (recomendado LTS)
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd cubatattoostudio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 🛠️ Tech Stack

### Core
- **[Astro 5.16](https://astro.build)**: Framework web moderno y ultra-rápido con Islands Architecture
- **[React 19.2](https://react.dev)**: Componentes interactivos y dashboard administrativo
- **[TypeScript](https://www.typescriptlang.org)**: Tipado estático para todo el proyecto

### Styling & UI
- **[TailwindCSS 4.1](https://tailwindcss.com)**: Framework CSS utility-first
- **[Shadcn UI](https://ui.shadcn.com)**: Componentes UI reutilizables basados en Radix UI
- **[Lucide React](https://lucide.dev)**: Iconos modernos y limpios
- **[React Colorful](https://www.npmjs.com/package/react-colorful)**: Selector de colores

### State Management & Interactividad
- **[Zustand](https://zustand-demo.pmnd.rs)**: Estado global para el editor visual
- **[@dnd-kit](https://dndkit.com)**: Sistema drag-and-drop para el editor
- **[Immer](https://immerjs.github.io/immer)**: Manipulación inmutable de estado

### Backend y Base de Datos
- **[Supabase](https://supabase.com)**: Backend as a Service (BaaS) - **Activo**
  - PostgreSQL Database con RLS
  - Authentication (Email/Password + Google OAuth)
  - Storage para imágenes y archivos
  - Real-time subscriptions

### Analytics & Visualización
- **[Recharts](https://recharts.org)**: Gráficos y dashboards de analytics

### Utilidades
- **[gray-matter](https://www.npmjs.com/package/gray-matter)**: Parser de Markdown frontmatter
- **[react-dropzone](https://react-dropzone.js.org)**: Upload de archivos drag-and-drop
- **[class-variance-authority](https://cva.style)**: Variantes de componentes con tipos
- **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)**: Merge de clases Tailwind

### Herramientas de Desarrollo
- **[Vite](https://vitejs.dev)**: Build tool y dev server
- **[tsx](https://www.npmjs.com/package/tsx)**: Ejecutor de TypeScript para scripts
- **ESLint**: Linting y calidad de código

## 📁 Estructura del Proyecto

```
/
├── public/                     # Assets estáticos
│   ├── artists/               # Imágenes de artistas
│   ├── tattoo/                # Galería de trabajos
│   ├── logo-stack.svg         # Logo del estudio
│   └── favicon.svg            # Favicon
├── src/
│   ├── components/            # Componentes del sitio
│   │   ├── admin/            # Dashboard administrativo (React)
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── artists/      # CRUD de artistas
│   │   │   ├── works/        # CRUD de trabajos
│   │   │   ├── services/     # CRUD de servicios
│   │   │   ├── content/      # Editor de contenido
│   │   │   ├── editor/       # Editor visual
│   │   │   └── media/        # Librería de medios
│   │   ├── auth/             # Sistema de autenticación (React)
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── Login.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── ui/               # Componentes UI Shadcn (React)
│   │   ├── Navbar.astro      # Navegación principal
│   │   ├── Hero.astro        # Sección hero
│   │   ├── Services.astro    # Disciplinas
│   │   ├── Artists.astro     # Perfiles de artistas
│   │   ├── Gallery.astro     # Galería masonry
│   │   ├── Booking.astro     # Formulario de contacto
│   │   ├── DomeGallery.tsx   # Galería 3D interactiva
│   │   └── Footer.astro      # Footer del sitio
│   ├── layouts/
│   │   ├── Layout.astro      # Layout principal
│   │   └── DashboardLayout.tsx # Layout del admin
│   ├── lib/                   # Utilidades y helpers
│   │   ├── supabase.ts       # Cliente de Supabase
│   │   ├── supabase-helpers.ts
│   │   ├── content-helpers.ts
│   │   ├── editor-store.ts   # Zustand store
│   │   └── utils.ts
│   ├── pages/
│   │   ├── index.astro       # Página principal
│   │   ├── login.astro       # Login
│   │   └── admin/            # Rutas administrativas
│   ├── styles/
│   │   └── global.css        # Estilos globales y animaciones
│   └── types/                 # Definiciones de tipos TypeScript
├── supabase/                  # Configuración de Supabase
│   ├── migrations/           # Migraciones de BD
│   └── schema.sql            # Esquema de la base de datos
├── scripts/
│   └── seed-content.ts       # Script para poblar la BD
├── astro.config.mjs          # Configuración de Astro
├── tsconfig.json             # Configuración de TypeScript
└── package.json              # Dependencias y scripts
```

## 📜 Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente antes de deployar |
| `npm run seed-content` | Popula la base de datos con contenido inicial |
| `npm run astro ...` | Ejecuta comandos CLI de Astro |

## 🎨 Secciones del Sitio

### Hero
Sección de apertura a pantalla completa con:
- Fondo parallax con imagen de texturas de tatuaje
- Logo animado del estudio
- Call-to-action para conocer a los artistas

### Services (Disciplinas)
Grid de 3 columnas mostrando las especialidades:
- **Hyper Realism**: Retratos y naturaleza con detalle extremo
- **Fine Line**: Diseños delicados, intrincados y minimalistas
- **Neo Traditional**: Líneas audaces y colores vibrantes con estilo moderno

### Artists (Artistas)
Perfiles detallados de los artistas del estudio:
- **David**: Especialista en Blackwork & Realism
- **Nina**: Experta en Fine Line & Floral
- **Karli**: Maestra en Neo Traditional & Color

### Gallery (Galería)
Grid masonry responsive con trabajos realizados

### Booking (Reservas)
Formulario de contacto con:
- Campos para nombre, email
- Selector de artista preferido
- Selector de tamaño del tatuaje
- Área de mensaje para describir la idea
- Información del estudio con mapa integrado
- Horarios de atención y datos de contacto

## 🗄️ Gestión de Datos con Supabase

El proyecto utiliza **Supabase** como backend completo:

### Base de Datos PostgreSQL
- **Artistas**: Perfiles, especialidades, biografías
- **Trabajos**: Galería de tatuajes con tags y categorías
- **Servicios**: Disciplinas ofrecidas (Realism, Fine Line, Neo Traditional)
- **Contenido del Sitio**: Secciones editables (Hero, About, Contact)
- **Configuración**: Ajustes generales del sitio

### Supabase Storage
- **Imágenes de artistas**: Avatares y fotos de perfil
- **Galería de trabajos**: Portfolio de tatuajes
- **Assets del sitio**: Logos, backgrounds, etc.

### Características Implementadas
- **Row Level Security (RLS)**: Políticas de seguridad granular
- **Real-time subscriptions**: Actualizaciones en tiempo real (opcional)
- **Optimización de imágenes**: Transformaciones automáticas

Ver detalles técnicos en [docs/supabase-integration.md](./docs/supabase-integration.md)

## 🔐 Autenticación

Sistema de autenticación completo implementado con **Supabase Auth**:

### Métodos de Autenticación Activos
- ✅ **Email y Contraseña**: Autenticación tradicional
- ✅ **Google OAuth**: Sign in con Google

### Roles de Usuario
- **Público**: Acceso de solo lectura al sitio
- **Artista**: Gestión de su propio portfolio y trabajos
- **Admin**: Control total del sitio y contenido

### Componentes de Autenticación
- `AuthProvider`: Context provider para estado de autenticación
- `Login`: Componente de login con ambos métodos
- `ProtectedRoute`: HOC para proteger rutas administrativas
- `AdminGuard`: Middleware de verificación de permisos

### Características de Seguridad
- ✅ Tokens JWT gestionados por Supabase
- ✅ Refresh tokens automáticos
- ✅ Protected routes en `/admin/*`
- ✅ Row Level Security en base de datos

Ver implementación completa en [docs/authentication.md](./docs/authentication.md)

## 🎭 Sistema de Animaciones

El sitio utiliza un sistema de animaciones basado en Intersection Observer:

- **Reveal Animations**: Los elementos aparecen con fade-in y slide-up al hacer scroll
- **Stagger Delays**: Animaciones escalonadas para elementos múltiples
- **Parallax Effect**: El background del hero se mueve a diferente velocidad del scroll
- **Hover Effects**: Transiciones suaves en imágenes y botones

Ver más detalles en [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Deployment

El sitio está optimizado para Cloudflare Pages:

```bash
# Build para producción
npm run build

# El output estará en ./dist/
```

Para instrucciones detalladas de deployment, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎛️ Dashboard Administrativo

Dashboard completo implementado para gestión de contenido en `/admin`:

### ✅ Gestión de Artistas
- CRUD completo de perfiles de artistas
- Edición de biografías, especialidades e imágenes
- Gestión de portfolios individuales
- Asignación de orden de visualización

### ✅ Gestión de Trabajos
- Subida de imágenes con drag & drop
- Clasificación por estilo, artista y fecha
- Sistema de tags y categorización
- Publicación y featured flags

### ✅ Gestión de Servicios
- CRUD de disciplinas/servicios
- Configuración de iconos y descripciones
- Imágenes de portada
- Control de orden de visualización

### ✅ Editor de Contenido
- Editor de secciones del sitio (Hero, About, Contact)
- Preview en tiempo real
- Gestión de medios integrada

### ✅ Editor Visual
- Sistema drag-and-drop con @dnd-kit
- Component tree navegable
- Panel de propiedades
- Preview frame en tiempo real

### ✅ Analytics
- Dashboard de estadísticas con Recharts
- Gráficos de actividad
- Distribución de trabajos por artista/estilo
- Actividad reciente

Ver documentación completa en [docs/admin-dashboard.md](./docs/admin-dashboard.md)

## 🚀 Roadmap

### 🔄 Fase 1 - Completada (Q4 2025)
- [x] Integración completa de Supabase
- [x] Sistema de autenticación funcional
- [x] Migración de contenido a base de datos

### 🚧 Fase 2 - Completada (Q4 2025)
- [x] Dashboard administrativo completo
- [x] CRUD de artistas, trabajos y servicios
- [x] Sistema de medios con drag & drop
- [x] Analytics básicos
- [x] Editor de contenido visual y galerías (incluyendo Dome Gallery)

### 🔄 Fase 3 - En Progreso (Q1 2026)
- [ ] Sistema de reservas/booking integrado
- [ ] Notificaciones en tiempo real
- [ ] PWA y optimizaciones offline
- [ ] Internacionalización (i18n)
- [ ] SEO avanzado y sitemap dinámico

## 📚 Documentación Adicional

### Documentación Principal
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura técnica del proyecto
- [COMPONENTS.md](./COMPONENTS.md) - Documentación detallada de componentes
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía para desarrolladores
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Instrucciones de despliegue
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guías de contribución

### Documentación Técnica Específica
- [docs/supabase-integration.md](./docs/supabase-integration.md) - Integración con Supabase
- [docs/authentication.md](./docs/authentication.md) - Sistema de autenticación
- [docs/admin-dashboard.md](./docs/admin-dashboard.md) - Dashboard administrativo
- [docs/content-management.md](./docs/content-management.md) - Gestión de contenido

## 🤝 Contributing

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles sobre el proceso de desarrollo y cómo enviar pull requests.

## 👥 Autores

- Desarrollado para Cuba Tattoo Studio
- Ubicado en Albuquerque, NM

## 📝 Licencia

Este proyecto es privado y propiedad de Cuba Tattoo Studio.

## 📞 Contacto

- **Email**: hello@cubatattoo.com
- **Teléfono**: (505) 555-0123
- **Dirección**: 123 Central Ave SW, Albuquerque, NM 87102

---

**Cuba Tattoo Studio** - _Where precision meets permanence._
