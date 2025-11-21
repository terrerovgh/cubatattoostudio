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
- **[Astro 5.16](https://astro.build)**: Framework web moderno y ultra-rápido
- **[React 19.2](https://react.dev)**: Componentes interactivos
- **[TypeScript](https://www.typescriptlang.org)**: Tipado estático

### Styling
- **[TailwindCSS 4.1](https://tailwindcss.com)**: Framework CSS utility-first
- **[Lucide React](https://lucide.dev)**: Iconos modernos y limpios
- **Custom CSS**: Animaciones y efectos personalizados

### Herramientas
- **[Vite](https://vitejs.dev)**: Build tool y dev server
- **ESLint**: Code quality y consistency

## 📁 Estructura del Proyecto

```
/
├── public/                  # Assets estáticos
│   ├── artists/            # Imágenes de artistas
│   ├── tattoo/             # Galería de trabajos
│   ├── logo-stack.svg      # Logo del estudio
│   └── favicon.svg         # Favicon
├── src/
│   ├── components/         # Componentes Astro
│   │   ├── Navbar.astro   # Navegación principal
│   │   ├── Hero.astro     # Sección hero con parallax
│   │   ├── Services.astro # Disciplinas de tatuaje
│   │   ├── Artists.astro  # Perfiles de artistas
│   │   ├── Gallery.astro  # Galería masonry
│   │   ├── Booking.astro  # Formulario de contacto
│   │   └── Footer.astro   # Footer del sitio
│   ├── layouts/
│   │   └── Layout.astro   # Layout principal
│   ├── pages/
│   │   └── index.astro    # Página principal
│   └── styles/
│       └── global.css     # Estilos globales y animaciones
├── astro.config.mjs       # Configuración de Astro
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias y scripts
```

## 📜 Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Previsualiza el build localmente antes de deployar |
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

## 📚 Documentación Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura técnica del proyecto
- [COMPONENTS.md](./COMPONENTS.md) - Documentación detallada de componentes
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía para desarrolladores
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Instrucciones de despliegue
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guías de contribución

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
