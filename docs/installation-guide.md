# Guía de Instalación - Cuba Tattoo Studio

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior (incluido con Node.js)
- **Git**: Para control de versiones
- **Editor de Código**: VS Code recomendado

### Requisitos Recomendados
- **Node.js**: v20.0.0 o superior
- **pnpm**: v8.0.0 o superior (gestor de paquetes más rápido)
- **Extensiones VS Code**:
  - Astro
  - Tailwind CSS IntelliSense
  - Prettier
  - ESLint

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cubatattoostudio.git

# Navegar al directorio
cd cubatattoostudio
```

### 2. Instalar Dependencias

**Con npm:**
```bash
npm install
```

**Con pnpm (recomendado):**
```bash
pnpm install
```

### 3. Iniciar el Servidor de Desarrollo

```bash
# Con npm
npm run dev

# Con pnpm
pnpm dev
```

El sitio estará disponible en: `http://localhost:4321`

## 🔧 Configuración del Entorno

### Estructura de Archivos Inicial

Después de la instalación, tu proyecto debe tener esta estructura:

```
cubatattoostudio/
├── .gitignore
├── README.md
├── astro.config.mjs
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── fonts/
│   └── images/
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── .trae/
    └── documents/
```

### Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno, crea un archivo `.env` en la raíz:

```bash
# .env
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_CONTACT_EMAIL=info@cubatattoostudio.com
PUBLIC_PHONE=+1-505-XXX-XXXX
PUBLIC_ADDRESS="Albuquerque, NM"
```

## 🎨 Configuración de Desarrollo

### VS Code - Configuración Recomendada

Crea `.vscode/settings.json`:

```json
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
  }
}
```

Crea `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}
```

### Prettier - Configuración

Crea `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

## 📦 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.ts,.astro",
    "type-check": "astro check"
  }
}
```

### Descripción de Scripts

- **`dev`**: Inicia el servidor de desarrollo con hot reload
- **`build`**: Construye el sitio para producción
- **`preview`**: Previsualiza la build de producción localmente
- **`format`**: Formatea todo el código con Prettier
- **`lint`**: Ejecuta ESLint para encontrar errores
- **`type-check`**: Verifica tipos de TypeScript

## 🖼️ Configuración de Assets

### Imágenes

Coloca las imágenes en las siguientes carpetas:

```
public/images/
├── artists/          # Fotos de artistas
├── portfolio/        # Trabajos de portfolio
├── studio/          # Fotos del estudio
└── og-image.jpg     # Imagen para redes sociales
```

### Fuentes

Las fuentes están en `public/fonts/`:
- `bebas-neue.woff2` - Para encabezados
- `inter.woff2` - Para texto del cuerpo

### Optimización de Imágenes

Para mejores resultados, optimiza las imágenes:

```bash
# Instalar herramientas de optimización (opcional)
npm install -g imagemin-cli

# Optimizar imágenes
imagemin public/images/**/*.{jpg,png} --out-dir=public/images/optimized
```

## 🌐 Configuración de Deployment

### GitHub Pages

1. **Configurar el repositorio**:
   - Ve a Settings > Pages
   - Source: GitHub Actions
   - Configura el dominio personalizado: `docs.cubatattoostudio.com`

2. **Crear workflow de GitHub Actions**:

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with Astro
        run: |
          npm run build
        env:
          PUBLIC_SITE_URL: ${{ steps.pages.outputs.origin }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
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
        uses: actions/deploy-pages@v4
```

3. **Configurar Astro para GitHub Pages**:

Actualiza `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://docs.cubatattoostudio.com',
  base: '/',
  vite: {
    plugins: [tailwindcss()]
  }
});
```

## 🔍 Verificación de la Instalación

### Checklist Post-Instalación

- [ ] ✅ Node.js v18+ instalado
- [ ] ✅ Dependencias instaladas sin errores
- [ ] ✅ Servidor de desarrollo funcionando en `localhost:4321`
- [ ] ✅ Hot reload funcionando al editar archivos
- [ ] ✅ Tailwind CSS aplicando estilos
- [ ] ✅ GSAP cargando sin errores en consola
- [ ] ✅ Fuentes cargando correctamente
- [ ] ✅ Imágenes mostrándose correctamente

### Comandos de Verificación

```bash
# Verificar versión de Node
node --version

# Verificar que no hay errores de TypeScript
npm run type-check

# Verificar que el build funciona
npm run build

# Verificar que el preview funciona
npm run preview
```

## 🆘 Solución de Problemas Comunes

### Error: "Module not found"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 4321 already in use"
```bash
# Usar un puerto diferente
npm run dev -- --port 3000
```

### Error: GSAP no funciona
```bash
# Verificar que GSAP está instalado
npm list gsap

# Reinstalar si es necesario
npm install gsap@latest
```

### Error: Tailwind no aplica estilos
```bash
# Verificar configuración de Tailwind
npx tailwindcss --init --check

# Reconstruir el proyecto
npm run build
```

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. **Revisa la documentación**: Consulta este documento y el README.md
2. **Verifica versiones**: Asegúrate de usar las versiones correctas de Node.js y npm
3. **Limpia la instalación**: Borra `node_modules` y reinstala
4. **Consulta los logs**: Revisa los mensajes de error en la consola

## 🎯 Próximos Pasos

Después de la instalación exitosa:

1. **Familiarízate con la estructura**: Revisa la [Guía de Componentes](./component-guide.md)
2. **Configura el contenido**: Edita los archivos JSON en `src/data/`
3. **Personaliza el diseño**: Modifica los colores en `tailwind.config.js`
4. **Añade contenido**: Agrega imágenes y actualiza el contenido
5. **Despliega**: Configura GitHub Pages siguiendo esta guía