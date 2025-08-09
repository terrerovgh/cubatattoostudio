# Guía de Componentes - Cuba Tattoo Studio

## 📋 Índice

1. [Estructura General](#estructura-general)
2. [Componentes de Layout](#componentes-de-layout)
3. [Componentes de UI](#componentes-de-ui)
4. [Componentes de Animación](#componentes-de-animación)
5. [Componentes de Galería](#componentes-de-galería)
6. [Componentes de Formularios](#componentes-de-formularios)
7. [Componentes de Efectos](#componentes-de-efectos)
8. [Guía de Uso](#guía-de-uso)

## 🏗️ Estructura General

```
src/components/
├── animations/          # Wrappers de animaciones GSAP
│   ├── FadeInSection.astro
│   ├── GSAPWrapper.astro
│   ├── ParallaxContainer.astro
│   ├── SlideInImage.astro
│   └── StaggerText.astro
├── effects/             # Efectos visuales
│   └── ParticleSystem.astro
├── forms/               # Componentes de formularios
│   └── BookingForm.astro
├── gallery/             # Componentes de galería
│   ├── PortfolioFilters.astro
│   └── PortfolioGrid.astro
├── layout/              # Componentes de estructura
│   ├── Footer.astro
│   └── Header.astro
└── ui/                  # Componentes básicos de UI
    ├── Badge.astro
    ├── Button.astro
    ├── Card.astro
    ├── Input.astro
    ├── MicroInteractions.astro
    └── VisualEffects.astro
```

## 🏠 Componentes de Layout

### Header.astro

**Propósito**: Navegación principal del sitio con logo y menú.

**Props**:
```typescript
interface Props {
  transparent?: boolean;  // Fondo transparente para hero
  fixed?: boolean;       // Posición fija en scroll
}
```

**Uso**:
```astro
---
import Header from '@/components/layout/Header.astro';
---

<!-- Header transparente para homepage -->
<Header transparent={true} fixed={true} />

<!-- Header normal para páginas internas -->
<Header />
```

**Características**:
- Navegación responsiva con menú hamburguesa en móvil
- Logo animado con hover effects
- Transiciones suaves entre estados
- Indicador de página activa

### Footer.astro

**Propósito**: Pie de página con información de contacto y enlaces.

**Props**:
```typescript
interface Props {
  minimal?: boolean;     // Versión minimalista
}
```

**Uso**:
```astro
---
import Footer from '@/components/layout/Footer.astro';
---

<Footer />
```

**Características**:
- Información de contacto del estudio
- Enlaces a redes sociales
- Mapa de ubicación integrado
- Horarios de atención

## 🎨 Componentes de UI

### Button.astro

**Propósito**: Botón reutilizable con múltiples variantes.

**Props**:
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;         // Para enlaces
  disabled?: boolean;
  loading?: boolean;
  icon?: string;         // Nombre del icono
  class?: string;        // Clases adicionales
}
```

**Uso**:
```astro
---
import Button from '@/components/ui/Button.astro';
---

<!-- Botón primario -->
<Button variant="primary" size="lg">
  Reservar Cita
</Button>

<!-- Botón como enlace -->
<Button variant="outline" href="/portfolio">
  Ver Portfolio
</Button>

<!-- Botón con icono -->
<Button variant="secondary" icon="arrow-right">
  Siguiente
</Button>
```

### Card.astro

**Propósito**: Contenedor de contenido con estilos consistentes.

**Props**:
```typescript
interface Props {
  variant?: 'default' | 'artist' | 'portfolio';
  hover?: boolean;       // Efectos hover
  padding?: 'sm' | 'md' | 'lg';
  class?: string;
}
```

**Uso**:
```astro
---
import Card from '@/components/ui/Card.astro';
---

<Card variant="artist" hover={true}>
  <img src="/images/artist.jpg" alt="Artista" />
  <h3>Nombre del Artista</h3>
  <p>Especialidades</p>
</Card>
```

### Input.astro

**Propósito**: Campo de entrada con validación y estilos.

**Props**:
```typescript
interface Props {
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'file';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  class?: string;
}
```

**Uso**:
```astro
---
import Input from '@/components/ui/Input.astro';
---

<Input 
  type="email" 
  name="email" 
  label="Email" 
  placeholder="tu@email.com"
  required={true}
/>

<Input 
  type="textarea" 
  name="description" 
  label="Descripción del Tatuaje"
  placeholder="Describe tu idea..."
/>
```

### Badge.astro

**Propósito**: Etiquetas para especialidades y categorías.

**Props**:
```typescript
interface Props {
  variant?: 'default' | 'specialty' | 'style';
  size?: 'sm' | 'md';
  class?: string;
}
```

**Uso**:
```astro
---
import Badge from '@/components/ui/Badge.astro';
---

<Badge variant="specialty">Blackwork</Badge>
<Badge variant="style">Realismo</Badge>
```

## ✨ Componentes de Animación

### GSAPWrapper.astro

**Propósito**: Wrapper base para todas las animaciones GSAP.

**Props**:
```typescript
interface Props {
  animation?: 'fadeIn' | 'slideUp' | 'stagger' | 'custom';
  trigger?: string;      // Selector para ScrollTrigger
  delay?: number;
  duration?: number;
  class?: string;
}
```

**Uso**:
```astro
---
import GSAPWrapper from '@/components/animations/GSAPWrapper.astro';
---

<GSAPWrapper animation="fadeIn" delay={0.2}>
  <h1>Título Animado</h1>
</GSAPWrapper>
```

### FadeInSection.astro

**Propósito**: Sección que aparece con fade-in al hacer scroll.

**Props**:
```typescript
interface Props {
  threshold?: number;    // Umbral de activación (0-1)
  delay?: number;
  duration?: number;
  class?: string;
}
```

**Uso**:
```astro
---
import FadeInSection from '@/components/animations/FadeInSection.astro';
---

<FadeInSection threshold={0.3}>
  <section>
    <h2>Sobre Nosotros</h2>
    <p>Contenido que aparece al hacer scroll...</p>
  </section>
</FadeInSection>
```

### StaggerText.astro

**Propósito**: Animación de texto con aparición escalonada.

**Props**:
```typescript
interface Props {
  text: string;
  delay?: number;
  stagger?: number;      // Delay entre caracteres
  class?: string;
}
```

**Uso**:
```astro
---
import StaggerText from '@/components/animations/StaggerText.astro';
---

<StaggerText 
  text="CUBA TATTOO STUDIO" 
  stagger={0.1}
  class="text-6xl font-heading"
/>
```

### ParallaxContainer.astro

**Propósito**: Contenedor con efecto parallax.

**Props**:
```typescript
interface Props {
  speed?: number;        // Velocidad del parallax (-1 a 1)
  direction?: 'vertical' | 'horizontal';
  class?: string;
}
```

**Uso**:
```astro
---
import ParallaxContainer from '@/components/animations/ParallaxContainer.astro';
---

<ParallaxContainer speed={0.5}>
  <img src="/images/background.jpg" alt="Fondo" />
</ParallaxContainer>
```

### SlideInImage.astro

**Propósito**: Imagen que se desliza al aparecer.

**Props**:
```typescript
interface Props {
  src: string;
  alt: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;     // Distancia del deslizamiento
  class?: string;
}
```

**Uso**:
```astro
---
import SlideInImage from '@/components/animations/SlideInImage.astro';
---

<SlideInImage 
  src="/images/artist.jpg" 
  alt="Artista" 
  direction="left"
  distance={100}
/>
```

## 🖼️ Componentes de Galería

### PortfolioGrid.astro

**Propósito**: Grid responsivo para mostrar trabajos del portfolio.

**Props**:
```typescript
interface Props {
  items: PortfolioItem[];
  columns?: 2 | 3 | 4;
  masonry?: boolean;     // Layout tipo masonry
  lightbox?: boolean;    // Habilitar lightbox
  class?: string;
}
```

**Uso**:
```astro
---
import PortfolioGrid from '@/components/gallery/PortfolioGrid.astro';
import { artists } from '@/data/artists.json';

const portfolioItems = artists.flatMap(artist => artist.portfolio);
---

<PortfolioGrid 
  items={portfolioItems} 
  columns={3}
  masonry={true}
  lightbox={true}
/>
```

### PortfolioFilters.astro

**Propósito**: Filtros para la galería del portfolio.

**Props**:
```typescript
interface Props {
  artists: Artist[];
  styles: Style[];
  showCount?: boolean;   // Mostrar contador de resultados
  class?: string;
}
```

**Uso**:
```astro
---
import PortfolioFilters from '@/components/gallery/PortfolioFilters.astro';
import { artists } from '@/data/artists.json';
import { styles } from '@/data/tattoo-styles.json';
---

<PortfolioFilters 
  artists={artists.artists}
  styles={styles.styles}
  showCount={true}
/>
```

## 📝 Componentes de Formularios

### BookingForm.astro

**Propósito**: Formulario completo para reservas de citas.

**Props**:
```typescript
interface Props {
  preselectedArtist?: string;  // ID del artista preseleccionado
  class?: string;
}
```

**Uso**:
```astro
---
import BookingForm from '@/components/forms/BookingForm.astro';
---

<!-- Formulario general -->
<BookingForm />

<!-- Formulario con artista preseleccionado -->
<BookingForm preselectedArtist="david" />
```

**Campos incluidos**:
- Nombre completo (requerido)
- Email (requerido)
- Teléfono (requerido)
- Descripción del tatuaje (requerido)
- Tamaño estimado
- Ubicación en el cuerpo
- Artista preferido (dropdown)
- Upload de imágenes de referencia
- Términos y condiciones

## 🎭 Componentes de Efectos

### VisualEffects.astro

**Propósito**: Efectos visuales de fondo y ambiente.

**Props**:
```typescript
interface Props {
  variant?: 'noise' | 'glow' | 'particles' | 'gradient';
  intensity?: 'low' | 'medium' | 'high';
  class?: string;
}
```

**Uso**:
```astro
---
import VisualEffects from '@/components/ui/VisualEffects.astro';
---

<VisualEffects variant="noise" intensity="low" />
<VisualEffects variant="glow" intensity="medium" />
```

### ParticleSystem.astro

**Propósito**: Sistema de partículas animadas.

**Props**:
```typescript
interface Props {
  count?: number;        // Número de partículas
  speed?: number;        // Velocidad de movimiento
  size?: number;         // Tamaño de partículas
  color?: string;        // Color de partículas
  class?: string;
}
```

**Uso**:
```astro
---
import ParticleSystem from '@/components/effects/ParticleSystem.astro';
---

<ParticleSystem 
  count={50}
  speed={1}
  size={2}
  color="#FFFFFF"
/>
```

### MicroInteractions.astro

**Propósito**: Pequeñas animaciones de interacción.

**Props**:
```typescript
interface Props {
  type?: 'hover' | 'click' | 'focus' | 'scroll';
  effect?: 'scale' | 'rotate' | 'glow' | 'shake';
  class?: string;
}
```

**Uso**:
```astro
---
import MicroInteractions from '@/components/ui/MicroInteractions.astro';
---

<MicroInteractions type="hover" effect="scale">
  <button>Botón Interactivo</button>
</MicroInteractions>
```

## 📖 Guía de Uso

### Principios de Diseño

1. **Consistencia**: Todos los componentes siguen la paleta de colores B&N
2. **Responsividad**: Mobile-first con breakpoints de Tailwind
3. **Accesibilidad**: HTML semántico y navegación por teclado
4. **Performance**: Lazy loading y optimización de animaciones

### Patrones de Uso Comunes

#### Página de Artista
```astro
---
import Layout from '@/layouts/Layout.astro';
import Header from '@/components/layout/Header.astro';
import Card from '@/components/ui/Card.astro';
import Badge from '@/components/ui/Badge.astro';
import FadeInSection from '@/components/animations/FadeInSection.astro';
import PortfolioGrid from '@/components/gallery/PortfolioGrid.astro';
---

<Layout title="David - Artista">
  <Header />
  
  <main>
    <FadeInSection>
      <Card variant="artist">
        <img src="/images/artists/david.jpg" alt="David" />
        <h1>David</h1>
        <div class="flex gap-2">
          <Badge variant="specialty">Japonés</Badge>
          <Badge variant="specialty">Blackwork</Badge>
        </div>
      </Card>
    </FadeInSection>
    
    <FadeInSection>
      <PortfolioGrid items={artist.portfolio} columns={3} />
    </FadeInSection>
  </main>
</Layout>
```

#### Sección Hero con Animaciones
```astro
---
import GSAPWrapper from '@/components/animations/GSAPWrapper.astro';
import StaggerText from '@/components/animations/StaggerText.astro';
import Button from '@/components/ui/Button.astro';
---

<section class="hero">
  <GSAPWrapper animation="fadeIn">
    <StaggerText 
      text="CUBA TATTOO STUDIO" 
      class="text-8xl font-heading"
    />
  </GSAPWrapper>
  
  <GSAPWrapper animation="slideUp" delay={0.5}>
    <p class="text-xl text-cuba-gray-400">
      Arte corporal de alta calidad en Albuquerque
    </p>
  </GSAPWrapper>
  
  <GSAPWrapper animation="fadeIn" delay={1}>
    <Button variant="primary" size="lg" href="/reservas">
      Reservar Cita
    </Button>
  </GSAPWrapper>
</section>
```

### Mejores Prácticas

1. **Importaciones**: Usa alias `@/` para rutas absolutas
2. **Props**: Siempre define interfaces TypeScript para props
3. **Clases**: Combina clases de Tailwind con clases personalizadas
4. **Animaciones**: Usa componentes de animación en lugar de GSAP directo
5. **Accesibilidad**: Incluye `alt` en imágenes y `aria-label` en botones

### Personalización

#### Colores Personalizados
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cuba-accent': '#FF0000', // Solo para estados críticos
      }
    }
  }
}
```

#### Animaciones Personalizadas
```javascript
// En cualquier componente .astro
<script>
  import { gsap } from 'gsap';
  
  gsap.fromTo('.custom-element', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1 }
  );
</script>
```

### Debugging

#### Verificar Componentes
```bash
# Verificar sintaxis de componentes
npm run type-check

# Verificar build
npm run build
```

#### Console Debugging
```javascript
// En componentes .astro
<script>
  console.log('Componente cargado:', document.querySelector('.mi-componente'));
</script>
```