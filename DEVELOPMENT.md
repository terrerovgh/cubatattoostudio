# Guía de Desarrollo

Esta guía proporciona información esencial para desarrolladores que trabajan en el proyecto Cuba Tattoo Studio.

## Tabla de Contenidos

- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Convenciones de Código](#convenciones-de-código)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Trabajando con Animaciones](#trabajando-con-animaciones)
- [Tareas Comunes](#tareas-comunes)
- [Troubleshooting](#troubleshooting)

## Configuración del Entorno

### Requisitos Previos

- **Node.js**: v18 o superior (recomendado: última LTS)
- **npm** o **pnpm**: Gestor de paquetes
- **Editor**: VSCode recomendado con extensiones:
  - Astro (astro-build.astro-vscode)
  - Tailwind CSS IntelliSense
  - ESLint

### Instalación Inicial

```bash
# Clonar el repositorio
git clone <repository-url>
cd cubatattoostudio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

### Extensiones VSCode Recomendadas

Crear archivo `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint"
  ]
}
```

### Configuración de Supabase

> [!IMPORTANT]
> Supabase es **requerido** para el funcionamiento completo del proyecto, especialmente para el dashboard administrativo y autenticación.

#### Variables de entorno necesarias

Crear archivo `.env` en la raíz del proyecto:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ **Importante**: Agregar `.env` al `.gitignore` y nunca commitear las keys.

#### Obtener las credenciales

1. Ir a [supabase.com](https://supabase.com) y crear un proyecto
2. En Settings > API, copiar:
   - Project URL → `PUBLIC_SUPABASE_URL`
   - anon/public key → `PUBLIC_SUPABASE_ANON_KEY`
3. Copiar al archivo `.env`

#### Instalar Supabase CLI (Opcional)

Para gestionar migraciones localmente:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Inicializar proyecto local
supabase init

# Generar tipos TypeScript de la base de datos
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

#### Aplicar Schema

La base de datos ya tiene un schema definido en `supabase/schema.sql`. Para aplicarlo:

1. **Opción 1 - Supabase Dashboard**:
   - Ir a SQL Editor en el dashboard
   - Copiar y ejecutar el contenido de `supabase/schema.sql`

2. **Opción 2 - CLI**:
   ```bash
   supabase db push
   ```

## Flujo de Trabajo

### Desarrollo Local

1. **Iniciar dev server**:
   ```bash
   npm run dev
   ```

2. **Hacer cambios**: El servidor se recarga automáticamente con HMR

3. **Verificar cambios**: Revisar en el navegador en tiempo real

4. **Build de prueba**:
   ```bash
   npm run build
   npm run preview
   ```

### Comandos Disponibles

## Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Dev server con HMR en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Preview del build localmente |
| `npm run seed-content` | Popula la base de datos con contenido inicial |
| `npm run astro add <integration>` | Añadir integración de Astro |
| `npm run astro check` | Type-checking con TypeScript |
| `supabase gen types typescript` | Generar tipos de Supabase |

## Convenciones de Código

### Estructura de Archivos

### Estructura de Archivos

**Nomenclatura**:
- Componentes Astro: `PascalCase.astro` (ej: `Hero.astro`, `Navbar.astro`)
- Componentes React: `PascalCase.tsx` (ej: `Login.tsx`, `DashboardPage.tsx`)
- Layouts: `PascalCase.astro` o `.tsx` según el tipo
- Librerías/Helpers: `kebab-case.ts` (ej: `supabase-helpers.ts`, `editor-store.ts`)
- Estilos: `kebab-case.css` (ej: `global.css`)
- Configuración: `kebab-case.js/mjs` (ej: `astro.config.mjs`)

**Organización**:
```
src/
├── components/
│   ├── admin/              # Dashboard (React/TSX)
│   ├── auth/               # Autenticación (React/TSX)
│   ├── ui/                 # Componentes UI (React/TSX)
│   └── *.astro             # Componentes públicos (Astro)
├── layouts/              # Layouts
├── lib/                  # Utilidades y helpers
├── pages/                # Rutas (file-based)
├── styles/               # Estilos globales
└── types/                # Definiciones de tipos
```

### Estilo de Código

#### Componentes Astro

#### Componentes React/TSX

Para el dashboard administrativo y componentes interactivos:

```tsx
// 1. Imports
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';

// 2. Interfaces/Types
interface Props {
    userId?: string;
}

interface Artist {
    id: string;
    name: string;
    specialty: string;
}

// 3. Componente
export function ArtistsTable({ userId }: Props) {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchArtists();
    }, []);
    
    const fetchArtists = async () => {
        const { data, error } = await supabase
            .from('artists')
            .select('*');
        if (data) setArtists(data);
        setLoading(false);
    };
    
    return (
        <div className="space-y-4">
            {/* JSX aqui */}
        </div>
    );
}
```

**Convenciones React**:
- Usar hooks de React (useState, useEffect, useContext, etc.)
- Componentes funcionales, no clases
- Props tipadas con TypeScript
- Export nombrado para componentes, default para páginas
- Usar `className` en vez de `class`

#### Clases CSS con Tailwind

**Organización de clases** (orden recomendado):
1. Layout (display, position, flex/grid)
2. Sizing (width, height, padding, margin)
3. Typography (font, text)
4. Visual (color, background, border)
5. Effects (shadow, opacity, transform)
6. Animations (transition, animate)

**Ejemplo**:
```astro
<div class="
    flex items-center justify-center
    w-full h-screen px-6 py-32
    text-xl font-medium
    bg-black text-white border-t border-neutral-900
    opacity-90 shadow-xl
    transition-all duration-300
">
    ...
</div>
```

#### Responsive Design

Mobile-first approach:

```astro
<!-- Base: móvil, luego tablet y desktop -->
<div class="
    text-base md:text-lg lg:text-xl
    px-4 md:px-6 lg:px-8
    grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
```

### TypeScript

- Usar interfaces para props
- Preferir type inference cuando sea obvio
- Evitar `any`, usar `unknown` si es necesario

```typescript
interface Props {
    title: string;
    description?: string; // Optional con ?
}

const { title, description = "Default" } = Astro.props;
```

## Guías de Desarrollo

### Crear Nuevo Componente

### Crear Componente Admin React

1. **Crear archivo**:
   ```bash
   touch src/components/admin/NewFeature.tsx
   ```

2. **Template básico**:
   ```tsx
   import { useState } from 'react';
   import { Button } from '../ui/button';
   import { Card } from '../ui/card';
   
   export function NewFeature() {
       const [data, setData] = useState(null);
       
       return (
           <Card>
               <h2>New Feature</h2>
               {/* Contenido */}
           </Card>
       );
   }
   ```

3. **Usar en página admin**:
   ```astro
   ---
   // src/pages/admin/feature.astro
   import { NewFeature } from '../../components/admin/NewFeature';
   import DashboardLayout from '../../layouts/DashboardLayout';
   ---
   
   <DashboardLayout title="Feature">
       <NewFeature client:load />
   </DashboardLayout>
   ```

### Añadir Nueva Página

Astro usa file-based routing:

```bash
# Crear nueva página
touch src/pages/about.astro
```

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="About | Cuba Tattoo Studio">
    <h1>About Us</h1>
</Layout>
```

La página estará disponible en `/about`

### Trabajar con Zustand Store (Editor Visual)

El editor visual usa Zustand para estado global:

```tsx
// src/lib/editor-store.ts - Store ya definido
import { create } from 'zustand';

interface EditorState {
    components: Component[];
    selectedId: string | null;
    addComponent: (component: Component) => void;
    updateComponent: (id: string, props: any) => void;
    selectComponent: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    // Estado y acciones...
}));
```

**Uso en componentes**:

```tsx
import { useEditorStore } from '../../lib/editor-store';

export function ComponentTree() {
    const { components, selectedId, selectComponent } = useEditorStore();
    
    return (
        <div>
            {components.map(comp => (
                <div 
                    key={comp.id}
                    onClick={() => selectComponent(comp.id)}
                    className={selectedId === comp.id ? 'selected' : ''}
                >
                    {comp.name}
                </div>
            ))}
        </div>
    );
}
```

### Integrar Supabase en Componentes

```tsx
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export function ArtistsList() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchArtists();
    }, []);
    
    const fetchArtists = async () => {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('is_active', true)
            .order('display_order');
            
        if (error) {
            console.error('Error:', error);
        } else {
            setArtists(data || []);
        }
        setLoading(false);
    };
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div>
            {artists.map(artist => (
                <div key={artist.id}>{artist.name}</div>
            ))}
        </div>
    );
}
```

### Modificar Contenido

#### Cambiar Texto

Editar directamente en componentes `.astro`:

```astro
<!-- src/components/Hero.astro -->
<p>
    Nuevo texto descriptivo aquí
</p>
```

#### Cambiar Imágenes

1. **Añadir imagen** a `/public/carpeta/`:
   ```bash
   cp nueva-imagen.png public/artists/
   ```

2. **Referenciar en componente**:
   ```astro
   <img src="/artists/nueva-imagen.png" alt="Descripción" />
   ```

#### Añadir Nuevo Artista

Editar `src/components/Artists.astro`:

```astro
<!-- Añadir después del último artista -->
<div class="flex flex-col md:flex-row items-center gap-12 reveal-hidden group">
    <div class="w-full md:w-1/2 relative aspect-square overflow-hidden rounded-2xl">
        <img 
            src="/artists/nuevo-artista.png" 
            alt="Nuevo Artista"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
        />
    </div>
    <div class="w-full md:w-1/2 md:pl-12">
        <span class="text-xs uppercase text-neutral-500">Especialidad</span>
        <h4 class="text-5xl md:text-7xl font-medium text-white mb-6">
            Nombre.
        </h4>
        <p class="text-neutral-400 text-lg font-light leading-relaxed mb-8 max-w-md">
            Biografía del artista...
        </p>
        <a href="#" class="inline-flex items-center">
            Ver Portfolio
        </a>
    </div>
</div>
```

### Trabajar con Estilos

#### TailwindCSS

**Theme personalizado** en `src/styles/global.css`:

```css
@theme {
    --color-brand-primary: #FF5D01;
    --font-heading: 'Inter', sans-serif;
}
```

**Usar en componentes**:
```astro
<h1 class="text-[--color-brand-primary] font-[--font-heading]">
    Título
</h1>
```

#### Custom CSS

Añadir clases personalizadas en `global.css`:

```css
.my-custom-class {
    /* Estilos que no se pueden hacer con Tailwind */
    background: linear-gradient(45deg, red, blue);
}
```

Usar en componentes:
```astro
<div class="my-custom-class">...</div>
```

## Trabajando con Animaciones

### Reveal Animations

El sistema usa Intersection Observer. Para añadir animación a un elemento:

```astro
<div class="reveal-hidden">
    <!-- Este elemento aparecerá con fade-in al scroll -->
</div>
```

**Con delays escalonados**:
```astro
<div class="reveal-hidden stagger-delay-1">Item 1</div>
<div class="reveal-hidden stagger-delay-2">Item 2</div>
<div class="reveal-hidden stagger-delay-3">Item 3</div>
```

### Personalizar Animaciones

Editar en `src/styles/global.css`:

```css
:root {
    --reveal-distance: 40px;    /* Distancia del slide-up */
    --reveal-duration: 1s;      /* Duración de la animación */
}

.reveal-hidden {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(var(--reveal-distance));
    transition: all var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Hover Effects

Patrón de grupo para efectos coordinados:

```astro
<div class="group">
    <img class="grayscale group-hover:grayscale-0 transition-all" />
    <p class="opacity-0 group-hover:opacity-100 transition-opacity">
        Texto que aparece en hover
    </p>
</div>
```

## Tareas Comunes

### Añadir Integración de Astro

```bash
npm run astro add <integration>

# Ejemplos:
npm run astro add tailwind  # Ya incluido
npm run astro add mdx       # Para contenido Markdown
npm run astro add sitemap   # Generar sitemap.xml
```

### Optimizar Imágenes

Astro tiene soporte nativo para optimización de imágenes:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---

<Image src={myImage} alt="..." />
```

### Añadir SEO Meta Tags

Editar `src/layouts/Layout.astro`:

```astro
<head>
    <!-- ... tags existentes ... -->
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
</head>
```

### Configurar Analytics

Añadir script de analytics en `Layout.astro`:

```astro
<head>
    <!-- ... -->
    
    <!-- Google Analytics ejemplo -->
    <script async src="https://www.googletagmanager.com/..."></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>
```

### Hacer Formulario Funcional

#### Opción 1: Formspree

```astro
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="email" name="email" required />
    <textarea name="message"></textarea>
    <button type="submit">Send</button>
</form>
```

#### Opción 2: Netlify Forms

```astro
<form name="contact" method="POST" data-netlify="true">
    <input type="hidden" name="form-name" value="contact" />
    <input type="email" name="email" required />
    <button type="submit">Send</button>
</form>
```

#### Opción 3: API Routes de Astro

Crear endpoint:
```typescript
// src/pages/api/contact.ts
export async function POST({ request }) {
    const data = await request.formData();
    const email = data.get('email');
    
    // Procesar...
    
    return new Response(JSON.stringify({ success: true }));
}
```

## Troubleshooting

### El servidor no inicia

**Problema**: Error al ejecutar `npm run dev`

**Soluciones**:
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node
node -v  # Debe ser >= 18

# Limpiar caché de Astro
rm -rf .astro node_modules/.astro
```

### Cambios no se reflejan

**Problema**: HMR no funciona correctamente

**Soluciones**:
1. Hard refresh en navegador: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows)
2. Reiniciar dev server
3. Limpiar caché: `rm -rf .astro`

### Errores de TypeScript

**Problema**: TypeScript muestra errores

**Soluciones**:
```bash
# Verificar tipos
npm run astro check

# Regenerar tipos de Astro
rm -rf .astro
npm run dev  # Regenera automáticamente
```

### Build falla en producción

**Problema**: `npm run build` falla

**Soluciones**:
1. Verificar que todas las importaciones existen
2. Revisar rutas de imágenes (deben estar en `/public/`)
3. Verificar sintaxis de componentes
4. Limpiar y rebuildar:
   ```bash
   rm -rf dist .astro
   npm run build
   ```

### Animaciones no funcionan

**Problema**: Elementos con `reveal-hidden` no se animan

**Soluciones**:
1. Verificar que el script de Intersection Observer está en `Layout.astro`
2. Abrir DevTools y verificar que `.reveal-visible` se añade al hacer scroll
3. Comprobar que `global.css` está importado correctamente
4. Verificar threshold del observer (0.15 por defecto)

### Imágenes no cargan

**Problema**: Imágenes retornan 404

**Soluciones**:
1. Verificar que la imagen está en `/public/`
2. Verificar ruta (debe empezar con `/`): `/artists/image.png`
3. Verificar mayúsculas/minúsculas en nombre de archivo
4. Reiniciar dev server

### Estilos de Tailwind no funcionan

**Problema**: Clases de Tailwind no se aplican

**Soluciones**:
1. Verificar que `@import "tailwindcss"` está en `global.css`
2. Verificar que `global.css` está importado en `Layout.astro`
3. Reiniciar dev server
4. Verificar sintaxis de clases (sin typos)

### Errores de Conexión con Supabase (Futuro)

**Problema**: "Missing Supabase environment variables"

**Soluciones**:
1. Verificar que el archivo `.env` existe en la raíz del proyecto
2. Confirmar que las variables están correctamente nombradas (`PUBLIC_SUPABASE_URL`, etc.)
3. Reiniciar el dev server después de añadir variables
4. Verificar que las keys son válidas en Supabase Dashboard

**Problema**: "Row Level Security policy violation"

**Soluciones**:
1. Verificar que las políticas RLS están correctamente configuradas
2. Revisar que el usuario tiene los permisos necesarios
3. Consultar logs en Supabase Dashboard > Logs
4. Ver [docs/supabase-integration.md](./docs/supabase-integration.md) para políticas

## Recursos Adicionales

### Documentación Oficial

- [Astro Docs](https://docs.astro.build)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

### Tutoriales y Guías

- [Astro Tutorial](https://docs.astro.build/en/tutorial/0-introduction/)
- [TailwindCSS Best Practices](https://tailwindcss.com/docs/reusability)

### Comunidad

- [Astro Discord](https://astro.build/chat)
- [GitHub Discussions](https://github.com/withastro/astro/discussions)

---

### Errores con React Components

**Problema**: "X is not a function" o errores de hidratación

**Soluciones**:
1. Verificar que el componente use `client:*` directive en Astro:
   ```astro
   <MyComponent client:load />
   ```
2. Verificar que exports sean correctos (named vs default)
3. Verificar que tipos TypeScript sean correctos
4. Revisar console del navegador para detalles

### Errores con Zustand Store

**Problema**: Estado no se actualiza correctamente

**Soluciones**:
1. Verificar que estás usando el hook correctamente:
   ```tsx
   const { value, setValue } = useEditorStore();
   ```
2. Las actualizaciones deben ser inmutables o usar Immer
3. No mutar estado directamente
4. Revisar DevTools de React

**Última actualización**: 2025-11-23
