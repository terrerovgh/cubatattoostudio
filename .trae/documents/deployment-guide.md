# Guía de Despliegue - Cuba Tattoo Studio

## 🚀 Resumen

Esta guía detalla el proceso completo de despliegue del sitio web de Cuba Tattoo Studio, desde la preparación del entorno hasta la configuración de producción y monitoreo.

## 📋 Requisitos Previos

### Herramientas Necesarias
- **Node.js:** v18.0.0 o superior
- **pnpm:** v8.0.0 o superior (gestor de paquetes recomendado)
- **Git:** Para control de versiones
- **Cuenta en Netlify/Vercel:** Para hosting estático
- **Dominio personalizado:** (opcional)

### Cuentas de Servicios Externos
- **EmailJS/Formspree:** Para formularios de contacto
- **Google Analytics:** Para tracking
- **Google Maps API:** Para el mapa del estudio
- **Instagram API:** (opcional) Para feed de Instagram

## 🏗️ Preparación para Producción

### 1. Configuración de Variables de Entorno

Crea un archivo `.env.production` en la raíz del proyecto:

```bash
# .env.production

# Site Configuration
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_SITE_NAME="Cuba Tattoo Studio"
PUBLIC_SITE_DESCRIPTION="Estudio de tatuajes premium en Albuquerque, Nuevo México"

# Analytics
PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX

# External Services
PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Google Maps
PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX

# Instagram (opcional)
PUBLIC_INSTAGRAM_ACCESS_TOKEN=IGQVJXXXXXXXXXXXXXXXXX

# Contact Information
PUBLIC_STUDIO_NAME="Cuba Tattoo Studio"
PUBLIC_STUDIO_ADDRESS="123 Central Ave NW, Albuquerque, NM 87102"
PUBLIC_STUDIO_PHONE="(505) 123-4567"
PUBLIC_STUDIO_EMAIL="info@cubatattoostudio.com"
PUBLIC_STUDIO_HOURS="Mar-Sáb: 12pm-8pm, Dom-Lun: Cerrado"

# Social Media
PUBLIC_INSTAGRAM_URL="https://instagram.com/cubatattoostudio"
PUBLIC_FACEBOOK_URL="https://facebook.com/cubatattoostudio"
```

### 2. Optimización de Assets

#### Compresión de Imágenes
```bash
# Instalar herramientas de optimización
npm install -g imagemin-cli
npm install -g svgo

# Optimizar imágenes
imagemin public/images/**/*.{jpg,jpeg,png} --out-dir=public/images/optimized --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant

# Optimizar SVGs
svgo -f public/images -o public/images/optimized
```

#### Generación de Imágenes Responsivas
```bash
# Script para generar múltiples tamaños
#!/bin/bash
for img in public/images/portfolio/*.jpg; do
  filename=$(basename "$img" .jpg)
  # Generar diferentes tamaños
  convert "$img" -resize 400x400^ -gravity center -extent 400x400 "public/images/portfolio/${filename}-400.jpg"
  convert "$img" -resize 800x800^ -gravity center -extent 800x800 "public/images/portfolio/${filename}-800.jpg"
  convert "$img" -resize 1200x1200^ -gravity center -extent 1200x1200 "public/images/portfolio/${filename}-1200.jpg"
  
  # Generar WebP
  cwebp -q 85 "$img" -o "public/images/portfolio/${filename}.webp"
done
```

### 3. Build para Producción

```bash
# Limpiar build anterior
rm -rf dist/

# Instalar dependencias
pnpm install --frozen-lockfile

# Ejecutar tests
pnpm run test:lighthouse
pnpm run test:a11y

# Build optimizado
pnpm run build

# Verificar build
pnpm run preview
```

### 4. Configuración de Astro para Producción

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    tailwind(),
    sitemap(),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        caseSensitive: true,
        removeComments: true
      },
      Image: false, // Manejamos imágenes manualmente
      JavaScript: true,
      SVG: true
    })
  ],
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'vendor': ['@astrojs/image']
          }
        }
      }
    },
    ssr: {
      external: ['gsap']
    }
  }
});
```

## 🌐 Opciones de Hosting

### Opción 1: Netlify (Recomendado)

#### Configuración Netlify

```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefix=/opt/buildhome/.local"

[[redirects]]
  from = "/artistas/*"
  to = "/artistas/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Deploy a Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login a Netlify
netlify login

# Deploy inicial
netlify deploy --prod --dir=dist

# Deploy automático desde Git
netlify link
```

### Opción 2: Vercel

#### Configuración Vercel

```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "astro",
  "rewrites": [
    {
      "source": "/artistas/(.*)",
      "destination": "/artistas/$1"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Deploy a Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Opción 3: GitHub Pages

#### Configuración GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'pnpm'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Build
      run: pnpm run build
      env:
        PUBLIC_SITE_URL: https://username.github.io/cubatattoostudio
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔧 Configuración de Dominio

### DNS Configuration

```bash
# Registros DNS necesarios
# Para Netlify
A     @     104.198.14.52
CNAME www   cubatattoostudio.netlify.app

# Para Vercel
A     @     76.76.19.61
CNAME www   cname.vercel-dns.com

# Para GitHub Pages
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   username.github.io
```

### SSL/TLS Configuration

```bash
# Netlify y Vercel manejan SSL automáticamente
# Para configuración manual:

# Let's Encrypt con Certbot
sudo certbot --nginx -d cubatattoostudio.com -d www.cubatattoostudio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoreo y Analytics

### Google Analytics 4

```html
<!-- En Layout.astro -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href
  });
</script>
```

### Google Search Console

```html
<!-- Verificación de propiedad -->
<meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxxx" />
```

### Uptime Monitoring

```javascript
// Configuración con UptimeRobot API
const monitors = [
  {
    friendly_name: "Cuba Tattoo Studio - Homepage",
    url: "https://cubatattoostudio.com",
    type: 1, // HTTP(s)
    interval: 300 // 5 minutos
  },
  {
    friendly_name: "Cuba Tattoo Studio - Reservas",
    url: "https://cubatattoostudio.com/reservas",
    type: 1,
    interval: 300
  }
];
```

## 🚨 Rollback y Recovery

### Estrategia de Rollback

```bash
# Netlify - Rollback a deploy anterior
netlify api listSiteDeploys --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID

# Vercel - Rollback
vercel rollback https://cubatattoostudio.com

# GitHub Pages - Revert commit
git revert HEAD
git push origin main
```

### Backup de Contenido

```bash
# Script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/content_$DATE"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de datos JSON
cp -r src/data/ $BACKUP_DIR/

# Backup de imágenes
cp -r public/images/ $BACKUP_DIR/

# Backup de configuración
cp astro.config.mjs $BACKUP_DIR/
cp tailwind.config.js $BACKUP_DIR/
cp package.json $BACKUP_DIR/

# Comprimir backup
tar -czf "backup_$DATE.tar.gz" $BACKUP_DIR

echo "Backup creado: backup_$DATE.tar.gz"
```

## 📋 Checklist Pre-Deploy

### Código y Build
- [ ] Todos los tests pasan
- [ ] Build se completa sin errores
- [ ] No hay warnings críticos
- [ ] Bundle size está optimizado
- [ ] Lighthouse scores > 90
- [ ] Todas las imágenes están optimizadas

### Contenido
- [ ] Información de contacto es correcta
- [ ] Todos los enlaces funcionan
- [ ] Portfolio está actualizado
- [ ] Información de artistas es precisa
- [ ] FAQ está completo

### Configuración
- [ ] Variables de entorno configuradas
- [ ] Analytics configurado
- [ ] Formularios funcionan correctamente
- [ ] Mapa muestra ubicación correcta
- [ ] SSL/TLS configurado

### SEO
- [ ] Meta tags únicos por página
- [ ] Sitemap generado
- [ ] robots.txt configurado
- [ ] Schema.org implementado
- [ ] Open Graph configurado

## 🔄 CI/CD Pipeline

### GitHub Actions Completo

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'pnpm'
    - uses: pnpm/action-setup@v2
      with:
        version: 8
    - run: pnpm install --frozen-lockfile
    - run: pnpm run lint
    - run: pnpm run test:lighthouse
    - run: pnpm run test:a11y
    
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'pnpm'
    - uses: pnpm/action-setup@v2
      with:
        version: 8
    - run: pnpm install --frozen-lockfile
    - run: pnpm run build
    - uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📈 Post-Deploy Monitoring

### Health Checks

```bash
# Script de health check
#!/bin/bash
SITE_URL="https://cubatattoostudio.com"

# Check homepage
if curl -f -s $SITE_URL > /dev/null; then
    echo "✅ Homepage is up"
else
    echo "❌ Homepage is down"
    exit 1
fi

# Check critical pages
for page in "/artistas" "/portfolio" "/estudio" "/reservas"; do
    if curl -f -s "$SITE_URL$page" > /dev/null; then
        echo "✅ $page is up"
    else
        echo "❌ $page is down"
        exit 1
    fi
done

echo "🎉 All systems operational"
```

### Performance Monitoring

```javascript
// Configuración de Web Vitals
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

*Esta guía debe actualizarse con cada cambio significativo en la infraestructura o proceso de deploy.*