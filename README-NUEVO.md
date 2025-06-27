# Cuba Tattoo Studio

Sitio web oficial de Cuba Tattoo Studio - Arte corporal profesional en el corazón de Cuba.

## 🚀 Características

- **Diseño Moderno**: Landing page responsiva con animaciones fluidas usando GSAP
- **Galería Interactiva**: Sistema de filtros para explorar diferentes estilos de tatuajes
- **Secciones Principales**:
  - Hero con animación de logo
  - Galería de trabajos con filtros
  - Servicios ofrecidos
  - Perfiles de artistas
  - Formulario de contacto
  - Footer completo

## 🛠️ Tecnologías

- **Astro** - Framework web moderno
- **Tailwind CSS** - Estilos utilitarios
- **GSAP** - Animaciones profesionales
- **TypeScript** - Tipado estático

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── fonts/          # Fuentes personalizadas GTA
│   ├── favicon.svg
│   └── logo-stack.svg  # Logo para animaciones
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── HeroSection.astro
│   │   ├── GallerySection.astro
│   │   ├── ServicesSection.astro
│   │   ├── ArtistsSection.astro
│   │   ├── ContactSection.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro # Layout principal
│   └── pages/
│       └── index.astro  # Página principal
└── package.json
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                        |
| `npm run dev`             | Inicia servidor local en `localhost:4321`       |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Vista previa del build local                    |
| `npm run astro ...`       | Ejecuta comandos CLI de Astro                   |
| `npm run astro -- --help` | Obtiene ayuda usando el CLI de Astro           |

## 🎨 Características del Diseño

### Hero Section
- Animación de logo con mask SVG
- Navegación smooth scroll
- Efectos de parallax con GSAP

### Galería
- Sistema de filtros interactivo (Tradicional, Realista, Geométrico, Color)
- Grid responsivo
- Efectos hover en imágenes

### Servicios
- Cards con gradientes y efectos hover
- Iconografía personalizada
- Diseño responsive

### Artistas
- Perfiles de equipo con redes sociales
- Información de especialidades
- Efectos de transformación en hover

### Contacto
- Formulario funcional con validación
- Información de ubicación y horarios
- Integración con redes sociales

## 🎯 Inspiración

Este proyecto está basado en el concepto del [landing de GTA VI por midudev](https://github.com/midudev/landing-gta-vi), adaptado para crear una experiencia única para un estudio de tatuajes cubano.

## 🌟 Características Técnicas

- **Scroll Suave**: Navegación fluida entre secciones
- **Animaciones GSAP**: Transiciones profesionales y efectos de scroll
- **Responsive Design**: Optimizado para todos los dispositivos
- **SEO Optimizado**: Meta tags y estructura semántica
- **Performance**: Carga rápida y optimización de assets

## 📞 Contacto del Estudio

- **Dirección**: Calle 23 #456, Vedado, La Habana, Cuba
- **Teléfono**: +53 7 832-1234
- **WhatsApp**: +53 5 234-5678
- **Email**: info@cubatattoostudio.com

## 🚀 Despliegue

El sitio está listo para desplegarse en cualquier servicio de hosting estático como:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

---

*Desarrollado con ❤️ para Cuba Tattoo Studio*
