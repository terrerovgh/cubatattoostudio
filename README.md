# Cuba Tattoo Studio - Sitio Web Oficial

> Sitio web moderno y optimizado para Cuba Tattoo Studio, creado con Astro 5.x y las mejores prácticas de desarrollo web.

## 🚀 Características

- ⚡ **Astro 5.x** - Framework moderno para sitios web rápidos
- 🎨 **Tailwind CSS 4.x** - Diseño responsive y moderno
- 🖼️ **Optimización de Imágenes** - Con astro-imagetools para carga rápida
- 🌍 **Internacionalización** - Soporte para español e inglés
- 📱 **Responsive Design** - Optimizado para todos los dispositivos
- 🎭 **Animaciones GSAP** - Experiencia de usuario fluida
- 🐳 **Docker Ready** - Fácil despliegue y desarrollo

## 🏗️ Estructura del Proyecto

```
/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Button.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── BookingForm.astro
│   │   ├── ArtistDavid.astro
│   │   ├── ArtistNina.astro
│   │   └── ArtistKarli.astro
│   ├── layouts/           # Layouts base
│   │   └── Layout.astro
│   ├── pages/             # Páginas del sitio
│   │   ├── index.astro
│   │   ├── artists.astro
│   │   └── booking.astro
│   └── styles/            # Estilos globales
│       └── global.css
├── Dockerfile             # Configuración Docker
├── docker-compose.yml     # Docker Compose
└── astro.config.mjs       # Configuración Astro
```

## 🛠️ Tecnologías Utilizadas

### Core
- **Astro 5.x** - Framework principal
- **Tailwind CSS 4.x** - Framework CSS
- **TypeScript** - Tipado estático

### Optimización
- **astro-imagetools** - Optimización de imágenes
- **Sharp** - Procesamiento de imágenes

### Animaciones y UX
- **GSAP** - Animaciones avanzadas
- **Locomotive Scroll** - Scroll suave

### Desarrollo
- **Docker** - Contenedorización
- **Vite** - Build tool rápido

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 20+ 
- npm o yarn
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/terrerovgh/cubatattoostudio.git
   cd cubatattoostudio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4321
   ```

### Desarrollo con Docker

1. **Construir y ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Acceder a la aplicación**
   ```
   http://localhost:3000
   ```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
npm run astro        # CLI de Astro
```

## 🎨 Componentes Principales

### Componentes de Layout
- **Header** - Navegación principal con menú responsive
- **Footer** - Información de contacto y enlaces
- **Layout** - Layout base con meta tags y estilos

### Componentes de UI
- **Button** - Botón reutilizable con variantes
- **Heading** - Títulos responsivos y consistentes
- **ImageOptimized** - Imágenes optimizadas automáticamente

### Componentes Específicos
- **Hero** - Sección principal con video de fondo
- **ArtistDavid/Nina/Karli** - Perfiles de artistas
- **BookingForm** - Formulario de reservas completo

## 🌍 Internacionalización

El sitio soporta múltiples idiomas:
- **Español** (es) - Idioma principal
- **Inglés** (en) - Idioma secundario

La configuración se encuentra en `astro.config.mjs`:

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  routing: {
    prefixDefaultLocale: false
  }
}
```

## 🚢 Despliegue en Cloudflare Pages

### Configuración Automática con GitHub Actions

1. **Conectar repositorio a Cloudflare Pages**
2. **Configurar variables de entorno** (si es necesario)
3. **Los deploys se activan automáticamente** con cada push a main

### Build Settings para Cloudflare Pages
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** `20`

## 🔧 Configuración Avanzada

### Optimización de Imágenes
```javascript
// astro.config.mjs
import { astroImageTools } from 'astro-imagetools';

export default defineConfig({
  integrations: [astroImageTools],
  // ... otras configuraciones
});
```

### Tailwind CSS
```javascript
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal:** [Tu Nombre]
- **Diseño UI/UX:** [Diseñador]
- **Artistas del Estudio:** David, Nina, Karli

## 📞 Contacto

- **Sitio Web:** [https://cubatattoostudio.com](https://cubatattoostudio.com)
- **Email:** info@cubatattoostudio.com
- **Teléfono:** +53 5555 1234
- **Dirección:** Calle 23, La Habana, Cuba

---

**Cuba Tattoo Studio** - Arte corporal único en el corazón de Cuba 🇨🇺

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
