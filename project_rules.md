# Plan de Diseño y Desarrollo Web Modular – Cubatattoostudio

## Introducción

Este documento define las pautas de diseño y desarrollo para el sitio Cubatattoostudio, con enfoque en una arquitectura web modular. El sitio se construirá con el framework **Astro** aprovechando su capacidad para generar contenido estático a partir de Markdown y su estrategia de Island Architecture, que facilita un código mantenible y reutilizable. Se busca una experiencia visual impactante con animaciones de desplazamiento inspiradas en sitios de alto perfil como el portal de GTA VI o páginas de productos de Apple. El sitio será bilingüe (inglés como idioma principal con opción a español) y presentará una paleta monocromática blanco y negro acorde con el logo del estudio. Para gestionar las reservas se conectará un formulario con Google Calendar mediante **n8n**.

## Tecnologías y Herramientas

- **Astro 4.x** para la base del proyecto y la generación de contenido estático.
- **GSAP** junto con ScrollTrigger para animaciones de scroll.
- **n8n** enlazado a **Google Calendar** para programar citas de manera automática.
- Opcionalmente **CSS Modules** o **Tailwind CSS** para estilos modulares.
- Despliegue en **Cloudflare Pages**.

## Identidad Visual

La estética del sitio seguirá una paleta en blanco y negro. Las tipografías y botones utilizarán variaciones de gris para mantener el estilo minimalista y permitir que las fotografías de tatuajes resalten. Las animaciones deberán complementar el contenido, no distraerlo.

## Estructura del Sitio

El sitio consistirá principalmente en una página única con las siguientes secciones:

1. **Header** con el logotipo y el selector de idioma.
2. **Historia del Estudio** presentando la filosofía del estudio.
3. **Artistas** con un componente por cada tatuador (David, Nina, Karli) y su portafolio.
4. **Agendar Cita** integrando el formulario conectado con n8n/Google Calendar.
5. **Footer** con datos de contacto y enlaces.

Cada sección será un componente Astro independiente para mantener la modularidad y permitir reorganizar fácilmente el contenido.

## Contenido en Markdown

Los textos de cada idioma se almacenarán en archivos Markdown bajo `src/content`. Los componentes de sección importarán estos archivos para separar el contenido de la presentación y simplificar la traducción.

## Animaciones

Las animaciones se implementarán con GSAP y ScrollTrigger, aplicando efectos de parallax, aparición de texto e imágenes y, cuando sea apropiado, "pinning" de secciones. Se privilegiará el uso de `transform` y `opacity` para un rendimiento fluido y se respetará la preferencia `prefers-reduced-motion` de los usuarios.

## Internacionalización

Astro se configurará con enrutamiento i18n de modo que la versión por defecto sea en inglés y exista la ruta `/es/` para la versión en español. El selector de idioma en el encabezado permitirá cambiar entre ambas versiones.

## Buenas Prácticas

- Optimizar imágenes (WebP o AVIF) y usar carga diferida.
- Verificar la apariencia tanto en dispositivos móviles como de escritorio.
- Mantener la accesibilidad: buen contraste y textos alternativos en las imágenes.
- Documentar actualizaciones del proyecto para conservar este plan al día.
