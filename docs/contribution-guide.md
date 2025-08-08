# Guía de Contribución - Cuba Tattoo Studio

## 🎯 Bienvenido al Proyecto

Esta guía establece los estándares y procesos para contribuir al desarrollo del sitio web de Cuba Tattoo Studio. Nuestro objetivo es mantener un código de alta calidad, consistente y bien documentado.

## 📋 Índice

1. [Configuración del Entorno](#configuración-del-entorno)
2. [Estándares de Código](#estándares-de-código)
3. [Flujo de Trabajo Git](#flujo-de-trabajo-git)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Guías de Desarrollo](#guías-de-desarrollo)
6. [Testing y Quality Assurance](#testing-y-quality-assurance)
7. [Deployment](#deployment)
8. [Recursos y Referencias](#recursos-y-referencias)

## ⚙️ Configuración del Entorno

### Requisitos Previos

- **Node.js:** v18.0.0 o superior
- **Package Manager:** pnpm (recomendado) o npm
- **Git:** Última versión estable
- **Editor:** VS Code (recomendado)

### Setup Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/cubatattoostudio/website.git
cd website

# 2. Instalar dependencias
pnpm install

# 3. Configurar hooks de Git
npx husky install

# 4. Iniciar servidor de desarrollo
pnpm dev
```

### Configuración de VS Code

Instalar las siguientes extensiones:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuración de Workspace

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  },
  "files.associations": {
    "*.astro": "astro"
  }
}
```

## 📝 Estándares de Código

### Convenciones de Nomenclatura

#### Archivos y Directorios

```
✅ Correcto:
components/ui/Button.astro
components/gallery/PortfolioGrid.astro
pages/artistas/[slug].astro
utils/gsap-helpers.js

❌ Incorrecto:
components/UI/button.astro
components/Gallery/portfolio_grid.astro
pages/Artistas/[Slug].astro
utils/gsapHelpers.js
```

#### Variables y Funciones

```javascript
// ✅ Correcto - camelCase
const artistName = 'Juan Pérez';
const portfolioItems = [];
const createAnimation = () => {};
const handleFormSubmit = () => {};

// ❌ Incorrecto
const artist_name = 'Juan Pérez';
const ArtistName = 'Juan Pérez';
const CreateAnimation = () => {};
```

#### Clases CSS (Tailwind)

```html
<!-- ✅ Correcto -->
<div class="bg-cuba-black text-cuba-white p-6 rounded-lg shadow-lg">
<button class="btn-primary hover:btn-primary-hover transition-colors">

<!-- ❌ Incorrecto -->
<div class="bg-black text-white p-6 rounded-lg shadow-lg">
<button class="bg-blue-500 hover:bg-blue-600 px-4 py-2">
```

### Estructura de Componentes Astro

```astro
---
// 1. Imports de librerías externas
import { gsap } from 'gsap';
import { Image } from 'astro:assets';

// 2. Imports de componentes locales
import Button from '../ui/Button.astro';
import Card from '../ui/Card.astro';

// 3. Imports de utilidades
import { formatDate } from '../../utils/date-helpers';

// 4. Props interface (TypeScript)
interface Props {
  title: string;
  description?: string;
  items: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

// 5. Destructuring de props
const { title, description, items } = Astro.props;

// 6. Lógica del componente
const processedItems = items.map(item => ({
  ...item,
  slug: item.name.toLowerCase().replace(/\s+/g, '-')
}));
---

<!-- 7. Template HTML -->
<section class="portfolio-section py-16">
  <div class="container mx-auto px-4">
    <!-- Header -->
    <header class="text-center mb-12">
      <h2 class="text-4xl font-heading text-cuba-white mb-4">
        {title}
      </h2>
      {description && (
        <p class="text-cuba-gray-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </header>
    
    <!-- Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processedItems.map((item) => (
        <Card key={item.id} class="portfolio-item">
          <Image 
            src={item.image} 
            alt={item.name}
            width={400}
            height={300}
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-xl font-heading text-cuba-white">
              {item.name}
            </h3>
          </div>
        </Card>
      ))}
    </div>
  </div>
</section>

<!-- 8. Scripts del lado del cliente -->
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Animación de aparición
  gsap.fromTo('.portfolio-item', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.portfolio-section',
        start: 'top 80%'
      }
    }
  );
</script>

<!-- 9. Estilos específicos (solo si es absolutamente necesario) -->
<style>
  /* Evitar CSS personalizado - usar Tailwind */
  .portfolio-item {
    /* Solo para animaciones GSAP complejas */
  }
</style>
```

### Estándares de JavaScript/TypeScript

#### Configuración ESLint

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:astro/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Reglas específicas del proyecto
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      }
    }
  ]
};
```

#### Configuración Prettier

```javascript
// .prettierrc.cjs
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
```

## 🌿 Flujo de Trabajo Git

### Estructura de Branches

```
main                    # Producción - solo merges de release
├── develop            # Desarrollo principal
├── feature/hero-animations
├── feature/portfolio-filters
├── bugfix/mobile-menu
└── hotfix/contact-form
```

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>[optional scope]: <description>

# Ejemplos
feat: add portfolio filtering functionality
fix: resolve mobile menu overlay issue
style: update button hover animations
docs: add GSAP animation guide
refactor: optimize image loading performance
test: add unit tests for form validation
chore: update dependencies

# Con scope
feat(portfolio): add image lazy loading
fix(forms): resolve validation error messages
style(animations): improve hero section transitions
```

### Tipos de Commit

- **feat:** Nueva funcionalidad
- **fix:** Corrección de bugs
- **docs:** Documentación
- **style:** Cambios de estilo/formato
- **refactor:** Refactorización de código
- **test:** Añadir o modificar tests
- **chore:** Tareas de mantenimiento
- **perf:** Mejoras de performance
- **ci:** Cambios en CI/CD

### Flujo de Desarrollo

#### 1. Crear Feature Branch

```bash
# Desde develop
git checkout develop
git pull origin develop
git checkout -b feature/portfolio-filters
```

#### 2. Desarrollo y Commits

```bash
# Hacer cambios
git add .
git commit -m "feat(portfolio): add style filtering functionality"

# Push regular
git push origin feature/portfolio-filters
```

#### 3. Pull Request

**Template de PR:**

```markdown
## 📝 Descripción

Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💄 Cambios de UI/estilo
- [ ] ♻️ Refactorización
- [ ] 📝 Documentación
- [ ] 🚀 Performance

## 🧪 Testing

- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Probado en Chrome/Firefox/Safari
- [ ] Probado en móvil
- [ ] Lighthouse score > 90

## 📱 Screenshots

<!-- Añadir screenshots si aplica -->

## 📋 Checklist

- [ ] Código sigue las convenciones del proyecto
- [ ] Documentación actualizada
- [ ] No hay console.logs
- [ ] Animaciones funcionan correctamente
- [ ] Responsive design implementado
- [ ] Accesibilidad verificada
```

#### 4. Code Review

**Criterios de Review:**

- ✅ Código sigue estándares establecidos
- ✅ Funcionalidad implementada correctamente
- ✅ No hay regresiones
- ✅ Performance no se ve afectada
- ✅ Documentación actualizada
- ✅ Tests incluidos (si aplica)

#### 5. Merge y Deploy

```bash
# Después de aprobación
git checkout develop
git pull origin develop
git merge feature/portfolio-filters
git push origin develop

# Limpiar branch
git branch -d feature/portfolio-filters
git push origin --delete feature/portfolio-filters
```

## 🏗️ Estructura del Proyecto

### Organización de Directorios

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes básicos (Button, Card, Input)
│   ├── layout/         # Layout components (Header, Footer)
│   ├── animations/     # Wrappers de animaciones GSAP
│   ├── forms/          # Componentes de formularios
│   ├── gallery/        # Componentes de galería
│   └── effects/        # Efectos visuales
├── layouts/            # Layouts de página
│   ├── Layout.astro    # Layout principal
│   └── BlogLayout.astro # Layout específico
├── pages/              # Páginas del sitio
│   ├── index.astro     # Homepage
│   ├── artistas/       # Sección artistas
│   ├── portfolio/      # Galería portfolio
│   ├── estudio/        # Sobre nosotros
│   └── reservas/       # Contacto y reservas
├── styles/             # Estilos globales mínimos
│   └── global.css      # Solo configuración base
├── utils/              # Utilidades y helpers
│   ├── gsap-helpers.js # Helpers para animaciones
│   ├── form-validation.js
│   └── date-helpers.js
├── data/               # Datos estáticos
│   ├── artists.json    # Información de artistas
│   └── tattoo-styles.json
└── assets/             # Assets estáticos
    ├── images/         # Imágenes optimizadas
    └── fonts/          # Fuentes personalizadas
```

### Convenciones de Archivos

#### Componentes

```
✅ Correcto:
Button.astro           # Componente simple
PortfolioGrid.astro    # Componente compuesto
GSAPWrapper.astro      # Wrapper específico

❌ Incorrecto:
button.astro
portfolio-grid.astro
gsap_wrapper.astro
```

#### Páginas

```
✅ Correcto:
index.astro            # Homepage
[slug].astro           # Página dinámica
artistas/index.astro   # Listado de artistas
artistas/[slug].astro  # Perfil de artista

❌ Incorrecto:
home.astro
artist.astro
artist-profile.astro
```

## 🛠️ Guías de Desarrollo

### Desarrollo de Componentes

#### 1. Planificación

- Definir props y interface
- Identificar estados y variantes
- Planificar animaciones necesarias
- Considerar responsividad

#### 2. Implementación

```astro
---
// ComponentName.astro
interface Props {
  // Definir props con tipos
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const { 
  title, 
  variant = 'primary', 
  size = 'md',
  animated = true 
} = Astro.props;

// Lógica de clases dinámicas
const baseClasses = 'component-base';
const variantClasses = {
  primary: 'bg-cuba-white text-cuba-black',
  secondary: 'bg-transparent border border-cuba-white text-cuba-white'
};
const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const componentClasses = [
  baseClasses,
  variantClasses[variant],
  sizeClasses[size],
  animated && 'animate-on-scroll'
].filter(Boolean).join(' ');
---

<div class={componentClasses}>
  <slot />
</div>

{animated && (
  <script>
    // Animaciones específicas del componente
  </script>
)}
```

#### 3. Testing Manual

- Probar todas las variantes
- Verificar responsividad
- Testear animaciones
- Validar accesibilidad

### Desarrollo de Animaciones

#### 1. Principios

- **Performance First:** 60fps mínimo
- **Progressive Enhancement:** Funciona sin JS
- **Accessibility:** Respetar `prefers-reduced-motion`
- **Mobile Optimized:** Animaciones ligeras en móvil

#### 2. Patrón de Implementación

```javascript
// utils/animation-helpers.js
export const createFadeInAnimation = (elements, options = {}) => {
  const defaults = {
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  };
  
  const config = { ...defaults, ...options };
  
  // Verificar preferencias de accesibilidad
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  if (prefersReducedMotion) {
    gsap.set(elements, { opacity: 1 });
    return;
  }
  
  return gsap.fromTo(elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: {
        trigger: elements,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
};
```

### Optimización de Performance

#### 1. Imágenes

```astro
---
// Usar componente Image de Astro
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg';
---

<!-- ✅ Correcto -->
<Image 
  src={heroImage}
  alt="Cuba Tattoo Studio interior"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading="lazy"
  class="w-full h-screen object-cover"
/>

<!-- ❌ Incorrecto -->
<img src="/images/hero.jpg" alt="Hero image" class="w-full" />
```

#### 2. GSAP Optimizations

```javascript
// ✅ Correcto - Import específico
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ❌ Incorrecto - Import completo
import * as gsap from 'gsap';

// ✅ Correcto - Configuración optimizada
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

// ✅ Correcto - Cleanup
const cleanup = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
};

window.addEventListener('beforeunload', cleanup);
```

## 🧪 Testing y Quality Assurance

### Testing Manual

#### Checklist de Funcionalidad

- [ ] **Navegación**
  - [ ] Todos los enlaces funcionan
  - [ ] Menú móvil se abre/cierra correctamente
  - [ ] Breadcrumbs actualizados
  - [ ] Navegación por teclado funcional

- [ ] **Formularios**
  - [ ] Validación en tiempo real
  - [ ] Mensajes de error claros
  - [ ] Envío exitoso
  - [ ] Estados de loading

- [ ] **Animaciones**
  - [ ] Secuencia de carga funciona
  - [ ] ScrollTrigger sincronizado
  - [ ] Hover effects responsivos
  - [ ] Performance > 60fps

- [ ] **Responsividad**
  - [ ] Mobile (320px - 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (1024px+)
  - [ ] Touch interactions

#### Testing de Navegadores

| Navegador | Versión Mínima | Status |
|-----------|----------------|--------|
| Chrome    | 90+           | ✅ |
| Firefox   | 88+           | ✅ |
| Safari    | 14+           | ✅ |
| Edge      | 90+           | ✅ |

### Performance Testing

#### Lighthouse Audit

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Objetivos mínimos
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 90
# SEO: > 90
```

#### Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Accessibility Testing

#### Herramientas

- **axe DevTools:** Extensión de navegador
- **WAVE:** Web Accessibility Evaluation Tool
- **Lighthouse:** Audit de accesibilidad
- **Screen Reader:** Testing manual

#### Checklist A11y

- [ ] Contraste de colores adecuado (4.5:1 mínimo)
- [ ] Navegación por teclado completa
- [ ] Alt text en todas las imágenes
- [ ] Headings jerárquicos (h1 → h2 → h3)
- [ ] Labels en formularios
- [ ] Focus indicators visibles
- [ ] ARIA attributes cuando sea necesario

## 🚀 Deployment

### Entornos

#### Development
- **URL:** http://localhost:3000
- **Branch:** feature branches
- **Deploy:** Manual (npm run dev)

#### Staging
- **URL:** https://staging.cubatattoostudio.com
- **Branch:** develop
- **Deploy:** Automático via GitHub Actions

#### Production
- **URL:** https://cubatattoostudio.com
- **Branch:** main
- **Deploy:** Manual via GitHub Actions

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run type checking
        run: pnpm type-check
      
      - name: Build project
        run: pnpm build
      
      - name: Run Lighthouse CI
        run: pnpm lighthouse:ci

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install and build
        run: |
          pnpm install
          pnpm build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Pre-deployment Checklist

- [ ] **Code Quality**
  - [ ] Linting pasa sin errores
  - [ ] Type checking exitoso
  - [ ] Build se completa sin warnings
  - [ ] Tests pasan (si existen)

- [ ] **Performance**
  - [ ] Lighthouse score > 90 en todas las métricas
  - [ ] Imágenes optimizadas
  - [ ] Bundle size aceptable
  - [ ] Core Web Vitals dentro de límites

- [ ] **Funcionalidad**
  - [ ] Todas las páginas cargan correctamente
  - [ ] Formularios funcionan
  - [ ] Animaciones fluidas
  - [ ] Links externos funcionan

- [ ] **SEO**
  - [ ] Meta tags actualizados
  - [ ] Sitemap generado
  - [ ] robots.txt configurado
  - [ ] Schema.org implementado

## 📚 Recursos y Referencias

### Documentación Oficial

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Herramientas de Desarrollo

- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Inspiración y Referencias

- [Rockstar Games GTA VI](https://www.rockstargames.com/VI) - Referencia de animaciones
- [Awwwards](https://www.awwwards.com/) - Inspiración de diseño
- [CodePen](https://codepen.io/) - Ejemplos de animaciones

### Comunidad y Soporte

- [Astro Discord](https://astro.build/chat)
- [GSAP Forums](https://greensock.com/forums/)
- [Tailwind CSS Discord](https://tailwindcss.com/discord)

## 🤝 Contacto y Soporte

### Equipo de Desarrollo

- **Tech Lead:** [Nombre] - [email]
- **Frontend Developer:** [Nombre] - [email]
- **Designer:** [Nombre] - [email]

### Reportar Issues

1. Verificar que el issue no existe ya
2. Usar el template de issue apropiado
3. Incluir pasos para reproducir
4. Añadir screenshots si es visual
5. Especificar navegador y dispositivo

### Solicitar Features

1. Describir la funcionalidad deseada
2. Explicar el caso de uso
3. Proporcionar mockups si es posible
4. Considerar impacto en performance

---

**¡Gracias por contribuir al proyecto Cuba Tattoo Studio!** 🎨

Tu trabajo ayuda a crear una experiencia web excepcional que representa la calidad y profesionalismo del estudio.