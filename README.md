# Cuba Tattoo Studio 🖤

Sitio web oficial para Cuba Tattoo Studio, un estudio de tatuajes de alta calidad ubicado en Albuquerque, Nuevo México.

## 🎯 Descripción del Proyecto

Website moderno y de alto impacto visual desarrollado con tecnologías web de vanguardia. El sitio presenta una estética minimalista en blanco y negro, animaciones fluidas inspiradas en GTA VI, y una experiencia de usuario excepcional tanto en desktop como en móvil.

## 🚀 Tecnologías Principales

- **[Astro](https://astro.build/)** - Framework web moderno para sitios estáticos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[GSAP](https://greensock.com/gsap/)** - Librería de animaciones de alto rendimiento
- **TypeScript** - Superset tipado de JavaScript

## 🎨 Características de Diseño

### Identidad Visual
- **Paleta Monocromática**: Estrictamente blanco y negro con escala de grises
- **Tipografía**: Bebas Neue para encabezados, Inter para texto de cuerpo
- **Estética**: Minimalista, profesional y audaz

### Animaciones
- Secuencia de carga inspirada en Rockstar Games GTA VI
- ScrollTrigger con efectos de pinning y parallax
- Transiciones suaves y fluidas a 60fps
- Revelado escalonado de contenido

## 📱 Estructura del Sitio

```
/ (Homepage)           - Hero animado + presentación del estudio
/artistas             - Grid de todos los artistas del estudio
/artistas/[slug]      - Perfil individual de cada artista
/portfolio            - Galería maestra filtrable por artista y estilo
/estudio              - Sobre nosotros + FAQ
/reservas             - Formulario de contacto + información del estudio
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cubatattoostudio.git
cd cubatattoostudio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run format       # Formatear código con Prettier
npm run lint         # Linter con ESLint
```

## 📂 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes básicos (botones, inputs, cards)
│   ├── layout/      # Header, Footer, Navigation
│   ├── animations/  # Wrappers para GSAP
│   ├── forms/       # Formulario de reservas
│   └── gallery/     # Componentes de galería
├── layouts/         # Layouts principales
├── pages/           # Páginas del sitio
├── styles/          # Configuración global mínima
└── utils/           # Helpers y utilidades
```

## ✨ Funcionalidades Principales

### Portfolio Filtrable
- Filtrado por artista
- Filtrado por estilo de tatuaje (Tradicional, Japonés, Geométrico, etc.)
- Filtros combinables
- Lazy loading de imágenes

### Formulario de Reservas
- Validación en tiempo real
- Upload de imágenes de referencia
- Selector de artista preferido
- Campos obligatorios: nombre, email, teléfono, descripción

### Galería de Artistas
- Grid responsivo
- Perfiles individuales detallados
- Especialidades y biografías
- Galerías extensas de trabajos

## 🎯 Objetivos de Performance

- **Lighthouse Score**: >90 en todas las métricas
- **Tiempo de Carga**: <3 segundos en conexiones 3G
- **Animaciones**: 60fps constantes
- **Accesibilidad**: Navegación completa por teclado

## 📱 Responsividad

- **Mobile-First**: Diseño prioritario para dispositivos móviles
- **Breakpoints**: Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`)
- **Experiencia Equivalente**: Funcionalidad completa en todos los dispositivos

## 🔧 Configuración

### Tailwind CSS
Configuración personalizada en `tailwind.config.cjs` con:
- Paleta de colores monocromática
- Tipografías personalizadas
- Breakpoints optimizados

### GSAP
- ScrollTrigger para animaciones de scroll
- Timeline para secuencias complejas
- Optimización de performance

## 📋 Checklist de Calidad

### Antes de cada commit
- [ ] Código formateado con Prettier
- [ ] Sin errores de TypeScript/ESLint
- [ ] Componentes testeados en móvil y desktop
- [ ] Animaciones fluidas en 60fps
- [ ] Accesibilidad verificada

### Antes de deploy
- [ ] Build exitoso sin warnings
- [ ] Lighthouse score >90
- [ ] Todas las páginas navegables
- [ ] Formularios funcionales
- [ ] Filtros operativos

## 🌐 SEO y Optimización

- Meta tags únicos por página
- Open Graph para redes sociales
- Schema.org para negocio local
- Sitemap.xml automático
- Optimización de imágenes (WebP, AVIF)

## 📍 Información del Negocio

**Cuba Tattoo Studio**  
Albuquerque, Nuevo México  
Especialistas en tatuajes de alta calidad  
Múltiples estilos y artistas profesionales  

## 🤝 Contribución

Este proyecto sigue estrictas guías de desarrollo. Consulta las reglas en `.trae/rules/` antes de contribuir.

## 📄 Licencia

[Especificar licencia]

---

**Desarrollado con ❤️ para Cuba Tattoo Studio**