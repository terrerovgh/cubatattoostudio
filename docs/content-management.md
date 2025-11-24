# Guía de Gestión de Contenido

Esta guía documenta cómo actualizar el contenido del sitio Cuba Tattoo Studio.

## 🔄 Transición a Gestión Dinámica

> **Nota Importante**: El proyecto está en transición de gestión de contenido estática a dinámica mediante un Dashboard Administrativo.

### Estado Actual: Gestión Estática

Actualmente, el contenido se maneja mediante:
- **Archivos markdown** en `src/content/`
- **Componentes Astro** con datos hardcodeados
- **Imágenes** en carpetas `public/`
- **Edición directa** de código fuente

### Futuro: Dashboard Administrativo

Se está planificando un sistema de gestión completo que permitirá:
- ✅ **Interfaz web intuitiva** para gestionar contenido
- ✅ **Sin necesidad de código** - Todo desde el navegador
- ✅ **Roles y permisos** - Admins y artistas con accesos diferenciados
- ✅ **Upload de imágenes** - Drag & drop directo desde el dashboard
- ✅ **Vista previa** - Ver cambios antes de publicar

Ver detalles en [docs/admin-dashboard.md](./admin-dashboard.md)

---

## 📝 Método Actual: Gestión Manual de Archivos

Las siguientes instrucciones describen cómo gestionar el contenido **actualmente** mediante edición directa de archivos.

> ⚠️ **Nota**: Este método quedará obsoleto una vez implementado el dashboard administrativo.

## 📋 Tabla de Contenidos

- [Actualizar Imágenes](#actualizar-imágenes)
- [Modificar Texto](#modificar-texto)
- [Añadir/Eliminar Artistas](#añadireliminar-artistas)
- [Actualizar Galería](#actualizar-galería)
- [Modificar Información de Contacto](#modificar-información-de-contacto)
- [Cambiar Logo](#cambiar-logo)

## Actualizar Imágenes

### Imágenes de Artistas

**Ubicación**: `/public/artists/`

**Archivos actuales**:
- `david.png` - Foto de David
- `nina.png` - Foto de Nina
- `karli.png` - Foto de Karli

**Para reemplazar**:
1. Prepara tu nueva imagen (recomendado: 1000x1000px, formato PNG o JPG)
2. Renombra el archivo exactamente como el original (ej: `david.png`)
3. Coloca la nueva imagen en `/public/artists/`
4. Reemplaza el archivo antiguo

**Formato recomendado**:
- Dimensiones: 1000x1000px (cuadrado)
- Formato: PNG o WebP
- Tamaño: < 500KB (optimizar antes de subir)

### Imágenes de Tatuajes (Galería)

**Ubicación**: `/public/tattoo/`

**Para añadir nuevas imágenes**:
1. Optimiza la imagen (recomendado: ancho 800-1200px)
2. Nombra el archivo: `tattooX.png` (donde X es el siguiente número)
3. Coloca en `/public/tattoo/`
4. Actualiza el componente Gallery (ver sección de Galería)

## Modificar Texto

### Hero (Introducción)

**Archivo**: `src/components/Hero.astro`

**Ubicación del texto**:
```astro
<h2>Albuquerque, NM</h2>  <!-- Línea 25 -->

<p>
    Ideally located in the heart of the desert. <br />
    Where precision meets permanence.
</p>  <!-- Líneas 38-41 -->
```

**Para cambiar**:
1. Abrir `src/components/Hero.astro`
2. Buscar el texto a modificar
3. Reemplazar con el nuevo texto
4. Guardar el archivo

### Servicios/Disciplinas

**Archivo**: `src/components/Services.astro`

**Texto del encabezado** (Líneas 8-16):
```astro
<h3>Disciplines.</h3>
<p>
    We don't just apply ink. We curate experiences 
    tailored to your narrative.
</p>
```

**Servicios individuales**:

**Service 1 - Hyper Realism** (Líneas 38-48):
```astro
<h4>Hyper Realism</h4>
<p>Portraits and nature with uncompromising detail.</p>
```

**Service 2 - Fine Line** (Líneas 72-82):
```astro
<h4>Fine Line</h4>
<p>Delicate, intricate, and minimal designs.</p>
```

**Service 3 - Neo Traditional** (Líneas 106-116):
```astro
<h4>Neo Traditional</h4>
<p>Bold lines and vibrant colors with modern flair.</p>
```

### Información del Estudio

**Archivo**: `src/components/Booking.astro`

**Horarios** (Líneas 147-156):
```astro
<p>
    <span>Tue - Sat</span> 11:00 AM - 7:00 PM<br />
    <span>Sun - Mon</span> Closed
</p>
```

## Añadir/Eliminar Artistas

### Añadir Nuevo Artista

**Archivo**: `src/components/Artists.astro`

1. **Preparar imagen**:
   - Dimensiones: 1000x1000px
   - Guardar en `/public/artists/nombre-artista.png`

2. **Añadir sección de artista** (copiar este template al final del archivo):

```astro
<!-- Artist: Nombre -->
<div class="flex flex-col md:flex-row items-center gap-12 mb-32 reveal-hidden group">
    <div class="w-full md:w-1/2 relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl">
        <img
            src="/artists/nombre-artista.png"
            alt="Nombre Portfolio"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
        />
    </div>
    <div class="w-full md:w-1/2 md:pl-12">
        <div class="flex items-center gap-4 mb-2">
            <span class="h-px w-8 bg-neutral-700"></span>
            <span class="text-xs font-medium tracking-widest uppercase text-neutral-500">
                Especialidad del Artista
            </span>
        </div>
        <h4 class="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-6">
            Nombre.
        </h4>
        <p class="text-neutral-400 text-lg font-light leading-relaxed mb-8 max-w-md">
            Biografía del artista. Descripción de su estilo, años de experiencia,
            especialidades, y qué lo hace único.
        </p>
        <a href="#" class="inline-flex items-center text-sm font-medium hover:text-neutral-300 transition-colors border-b border-neutral-700 pb-1">
            View Nombre's Portfolio <ArrowRight className="ml-2 w-4 h-4" />
        </a>
    </div>
</div>
```

3. **Personalizar**:
   - Cambiar `nombre-artista.png` por el nombre real del archivo
   - Actualizar "Especialidad del Artista"
   - Cambiar "Nombre" por el nombre del artista
   - Escribir biografía personalizada

4. **Alternar layout** (opcional):
   - Para layout inverso (texto izquierda, imagen derecha), cambiar:
   - `md:flex-row` → `md:flex-row-reverse`
   - `md:pl-12` → `md:pr-12`

### Eliminar Artista

1. Abrir `src/components/Artists.astro`
2. Buscar el bloque del artista (comienza con `<!-- Artist: Nombre -->`)
3. Eliminar todo el `<div>` hasta el `</div>` de cierre
4. Guardar

## Actualizar Galería

**Archivo**: `src/components/Gallery.astro`

### Cambiar Imágenes Mostradas

Buscar la sección del masonry grid (Líneas 22-64):

```astro
<div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
    <div class="break-inside-avoid reveal-hidden stagger-delay-1">
        <img src="/tattoo/tattoo4.png" alt="Tattoo Work" />
    </div>
    <div class="break-inside-avoid reveal-hidden stagger-delay-2">
        <img src="/tattoo/tattoo6.png" alt="Tattoo Work" />
    </div>
    <!-- ... más imágenes ... -->
</div>
```

**Para cambiar una imagen**:
1. Localizar el `<img src="/tattoo/tattooX.png">`
2. Cambiar `tattooX.png` por el nuevo archivo
3. Actualizar el `alt` text si es apropiado

**Para añadir más imágenes**:
1. Copiar un bloque completo:
   ```astro
   <div class="break-inside-avoid reveal-hidden stagger-delay-1">
       <img 
           src="/tattoo/nueva-imagen.png" 
           class="w-full rounded-xl hover:opacity-90 transition-opacity"
           alt="Tattoo Work"
       />
   </div>
   ```
2. Pegar dentro del grid
3. Actualizar `src` con tu imagen

## Modificar Información de Contacto

**Archivo**: `src/components/Booking.astro`

### Email

Buscar (Línea 185):
```astro
<a href="mailto:hello@cubatattoo.com">
    <Mail className="w-4 h-4 mr-2" /> hello@cubatattoo.com
</a>
```

Cambiar ambas instancias de `hello@cubatattoo.com` por el nuevo email.

### Teléfono

Buscar (Línea 191):
```astro
<a href="tel:+15055550123">
    <Phone className="w-4 h-4 mr-2" /> (505) 555-0123
</a>
```

Cambiar:
- `tel:+15055550123` (formato: `+1` + número sin espacios)
- `(505) 555-0123` (formato visual)

### Dirección

Buscar (Línea 143):
```astro
<p class="text-neutral-400 mt-2">
    123 Central Ave SW,<br />
    Albuquerque, NM 87102
</p>
```

Reemplazar con la nueva dirección.

### Google Maps

Buscar (Líneas 166-172):
```astro
<iframe
    src="https://www.google.com/maps/embed?pb=..."
    ...
></iframe>
```

**Para actualizar**:
1. Ir a [Google Maps](https://www.google.com/maps)
2. Buscar tu ubicación
3. Click en "Share" → "Embed a map"
4. Copiar el código `<iframe>`
5. Reemplazar el existente (mantener las clases de Tailwind)

## Cambiar Logo

**Archivos**:
- Logo principal: `/public/logo-stack.svg`
- Favicon: `/public/favicon.svg`

### Logo Principal

El logo se usa en:
1. **Navbar** (`src/components/Navbar.astro`, Línea 15)
2. **Hero** (`src/components/Hero.astro`, Línea 32)

**Para cambiar**:
1. Exporta tu nuevo logo como SVG
2. Renombra como `logo-stack.svg`
3. Reemplaza el archivo en `/public/`

**Recomendaciones**:
- Formato: SVG (escalable sin pérdida)
- Colores: Blancos/claros para contrastar con fondo oscuro
- Dimensiones: Vectorial (SVG no tiene píxeles)

### Favicon

**Archivo**: `/public/favicon.svg`

1. Crea un ícono simple (32x32px o SVG)
2. Renombra como `favicon.svg`
3. Reemplaza en `/public/`

También puedes usar formatos `.ico` o `.png`, pero debes actualizar el `<link>` en `src/layouts/Layout.astro`:

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<!-- O para PNG: -->
<link rel="icon" type="image/png" href="/favicon.png" />
```

## Tips de Optimización

### Optimizar Imágenes

Antes de subir imágenes, optimízalas para web:

**Herramientas recomendadas**:
- [TinyPNG](https://tinypng.com/) - Compresión online
- [Squoosh](https://squoosh.app/) - Google's image compressor
- [ImageOptim](https://imageoptim.com/) - App para Mac

**Configuraciones**:
- JPG: Calidad 80-85%
- PNG: Compresión con pngquant
- WebP: Mejor opción (soporte moderno)

### Formato de Imágenes

| Tipo | Formato Recomendado | Tamaño Objetivo |
| :--- | :--- | :--- |
| Artistas | PNG/WebP | < 300KB |
| Galería | JPG/WebP | < 200KB |
| Logo | SVG | < 50KB |
| Favicon | SVG/PNG | < 10KB |

## Checklist Post-Cambios

Después de hacer cambios de contenido:

- [ ] Verificar que el servidor dev funciona: `npm run dev`
- [ ] Revisar cambios en el navegador
- [ ] Probar responsive (móvil/tablet/desktop)
- [ ] Verificar que las imágenes cargan correctamente
- [ ] Revisar ortografía y gramática
- [ ] Build de producción: `npm run build`
- [ ] Preview del build: `npm run preview`
- [ ] Commit cambios al repositorio
- [ ] Deploy a producción

## Ayuda Adicional

Si necesitas ayuda:
1. Consulta [DEVELOPMENT.md](../DEVELOPMENT.md) para guías técnicas
2. Revisa [COMPONENTS.md](../COMPONENTS.md) para estructura de componentes
3. Abre un issue en GitHub con label `question`

---

**Última actualización**: 2025-11-23
