# Component Specifications Context

## Component Design System

### Design Principles

1. **Atomic Design Methodology**
2. **Single Responsibility Principle**
3. **Composition over Inheritance**
4. **Accessibility First**
5. **Performance Optimized**
6. **Mobile-First Responsive**

## UI Components (Atoms)

### Button Component

#### Specifications
```astro
---
// components/ui/Button.astro
export interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  class?: string;
  'data-testid'?: string;
}
---
```

#### Visual Specifications
```css
/* Primary Button */
.btn-primary {
  background: #FFFFFF;
  color: #000000;
  border: 2px solid #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: #A0A0A0;
  border-color: #A0A0A0;
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### Size Variants
```css
.btn-sm { padding: 8px 16px; font-size: 14px; }
.btn-md { padding: 12px 24px; font-size: 16px; }
.btn-lg { padding: 16px 32px; font-size: 18px; }
.btn-xl { padding: 20px 40px; font-size: 20px; }
```

#### Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Loading state announcements

### Input Component

#### Specifications
```astro
---
// components/ui/Input.astro
export interface Props {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;
  pattern?: string;
  autocomplete?: string;
  class?: string;
}
---
```

#### Visual Specifications
```css
.input-field {
  background: transparent;
  border: 2px solid #525252;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 0; /* Sharp corners for tattoo aesthetic */
  transition: border-color 200ms ease;
}

.input-field:focus {
  outline: none;
  border-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.input-field.error {
  border-color: #DC2626; /* Only color exception for errors */
}

.input-label {
  color: #A0A0A0;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
```

### Card Component

#### Specifications
```astro
---
// components/ui/Card.astro
export interface Props {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  class?: string;
}
---
```

#### Visual Specifications
```css
.card-default {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 300ms ease;
}

.card-elevated {
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}
```

## Layout Components (Molecules)

### Header Component

#### Specifications
```astro
---
// components/layout/Header.astro
export interface Props {
  transparent?: boolean;
  fixed?: boolean;
  showLogo?: boolean;
  showNavigation?: boolean;
  class?: string;
}
---
```

#### Structure
```html
<header class="header" role="banner">
  <div class="header-container">
    <div class="header-logo">
      <a href="/" aria-label="Cuba Tattoo Studio - Inicio">
        <span class="logo-text">CUBA</span>
      </a>
    </div>
    
    <nav class="header-nav" role="navigation" aria-label="Navegación principal">
      <ul class="nav-list">
        <li><a href="/artistas" class="nav-link">Artistas</a></li>
        <li><a href="/portfolio" class="nav-link">Portfolio</a></li>
        <li><a href="/estudio" class="nav-link">Estudio</a></li>
        <li><a href="/reservas" class="nav-link btn-primary">Reservar</a></li>
      </ul>
    </nav>
    
    <button class="mobile-menu-toggle" aria-label="Abrir menú móvil">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </div>
</header>
```

#### Responsive Behavior
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

@media (max-width: 768px) {
  .header-nav {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    transform: translateY(-100%);
    transition: transform 300ms ease;
  }
  
  .header-nav.open {
    transform: translateY(0);
  }
}
```

### Navigation Component

#### Specifications
```astro
---
// components/layout/Navigation.astro
export interface Props {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'primary' | 'secondary' | 'footer';
  showIcons?: boolean;
  class?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  external?: boolean;
}
---
```

### Footer Component

#### Specifications
```astro
---
// components/layout/Footer.astro
export interface Props {
  showSocialLinks?: boolean;
  showContactInfo?: boolean;
  showBusinessHours?: boolean;
  class?: string;
}
---
```

#### Structure
```html
<footer class="footer" role="contentinfo">
  <div class="footer-container">
    <div class="footer-grid">
      <div class="footer-section">
        <h3 class="footer-title">Cuba Tattoo Studio</h3>
        <p class="footer-description">
          Arte corporal profesional en Albuquerque, Nuevo México
        </p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Contacto</h4>
        <address class="footer-address">
          <p>123 Central Ave NW</p>
          <p>Albuquerque, NM 87102</p>
          <p><a href="tel:+15055551234">(505) 555-1234</a></p>
          <p><a href="mailto:info@cubatattoostudio.com">info@cubatattoostudio.com</a></p>
        </address>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Horarios</h4>
        <ul class="footer-hours">
          <li>Lun - Vie: 12:00 PM - 8:00 PM</li>
          <li>Sábado: 10:00 AM - 6:00 PM</li>
          <li>Domingo: Cerrado</li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Síguenos</h4>
        <div class="social-links">
          <a href="#" aria-label="Instagram" class="social-link">
            <svg><!-- Instagram icon --></svg>
          </a>
          <a href="#" aria-label="Facebook" class="social-link">
            <svg><!-- Facebook icon --></svg>
          </a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 Cuba Tattoo Studio. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>
```

## Form Components (Molecules)

### FormField Component

#### Specifications
```astro
---
// components/forms/FormField.astro
export interface Props {
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file';
  name: string;
  label: string;
  placeholder?: string;
  value?: string;
  options?: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  validation?: ValidationRule[];
  class?: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}
---
```

### BookingForm Component

#### Specifications
```astro
---
// components/forms/BookingForm.astro
export interface Props {
  preselectedArtist?: string;
  showProgressIndicator?: boolean;
  multiStep?: boolean;
  class?: string;
}
---
```

#### Form Structure
```html
<form class="booking-form" novalidate>
  <div class="form-progress" aria-label="Progreso del formulario">
    <div class="progress-bar">
      <div class="progress-fill" style="width: 33%"></div>
    </div>
    <span class="progress-text">Paso 1 de 3</span>
  </div>
  
  <fieldset class="form-section">
    <legend class="form-section-title">Información Personal</legend>
    
    <div class="form-grid">
      <FormField 
        type="text" 
        name="fullName" 
        label="Nombre Completo" 
        required 
        validation={[
          { type: 'required', message: 'El nombre es requerido' },
          { type: 'minLength', value: 2, message: 'Mínimo 2 caracteres' }
        ]}
      />
      
      <FormField 
        type="email" 
        name="email" 
        label="Correo Electrónico" 
        required 
        validation={[
          { type: 'required', message: 'El email es requerido' },
          { type: 'email', message: 'Formato de email inválido' }
        ]}
      />
      
      <FormField 
        type="tel" 
        name="phone" 
        label="Teléfono" 
        required 
        validation={[
          { type: 'required', message: 'El teléfono es requerido' },
          { type: 'pattern', value: '^[\+]?[1-9][\d]{0,15}$', message: 'Formato de teléfono inválido' }
        ]}
      />
    </div>
  </fieldset>
  
  <fieldset class="form-section">
    <legend class="form-section-title">Detalles del Tatuaje</legend>
    
    <FormField 
      type="textarea" 
      name="tattooDescription" 
      label="Descripción del Tatuaje" 
      placeholder="Describe tu idea de tatuaje en detalle..." 
      required 
      validation={[
        { type: 'required', message: 'La descripción es requerida' },
        { type: 'minLength', value: 10, message: 'Mínimo 10 caracteres' }
      ]}
    />
    
    <div class="form-grid">
      <FormField 
        type="select" 
        name="size" 
        label="Tamaño Aproximado" 
        required 
        options={[
          { value: '', label: 'Selecciona un tamaño' },
          { value: 'small', label: 'Pequeño (2-4 pulgadas)' },
          { value: 'medium', label: 'Mediano (4-8 pulgadas)' },
          { value: 'large', label: 'Grande (8-12 pulgadas)' },
          { value: 'extra_large', label: 'Extra Grande (12+ pulgadas)' }
        ]}
      />
      
      <FormField 
        type="text" 
        name="bodyLocation" 
        label="Ubicación en el Cuerpo" 
        placeholder="Ej: brazo, espalda, pierna..." 
        required 
      />
    </div>
    
    <FormField 
      type="select" 
      name="preferredArtist" 
      label="Artista de Preferencia" 
      options={[
        { value: '', label: 'Sin preferencia' },
        { value: 'carlos-mendez', label: 'Carlos Méndez' },
        { value: 'maria-rodriguez', label: 'María Rodríguez' },
        { value: 'david-santos', label: 'David Santos' }
      ]}
    />
  </fieldset>
  
  <fieldset class="form-section">
    <legend class="form-section-title">Referencias e Información Adicional</legend>
    
    <FormField 
      type="file" 
      name="referenceImages" 
      label="Imágenes de Referencia" 
      helperText="Sube hasta 5 imágenes (JPG, PNG, máx. 5MB cada una)" 
      multiple 
      accept="image/jpeg,image/png,image/webp"
    />
    
    <FormField 
      type="textarea" 
      name="additionalNotes" 
      label="Notas Adicionales" 
      placeholder="Cualquier información adicional que consideres importante..." 
    />
  </fieldset>
  
  <div class="form-actions">
    <Button type="button" variant="secondary" class="btn-back">
      Anterior
    </Button>
    <Button type="submit" variant="primary" class="btn-submit" loading>
      Enviar Solicitud
    </Button>
  </div>
</form>
```

## Gallery Components (Organisms)

### PortfolioGrid Component

#### Specifications
```astro
---
// components/gallery/PortfolioGrid.astro
export interface Props {
  images: TattooImage[];
  columns?: 2 | 3 | 4 | 5;
  showFilters?: boolean;
  showLoadMore?: boolean;
  masonry?: boolean;
  lazyLoad?: boolean;
  class?: string;
}
---
```

#### Structure
```html
<section class="portfolio-grid" aria-label="Galería de tatuajes">
  <div class="grid-filters" v-if="showFilters">
    <GalleryFilter 
      :filters="availableFilters" 
      @filter-change="handleFilterChange"
    />
  </div>
  
  <div class="grid-container" :class="{ masonry: masonry }">
    <div 
      v-for="image in filteredImages" 
      :key="image.id" 
      class="grid-item" 
      :data-style="image.style"
      :data-artist="image.artist_id"
    >
      <div class="image-container">
        <OptimizedImage 
          :src="image.url" 
          :alt="image.alt" 
          :width="400" 
          :height="400" 
          :loading="lazyLoad ? 'lazy' : 'eager'"
          class="portfolio-image"
        />
        
        <div class="image-overlay">
          <div class="image-info">
            <h3 class="image-title">{{ image.artist_name }}</h3>
            <p class="image-style">{{ image.style }}</p>
          </div>
          
          <button 
            class="image-expand" 
            @click="openModal(image)"
            aria-label="Ver imagen completa"
          >
            <svg><!-- Expand icon --></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="grid-actions" v-if="showLoadMore && hasMoreImages">
    <Button @click="loadMoreImages" :loading="loadingMore">
      Cargar Más
    </Button>
  </div>
</section>
```

### GalleryFilter Component

#### Specifications
```astro
---
// components/gallery/GalleryFilter.astro
export interface Props {
  filters: FilterOption[];
  activeFilters: string[];
  showSearch?: boolean;
  showSort?: boolean;
  class?: string;
}

interface FilterOption {
  type: 'artist' | 'style' | 'size';
  label: string;
  value: string;
  count?: number;
}
---
```

## Animation Components (Organisms)

### LoadingSequence Component

#### Specifications
```astro
---
// components/animations/LoadingSequence.astro
export interface Props {
  logoText?: string;
  duration?: number;
  showProgress?: boolean;
  onComplete?: () => void;
  class?: string;
}
---
```

### ScrollTrigger Component

#### Specifications
```astro
---
// components/animations/ScrollTrigger.astro
export interface Props {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  animation: 'fade' | 'slide' | 'scale' | 'stagger' | 'parallax';
  delay?: number;
  duration?: number;
  ease?: string;
  class?: string;
}
---
```

## Component Testing Specifications

### Unit Testing
```javascript
// tests/components/Button.test.js
import { render, screen, fireEvent } from '@testing-library/astro';
import Button from '../src/components/ui/Button.astro';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(Button, { props: { children: 'Click me' } });
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  test('applies correct variant classes', () => {
    render(Button, { props: { variant: 'primary' } });
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(Button, { props: { onClick: handleClick } });
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('is disabled when disabled prop is true', () => {
    render(Button, { props: { disabled: true } });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Visual Regression Testing
```javascript
// tests/visual/components.test.js
import { test, expect } from '@playwright/test';

test('Button component visual regression', async ({ page }) => {
  await page.goto('/test/components/button');
  
  // Test different states
  await expect(page.locator('.btn-primary')).toHaveScreenshot('button-primary.png');
  await expect(page.locator('.btn-secondary')).toHaveScreenshot('button-secondary.png');
  
  // Test hover state
  await page.locator('.btn-primary').hover();
  await expect(page.locator('.btn-primary')).toHaveScreenshot('button-primary-hover.png');
});
```

### Accessibility Testing
```javascript
// tests/accessibility/components.test.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Components meet accessibility standards', async ({ page }) => {
  await page.goto('/test/components');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Performance Specifications

### Component Performance Metrics
- **Render Time:** < 16ms per component
- **Memory Usage:** < 1MB per complex component
- **Bundle Size:** < 5KB per component (gzipped)
- **Lazy Loading:** All non-critical components

### Optimization Strategies
- Tree shaking for unused component code
- Dynamic imports for heavy components
- Memoization for expensive computations
- Virtual scrolling for large lists
- Image lazy loading with intersection observer

---

**These component specifications ensure consistency, accessibility, and performance across the entire Cuba Tattoo Studio website while maintaining the strict B&W design system and professional aesthetic.**