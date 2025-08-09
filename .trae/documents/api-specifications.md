# Especificaciones de API - Cuba Tattoo Studio

## 📋 Resumen

Este documento detalla las especificaciones de API y endpoints para el sitio web de Cuba Tattoo Studio. Aunque el sitio es principalmente estático (SSG), incluye funcionalidades que requieren procesamiento de datos y comunicación con servicios externos.

## 🏗️ Arquitectura de API

### Tipo de Implementación
- **Sitio Estático:** Generación estática con Astro
- **APIs Externas:** Integración con servicios de terceros
- **Formularios:** Procesamiento mediante servicios externos
- **Datos Dinámicos:** JSON estático con actualización manual

## 📊 Estructura de Datos

### 1. Artistas (artists.json)

```typescript
interface Artist {
  id: string;
  name: string;
  slug: string;
  specialties: string[];
  bio: string;
  experience: string;
  image: string;
  featured: boolean;
  portfolio: PortfolioItem[];
  contact: {
    instagram?: string;
    email?: string;
    phone?: string;
  };
  availability: {
    status: 'available' | 'busy' | 'booked';
    nextAvailable?: string;
  };
}
```

**Ejemplo:**
```json
{
  "artists": [
    {
      "id": "david-martinez",
      "name": "David Martínez",
      "slug": "david-martinez",
      "specialties": ["Blackwork", "Geométrico", "Minimalista"],
      "bio": "Especialista en diseños geométricos y blackwork con más de 8 años de experiencia...",
      "experience": "8+ años",
      "image": "/images/artists/david-martinez.jpg",
      "featured": true,
      "portfolio": [
        {
          "id": "geometric-sleeve-001",
          "image": "/images/portfolio/david/geometric-sleeve-001.jpg",
          "title": "Manga Geométrica",
          "style": "Geométrico",
          "description": "Diseño geométrico complejo en manga completa",
          "size": "large",
          "bodyPart": "brazo",
          "duration": "3 sesiones",
          "featured": true
        }
      ],
      "contact": {
        "instagram": "@david_ink_cuba",
        "email": "david@cubatattoostudio.com"
      },
      "availability": {
        "status": "available",
        "nextAvailable": "2024-02-15"
      }
    }
  ]
}
```

### 2. Estilos de Tatuaje (tattoo-styles.json)

```typescript
interface TattooStyle {
  id: string;
  name: string;
  slug: string;
  description: string;
  characteristics: string[];
  artists: string[]; // IDs de artistas que practican este estilo
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  averagePrice: {
    small: string;
    medium: string;
    large: string;
  };
  averageDuration: {
    small: string;
    medium: string;
    large: string;
  };
}
```

**Ejemplo:**
```json
{
  "styles": [
    {
      "id": "blackwork",
      "name": "Blackwork",
      "slug": "blackwork",
      "description": "Tatuajes realizados completamente en tinta negra, enfocados en patrones geométricos, tribales o ilustraciones sólidas.",
      "characteristics": [
        "Solo tinta negra",
        "Patrones geométricos",
        "Alto contraste",
        "Diseños sólidos"
      ],
      "artists": ["david-martinez", "nina-rodriguez"],
      "featured": true,
      "difficulty": "intermediate",
      "averagePrice": {
        "small": "$150-300",
        "medium": "$400-800",
        "large": "$1000+"
      },
      "averageDuration": {
        "small": "2-3 horas",
        "medium": "4-6 horas",
        "large": "Múltiples sesiones"
      }
    }
  ],
  "categories": {
    "by_complexity": {
      "simple": ["minimalista", "fine-line"],
      "medium": ["tradicional", "geometrico"],
      "complex": ["japones", "realismo", "blackwork"]
    },
    "by_color": {
      "black_only": ["blackwork", "minimalista"],
      "color": ["tradicional", "japones"],
      "mixed": ["geometrico", "biomecanico"]
    }
  }
}
```

### 3. Portfolio Items

```typescript
interface PortfolioItem {
  id: string;
  artistId: string;
  image: string;
  title: string;
  style: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  bodyPart: string;
  duration?: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
}
```

## 🔌 Integraciones de API Externas

### 1. Formulario de Contacto/Reservas

**Servicio Recomendado:** Netlify Forms, Formspree, o EmailJS

#### Endpoint de Envío
```
POST /api/contact
```

**Request Body:**
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  tattooDescription: string;
  size: 'small' | 'medium' | 'large';
  bodyPart: string;
  preferredArtist?: string;
  referenceImages?: File[];
  budget?: string;
  timeframe?: string;
  isFirstTattoo: boolean;
  additionalNotes?: string;
}
```

**Response:**
```typescript
interface ContactFormResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  estimatedResponse?: string;
}
```

**Ejemplo de Implementación con EmailJS:**
```javascript
// components/forms/BookingForm.astro
<script>
  import emailjs from '@emailjs/browser';
  
  const handleSubmit = async (formData) => {
    try {
      const result = await emailjs.send(
        'service_id',
        'template_id',
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          tattoo_description: formData.tattooDescription,
          size: formData.size,
          body_part: formData.bodyPart,
          preferred_artist: formData.preferredArtist,
          budget: formData.budget,
          is_first_tattoo: formData.isFirstTattoo,
          additional_notes: formData.additionalNotes
        },
        'public_key'
      );
      
      return {
        success: true,
        message: 'Solicitud enviada exitosamente. Te contactaremos pronto.',
        submissionId: result.text
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al enviar la solicitud. Inténtalo de nuevo.'
      };
    }
  };
</script>
```

### 2. Google Maps Integration

**API:** Google Maps JavaScript API

```javascript
// utils/maps.js
export const initializeMap = () => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 35.0844, lng: -106.6504 }, // Albuquerque, NM
    zoom: 15,
    styles: [
      // Dark theme styles
      {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
      }
    ]
  });
  
  const marker = new google.maps.Marker({
    position: { lat: 35.0844, lng: -106.6504 },
    map: map,
    title: 'Cuba Tattoo Studio',
    icon: {
      url: '/images/map-marker.svg',
      scaledSize: new google.maps.Size(40, 40)
    }
  });
  
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="map-info-window">
        <h3>Cuba Tattoo Studio</h3>
        <p>123 Central Ave NW<br>Albuquerque, NM 87102</p>
        <p>📞 (505) 123-4567</p>
        <p>🕒 Mar-Sáb: 12pm-8pm</p>
      </div>
    `
  });
  
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
};
```

### 3. Instagram Feed (Opcional)

**API:** Instagram Basic Display API

```javascript
// utils/instagram.js
export const fetchInstagramPosts = async (accessToken, limit = 6) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${accessToken}`
    );
    
    const data = await response.json();
    
    return {
      success: true,
      posts: data.data.map(post => ({
        id: post.id,
        caption: post.caption,
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        permalink: post.permalink
      }))
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

## 🔍 API de Búsqueda Local

### Búsqueda de Portfolio

```javascript
// utils/search.js
export class PortfolioSearch {
  constructor(portfolioData) {
    this.data = portfolioData;
    this.index = this.buildIndex();
  }
  
  buildIndex() {
    // Crear índice de búsqueda para mejor performance
    const index = new Map();
    
    this.data.forEach(item => {
      const searchTerms = [
        item.title.toLowerCase(),
        item.style.toLowerCase(),
        item.description.toLowerCase(),
        item.bodyPart.toLowerCase(),
        ...item.tags.map(tag => tag.toLowerCase())
      ];
      
      searchTerms.forEach(term => {
        if (!index.has(term)) {
          index.set(term, []);
        }
        index.get(term).push(item);
      });
    });
    
    return index;
  }
  
  search(query, filters = {}) {
    const searchTerms = query.toLowerCase().split(' ');
    let results = [];
    
    // Búsqueda por términos
    searchTerms.forEach(term => {
      const matches = this.index.get(term) || [];
      results = [...results, ...matches];
    });
    
    // Eliminar duplicados
    results = [...new Set(results)];
    
    // Aplicar filtros
    if (filters.artist) {
      results = results.filter(item => item.artistId === filters.artist);
    }
    
    if (filters.style) {
      results = results.filter(item => item.style === filters.style);
    }
    
    if (filters.size) {
      results = results.filter(item => item.size === filters.size);
    }
    
    return results;
  }
}
```

## 📧 Configuración de Email Templates

### Template para Nuevas Solicitudes

```html
<!-- email-templates/new-booking-request.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Solicitud de Cita - Cuba Tattoo Studio</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
      Nueva Solicitud de Cita
    </h1>
    
    <h2>Información del Cliente</h2>
    <p><strong>Nombre:</strong> {{name}}</p>
    <p><strong>Email:</strong> {{email}}</p>
    <p><strong>Teléfono:</strong> {{phone}}</p>
    
    <h2>Detalles del Tatuaje</h2>
    <p><strong>Descripción:</strong> {{tattoo_description}}</p>
    <p><strong>Tamaño:</strong> {{size}}</p>
    <p><strong>Ubicación:</strong> {{body_part}}</p>
    <p><strong>Artista Preferido:</strong> {{preferred_artist}}</p>
    <p><strong>Presupuesto:</strong> {{budget}}</p>
    <p><strong>Primer Tatuaje:</strong> {{is_first_tattoo}}</p>
    
    <h2>Notas Adicionales</h2>
    <p>{{additional_notes}}</p>
    
    <hr style="margin: 30px 0;">
    <p style="font-size: 12px; color: #666;">
      Esta solicitud fue enviada desde cubatattoostudio.com
    </p>
  </div>
</body>
</html>
```

## 🔒 Consideraciones de Seguridad

### Validación de Formularios

```javascript
// utils/validation.js
export const validateBookingForm = (data) => {
  const errors = {};
  
  // Validar nombre
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Email inválido';
  }
  
  // Validar teléfono
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  if (!data.phone || !phoneRegex.test(data.phone)) {
    errors.phone = 'Teléfono inválido';
  }
  
  // Validar descripción
  if (!data.tattooDescription || data.tattooDescription.trim().length < 10) {
    errors.tattooDescription = 'La descripción debe tener al menos 10 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Rate Limiting

```javascript
// utils/rate-limit.js
class RateLimit {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Limpiar requests antiguos
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
}

export const formRateLimit = new RateLimit(3, 300000); // 3 requests per 5 minutes
```

## 📊 Analytics y Tracking

### Google Analytics 4

```javascript
// utils/analytics.js
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};

// Eventos específicos del sitio
export const trackPortfolioView = (artistId, style) => {
  trackEvent('portfolio_view', {
    artist_id: artistId,
    tattoo_style: style
  });
};

export const trackBookingFormSubmit = (artistPreference, tattooStyle) => {
  trackEvent('booking_form_submit', {
    preferred_artist: artistPreference,
    tattoo_style: tattooStyle
  });
};

export const trackArtistProfileView = (artistId) => {
  trackEvent('artist_profile_view', {
    artist_id: artistId
  });
};
```

---

*Esta documentación de API está diseñada para un sitio estático con funcionalidades dinámicas mínimas. Para implementaciones más complejas, considera migrar a un framework full-stack.*