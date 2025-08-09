# Documentación Completa - Cuba Tattoo Studio

## 📋 Índice General de Documentación

Esta es la documentación completa para el proyecto del sitio web de Cuba Tattoo Studio, un estudio de tatuajes premium en Albuquerque, Nuevo México.

## 📚 Documentación Completa

### 📋 Planificación y Requerimientos
- [📄 Product Requirements Document](./product-requirements.md) - Especificaciones completas del producto
- [🏗️ Technical Architecture](./technical-architecture.md) - Arquitectura técnica del sistema
- [📊 API Specifications](./api-specifications.md) - Especificaciones de APIs y endpoints
- [🎯 Cuba Tattoo Studio PRD](./cuba_tattoo_studio_prd.md) - Documento de requerimientos específico
- [🏛️ Technical Architecture (Detailed)](./cuba_tattoo_studio_technical_architecture.md) - Arquitectura técnica detallada

### 🛠️ Guías de Desarrollo
- [⚙️ Installation Guide](./installation-guide.md) - Configuración del entorno de desarrollo
- [🧩 Component Guide](./component-guide.md) - Documentación de componentes
- [✨ GSAP Animation Guide](./gsap-animation-guide.md) - Implementación de animaciones
- [🤝 Contribution Guide](./contribution-guide.md) - Estándares y procesos de contribución
- [⚡ Performance Optimization Guide](./performance-optimization-guide.md) - Optimización y performance
- [🔒 Security Best Practices](./security-best-practices.md) - Guía de seguridad y mejores prácticas

### 🚀 Guías de Usuario y Deployment
- [📖 User Guide](./user-guide.md) - Manual de usuario del sitio web
- [🚀 Deployment Guide](./deployment-guide.md) - Proceso de despliegue a producción
- [🧪 Testing & QA Guide](./testing-qa-guide.md) - Guía de testing y control de calidad

### 🎨 Diseño y Experiencia
- [🎭 Homepage Storytelling Experience](./homepage-storytelling-experience.md) - Experiencia narrativa de la homepage
- [🌟 ReactBits Design Replication Plan](./reactbits-design-replication-plan.md) - Plan de replicación de diseño
- [🎬 Sitio Completo Filosofía Cinematográfica](./sitio-completo-filosofia-cinematografica.md) - Filosofía cinematográfica del sitio
- [📋 Classic Dark Documentation Design Plan](./classic-dark-documentation-design-plan.md) - Plan de diseño de documentación

### 🔧 Especificaciones Técnicas
- [⚙️ Technical Implementation Specs](./technical-implementation-specs.md) - Especificaciones técnicas de implementación

## 🚀 Stack Tecnológico

- **Framework:** Astro 5.9.2
- **Estilos:** Tailwind CSS 4.1.9
- **Animaciones:** GSAP 3.13.0
- **Build Tool:** Vite
- **Deployment:** GitHub Pages

## 🎨 Identidad Visual

### Paleta de Colores
- **Fondo Principal:** `#000000` (Negro absoluto)
- **Texto Principal:** `#FFFFFF` (Blanco puro)
- **Texto Secundario:** `#A0A0A0`, `#525252` (Escala de grises)
- **Acentos:** Solo para estados críticos de UX

### Tipografía
- **Encabezados:** Bebas Neue (condensada, mayúsculas)
- **Cuerpo:** Inter (legible, sans-serif)

## 🏗️ Arquitectura del Sitio

```
/ (Homepage)           - Hero animado + CTAs principales
/artistas             - Grid de todos los artistas
/artistas/[slug]      - Perfil individual + galería extensa
/portfolio            - Galería maestra filtrable (artista + estilo)
/estudio              - Sobre nosotros + FAQ combinados
/reservas             - Formulario detallado + mapa + contacto
```

## 📱 Características Principales

### Animaciones GSAP
- Secuencia de carga inspirada en rockstargames.com/VI
- ScrollTrigger para efectos de scroll
- Pinning de secciones
- Efectos parallax
- Transiciones suaves

### Portfolio Filtrable
- Filtrado por artista
- Filtrado por estilo de tatuaje
- Lazy loading de imágenes
- Grid responsivo

### Formulario de Reservas
- Campos completos de información
- Upload de imágenes de referencia
- Validación en tiempo real
- Selector de artista preferido

## 🔧 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Formatear código
npm run format

# Linting
npm run lint
```

## 📋 Checklist de Calidad

### Antes de cada commit
- [ ] Código formateado con Prettier
- [ ] Sin errores de TypeScript/ESLint
- [ ] Componentes testeados en móvil y desktop
- [ ] Animaciones fluidas en 60fps
- [ ] Accesibilidad verificada
- [ ] Imágenes optimizadas

### Antes de deploy
- [ ] Build exitoso sin warnings
- [ ] Lighthouse score > 90
- [ ] Todas las páginas navegables
- [ ] Formularios funcionales
- [ ] Filtros de portfolio operativos
- [ ] Animaciones sincronizadas

## 📞 Información del Negocio

**Nombre:** Cuba Tattoo Studio  
**Ubicación:** Albuquerque, Nuevo México  
**Especialidades:** Tatuajes de alta calidad, múltiples estilos  
**Público:** Personas que buscan arte corporal profesional y de calidad  
**Diferenciador:** Estética limpia, moderna y profesional  

## 🎯 Objetivos del Proyecto

- Crear una presencia digital profesional
- Mostrar el trabajo de alta calidad del estudio
- Facilitar el proceso de reservas
- Posicionar como estudio premium en Albuquerque
- Proporcionar una experiencia de usuario excepcional

---

*Esta documentación está en constante actualización. Para contribuir, consulta la [Guía de Contribución](./contribution-guide.md).*