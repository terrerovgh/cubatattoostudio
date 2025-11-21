# Guía del Sistema de Animaciones

Esta guía documenta el sistema de animaciones utilizado en Cuba Tattoo Studio y cómo personalizarlo.

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Reveal Animations](#reveal-animations)
- [Parallax Effect](#parallax-effect)
- [Hover Effects](#hover-effects)
- [Personalización](#personalización)
- [Performance](#performance)

## Visión General

El sitio utiliza un sistema de animaciones basado en **Intersection Observer API** para crear experiencias visuales suaves y atractivas sin impactar el performance.

### Características

- ✅ Scroll-triggered animations
- ✅ Stagger delays para secuencias
- ✅ Efecto parallax en hero
- ✅ Hover effects coordinados
- ✅ Hardware-accelerated (GPU)
- ✅ Performance optimizado

## Reveal Animations

### Funcionamiento

Las reveal animations usan Intersection Observer para detectar cuando un elemento entra al viewport y aplicar animaciones de entrada.

### Implementación Técnica

**Script** (en `src/layouts/Layout.astro`):

```javascript
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // Solo anima una vez
        }
    });
}, { 
    root: null,              // Viewport como root
    rootMargin: "0px",       // Sin margen
    threshold: 0.15          // 15% del elemento debe ser visible
});

// Observar todos los elementos con .reveal-hidden
document.querySelectorAll(".reveal-hidden").forEach((el) => {
    observer.observe(el);
});
```

### CSS (en `src/styles/global.css`):

```css
/* Variables CSS */
:root {
    --reveal-distance: 40px;      /* Distancia del slide-up */
    --reveal-duration: 1s;        /* Duración de la animación */
}

/* Estado inicial (hidden) */
.reveal-hidden {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(var(--reveal-distance));
    transition: all var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1);
}

/* Estado animado (visible) */
.reveal-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
}
```

### Uso en Componentes

**Básico**:
```astro
<div class="reveal-hidden">
    <!-- Este contenido aparecerá con fade-in y slide-up -->
</div>
```

**Con delays escalonados**:
```astro
<div class="reveal-hidden stagger-delay-1">Item 1</div>
<div class="reveal-hidden stagger-delay-2">Item 2</div>
<div class="reveal-hidden stagger-delay-3">Item 3</div>
```

### Stagger Delays

CSS para delays:

```css
.stagger-delay-1 {
    transition-delay: 0.1s;
}

.stagger-delay-2 {
    transition-delay: 0.2s;
}

.stagger-delay-3 {
    transition-delay: 0.3s;
}
```

### Ejemplos de Uso

#### Hero Section
```astro
<div class="reveal-hidden stagger-delay-1">
    <img src="/logo-stack.svg" alt="Logo" />
</div>

<p class="reveal-hidden stagger-delay-2">
    Descripción del estudio
</p>

<div class="reveal-hidden stagger-delay-3">
    <a href="#artists">CTA Button</a>
</div>
```

#### Grid de Cards
```astro
<div class="grid grid-cols-3">
    <div class="reveal-hidden stagger-delay-1">Card 1</div>
    <div class="reveal-hidden stagger-delay-2">Card 2</div>
    <div class="reveal-hidden stagger-delay-3">Card 3</div>
</div>
```

## Parallax Effect

### Implementación

El efecto parallax se aplica al background del Hero:

```javascript
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroBg = document.getElementById("hero-bg");
    
    if (heroBg) {
        // translateY: el background se mueve más lento (factor 0.3)
        // scale: disminuye ligeramente con scroll
        heroBg.style.transform = `
            translateY(${scrolled * 0.3}px) 
            scale(${1.1 - scrolled * 0.0002})
        `;
    }
});
```

### Velocidad del Parallax

- **Factor 0.3**: Background se mueve al 30% de la velocidad del scroll
- **Valores menores** (0.1-0.2): Más sutil
- **Valores mayores** (0.4-0.5): Más dramático

### Escala

```javascript
scale(${1.1 - scrolled * 0.0002})
```

- **1.1**: Escala inicial (10% más grande)
- **0.0002**: Factor de reducción por píxel scrolleado

### HTML Requerido

```astro
<div class="absolute inset-0">
    <img 
        id="hero-bg"  <!-- ID necesario para el script -->
        src="/background.jpg"
        class="object-cover w-full h-full opacity-40 scale-105"
    />
</div>
```

## Hover Effects

### Patrón de Grupo

Usa la clase `group` de Tailwind para coordinar efectos:

```astro
<div class="group">
    <img class="grayscale group-hover:grayscale-0 transition-all duration-700" />
    <p class="opacity-0 group-hover:opacity-100 transition-opacity">
        Texto que aparece en hover
    </p>
</div>
```

### Efectos Comunes

#### Imágenes

```astro
<!-- Grayscale → Color -->
<img class="grayscale group-hover:grayscale-0 transition-all duration-700" />

<!-- Scale up -->
<img class="group-hover:scale-105 transition-transform duration-500" />

<!-- Blur → Sharp -->
<img class="blur-sm group-hover:blur-0 transition-all" />

<!-- Opacity -->
<img class="opacity-90 hover:opacity-100 transition-opacity" />
```

#### Botones

```astro
<!-- Background change -->
<button class="bg-white/10 hover:bg-white/20 transition-all duration-300">
    Click me
</button>

<!-- Scale + Background -->
<button class="
    hover:scale-105 active:scale-95
    hover:bg-white/20
    transition-all duration-300
">
    Interactive Button
</button>
```

#### Text

```astro
<!-- Color change -->
<a class="text-neutral-400 hover:text-white transition-colors">
    Link
</a>

<!-- Underline animation -->
<a class="border-b border-transparent hover:border-white transition-all">
    Link con underline
</a>
```

### Animación de Iconos

```astro
<a href="#" class="group">
    Download
    <ArrowDown className="
        ml-2 w-4 h-4
        group-hover:translate-y-1
        transition-transform
    " />
</a>
```

## Personalización

### Cambiar Velocidad de Animaciones

Editar `src/styles/global.css`:

```css
:root {
    --reveal-duration: 1.5s;  /* Más lento */
    /* o */
    --reveal-duration: 0.5s;  /* Más rápido */
}
```

### Cambiar Distancia de Slide

```css
:root {
    --reveal-distance: 60px;  /* Mayor desplazamiento */
    /* o */
    --reveal-distance: 20px;  /* Más sutil */
}
```

### Cambiar Easing Function

```css
.reveal-hidden {
    /* Easing actual */
    transition: all var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1);
    
    /* Más lineal */
    transition: all var(--reveal-duration) ease-in-out;
    
    /* Más bouncy */
    transition: all var(--reveal-duration) cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

### Añadir Blur más Intenso

```css
.reveal-hidden {
    filter: blur(20px);  /* Más blur inicial */
}
```

### Threshold del Observer

Cambiar cuánto del elemento debe ser visible antes de animar:

```javascript
const observer = new IntersectionObserver((entries, observer) => {
    // ...
}, { 
    threshold: 0.5  // 50% del elemento visible
});
```

### Delays Personalizados

Añadir más opciones de delay:

```css
.stagger-delay-4 {
    transition-delay: 0.4s;
}

.stagger-delay-5 {
    transition-delay: 0.5s;
}

.long-delay {
    transition-delay: 1s;
}
```

## Animaciones Personalizadas

### Slide desde la Izquierda

```css
.slide-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-visible {
    opacity: 1;
    transform: translateX(0);
}
```

Uso:
```astro
<div class="slide-left">
    <!-- Contenido -->
</div>
```

Actualizar JavaScript:
```javascript
document.querySelectorAll(".slide-left").forEach((el) => {
    observer.observe(el);
});
```

Modificar callback del observer:
```javascript
if (entry.isIntersecting) {
    if (entry.target.classList.contains('slide-left')) {
        entry.target.classList.add("slide-left-visible");
    } else {
        entry.target.classList.add("reveal-visible");
    }
    observer.unobserve(entry.target);
}
```

### Fade In (sin slide)

```css
.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.fade-in-visible {
    opacity: 1;
}
```

### Rotate In

```css
.rotate-in {
    opacity: 0;
    transform: rotate(-10deg) scale(0.9);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.rotate-in-visible {
    opacity: 1;
    transform: rotate(0) scale(1);
}
```

## Performance

### Best Practices

1. **Usar transform y opacity** (GPU-accelerated):
   ```css
   /* ✅ Bueno - GPU */
   transform: translateY(40px);
   opacity: 0;
   
   /* ❌ Evitar - CPU */
   top: 40px;
   visibility: hidden;
   ```

2. **will-change para elementos animados**:
   ```css
   .reveal-hidden {
       will-change: transform, opacity;
   }
   ```

3. **Unobserve después de animar** (ya implementado):
   ```javascript
   observer.unobserve(entry.target);
   ```

4. **Usar transiciones en lugar de animaciones** para mejor performance:
   ```css
   /* ✅ Mejor */
   transition: transform 1s;
   
   /* ❌ Menos performante */
   animation: slideUp 1s;
   ```

### Debugging

**Ver qué elementos están siendo observados**:
```javascript
console.log('Observing:', document.querySelectorAll('.reveal-hidden').length, 'elements');
```

**Log cuando elemento se revela**:
```javascript
if (entry.isIntersecting) {
    console.log('Revealing:', entry.target);
    entry.target.classList.add("reveal-visible");
}
```

### Deshabilitar Animaciones

Para usuarios con `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    .reveal-hidden {
        transition: none;
        opacity: 1;
        transform: none;
        filter: none;
    }
}
```

## Recursos

- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [Cubic Bezier Generator](https://cubic-bezier.com/)
- [Animation Performance Guide](https://web.dev/animations/)

---

**Última actualización**: 2025-11-21
