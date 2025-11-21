# Guía de Deployment

Esta guía documenta el proceso de deployment del sitio Cuba Tattoo Studio.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Build de Producción](#build-de-producción)
- [Cloudflare Pages (Recomendado)](#cloudflare-pages-recomendado)
- [Alternativas de Hosting](#alternativas-de-hosting)
- [Optimizaciones](#optimizaciones)
- [Post-Deployment](#post-deployment)

## Visión General

Cuba Tattoo Studio es un sitio estático generado (SSG) que puede desplegarse en cualquier servicio de hosting de sitios estáticos. El deployment recomendado es **Cloudflare Pages** por su velocidad, CDN global, y facilidad de uso.

### Características del Build

- **Output**: Sitio estático (HTML, CSS, JS, assets)
- **Directorio**: `./dist/`
- **No requiere**: Servidor Node.js en producción
- **CDN-friendly**: Todos los assets están optimizados para CDN

## Build de Producción

### Comando de Build

```bash
npm run build
```

Este comando:
1. Compila todos los componentes Astro a HTML
2. Procesa y optimiza CSS con TailwindCSS
3. Bundle JavaScript (mínimo, solo iconos de React)
4. Optimiza assets estáticos
5. Genera el output en `./dist/`

### Estructura del Build

```
dist/
├── index.html              # Página principal
├── _astro/                 # Assets optimizados (CSS, JS)
│   ├── *.css
│   └── *.js
├── artists/                # Imágenes de artistas
├── tattoo/                 # Galería de trabajos
├── logo-stack.svg
└── favicon.svg
```

### Preview Local del Build

```bash
# Build
npm run build

# Preview
npm run preview
```

El sitio estará disponible en `http://localhost:4321`

## Cloudflare Pages (Recomendado)

### Ventajas

- ✅ CDN global ultra-rápido
- ✅ SSL automático
- ✅ Git integration (auto-deploy en push)
- ✅ Preview deployments para branches
- ✅ Rollback fácil
- ✅ Gratis para proyectos personales

### Setup Inicial

#### 1. Crear Cuenta en Cloudflare Pages

1. Ir a [Cloudflare Pages](https://pages.cloudflare.com)
2. Crear cuenta o iniciar sesión
3. Click en "Create a project"

#### 2. Conectar Repositorio

1. Conectar GitHub/GitLab account
2. Seleccionar el repositorio `cubatattoostudio`
3. Dar permisos de acceso

#### 3. Configurar Build

**Framework preset**: Astro

**Build settings**:
```yaml
Build command: npm run build
Build output directory: dist
Root directory: /
```

**Más configuración (opcional)**:
```yaml
Node version: 18
```

#### 4. Deploy

1. Click "Save and Deploy"
2. Esperar a que termine el build (1-2 minutos)
3. Sitio estará disponible en `https://cubatattoostudio.pages.dev`

### Custom Domain

#### Añadir Dominio Personalizado

1. En Cloudflare Pages, ir a proyecto → "Custom domains"
2. Click "Set up a custom domain"
3. Ingresar dominio (ej: `cubatattoostudio.com`)
4. Seguir instrucciones para configurar DNS

**DNS Records** (si usas Cloudflare DNS):
```
Type: CNAME
Name: @
Target: cubatattoostudio.pages.dev
Proxy: Enabled (naranja)
```

Para `www`:
```
Type: CNAME
Name: www
Target: cubatattoostudio.pages.dev
Proxy: Enabled
```

### Configuración Avanzada

#### Variables de Entorno

Si necesitas variables de entorno:

1. Ir a Settings → Environment variables
2. Añadir variables:
   ```
   Production:
   PUBLIC_ANALYTICS_ID=UA-XXXXXXX
   
   Preview:
   PUBLIC_ANALYTICS_ID=UA-XXXXXXX-preview
   ```

#### Build Configuration File

Crear `wrangler.toml` (opcional):

```toml
name = "cubatattoostudio"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
cwd = "."
watch_dir = "src"

[build.upload]
format = "service-worker"
```

### Preview Deployments

Cloudflare Pages genera automáticamente preview deployments para cada branch:

- **Production**: branch `main` → `cubatattoostudio.pages.dev`
- **Preview**: branch `feature-x` → `feature-x.cubatattoostudio.pages.dev`

## Alternativas de Hosting

### Netlify

#### Setup

1. Ir a [Netlify](https://netlify.com)
2. "New site from Git" → Conectar repo
3. Build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

#### Configuración

Crear `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

#### Setup

1. Ir a [Vercel](https://vercel.com)
2. "Import Project" → Seleccionar repo
3. Framework: Astro (auto-detectado)
4. Deploy

#### Configuración

Crear `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### GitHub Pages

#### Setup

1. Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

2. Habilitar GitHub Pages en repo settings
3. Select source: "GitHub Actions"

### Render

#### Setup

1. Crear cuenta en [Render](https://render.com)
2. "New Static Site"
3. Conectar repo
4. Build command: `npm run build`
5. Publish directory: `dist`

## Optimizaciones

### Performance

#### 1. Comprimir Imágenes

Antes de deployar, optimizar imágenes:

```bash
# Instalar imagemin
npm install -g imagemin-cli imagemin-webp imagemin-pngquant

# Comprimir PNGs
imagemin public/artists/*.png --out-dir=public/artists/ --plugin=pngquant

# Convertir a WebP (mejor compresión)
imagemin public/tattoo/*.png --out-dir=public/tattoo/ --plugin=webp
```

#### 2. Asset Optimization

Astro optimiza automáticamente en build:
- CSS minificado
- JavaScript minificado
- TailwindCSS purged (solo clases usadas)

#### 3. Cache Headers

Configurar cache en Cloudflare/Netlify:

**`_headers` file** (Netlify):
```
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

**Page Rules** (Cloudflare):
```
URL: *.pages.dev/_astro/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
```

### SEO

#### Sitemap

Añadir integración de sitemap:

```bash
npm run astro add sitemap
```

Actualizar `astro.config.mjs`:
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [react(), sitemap()]
});
```

#### robots.txt

Crear `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://cubatattoostudio.com/sitemap-index.xml
```

### Security

#### Content Security Policy

Añadir headers en `_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Post-Deployment

### Checklist

- [ ] Verificar que el sitio carga correctamente
- [ ] Probar navegación en todas las secciones
- [ ] Verificar que las imágenes cargan
- [ ] Probar formulario de contacto (si está integrado)
- [ ] Verificar responsive en móvil/tablet
- [ ] Probar animaciones (scroll reveals)
- [ ] Verificar que parallax funciona
- [ ] Verificar meta tags (Open Graph, Twitter Card)
- [ ] Probar performance con Lighthouse
- [ ] Configurar analytics (si aplica)

### Testing de Performance

```bash
# Lighthouse CI
npm install -g lighthouse

lighthouse https://cubatattoostudio.pages.dev --view
```

**Métricas Objetivo**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Monitoring

#### Setup Analytics

**Google Analytics**:
```astro
<!-- Layout.astro -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Cloudflare Web Analytics** (recomendado):
```astro
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

### Rollback

Si necesitas revertir un deployment:

**Cloudflare Pages**:
1. Ir a Deployments
2. Encontrar deployment anterior
3. Click "Rollback to this deployment"

**Netlify**:
1. Deploys → Seleccionar deployment anterior
2. Click "Publish deploy"

## CI/CD Avanzado

### GitHub Actions

Crear workflow para build y deploy automático:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run tests (si existen)
        run: npm test
```

## Troubleshooting

### Build Falla en Production

**Síntoma**: Build exitoso localmente pero falla en hosting

**Soluciones**:
1. Verificar versión de Node (debe ser >= 18)
2. Limpiar lock files y rebuildar:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
3. Verificar variables de entorno
4. Revisar logs de build en plataforma

### Sitio No Carga Después de Deploy

**Síntoma**: 404 o página en blanco

**Soluciones**:
1. Verificar que `dist/` contiene archivos
2. Verificar configuración de "publish directory"
3. Check browser console para errores
4. Verificar rutas de assets (deben ser absolutas: `/assets/...`)

### Imágenes No Cargan

**Síntoma**: 404 en imágenes

**Soluciones**:
1. Verificar que imágenes están en `/public/`
2. Verificar rutas (case-sensitive en producción)
3. Verificar que imágenes se copiaron a `dist/`

---

**Última actualización**: 2025-11-21
