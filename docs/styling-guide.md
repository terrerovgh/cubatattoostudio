# Guía de Estilos y TailwindCSS

Esta guía documenta el sistema de estilos utilizado en Cuba Tattoo Studio y las mejores prácticas para trabajar con TailwindCSS 4.

## 📋 Tabla de Contenidos

- [TailwindCSS 4](#tailwindcss-4)
- [Paleta de Colores](#paleta-de-colores)
- [Tipografía](#tipografía)
- [Spacing y Layout](#spacing-y-layout)
- [Responsive Design](#responsive-design)
- [Custom CSS](#custom-css)
- [Mejores Prácticas](#mejores-prácticas)

## TailwindCSS 4

Cuba Tattoo Studio usa **TailwindCSS 4**, que introduce un nuevo sistema de configuración basado en CSS.

### Configuración

La configuración se define en `src/styles/global.css` usando la directiva `@theme`:

```css
@import "tailwindcss";

@theme {
    --color-brand-50: #f9fafb;
    --color-brand-100: #f3f4f6;
    --color-brand-900: #111827;
    --tracking-tighter: -0.04em;
    --tracking-tight: -0.02em;
}
```

### Diferencias con Tailwind v3

- ✅ No hay `tailwind.config.js` (configuración en CSS)
- ✅ Importación directa: `@import "tailwindcss"`
- ✅ Theme via `@theme` directive
- ✅ Integración via Vite plugin: `@tailwindcss/vite`

### Integración con Astro

En `astro.config.mjs`:

```javascript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

## Paleta de Colores

El sitio utiliza una paleta **monocromática oscura** con énfasis en neutrales.

### Colores Primarios

| Clase | Hex | Uso |
| :--- | :--- | :--- |
| `bg-black` | `#000000` | Background principal |
| `bg-neutral-950` | `#0a0a0a` | Secciones alternas |
| `bg-neutral-900` | `#171717` | Cards y elementos |
| `bg-white` | `#ffffff` | CTAs y acentos |

### Colores de Texto

| Clase | Hex | Uso |
| :--- | :--- | :--- |
| `text-white` | `#ffffff` | Headlines principales |
| `text-neutral-100` | `#f5f5f5` | Texto body primario |
| `text-neutral-300` | `#d4d4d4` | Texto body secundario |
| `text-neutral-400` | `#a3a3a3` | Texto descriptivo |
| `text-neutral-500` | `#737373` | Labels y metadata |
| `text-neutral-700` | `#404040` | Borders sutiles |

### Opacidad

Utiliza el sistema de opacidad de Tailwind para transparencias:

```astro
<!-- Background semi-transparente -->
<div class="bg-black/80">
    <!-- 80% opacidad -->
</div>

<!-- White con opacidad -->
<div class="bg-white/10 hover:bg-white/20">
    <!-- Glassmorphism effect -->
</div>
```

### Gradientes

```astro
<!-- Gradient de fondo -->
<div class="bg-gradient-to-b from-black/20 via-transparent to-black">
    <!-- Top negro sutil → transparente → bottom negro -->
</div>

<!-- Gradient de texto (no usado actualmente) -->
<h1 class="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
    Gradient Text
</h1>
```

## Tipografía

### Fuente

**Inter** (Google Fonts)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)
- Cargada en `Layout.astro`

### Tamaños de Texto

| Clase | Tamaño | Uso |
| :--- | :--- | :--- |
| `text-xs` | 0.75rem (12px) | Labels, metadata |
| `text-sm` | 0.875rem (14px) | Links, pequeños textos |
| `text-base` | 1rem (16px) | Body text (default) |
| `text-lg` | 1.125rem (18px) | Body text destacado |
| `text-xl` | 1.25rem (20px) | Subtítulos |
| `text-2xl` | 1.5rem (24px) | Section headers |
| `text-3xl` | 1.875rem (30px) | Medium headers |
| `text-4xl` | 2.25rem (36px) | Large headers |
| `text-5xl` | 3rem (48px) | Extra large headers |
| `text-6xl` | 3.75rem (60px) | Hero text |
| `text-7xl` | 4.5rem (72px) | Artist names |

### Responsive Typography

```astro
<h1 class="text-4xl md:text-6xl lg:text-7xl">
    <!-- Mobile: 36px, Tablet: 60px, Desktop: 72px -->
</h1>

<p class="text-base md:text-lg">
    <!-- Mobile: 16px, Desktop: 18px -->
</p>
```

### Tracking (Letter Spacing)

```astro
<!-- Muy tight - para headlines grandes -->
<h1 class="tracking-tighter text-7xl">
    <!-- -0.04em -->
</h1>

<!-- Tight - para títulos medianos -->
<h2 class="tracking-tight text-4xl">
    <!-- -0.02em -->
</h2>

<!-- Wide - para labels -->
<span class="tracking-widest uppercase text-xs">
    <!-- 0.1em -->
</span>
```

### Font Weight

```astro
<p class="font-light">     <!-- 300 - Delicado -->
<p class="font-normal">    <!-- 400 - Regular -->
<p class="font-medium">    <!-- 500 - Emphasis -->
<p class="font-semibold">  <!-- 600 - Strong -->
```

### Line Height

```astro
<!-- Tight para headlines -->
<h1 class="leading-tight">
    <!-- 1.25 -->
</h1>

<!-- Relaxed para body text -->
<p class="leading-relaxed">
    <!-- 1.625 -->
</p>
```

## Spacing y Layout

### Padding y Margin

El proyecto usa spacing consistente:

```astro
<!-- Secciones verticales -->
<section class="py-20 md:py-32">
    <!-- Mobile: 80px top+bottom, Desktop: 128px -->
</section>

<!-- Horizontal container padding -->
<div class="px-6">
    <!-- 24px horizontal padding -->
</div>

<!-- Max width container -->
<div class="max-w-7xl mx-auto px-6">
    <!-- Centrado, máx 1280px, padding horizontal -->
</div>
```

### Spacing Scale

| Clase | Tamaño | Uso |
| :--- | :--- | :--- |
| `gap-2` | 0.5rem (8px) | Elementos muy cercanos |
| `gap-4` | 1rem (16px) | Spacing estándar |
| `gap-6` | 1.5rem (24px) | Columnas de grid |
| `gap-8` | 2rem (32px) | Secciones de contenido |
| `gap-12` | 3rem (48px) | Image-text layouts |
| `gap-24` | 6rem (96px) | Separación mayor |

### Layout Patterns

#### Container Estándar

```astro
<section class="py-20 md:py-32 bg-black">
    <div class="max-w-7xl mx-auto px-6">
        <!-- Contenido -->
    </div>
</section>
```

#### Flexbox

```astro
<!-- Centrado vertical y horizontal -->
<div class="flex items-center justify-center">
    ...
</div>

<!-- Espacio entre items -->
<div class="flex justify-between items-end">
    ...
</div>

<!-- Column en móvil, row en desktop -->
<div class="flex flex-col md:flex-row gap-12">
    ...
</div>
```

#### Grid

```astro
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- 1 col móvil, 2 tablet, 3 desktop -->
</div>
```

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Prefix |
| :--- | :--- | :--- |
| Mobile | 0px | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |
| Large Desktop | 1280px | `xl:` |

### Mobile-First Approach

Siempre diseña para móvil primero, luego añade breakpoints:

```astro
<!-- ❌ Incorrecto - Desktop first -->
<div class="hidden lg:block md:hidden">

<!-- ✅ Correcto - Mobile first -->
<div class="hidden md:block">
    <!-- Hidden en móvil, visible en tablet+ -->
</div>
```

### Patrones Comunes

```astro
<!-- Text size responsive -->
<h1 class="text-3xl md:text-5xl lg:text-7xl">

<!-- Padding responsive -->
<div class="px-4 md:px-6 lg:px-8">

<!-- Grid columns responsive -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

<!-- Flexbox direction -->
<div class="flex-col md:flex-row">

<!-- Height responsive -->
<div class="h-64 md:h-96 lg:h-screen">
```

## Custom CSS

### Clases Personalizadas

Definidas en `src/styles/global.css`:

#### Custom Input

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

Uso:
```astro
<input class="custom-input w-full py-2 text-lg" />
```

#### Parallax Background

```css
.parallax-bg {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
```

### Cuándo Usar Custom CSS

✅ **Usar custom CSS cuando**:
- Efectos que no se pueden hacer con Tailwind
- Animaciones complejas con keyframes
- Pseudo-elementos específicos
- Estilos que se repiten mucho

❌ **Evitar custom CSS para**:
- Spacing (usar Tailwind: `p-4`, `m-2`, etc.)
- Colors (definir en `@theme`)
- Typography (usar utilities de Tailwind)

### Añadir Custom CSS

```css
/* src/styles/global.css */

/* Animación de keyframes personalizada */
@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

.slide-in-animation {
    animation: slideIn 1s ease-out;
}
```

## Mejores Prácticas

### 1. Orden de Clases

Mantén un orden consistente:

```astro
<div class="
    /* Layout */
    flex items-center justify-between
    
    /* Sizing */
    w-full h-screen px-6 py-32
    
    /* Typography */
    text-xl font-medium tracking-tight
    
    /* Visual */
    bg-black text-white border-t border-neutral-900
    
    /* Effects */
    opacity-90 shadow-xl
    
    /* Interactions */
    hover:bg-neutral-900 transition-all duration-300
">
```

### 2. No Usar Estilos Inline

```astro
<!-- ❌ Evitar -->
<div style="background: black; padding: 20px;">

<!-- ✅ Usar Tailwind -->
<div class="bg-black p-5">
```

### 3. Extract Components para Estilos Repetidos

Si repites muchas clases, considera crear un componente:

```astro
<!-- components/Button.astro -->
---
interface Props {
    variant?: 'primary' | 'secondary';
}

const { variant = 'primary' } = Astro.props;

const baseClasses = "px-8 py-3 text-sm font-medium rounded-full transition-all duration-300";
const variants = {
    primary: "bg-white text-black hover:bg-neutral-200",
    secondary: "bg-white/10 text-white hover:bg-white/20"
};
---

<button class={`${baseClasses} ${variants[variant]}`}>
    <slot />
</button>
```

### 4. Usar @apply con Moderación

En Tailwind 4, `@apply` aún funciona pero es menos necesario:

```css
/* Usar solo para patrones muy repetidos */
.btn-primary {
    @apply px-8 py-3 text-sm font-medium bg-white text-black rounded-full;
    @apply hover:bg-neutral-200 transition-all duration-300;
}
```

### 5. Dark Mode

El sitio está permanentemente en dark mode:

```astro
<!-- Layout.astro -->
<html lang="en" class="dark">
```

No uses dark mode variants (`dark:`) a menos que quieras soporte light mode futuro.

### 6. Accessibility

```astro
<!-- Añadir focus states -->
<button class="
    focus:outline-none
    focus:ring-2 focus:ring-white/50
    focus:ring-offset-2 focus:ring-offset-black
">
```

### 7. Transiciones Suaves

```astro
<!-- Añadir transiciones para hover effects -->
<div class="
    bg-neutral-900
    hover:bg-neutral-800
    transition-all duration-300
">
```

## Utilidades Útiles

### Aspect Ratio

```astro
aspect-square     <!-- 1:1 -->
aspect-video      <!-- 16:9 -->
aspect-[4/5]      <!-- Custom ratio -->
```

### Object Fit

```astro
<!-- Para imágenes -->
<img class="object-cover w-full h-full" />
<img class="object-contain" />
```

### Filters

```astro
<!-- Grayscale -->
<img class="grayscale hover:grayscale-0 transition-all" />

<!-- Blur -->
<div class="backdrop-blur-md">  <!-- Background blur -->
<img class="blur-sm" />          <!-- Image blur -->
```

### Transforms

```astro
<!-- Scale -->
<div class="scale-105 hover:scale-110 transition-transform">

<!-- Translate -->
<div class="translate-y-1">

<!-- Rotate -->
<div class="rotate-45">
```

## Debugging

### Ver Clases Aplicadas

Usa DevTools para inspeccionar elementos y ver qué clases están activas.

### Purge Issues

Si  una clase no funciona en build:
1. Verifica que la clase existe en Tailwind
2. Asegúrate de que el archivo está siendo escaneado
3. Reconstruye: `rm -rf .astro dist && npm run build`

### JIT Issues

Tailwind 4 usa JIT por defecto. Si clases dinámicas no funcionan:

```astro
<!-- ❌ No funcionará con JIT -->
<div class={`text-${color}-500`}>

<!-- ✅ Usar clases completas -->
<div class={color === 'red' ? 'text-red-500' : 'text-blue-500'}>
```

## Recursos

- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/) - Playground online
- [TailwindCSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)

---

**Última actualización**: 2025-11-21
