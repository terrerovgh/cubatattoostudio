# Cuba Tattoo Studio Web - Modular v2

## Project Overview

Reescritura y modularización completa del sitio web de Cuba Tattoo Studio usando Astro, React, GSAP, CSS modular y arquitectura islands.

## Estructura del Proyecto

```
cubatattoostudio/
├── public/
│   └── assets/ (imágenes, videos, íconos, fuentes)
├── src/
│   ├── components/
│   │   ├── islands/
│   │   │   ├── CitasForm.jsx
│   │   │   └── InteractiveGallery.jsx
│   │   ├── Hero.astro
│   │   ├── Servicios.astro
│   │   ├── Galeria.astro
│   │   ├── Artistas/
│   │   │   ├── ArtistasSection.astro
│   │   │   └── ArtistaCard.astro
│   │   ├── Contacto.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── artistas/
│   │       └── [slug].astro
│   ├── data/
│   │   ├── servicios.js
│   │   ├── artistas.js
│   │   └── galeria.js
│   └── styles/
│       ├── globals.css
│       └── components/
│           ├── hero.css
│           ├── servicios.css
│           ├── galeria.css
│           ├── artistas.css
│           ├── contacto.css
│           └── footer.css
├── astro.config.mjs
├── package.json
├── jsdoc.json
└── README.md
```

## Instalación

```bash
npm install
```

## Comandos de desarrollo

```bash
npm run dev
```

## Generar documentación automática

```bash
npm run docs
```

## Despliegue

Recomendado: Cloudflare Pages

## Notas
- CSS modular con BEM
- Animaciones GSAP
- Islands con React
- Accesibilidad y semántica
