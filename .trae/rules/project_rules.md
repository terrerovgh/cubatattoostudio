# Contexto del Proyecto: Website de Cuba Tattoo Studio

## 1. Resumen del Proyecto 🎯

**Objetivo:** Desarrollar un sitio web completo, moderno y de alto impacto para "Cuba Tattoo Studio", un estudio de tatuajes localizado en Albuquerque, Nuevo México.

**Público Objetivo:** Personas interesadas en tatuajes de alta calidad, que buscan artistas profesionales y un estudio con una estética limpia y moderna.

**Punto de Partida:** El proyecto se inicia usando como base el repositorio `https://github.com/midudev/landing-gta-vi`. No se debe modificar el código original de ese repositorio, sino usarlo como inspiración estructural y punto de partida para construir la nueva aplicación.

**Tecnologías Principales:**

- **Framework:** Astro
- **Estilos:** Tailwind CSS
- **Animations:** GSAP (GreenSock Animation Platform)

---

## 2. Identidad Visual y Diseño 🎨

La estética debe ser minimalista, profesional y audaz, inspirada en estudios de tatuajes de alta gama.

- **Paleta de Colores:** Estrictamente monocromática.
  - **Fondo Principal:** Negro (`#000000`)
  - **Texto Principal y Elementos Activos:** Blanco (`#FFFFFF`)
  - **Texto Secundario y Detalles:** Escala de grises (ej. `#A0A0A0`, `#525252`)
  - **Acentos:** Se puede usar un color de acento de forma muy sutil y solo si es estrictamente necesario para la UX (ej. para estados de error en un formulario), pero el 99% del diseño debe ser B&N.

- **Tipografía:**
  - **Encabezados (h1, h2, h3):** `Bebas Neue` o una fuente sans-serif condensada y en mayúsculas para un look impactante.
  - **Cuerpo de Texto:** `Inter` o una fuente sans-serif muy legible para párrafos, menús y descripciones.

---

## 3. Animaciones e Interacción (Homepage) ✨

**Referencia Obligatoria:** Las animaciones de la página de inicio deben replicar **exactamente** la experiencia de `https://www.rockstargames.com/VI`.

- **Secuencia de Carga:**
  1. Pantalla de carga inicial con el logo de "CUBA" que se desvanece suavemente.
  2. El video/imagen principal de fondo aparece con un ligero efecto de zoom-out.
  3. Los elementos de la UI (logo en la esquina, menú de navegación) aparecen con un `stagger` (aparición escalonada) y un `fade-in`.

- **Animaciones de Scroll (usando GSAP ScrollTrigger):**
  - **Secciones Fijas (Pinning):** Al hacer scroll, la primera sección (el video/hero) debe permanecer fija (`pinned`) mientras el contenido de texto superpuesto se desplaza sobre ella.
  - **Revelado Escalonado (Stagger):** A medida que el usuario hace scroll hacia abajo, los nuevos bloques de contenido (ej. "Artistas Destacados", "Sobre el Estudio") deben aparecer con animaciones de `fade-in` y un ligero `slide-in` desde abajo. Los elementos dentro de una misma sección (título, párrafo, botón) deben aparecer de forma escalonada.
  - **Efecto Parallax:** Las imágenes de fondo en las diferentes secciones deben moverse a una velocidad ligeramente más lenta que el contenido principal para crear una sensación de profundidad.
  - **Transiciones Suaves:** Todas las animaciones deben ser fluidas y estar perfectamente sincronizadas con el scroll del usuario.

---

## 4. Arquitectura del Sitio y Contenido 🏗️

El sitio web debe tener la siguiente estructura de páginas:

- **/ (Homepage):**
  - La página principal con las animaciones de alto impacto descritas anteriormente.
  - Debe presentar una introducción visual al estudio, enlaces a las secciones más importantes (Artistas, Portfolio) y un CTA (Call to Action) claro para "Reservar una Cita".

- **/artistas:**
  - Una página con una cuadrícula (grid) presentando a todos los artistas del estudio.
  - Cada tarjeta de artista debe mostrar su foto, nombre y especialidades (ej. "Blackwork, Realismo").
  - Al hacer clic en un artista, se navega a su página de perfil individual (`/artistas/[nombre-del-artista]`).

- **/artistas/[slug]:**
  - Página de perfil individual para cada artista.
  - Debe incluir: una biografía, una galería de fotos extensa y de alta calidad con sus mejores trabajos, y un enlace directo a la página de contacto/reservas con su nombre preseleccionado.

- **/portfolio:**
  - Una galería maestra con los mejores trabajos de todo el estudio.
  - **Funcionalidad Clave:** Debe ser filtrable por **artista** y por **estilo de tatuaje** (ej. Tradicional, Japonés, Geométrico, etc.).

- **/estudio:**
  - Una página que combina la sección "Sobre Nosotros" y "Preguntas Frecuentes (FAQ)".
  - **Contenido:** Historia y filosofía del estudio, información sobre las normas de higiene y seguridad, el proceso de tatuaje (desde la consulta hasta el cuidado posterior), y respuestas a preguntas comunes sobre precios, depósitos y preparación.

- **/reservas:**
  - Página de contacto y reservas.
  - Incluir un **formulario detallado** para solicitar una cita. Campos requeridos:
    - Nombre completo
    - Email y Teléfono
    - Descripción de la idea del tatuaje
    - Tamaño y ubicación en el cuerpo (con opción a subir imágenes de referencia)
    - Artista de preferencia (menú desplegable, incluyendo "Sin preferencia")
  - También debe mostrar la dirección física del estudio en Albuquerque, un mapa incrustado y el horario de atención.

# Reglas Técnicas del Proyecto para Trae.ai Solo

Estas son las reglas técnicas y de estilo de código que se deben seguir estrictamente durante todo el desarrollo.

## 1. Estructura y Componentes (Astro)

- **Modularidad:** Construye la interfaz utilizando componentes de Astro (`.astro`) reutilizables. Cada componente debe ser atómico y encargarse de una sola responsabilidad.
- **Organización:** Todos los componentes deben residir en el directorio `src/components/`. Organízalos en subdirectorios por funcionalidad (ej. `src/components/ui/`, `src/components/layout/`).
- **Layouts:** Utiliza los layouts de Astro (`src/layouts/`) para definir las estructuras de página principales (ej. `Layout.astro`) que incluyan el `head`, la navegación y el `footer`.

## 2. Estilos (Tailwind CSS)

- **Utility-First:** Utiliza clases de utilidad de Tailwind CSS directamente en el markup de los componentes Astro. **No escribas CSS personalizado en archivos `.css`** a menos que sea absolutamente indispensable para una animación compleja que no se pueda lograr con Tailwind.
- **Consistencia:** Usa los valores de espaciado, colores y tipografía definidos en el archivo `tailwind.config.cjs` para mantener la consistencia visual en todo el sitio. No uses valores mágicos (ej. `mt-[13px]`).
- **Dark Mode:** Dado que el diseño es oscuro por defecto, no es necesario configurar la variante `dark:`. Diseña directamente para el tema oscuro.

## 3. Animaciones (GSAP)

- **Importación:** Importa GSAP y sus plugins (como ScrollTrigger) de manera eficiente en los componentes o scripts donde se necesiten.
- **Performance:** Asegúrate de que las animaciones sean performantes. Usa transformaciones de CSS (`transform`, `opacity`) siempre que sea posible, ya que son más eficientes para animar.
- **Cleanup:** En el ciclo de vida de los componentes de Astro, asegúrate de limpiar los listeners y las animaciones de ScrollTrigger para evitar memory leaks durante la navegación del lado del cliente.

## 4. Responsividad y Accesibilidad (a11y)

- **Mobile-First:** Todos los componentes y páginas deben ser diseñados y construidos con un enfoque "mobile-first". Luego, utiliza los breakpoints de Tailwind (`sm:`, `md:`, `lg:`, `xl:`) para adaptar el diseño a pantallas más grandes.
- **HTML Semántico:** Utiliza las etiquetas HTML adecuadas para su propósito (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, etc.).
- **Atributos `alt`:** Todas las imágenes (`<img>` y los componentes `Image` de Astro) deben tener un atributo `alt` descriptivo. Para imágenes puramente decorativas, usa `alt=""`.
- **Navegación por Teclado:** Asegúrate de que todos los elementos interactivos (enlaces, botones, campos de formulario) sean completamente accesibles y funcionales utilizando solo el teclado.

## 5. Calidad del Código y Versionamiento

- **Formato:** El código debe ser formateado automáticamente con Prettier.
- **Comentarios:** Agrega comentarios claros y concisos al código complejo, especialmente a la lógica de las animaciones con GSAP.
- **Commits:** Escribe mensajes de commit claros y descriptivos siguiendo la especificación de Commits Convencionales (ej. `feat: add artist portfolio gallery`, `fix: correct mobile menu overlap`).

---

## 6. Configuración Técnica Específica 🔧

### Configuración de Astro (astro.config.mjs)

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }),
    sitemap()
  ],
  vite: {
    ssr: {
      external: ['gsap']
    }
  }
});
```

### Configuración de Tailwind (tailwind.config.cjs)

```javascript
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'cuba-black': '#000000',
        'cuba-white': '#FFFFFF',
        'cuba-gray': {
          400: '#A0A0A0',
          600: '#525252'
        }
      },
      fontFamily: {
        'heading': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'stagger': 'stagger 0.4s ease-out'
      }
    }
  },
  plugins: []
};
```

### Package.json Scripts Requeridos

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.ts,.astro",
    "type-check": "astro check"
  }
}
```

---

## 7. Performance y Optimización 🚀

### Optimización de Imágenes

- **Formatos:** Usar WebP/AVIF con fallback a JPEG
- **Lazy Loading:** Implementar en todas las imágenes excepto hero
- **Responsive Images:** Múltiples tamaños para diferentes breakpoints
- **Compresión:** Máximo 85% de calidad para fotografías

### Optimización de GSAP

- **Tree Shaking:** Importar solo los módulos necesarios
- **Registro de Plugins:** Registrar ScrollTrigger solo donde se use
- **Cleanup:** Destruir animaciones en componentes desmontados
- **Performance:** Usar `will-change` CSS para elementos animados

### Métricas de Performance (Objetivos)

- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms
- **Lighthouse Score:** > 90 en todas las categorías

---

## 8. SEO y Meta Tags 📈

### Meta Tags Obligatorios por Página

```html
<!-- Básicos -->
<title>Página Específica | Cuba Tattoo Studio</title>
<meta name="description" content="Descripción única de 150-160 caracteres">
<meta name="keywords" content="tatuajes, albuquerque, tattoo studio">

<!-- Open Graph -->
<meta property="og:title" content="Título específico">
<meta property="og:description" content="Descripción para redes sociales">
<meta property="og:image" content="/images/og-image.jpg">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Título específico">
<meta name="twitter:description" content="Descripción para Twitter">
```

### Schema.org (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "TattooShop",
  "name": "Cuba Tattoo Studio",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dirección específica",
    "addressLocality": "Albuquerque",
    "addressRegion": "NM",
    "postalCode": "Código postal"
  },
  "telephone": "+1-XXX-XXX-XXXX",
  "openingHours": "Mo-Sa 10:00-20:00"
}
```

---

## 9. Estructura de Datos y Contenido 📊

### Estructura de Artistas (JSON)

```json
{
  "artists": [
    {
      "id": "artist-slug",
      "name": "Nombre del Artista",
      "specialties": ["Blackwork", "Realismo"],
      "bio": "Biografía del artista...",
      "image": "/images/artists/artist-slug.jpg",
      "portfolio": [
        {
          "id": "work-1",
          "image": "/images/portfolio/work-1.jpg",
          "style": "Blackwork",
          "description": "Descripción del trabajo"
        }
      ]
    }
  ]
}
```

### Estilos de Tatuajes (Categorías)

- Tradicional Americano
- Japonés (Irezumi)
- Blackwork
- Realismo
- Geométrico
- Minimalista
- Neo-tradicional
- Acuarela
- Dotwork
- Biomecánico

---

## 10. Formularios y Validación ✅

### Validación del Formulario de Reservas

```javascript
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 500
  }
};
```

### Estados del Formulario

- **Loading:** Mostrar spinner durante envío
- **Success:** Mensaje de confirmación con número de referencia
- **Error:** Mensajes específicos por campo
- **Validation:** Validación en tiempo real

---

## 11. Testing y Quality Assurance 🧪

### Checklist de Testing

- [ ] **Responsive:** Testear en móvil, tablet y desktop
- [ ] **Browsers:** Chrome, Firefox, Safari, Edge
- [ ] **Performance:** Lighthouse en todas las páginas
- [ ] **Accessibility:** WAVE, axe-core, navegación por teclado
- [ ] **Forms:** Validación, envío, estados de error
- [ ] **Animations:** Fluidez en 60fps, sin jank
- [ ] **Images:** Carga correcta, lazy loading, alt texts

### Herramientas de Testing

- **Lighthouse:** Performance y SEO
- **WAVE:** Accesibilidad web
- **GTmetrix:** Velocidad de carga
- **BrowserStack:** Testing cross-browser

---

## 12. Deployment y Hosting 🌐

### Configuración de Build

```bash
# Build de producción
npm run build

# Preview local
npm run preview

# Verificación pre-deploy
npm run lint && npm run type-check
```

### Variables de Entorno

```env
# .env.production
SITE_URL=https://cubatattoostudio.com
CONTACT_EMAIL=info@cubatattoostudio.com
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Optimizaciones de Hosting

- **CDN:** Configurar para assets estáticos
- **Compression:** Gzip/Brotli habilitado
- **Caching:** Headers apropiados para recursos
- **SSL:** Certificado válido y HTTPS forzado

---

## 13. Mantenimiento y Actualizaciones 🔄

### Actualizaciones Regulares

- **Dependencias:** Revisar mensualmente
- **Contenido:** Portfolio actualizado semanalmente
- **Performance:** Monitoreo continuo
- **Security:** Parches de seguridad inmediatos

### Backup y Versionado

- **Git:** Commits frecuentes con mensajes descriptivos
- **Branches:** `main` para producción, `develop` para desarrollo
- **Tags:** Versiones de release etiquetadas
- **Assets:** Backup de imágenes y contenido

---

## 14. Métricas y Analytics 📊

### Google Analytics 4

- **Eventos Personalizados:** Clics en CTA, envío de formularios
- **Conversiones:** Reservas completadas
- **Audience:** Demografía y comportamiento
- **Performance:** Velocidad de página

### Métricas Clave (KPIs)

- **Tasa de Conversión:** Formularios completados / Visitantes
- **Tiempo en Página:** Especialmente en portfolio
- **Bounce Rate:** < 60% objetivo
- **Page Speed:** < 3s tiempo de carga

---

## ⚠️ REGLAS CRÍTICAS ADICIONALES

15. **NUNCA** comprometer la velocidad por efectos visuales
16. **SIEMPRE** testear en dispositivos móviles reales
17. **OBLIGATORIO** backup antes de cada deploy
18. **PROHIBIDO** hardcodear datos que cambien frecuentemente
19. **REQUERIDO** alt text descriptivo en todas las imágenes
20. **CRÍTICO** formulario de contacto 100% funcional
21. **ESENCIAL** navegación accesible por teclado
22. **MANDATORIO** meta tags únicos por página
