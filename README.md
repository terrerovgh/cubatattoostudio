# Cuba Tattoo Studio - Website & Automated Management System

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versión-0.1%20MVP-blue)

Sitio web y sistema de gestión automatizado para Cuba Tattoo Studio en Albuquerque, combinando un diseño atractivo con animaciones fluidas y un backend eficiente para la gestión del estudio.

## 🎯 Objetivos del Proyecto <a name="objetivos"></a>

- Crear un sitio web único y atractivo que aumente la visibilidad del estudio en Albuquerque
- Implementar animaciones fluidas y profesionales utilizando anime.js y GSAP
- Desarrollar un sistema de gestión eficiente utilizando n8n y AI
- Automatizar procesos de reserva y gestión de clientes

## 🛠️ Tech Stack <a name="tech-stack"></a>

### Frontend

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+** - Funcionalidad interactiva
- **GSAP & ScrollSmoother** - Animaciones fluidas y scroll suave
- **anime.js** - Animaciones avanzadas (próximamente)

### Backend & Automatización

- **n8n** - Flujos de trabajo de automatización visual
- **Docker** - Contenedorización para despliegue consistente
- **GitHub Pages** - Alojamiento del MVP frontend

### Herramientas de Desarrollo

- **Git & GitHub** - Control de versiones y colaboración
- **ESLint & Prettier** - Calidad de código y formateo
- **GitHub Actions** - Automatización CI/CD
- **GitHub Projects** - Gestión de proyectos estilo Kanban

## 📋 Instalación <a name="installation"></a>

### Requisitos Previos

- Node.js (v18 o superior)
- Git
- Navegador web moderno

### Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/terrerovgh/cubatattoostudio.git

# Navegar al directorio del proyecto
cd cubatattoostudio

# Instalar dependencias (si se usan paquetes npm)
npm install

# Iniciar servidor de desarrollo
python3 -m http.server 8000
# o
npx serve src
```

## 🚀 Uso <a name="usage"></a>

### Desarrollo

```bash
# Iniciar servidor de desarrollo local
cd src
python3 -m http.server 8000

# Abrir navegador en http://localhost:8000
```

### Testing

```bash
# Ejecutar linting
npx eslint src/js/

# Formatear código
npx prettier --write src/
```

## 📁 Estructura del Proyecto <a name="project-structure"></a>

```
cubatattoostudio/
├── README.md
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── docs/
│   ├── project_rules.md
│   └── design/
└── .github/
    └── workflows/
```

## 🗺️ Roadmap <a name="roadmap"></a>

### Fase 1: MVP Frontend (Actual)

- Sitio web estático con funcionalidad básica
- Diseño responsive y animaciones
- Galería y formularios de contacto
- Despliegue en GitHub Pages

### Fase 2: Integración Backend

- Implementación de n8n para flujos de trabajo
- Sistema de reservas básico
- Integración con redes sociales

### Fase 3: Sistema Completo

- Sistema de gestión de clientes
- Automatización completa de procesos
- Análisis y reportes

## 📚 Documentación

La documentación detallada está disponible en el directorio `docs/`:
- [Reglas del Proyecto](docs/project_rules.md) - Directrices y estándares de desarrollo
- [Guía de Estilos](docs/diseno/guia-estilos.md) - Directrices de diseño visual
- [Arquitectura](docs/arquitectura/) - Documentación de arquitectura del sistema

## 🛠️ Configuración de Desarrollo

### Requisitos Previos

- Node.js 18+
- Git
- Editor de código (VS Code recomendado)
- Navegador web moderno

### Configuración del Entorno

```bash
# Clonar repositorio
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🚀 Despliegue

### Despliegue MVP (GitHub Pages)

```bash
# Construir y desplegar en GitHub Pages
# (Automatizado a través de GitHub Actions - próximamente)
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- [Demo en Vivo](https://terrerovgh.github.io/cubatattoostudio/) (Próximamente)
- [Tablero del Proyecto](https://github.com/users/terrerovgh/projects/3)
- [Documentación](docs/)
- [Guía de Estilos](docs/diseno/guia-estilos.md)

---

Desarrollado con ❤️ para Cuba Tattoo Studio