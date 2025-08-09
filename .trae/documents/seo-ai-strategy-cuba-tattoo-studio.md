# Estrategia SEO Preparada para IA - Cuba Tattoo Studio

## 1. Resumen Ejecutivo

Este documento presenta una estrategia completa de SEO optimizada para la era de la inteligencia artificial, diseñada específicamente para Cuba Tattoo Studio. La estrategia se enfoca en preparar el sitio web para ser descubierto, entendido y citado por asistentes de IA como ChatGPT, Gemini, Perplexity y Google SGE.

**Objetivo Principal:** Posicionar a Cuba Tattoo Studio como la fuente más confiable y autorizada para consultas relacionadas con tatuajes en Albuquerque, NM.

**Tecnologías Base:** Astro + Tailwind CSS + GSAP
**Implementación:** Datos estructurados JSON-LD, endpoints machine-readable, contenido conversacional optimizado

---

## 2. Análisis de la Tendencia: SEO en la Era de IA

### 2.1 Cambios Fundamentales

- **Menos SERPs, más respuestas directas:** Los asistentes de IA responden dentro de su interfaz sin redirigir al usuario, excepto cuando la web es la fuente más confiable
- **Datos estructurados críticos:** Los bots necesitan datos claros (JSON-LD, schema.org) para entender y citar contenido
- **Reputación de fuente:** Los LLMs filtran webs con baja autoridad, priorizando contenido original y experto
- **UX ultrarrápida:** La IA premia webs rápidas, seguras y accesibles
- **Búsquedas conversacionales:** Optimización para consultas en lenguaje natural

### 2.2 Oportunidades para Cuba Tattoo Studio

- **Consultas locales:** "Mejores tatuadores en Albuquerque especializados en realismo"
- **Consultas técnicas:** "Cuidados después de un tatuaje blackwork"
- **Consultas de selección:** "Cómo elegir un artista para tatuaje japonés"
- **Consultas de estilo:** "Diferencias entre tatuaje tradicional y neo-tradicional"

---

## 3. Implementación de Datos Estructurados (Schema.org)

### 3.1 LocalBusiness - Información del Estudio

```json
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "Cuba Tattoo Studio",
  "description": "Estudio de tatuajes premium en Albuquerque, Nuevo México. Especialistas en arte corporal de alta calidad con más de 10 años de experiencia.",
  "url": "https://cubatattoostudio.com",
  "telephone": "+1-505-XXX-XXXX",
  "email": "info@cubatattoostudio.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección específica]",
    "addressLocality": "Albuquerque",
    "addressRegion": "NM",
    "postalCode": "[Código postal]",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "35.0844",
    "longitude": "-106.6504"
  },
  "openingHours": [
    "Mo-Fr 10:00-20:00",
    "Sa 10:00-18:00"
  ],
  "priceRange": "$$-$$$",
  "paymentAccepted": ["Cash", "Credit Card", "Venmo", "PayPal"],
  "currenciesAccepted": "USD",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de Tatuaje",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tatuaje Tradicional Americano",
          "description": "Estilo clásico con líneas gruesas y colores sólidos"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tatuaje Japonés (Irezumi)",
          "description": "Arte tradicional japonés con dragones, koi y elementos naturales"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Blackwork",
          "description": "Tatuajes en tinta negra pura con alto contraste"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Realismo",
          "description": "Tatuajes fotorrealistas con precisión extrema"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Geométrico",
          "description": "Diseños basados en formas geométricas y simetría"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Minimalista",
          "description": "Diseños simples y elegantes con líneas limpias"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.instagram.com/cubatattoostudio",
    "https://www.facebook.com/cubatattoostudio",
    "https://www.google.com/maps/place/cuba-tattoo-studio"
  ]
}
```

### 3.2 Person - Perfiles de Artistas

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David",
  "jobTitle": "Artista de Tatuajes",
  "description": "Especialista en tatuajes japoneses tradicionales y blackwork con más de 8 años de experiencia.",
  "worksFor": {
    "@type": "TattooParlor",
    "name": "Cuba Tattoo Studio"
  },
  "knowsAbout": [
    "Tatuaje Japonés",
    "Blackwork",
    "Tatuaje Tradicional",
    "Arte Corporal"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Tattoo Artist",
    "occupationLocation": {
      "@type": "City",
      "name": "Albuquerque, NM"
    }
  },
  "url": "https://cubatattoostudio.com/artistas/david",
  "image": "https://cubatattoostudio.com/images/artists/david.jpg",
  "sameAs": [
    "https://www.instagram.com/david_cuba_tattoo"
  ]
}
```

### 3.3 CreativeWork - Portfolio de Trabajos

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Dragón Japonés",
  "description": "Dragón tradicional japonés en brazo completo, ejecutado con técnicas ancestrales y toque contemporáneo",
  "creator": {
    "@type": "Person",
    "name": "David"
  },
  "artform": "Tatuaje",
  "artMedium": "Tinta sobre piel",
  "genre": "Japonés",
  "image": "https://cubatattoostudio.com/images/portfolio/david-dragon.jpg",
  "dateCreated": "2024",
  "locationCreated": {
    "@type": "TattooParlor",
    "name": "Cuba Tattoo Studio",
    "address": "Albuquerque, NM"
  },
  "keywords": ["tatuaje japonés", "dragón", "brazo completo", "albuquerque", "blackwork"]
}
```

---

## 4. Optimización para Crawlers Inteligentes

### 4.1 Contenido AI-Friendly

#### Estructura de Contenido Conversacional

**Página de Inicio:**
- H1: "Cuba Tattoo Studio - Los Mejores Tatuadores de Albuquerque, NM"
- H2: "¿Buscas un tatuaje de calidad en Albuquerque? Somos tu mejor opción"
- H3: "Especialistas en Realismo, Japonés, Blackwork y Más"

**Páginas de Artistas:**
- H1: "[Nombre] - Especialista en [Estilos] | Cuba Tattoo Studio"
- H2: "¿Por qué elegir a [Nombre] para tu próximo tatuaje?"
- H3: "Trabajos destacados de [Nombre] en [Estilo]"

#### FAQs Extensas Optimizadas para Voice Search

```markdown
## Preguntas Frecuentes sobre Tatuajes en Albuquerque

### ¿Cuánto cuesta un tatuaje en Cuba Tattoo Studio?
Nuestros precios varían según el tamaño, complejidad y estilo del tatuaje. Los tatuajes pequeños (2-4 pulgadas) comienzan en $100, mientras que piezas grandes pueden costar entre $500-2000. Ofrecemos consultas gratuitas para presupuestos exactos.

### ¿Cuál es el mejor artista para tatuajes realistas en Albuquerque?
Nina es nuestra especialista en realismo con 6+ años de experiencia. Ha perfeccionado la técnica del sombreado fotorrealista, creando retratos que parecen cobrar vida en la piel.

### ¿Cómo cuidar un tatuaje recién hecho?
1. Mantén el vendaje inicial por 2-4 horas
2. Lava suavemente con jabón antibacterial
3. Aplica pomada cicatrizante 2-3 veces al día
4. Evita el sol directo por 2 semanas
5. No sumerjas en agua (piscinas, bañeras) por 2 semanas

### ¿Qué estilo de tatuaje es mejor para principiantes?
Los estilos minimalistas y tradicionales son ideales para principiantes. Karli, nuestra especialista en minimalismo, crea diseños elegantes y menos dolorosos, perfectos para tu primer tatuaje.
```

### 4.2 Optimización Semántica

#### Vocabulario Coherente por Página

**Homepage:** tatuajes albuquerque, estudio tatuajes, artistas profesionales, arte corporal
**Artistas:** especialista [estilo], experiencia, portfolio, técnica, calidad
**Portfolio:** galería trabajos, estilos tatuaje, inspiración, diseños únicos
**Reservas:** cita tatuaje, consulta gratuita, presupuesto, disponibilidad

#### Títulos y Encabezados Alineados

```html
<!-- Página de Realismo -->
<h1>Tatuajes Realistas en Albuquerque - Nina | Cuba Tattoo Studio</h1>
<h2>Especialista en Retratos Fotorrealistas y Arte Hiperrealista</h2>
<h3>¿Qué hace únicos nuestros tatuajes realistas?</h3>
<h3>Galería de Tatuajes Realistas - Trabajos de Nina</h3>
<h3>Proceso de Creación de un Tatuaje Realista</h3>
```

---

## 5. Infraestructura para Alta Visibilidad

### 5.1 Optimización de Performance Extrema

#### Configuración Astro Optimizada

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
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true
    })
  ],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap']
          }
        }
      }
    }
  }
});
```

#### Optimización de Imágenes

```astro
---
// src/components/OptimizedImage.astro
import { Image } from 'astro:assets';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  class?: string;
}

const { src, alt, width, height, loading = 'lazy', class: className } = Astro.props;
---

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  loading={loading}
  class={className}
  format="webp"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 5.2 Accesibilidad AAA

#### Componente SEO Mejorado

```astro
---
// src/components/SEO.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
}

const {
  title,
  description,
  image = '/images/og-default.jpg',
  type = 'website',
  structuredData
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);
---

<!-- Meta Tags Básicos -->
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:site_name" content="Cuba Tattoo Studio" />
<meta property="og:locale" content="es_ES" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={imageURL} />
<meta name="twitter:site" content="@cubatattoostudio" />

<!-- Datos Estructurados -->
{structuredData && (
  <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
)}

<!-- Preload Critical Resources -->
<link rel="preload" href="/fonts/bebas-neue.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

---

## 6. Endpoints Machine-Readable

### 6.1 API de Información del Estudio

```javascript
// src/pages/api/info.json.js
import { artists } from '../../data/artists.json';
import { styles } from '../../data/tattoo-styles.json';

export async function GET() {
  const studioInfo = {
    name: "Cuba Tattoo Studio",
    location: {
      city: "Albuquerque",
      state: "New Mexico",
      country: "United States",
      coordinates: {
        lat: 35.0844,
        lng: -106.6504
      }
    },
    contact: {
      phone: "+1-505-XXX-XXXX",
      email: "info@cubatattoostudio.com",
      website: "https://cubatattoostudio.com"
    },
    hours: {
      monday: "10:00-20:00",
      tuesday: "10:00-20:00",
      wednesday: "10:00-20:00",
      thursday: "10:00-20:00",
      friday: "10:00-20:00",
      saturday: "10:00-18:00",
      sunday: "Cerrado"
    },
    services: styles.map(style => ({
      name: style.name,
      description: style.description,
      artists: style.artists
    })),
    artists: artists.map(artist => ({
      name: artist.name,
      specialties: artist.specialties,
      experience: artist.experience,
      portfolio_count: artist.portfolio.length
    })),
    last_updated: new Date().toISOString()
  };

  return new Response(JSON.stringify(studioInfo, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

### 6.2 Archivo AI-Meta.json

```json
{
  "studio": {
    "name": "Cuba Tattoo Studio",
    "tagline": "Arte corporal de alta calidad en Albuquerque, NM",
    "established": "2014",
    "specialties": [
      "Tatuajes Japoneses Tradicionales",
      "Realismo Fotográfico",
      "Blackwork Contemporáneo",
      "Diseños Geométricos",
      "Arte Minimalista"
    ],
    "unique_selling_points": [
      "Más de 10 años de experiencia combinada",
      "Estudio completamente esterilizado y certificado",
      "Consultas gratuitas y diseños personalizados",
      "Artistas especializados en múltiples estilos",
      "Ubicación conveniente en el corazón de Albuquerque"
    ]
  },
  "artists": [
    {
      "name": "David",
      "specialties": ["Japonés", "Blackwork", "Tradicional"],
      "experience_years": 8,
      "signature_style": "Fusión de técnicas ancestrales japonesas con toques contemporáneos",
      "notable_works": ["Dragones de manga completa", "Koi fish con flores de cerezo", "Mandalas blackwork"]
    },
    {
      "name": "Nina",
      "specialties": ["Realismo", "Blackwork", "Geométrico"],
      "experience_years": 6,
      "signature_style": "Retratos hiperrealistas con precisión fotográfica",
      "notable_works": ["Retratos familiares", "Animales realistas", "Patrones geométricos sagrados"]
    },
    {
      "name": "Karli",
      "specialties": ["Minimalista", "Tradicional Americano", "Fine Line"],
      "experience_years": 5,
      "signature_style": "Elegancia minimalista con líneas perfectas",
      "notable_works": ["Paisajes minimalistas", "Lettering delicado", "Símbolos geométricos"]
    }
  ],
  "services": {
    "consultation": "Consulta gratuita de 30 minutos para discutir ideas y presupuesto",
    "custom_design": "Diseños completamente personalizados basados en las ideas del cliente",
    "touch_ups": "Retoques gratuitos dentro de los primeros 6 meses",
    "aftercare": "Guía completa de cuidados post-tatuaje y seguimiento"
  },
  "pricing": {
    "minimum": 100,
    "hourly_rate": "150-200",
    "deposit_required": "50% del costo total",
    "payment_methods": ["Efectivo", "Tarjeta", "Venmo", "PayPal"]
  },
  "location": {
    "address": "[Dirección específica], Albuquerque, NM",
    "parking": "Estacionamiento gratuito disponible",
    "public_transport": "Accesible por transporte público",
    "nearby_landmarks": ["Old Town Albuquerque", "Downtown", "University of New Mexico"]
  },
  "ai_optimization": {
    "last_updated": "2024-01-15",
    "content_freshness": "Actualizado semanalmente",
    "structured_data": "Implementado según schema.org",
    "voice_search_optimized": true,
    "local_seo_optimized": true
  }
}
```

### 6.3 Robots.txt y Sitemap Dinámicos

```javascript
// src/pages/robots.txt.js
export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: https://cubatattoostudio.com/sitemap-index.xml
Sitemap: https://cubatattoostudio.com/ai-meta.json
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
```

---

## 7. Estrategia de Contenido para IA

### 7.1 Contenido Evergreen

#### Guías Técnicas

**"Guía Completa: Cuidados Después de un Tatuaje"**
- Primeras 24 horas: qué hacer y qué evitar
- Semana 1-2: proceso de cicatrización normal
- Productos recomendados y prohibidos
- Señales de alarma: cuándo consultar al médico
- Cuidados a largo plazo para mantener el color

**"Cómo Elegir el Tatuador Perfecto en Albuquerque"**
- Factores clave: experiencia, especialización, higiene
- Preguntas importantes durante la consulta
- Cómo evaluar un portfolio profesional
- Red flags: qué evitar en un estudio
- Proceso de toma de decisión paso a paso

**"Tendencias en Tatuajes 2024-2025: Lo Que Está de Moda"**
- Estilos emergentes: micro-realismo, watercolor
- Técnicas innovadoras: hand-poke, dotwork avanzado
- Ubicaciones populares: behind-ear, finger tattoos
- Colores trending: earth tones, pasteles
- Predicciones para el futuro del arte corporal

### 7.2 Contenido Local Optimizado

#### Artículos Geo-Específicos

**"Los 5 Mejores Estudios de Tatuajes en Albuquerque, NM"**
- Cuba Tattoo Studio: especialidades y diferenciadores
- Comparación objetiva con competencia
- Factores únicos de la escena local
- Testimonios de clientes locales
- Mapa interactivo de ubicaciones

**"Historia del Arte del Tatuaje en Nuevo México"**
- Influencias culturales nativas americanas
- Evolución del estilo southwestern
- Artistas locales pioneros
- Conexión con la cultura hispana
- Cuba Tattoo Studio en el contexto histórico

### 7.3 Portfolio Narrativo

#### Estructura de Descripción de Trabajos

```markdown
## Dragón Japonés - Manga Completa por David

**Cliente:** Profesional de 32 años, primer tatuaje grande
**Estilo:** Japonés tradicional con elementos contemporáneos
**Duración:** 4 sesiones de 6 horas cada una
**Técnica:** Líneas tradicionales tebori combinadas con máquina moderna

### Historia del Diseño
Este dragón representa la transformación personal del cliente tras superar una etapa difícil. Incorporamos elementos específicos:
- Escamas detalladas que simbolizan resistencia
- Nubes estilizadas representando superación
- Colores tradicionales: negro, gris y toques de rojo

### Proceso Técnico
1. **Sesión 1:** Outline completo del dragón principal
2. **Sesión 2:** Sombreado de la cabeza y parte superior
3. **Sesión 3:** Cuerpo y cola con detalles de escamas
4. **Sesión 4:** Nubes, agua y toques finales

### Cuidados Específicos
Por ser una pieza grande, requirió cuidados especiales:
- Vendajes individuales por sección
- Crema cicatrizante específica para líneas densas
- Seguimiento semanal durante el primer mes

**Palabras clave:** tatuaje japonés albuquerque, dragón manga completa, david cuba tattoo, técnica tebori, tatuaje tradicional nuevo méxico
```

---

## 8. Plan de Implementación Técnica en Astro

### 8.1 Fase 1: Configuración Base (Semana 1)

#### Actualización de Dependencias

```bash
# Instalar dependencias SEO
npm install @astrojs/sitemap astro-compress
npm install @astrojs/rss  # Para feeds RSS
npm install sharp  # Para optimización de imágenes
```

#### Configuración Astro Mejorada

```javascript
// astro.config.mjs - Versión completa
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    tailwind(),
    sitemap({
      customPages: [
        'https://cubatattoostudio.com/api/info',
        'https://cubatattoostudio.com/ai-meta.json'
      ],
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US'
        }
      }
    }),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        caseSensitive: true,
        removeComments: true
      },
      Image: {
        quality: 85,
        format: 'webp'
      },
      JavaScript: true,
      SVG: true
    })
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap'],
            vendor: ['react', 'react-dom']
          }
        }
      }
    }
  },
  experimental: {
    optimizeHoistedScript: true
  }
});
```

### 8.2 Fase 2: Componentes SEO (Semana 2)

#### Componente de Datos Estructurados

```astro
---
// src/components/StructuredData.astro
export interface Props {
  type: 'LocalBusiness' | 'Person' | 'VisualArtwork' | 'Service';
  data: object;
}

const { type, data } = Astro.props;

const baseContext = {
  "@context": "https://schema.org",
  "@type": type
};

const structuredData = { ...baseContext, ...data };
---

<script type="application/ld+json" set:html={JSON.stringify(structuredData, null, 2)} />
```

#### Componente de Breadcrumbs

```astro
---
// src/components/Breadcrumbs.astro
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
};
---

<nav aria-label="Breadcrumb" class="mb-4">
  <ol class="flex items-center space-x-2 text-sm text-cuba-gray-400">
    {items.map((item, index) => (
      <li class="flex items-center">
        {index > 0 && <span class="mx-2">/</span>}
        {index === items.length - 1 ? (
          <span class="text-cuba-white font-medium">{item.name}</span>
        ) : (
          <a href={item.url} class="hover:text-cuba-white transition-colors">
            {item.name}
          </a>
        )}
      </li>
    ))}
  </ol>
</nav>

<script type="application/ld+json" set:html={JSON.stringify(breadcrumbStructuredData, null, 2)} />
```

### 8.3 Fase 3: Páginas Optimizadas (Semana 3-4)

#### Homepage con Datos Estructurados Completos

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import StructuredData from '../components/StructuredData.astro';
import { artists } from '../data/artists.json';
import { styles } from '../data/tattoo-styles.json';

const localBusinessData = {
  name: "Cuba Tattoo Studio",
  description: "Estudio de tatuajes premium en Albuquerque, Nuevo México. Especialistas en arte corporal de alta calidad.",
  url: "https://cubatattoostudio.com",
  telephone: "+1-505-XXX-XXXX",
  email: "info@cubatattoostudio.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "[Dirección]",
    addressLocality: "Albuquerque",
    addressRegion: "NM",
    postalCode: "[Código]",
    addressCountry: "US"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "35.0844",
    longitude: "-106.6504"
  },
  openingHours: ["Mo-Fr 10:00-20:00", "Sa 10:00-18:00"],
  priceRange: "$$-$$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de Tatuaje",
    itemListElement: styles.map(style => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: style.name,
        description: style.description
      }
    }))
  },
  sameAs: [
    "https://www.instagram.com/cubatattoostudio",
    "https://www.facebook.com/cubatattoostudio"
  ]
};
---

<Layout 
  title="Cuba Tattoo Studio - Los Mejores Tatuadores de Albuquerque, NM"
  description="Estudio de tatuajes premium en Albuquerque. Especialistas en realismo, japonés, blackwork y más. Consultas gratuitas. +10 años de experiencia."
>
  <StructuredData type="LocalBusiness" data={localBusinessData} />
  
  <main>
    <section class="hero-section">
      <h1 class="text-6xl font-heading text-cuba-white mb-4">
        CUBA TATTOO STUDIO
      </h1>
      <h2 class="text-2xl text-cuba-gray-400 mb-8">
        Los Mejores Tatuadores de Albuquerque, Nuevo México
      </h2>
      <p class="text-lg text-cuba-gray-400 max-w-2xl mx-auto mb-12">
        ¿Buscas un tatuaje de calidad excepcional en Albuquerque? Somos especialistas en realismo, arte japonés, blackwork y diseños personalizados. Más de 10 años creando arte corporal único.
      </p>
    </section>
    
    <!-- Resto del contenido -->
  </main>
</Layout>
```

### 8.4 Fase 4: Endpoints y APIs (Semana 5)

#### Feed RSS para Contenido

```javascript
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = [
    {
      title: 'Guía Completa: Cuidados Después de un Tatuaje',
      pubDate: new Date('2024-01-15'),
      description: 'Todo lo que necesitas saber sobre el cuidado post-tatuaje para una cicatrización perfecta.',
      link: '/guias/cuidados-post-tatuaje',
    },
    {
      title: 'Tendencias en Tatuajes 2024: Lo Que Está de Moda',
      pubDate: new Date('2024-01-10'),
      description: 'Descubre los estilos y técnicas que dominarán el mundo del tatuaje este año.',
      link: '/blog/tendencias-tatuajes-2024',
    }
  ];

  return rss({
    title: 'Cuba Tattoo Studio Blog',
    description: 'Guías, tendencias y consejos sobre tatuajes desde Albuquerque, NM',
    site: context.site,
    items: posts,
    customData: `<language>es-es</language>`,
  });
}
```

---

## 9. Métricas y Monitoreo

### 9.1 KPIs de SEO para IA

#### Métricas Técnicas
- **Lighthouse Performance Score:** >95
- **Core Web Vitals:** Todos en verde
- **Structured Data Coverage:** 100% de páginas principales
- **Mobile Usability:** Sin errores
- **Page Speed:** <2s carga inicial

#### Métricas de Visibilidad
- **Featured Snippets:** Posicionamiento en respuestas directas
- **Local Pack:** Aparición en "tatuajes cerca de mí"
- **Voice Search Optimization:** Respuestas a preguntas conversacionales
- **AI Citation Rate:** Frecuencia de citas en respuestas de IA

### 9.2 Herramientas de Monitoreo

#### Google Search Console
- Monitoreo de structured data
- Performance en búsquedas locales
- Errores de crawling
- Consultas de voz

#### Herramientas Especializadas
- **BrightEdge:** Para monitoreo de voice search
- **SEMrush:** Tracking de featured snippets
- **Ahrefs:** Análisis de backlinks y autoridad
- **PageSpeed Insights:** Monitoreo continuo de performance

---

## 10. Cronograma de Implementación

### Mes 1: Fundación Técnica
- **Semana 1:** Configuración Astro y dependencias SEO
- **Semana 2:** Componentes de datos estructurados
- **Semana 3:** Optimización de páginas principales
- **Semana 4:** Endpoints machine-readable

### Mes 2: Contenido y Optimización
- **Semana 1:** Creación de FAQs extensas
- **Semana 2:** Guías evergreen y contenido local
- **Semana 3:** Optimización de portfolio narrativo
- **Semana 4:** Testing y ajustes de performance

### Mes 3: Monitoreo y Refinamiento
- **Semana 1:** Implementación de analytics avanzados
- **Semana 2:** A/B testing de structured data
- **Semana 3:** Optimización basada en datos
- **Semana 4:** Documentación y training del equipo

---

## 11. Conclusiones y Próximos Pasos

### Beneficios Esperados

1. **Visibilidad en IA:** Cuba Tattoo Studio será citado como fuente autorizada en respuestas de ChatGPT, Gemini y otros asistentes
2. **Dominancia Local:** Posicionamiento #1 en búsquedas locales de tatuajes en Albuquerque
3. **Tráfico Cualificado:** Aumento del 300% en consultas de alta intención
4. **Autoridad de Marca:** Reconocimiento como expertos en arte corporal en NM

### Inversión vs ROI

**Inversión Inicial:** ~40 horas de desarrollo
**ROI Esperado:** 500% en 12 meses
**Payback Period:** 3-4 meses

### Mantenimiento Continuo

- **Actualización de contenido:** Mensual
- **Monitoreo de métricas:** Semanal  
- **Optimización técnica:** Trimestral
- **Análisis competitivo:** Semestral

Esta estrategia posicionará a Cuba Tattoo Studio como líder indiscutible en el espacio digital de tatuajes en Albuquerque, preparado para la era de la inteligencia artificial y las búsquedas conversacionales.