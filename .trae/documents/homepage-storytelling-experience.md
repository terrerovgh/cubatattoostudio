# Experiencia de Homepage Inmersiva - Cuba Tattoo Studio

## 1. Visión General del Proyecto

**Objetivo:** Crear una experiencia de homepage cinemática e inmersiva que cuente la historia de Cuba Tattoo Studio a través del scroll, inspirada en la web de Rockstar Games para GTA VI.

**Concepto Central:** "Storytelling Visual Progresivo" - El contenido se revela de manera controlada y sincronizada con el scroll del usuario, creando una narrativa visual que transforma la navegación en una experiencia cinematográfica.

**Estética:** Monocromática estricta (blanco y negro) con animaciones fluidas y elegantes que reflejen la profesionalidad y modernidad del estudio.

---

## 2. Secuencia de Entrada (Hero Section)

### 2.1 Pantalla de Carga Inicial
- **Estado Inicial:** Pantalla completamente negra con el logo "CUBA" centrado
- **Animación de Entrada:**
  - Logo aparece con un sutil fade-in (0.8s)
  - Efecto de respiración suave en el logo (scale: 1.0 → 1.02 → 1.0)
  - Duración total: 2-3 segundos

### 2.2 Transición al Contenido Principal
- **Fade-out del logo** hacia la esquina superior izquierda
- **Aparición gradual** del fondo principal (imagen del estudio o textura)
- **Elementos de UI** aparecen con stagger:
  1. Logo en esquina (0.2s delay)
  2. Menú de navegación (0.4s delay)
  3. Indicador de scroll (0.6s delay)

---

## 3. Arquitectura de Storytelling por Secciones

### Sección 1: "El Comienzo" (0-100vh)
- **Contenido:** Introducción al estudio
- **Elementos:**
  - Título principal: "Cuba Tattoo Studio"
  - Subtítulo: "Donde el arte cobra vida en tu piel"
  - Imagen de fondo: Interior del estudio (parallax lento)

### Sección 2: "Nuestra Filosofía" (100-200vh)
- **Contenido:** Valores y enfoque del estudio
- **Animaciones:**
  - Texto desliza desde la izquierda
  - Imagen complementaria desde la derecha
  - Elementos aparecen con 0.2s de stagger

### Sección 3: "Los Artistas" (200-400vh)
- **Contenido:** Presentación de los tatuadores
- **Animaciones:**
  - Grid de artistas con entrada escalonada
  - Cada tarjeta desliza desde diferentes direcciones
  - Hover effects sutiles con scale y opacity

### Sección 4: "Nuestro Trabajo" (400-500vh)
- **Contenido:** Galería destacada de tatuajes
- **Animaciones:**
  - Mosaico de imágenes con reveal progresivo
  - Efecto de máscara que se expande
  - Transición suave entre imágenes

### Sección 5: "Reserva tu Cita" (500-600vh)
- **Contenido:** Call-to-action principal
- **Animaciones:**
  - Botón principal con efecto de pulso
  - Información de contacto con fade-in
  - Mapa del estudio con zoom-in suave

---

## 4. Especificaciones Técnicas de Animación

### 4.1 Configuración de GSAP ScrollTrigger

```javascript
// Configuración base para todas las animaciones
const scrollConfig = {
  ease: "power2.out",
  duration: 1.2,
  stagger: 0.15,
  scrub: 1 // Sincronización perfecta con scroll
};

// Timeline principal
const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    pin: false
  }
});
```

### 4.2 Animaciones Específicas por Tipo

#### Texto (Fade-in desde abajo)
```javascript
gsap.fromTo(".text-reveal", 
  { 
    y: 50, 
    opacity: 0 
  },
  { 
    y: 0, 
    opacity: 1, 
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".text-reveal",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);
```

#### Imágenes (Deslizamiento lateral)
```javascript
// Desde la izquierda
gsap.fromTo(".slide-left", 
  { x: -100, opacity: 0 },
  { x: 0, opacity: 1, duration: 1.2 }
);

// Desde la derecha
gsap.fromTo(".slide-right", 
  { x: 100, opacity: 0 },
  { x: 0, opacity: 1, duration: 1.2 }
);
```

#### Efecto Parallax
```javascript
gsap.to(".parallax-bg", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

---

## 5. Estructura HTML Semántica

### 5.1 Contenedor Principal
```html
<main class="storytelling-container">
  <!-- Hero Section -->
  <section class="hero-section" data-section="intro">
    <div class="hero-content">
      <h1 class="text-reveal">Cuba Tattoo Studio</h1>
      <p class="text-reveal">Donde el arte cobra vida en tu piel</p>
    </div>
    <div class="parallax-bg"></div>
  </section>

  <!-- Story Sections -->
  <section class="story-section" data-section="philosophy">
    <div class="content-grid">
      <div class="text-content slide-left">
        <h2>Nuestra Filosofía</h2>
        <p>Contenido...</p>
      </div>
      <div class="image-content slide-right">
        <img src="..." alt="...">
      </div>
    </div>
  </section>

  <!-- Más secciones... -->
</main>
```

### 5.2 Clases CSS de Utilidad
```css
/* Estados iniciales para animaciones */
.text-reveal {
  opacity: 0;
  transform: translateY(50px);
}

.slide-left {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-right {
  opacity: 0;
  transform: translateX(100px);
}

.parallax-bg {
  will-change: transform;
}
```

---

## 6. Experiencia de Usuario y Interactividad

### 6.1 Indicadores Visuales
- **Barra de progreso** en la parte superior que se llena con el scroll
- **Indicador de sección actual** en el menú de navegación
- **Cursor personalizado** que cambia según el contexto

### 6.2 Navegación Intuitiva
- **Scroll suave** entre secciones al hacer clic en el menú
- **Teclas de flecha** para navegación por teclado
- **Scroll hijacking mínimo** - respeta la velocidad natural del usuario

### 6.3 Estados de Carga
- **Lazy loading** de imágenes fuera del viewport
- **Preload** de assets críticos para la primera sección
- **Fallbacks** para dispositivos con JavaScript deshabilitado

---

## 7. Optimización y Performance

### 7.1 Técnicas de Optimización
- **Transform y opacity** únicamente para animaciones
- **will-change** en elementos animados
- **Debounce** en eventos de scroll
- **RequestAnimationFrame** para animaciones complejas

### 7.2 Responsive Design
- **Mobile-first** con animaciones adaptadas
- **Reduced motion** para usuarios con preferencias de accesibilidad
- **Touch-friendly** con gestos de swipe en móvil

### 7.3 Métricas de Performance
- **FCP < 1.5s** (First Contentful Paint)
- **LCP < 2.5s** (Largest Contentful Paint)
- **60fps** constantes durante las animaciones
- **Lighthouse Score > 90** en todas las categorías

---

## 8. Contenido y Copywriting

### 8.1 Tono y Voz
- **Profesional pero accesible**
- **Enfoque en la artesanía y calidad**
- **Storytelling emocional**
- **Llamadas a la acción claras**

### 8.2 Estructura de Contenido por Sección

#### Sección 1: Introducción
- **Headline:** "Cuba Tattoo Studio"
- **Subheadline:** "Donde el arte cobra vida en tu piel"
- **Body:** Breve introducción al estudio y su ubicación en Albuquerque

#### Sección 2: Filosofía
- **Headline:** "Nuestra Filosofía"
- **Body:** Compromiso con la calidad, higiene y arte personalizado
- **Quote:** Testimonio destacado de un cliente

#### Sección 3: Artistas
- **Headline:** "Conoce a Nuestros Artistas"
- **Body:** Presentación del equipo y sus especialidades
- **CTA:** "Ver todos los artistas"

#### Sección 4: Portfolio
- **Headline:** "Nuestro Trabajo Habla por Sí Solo"
- **Body:** Galería curada de mejores trabajos
- **CTA:** "Explorar portfolio completo"

#### Sección 5: Reservas
- **Headline:** "Comienza tu Historia"
- **Body:** Proceso de reserva y consulta
- **CTA:** "Reservar consulta gratuita"

---

## 9. Implementación Técnica

### 9.1 Dependencias Requeridas
```json
{
  "dependencies": {
    "gsap": "^3.12.2",
    "@astrojs/tailwind": "^5.0.0",
    "astro": "^4.0.0"
  }
}
```

### 9.2 Estructura de Archivos
```
src/
├── components/
│   ├── storytelling/
│   │   ├── HeroSection.astro
│   │   ├── StorySection.astro
│   │   ├── ArtistGrid.astro
│   │   └── ScrollIndicator.astro
│   └── animations/
│       ├── GSAPWrapper.astro
│       └── ScrollTriggerSetup.js
├── pages/
│   └── index.astro
└── styles/
    └── storytelling.css
```

### 9.3 Configuración de Tailwind
```javascript
// tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out',
        'slide-in-left': 'slideInLeft 1.2s ease-out',
        'slide-in-right': 'slideInRight 1.2s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
};
```

---

## 10. Testing y Quality Assurance

### 10.1 Checklist de Testing
- [ ] Animaciones fluidas en Chrome, Firefox, Safari
- [ ] Responsive design en móvil, tablet, desktop
- [ ] Accesibilidad con lectores de pantalla
- [ ] Performance en conexiones lentas
- [ ] Fallbacks para JavaScript deshabilitado

### 10.2 Métricas de Éxito
- **Tiempo en página > 2 minutos**
- **Scroll depth > 80%**
- **Bounce rate < 30%**
- **Conversión a reservas > 5%**

---

## 11. Cronograma de Implementación

### Fase 1: Estructura Base (Semana 1)
- Configuración de GSAP y ScrollTrigger
- Estructura HTML semántica
- Estilos base con Tailwind

### Fase 2: Animaciones Core (Semana 2)
- Implementación de animaciones principales
- Sincronización con scroll
- Testing en diferentes dispositivos

### Fase 3: Contenido y Pulido (Semana 3)
- Integración de contenido real
- Optimización de performance
- Testing de accesibilidad

### Fase 4: Launch y Monitoreo (Semana 4)
- Deploy a producción
- Monitoreo de métricas
- Ajustes basados en feedback

---

## 12. Consideraciones de Accesibilidad

### 12.1 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.2 Navegación por Teclado
- **Tab order** lógico y visible
- **Skip links** para navegación rápida
- **Focus indicators** claros y contrastados

### 12.3 Screen Readers
- **Alt text** descriptivo en todas las imágenes
- **ARIA labels** en elementos interactivos
- **Semantic HTML** para estructura clara

---

Este documento define una experiencia de homepage que transforma la navegación web en una experiencia cinematográfica, manteniendo la funcionalidad y accesibilidad mientras cuenta la historia única de Cuba Tattoo Studio.