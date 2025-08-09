# Guía de Testing y QA - Cuba Tattoo Studio

## 📋 Resumen

Esta guía establece los estándares y procesos de testing y control de calidad para el sitio web de Cuba Tattoo Studio, asegurando que todas las funcionalidades cumplan con los requisitos de performance, accesibilidad y experiencia de usuario.

## 🧪 Estrategia de Testing

### Tipos de Testing

1. **Testing Manual**
   - Pruebas de funcionalidad
   - Pruebas de usabilidad
   - Pruebas de compatibilidad
   - Pruebas de accesibilidad

2. **Testing Automatizado**
   - Lighthouse CI para performance
   - Pruebas de regresión visual
   - Validación de HTML/CSS
   - Pruebas de enlaces rotos

3. **Testing de Performance**
   - Core Web Vitals
   - Tiempo de carga
   - Optimización de imágenes
   - Bundle size analysis

## 🔍 Checklist de Testing Manual

### Homepage

#### Animaciones GSAP
- [ ] Secuencia de carga se ejecuta correctamente
- [ ] Logo "CUBA" aparece y desaparece suavemente
- [ ] Video/imagen hero tiene efecto zoom-out
- [ ] Elementos UI aparecen con stagger effect
- [ ] ScrollTrigger funciona en todas las secciones
- [ ] Pinning de secciones opera correctamente
- [ ] Efectos parallax son suaves
- [ ] Animaciones mantienen 60fps
- [ ] No hay glitches visuales durante scroll
- [ ] Animaciones se adaptan a diferentes velocidades de scroll

#### Responsividad
- [ ] Layout se adapta correctamente en móvil (320px-768px)
- [ ] Layout se adapta correctamente en tablet (768px-1024px)
- [ ] Layout se adapta correctamente en desktop (1024px+)
- [ ] Navegación móvil funciona correctamente
- [ ] Botones y enlaces son tocables en móvil (44px mínimo)
- [ ] Texto es legible en todas las resoluciones
- [ ] Imágenes se escalan apropiadamente

#### Funcionalidad
- [ ] Todos los enlaces de navegación funcionan
- [ ] CTAs redirigen a páginas correctas
- [ ] Scroll suave entre secciones
- [ ] Botones hover/focus states funcionan
- [ ] No hay errores en consola del navegador

### Página de Artistas (/artistas)

#### Grid de Artistas
- [ ] Grid se muestra correctamente en todas las resoluciones
- [ ] Imágenes de artistas cargan correctamente
- [ ] Hover effects funcionan suavemente
- [ ] Información de especialidades es visible
- [ ] Enlaces a perfiles individuales funcionan
- [ ] Lazy loading de imágenes opera correctamente
- [ ] Grid es accesible por teclado

#### Performance
- [ ] Página carga en menos de 3 segundos
- [ ] Imágenes están optimizadas (WebP/AVIF)
- [ ] No hay layout shift durante carga
- [ ] Smooth scrolling funciona

### Perfiles de Artistas (/artistas/[slug])

#### Contenido
- [ ] Biografía del artista se muestra correctamente
- [ ] Galería de portfolio carga todas las imágenes
- [ ] Navegación entre imágenes funciona
- [ ] Modal de imagen completa opera correctamente
- [ ] Información de contacto es precisa
- [ ] Enlace a reservas preselecciona artista

#### Galería
- [ ] Lightbox/modal funciona en todas las imágenes
- [ ] Navegación por teclado en galería
- [ ] Zoom de imágenes funciona correctamente
- [ ] Cierre de modal con ESC y click fuera
- [ ] Lazy loading de imágenes de galería

### Portfolio (/portfolio)

#### Filtros
- [ ] Filtro por artista funciona correctamente
- [ ] Filtro por estilo funciona correctamente
- [ ] Filtros múltiples se pueden combinar
- [ ] Botón "Limpiar filtros" resetea correctamente
- [ ] Animaciones de filtrado son suaves
- [ ] URL se actualiza con filtros activos
- [ ] Filtros persisten al recargar página

#### Galería
- [ ] Grid responsivo se adapta a contenido filtrado
- [ ] Imágenes mantienen aspect ratio
- [ ] Hover effects en tarjetas de portfolio
- [ ] Modal de imagen detallada funciona
- [ ] Información de cada trabajo es precisa
- [ ] Performance no se degrada con muchas imágenes

### Página del Estudio (/estudio)

#### Contenido
- [ ] Sección "Sobre Nosotros" es clara y atractiva
- [ ] FAQ está bien organizado y es fácil de navegar
- [ ] Acordeón de preguntas funciona correctamente
- [ ] Información de contacto es precisa
- [ ] Imágenes del estudio cargan correctamente
- [ ] Texto es legible y bien formateado

### Página de Reservas (/reservas)

#### Formulario
- [ ] Todos los campos requeridos están marcados
- [ ] Validación en tiempo real funciona
- [ ] Mensajes de error son claros y útiles
- [ ] Upload de imágenes funciona correctamente
- [ ] Dropdown de artistas incluye todas las opciones
- [ ] Envío de formulario funciona
- [ ] Mensaje de confirmación se muestra
- [ ] Formulario se resetea después del envío
- [ ] Validación de email es precisa
- [ ] Validación de teléfono acepta formatos válidos

#### Mapa y Contacto
- [ ] Google Maps se carga correctamente
- [ ] Marcador del estudio está en ubicación correcta
- [ ] Información de contacto es precisa
- [ ] Horarios de atención son correctos
- [ ] Enlaces de redes sociales funcionan

## 🚀 Testing de Performance

### Core Web Vitals

#### Largest Contentful Paint (LCP)
- **Objetivo:** < 2.5 segundos
- **Cómo medir:** Lighthouse, PageSpeed Insights
- **Optimizaciones:**
  - Preload de recursos críticos
  - Optimización de imágenes hero
  - Minimización de render-blocking resources

#### First Input Delay (FID)
- **Objetivo:** < 100 milisegundos
- **Cómo medir:** Real User Monitoring
- **Optimizaciones:**
  - Code splitting
  - Lazy loading de JavaScript no crítico
  - Optimización de GSAP animations

#### Cumulative Layout Shift (CLS)
- **Objetivo:** < 0.1
- **Cómo medir:** Lighthouse
- **Optimizaciones:**
  - Dimensiones explícitas para imágenes
  - Reservar espacio para contenido dinámico
  - Evitar inserción de contenido sobre contenido existente

### Métricas Adicionales

#### First Contentful Paint (FCP)
- **Objetivo:** < 1.5 segundos
- **Optimizaciones:**
  - Inline CSS crítico
  - Preconnect a dominios externos
  - Optimización de fonts

#### Speed Index
- **Objetivo:** < 3.0 segundos
- **Optimizaciones:**
  - Progressive loading
  - Priorización de contenido above-the-fold

### Herramientas de Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle analyzer
npm run build:analyze

# Performance testing
npm run test:performance
```

## ♿ Testing de Accesibilidad

### Checklist WCAG 2.1 AA

#### Perceptible
- [ ] Todas las imágenes tienen alt text descriptivo
- [ ] Contraste de color cumple ratio 4.5:1 (ya garantizado por B&N)
- [ ] Contenido no depende solo del color
- [ ] Videos tienen subtítulos (si aplica)
- [ ] Texto puede escalarse hasta 200% sin pérdida de funcionalidad

#### Operable
- [ ] Toda funcionalidad accesible por teclado
- [ ] No hay trampas de teclado
- [ ] Usuarios pueden pausar animaciones automáticas
- [ ] No hay contenido que cause convulsiones
- [ ] Tiempo de sesión es suficiente o extensible

#### Comprensible
- [ ] Idioma de página está declarado
- [ ] Navegación es consistente
- [ ] Identificación y descripción de errores
- [ ] Etiquetas e instrucciones para formularios

#### Robusto
- [ ] Código HTML válido
- [ ] Compatible con tecnologías asistivas
- [ ] Elementos tienen roles ARIA apropiados

### Herramientas de Testing

```bash
# axe-core testing
npm install -g @axe-core/cli
axe https://cubatattoostudio.com

# Pa11y testing
npm install -g pa11y
pa11y https://cubatattoostudio.com
```

## 🌐 Testing de Compatibilidad

### Navegadores Soportados

#### Desktop
- [ ] Chrome 90+ (Windows, macOS, Linux)
- [ ] Firefox 88+ (Windows, macOS, Linux)
- [ ] Safari 14+ (macOS)
- [ ] Edge 90+ (Windows)

#### Mobile
- [ ] Chrome Mobile 90+ (Android)
- [ ] Safari Mobile 14+ (iOS)
- [ ] Samsung Internet 14+
- [ ] Firefox Mobile 88+

### Dispositivos de Testing

#### Móviles
- [ ] iPhone 12/13/14 (Safari)
- [ ] Samsung Galaxy S21/S22 (Chrome)
- [ ] Google Pixel 6/7 (Chrome)
- [ ] iPhone SE (Safari)

#### Tablets
- [ ] iPad Air/Pro (Safari)
- [ ] Samsung Galaxy Tab (Chrome)
- [ ] Surface Pro (Edge)

#### Desktop
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (HD)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)

## 🔧 Herramientas de Testing

### Automatización

```json
// package.json scripts
{
  "scripts": {
    "test:lighthouse": "lhci autorun",
    "test:a11y": "pa11y-ci --sitemap https://cubatattoostudio.com/sitemap.xml",
    "test:html": "html-validate src/**/*.astro",
    "test:links": "blc https://cubatattoostudio.com -r",
    "test:performance": "npm run test:lighthouse && npm run build:analyze"
  }
}
```

### Configuración Lighthouse CI

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "https://cubatattoostudio.com",
        "https://cubatattoostudio.com/artistas",
        "https://cubatattoostudio.com/portfolio",
        "https://cubatattoostudio.com/estudio",
        "https://cubatattoostudio.com/reservas"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## 📊 Reportes de Testing

### Template de Reporte

```markdown
# Reporte de Testing - [Fecha]

## Resumen Ejecutivo
- **Páginas Testeadas:** X
- **Issues Críticos:** X
- **Issues Menores:** X
- **Performance Score:** X/100
- **Accessibility Score:** X/100

## Resultados por Página

### Homepage
- **Performance:** X/100
- **Accessibility:** X/100
- **Issues Encontrados:**
  - [Descripción del issue]
  - [Descripción del issue]

### [Repetir para cada página]

## Recomendaciones
1. [Recomendación prioritaria]
2. [Recomendación secundaria]

## Próximos Pasos
- [ ] Acción 1
- [ ] Acción 2
```

## 🚨 Criterios de Aceptación

### Mínimos para Producción
- [ ] Lighthouse Performance Score ≥ 90
- [ ] Lighthouse Accessibility Score ≥ 95
- [ ] Lighthouse Best Practices Score ≥ 90
- [ ] Lighthouse SEO Score ≥ 90
- [ ] 0 errores críticos de accesibilidad
- [ ] Funcionalidad completa en navegadores soportados
- [ ] Formulario de reservas 100% funcional
- [ ] Todas las animaciones fluidas (60fps)
- [ ] Tiempo de carga < 3 segundos en 3G

### Ideales para Excelencia
- [ ] Lighthouse Performance Score ≥ 95
- [ ] Lighthouse Accessibility Score = 100
- [ ] Core Web Vitals en verde
- [ ] 0 errores de HTML/CSS validation
- [ ] 0 enlaces rotos
- [ ] Tiempo de carga < 2 segundos en 4G

## 📅 Cronograma de Testing

### Testing Continuo
- **Diario:** Lighthouse CI en cada deploy
- **Semanal:** Testing manual de funcionalidades críticas
- **Mensual:** Testing completo de compatibilidad
- **Trimestral:** Auditoría completa de accesibilidad

### Testing Pre-Release
- **2 semanas antes:** Testing completo de funcionalidades
- **1 semana antes:** Testing de performance y optimización
- **3 días antes:** Testing final y corrección de bugs críticos
- **1 día antes:** Smoke testing y validación final

---

*Esta guía debe actualizarse regularmente para reflejar nuevas herramientas, estándares y requisitos del proyecto.*