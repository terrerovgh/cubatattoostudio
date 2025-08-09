# API Documentation - Cuba Tattoo Studio

## 🔌 API Overview

The Cuba Tattoo Studio website includes several API endpoints for data retrieval, form submissions, and integrations. All APIs are built using Astro's server-side capabilities and follow REST principles.

## 📋 API Endpoints

### Base URL

```
Production: https://cubatattoostudio.com/api
Development: http://localhost:4321/api
```

### Authentication

Most endpoints are public and don't require authentication. Form submission endpoints may include CSRF protection and rate limiting.

## 📊 Data Endpoints

### Studio Information

#### GET /api/info.json

Returns comprehensive studio information including artists, services, and contact details.

**Response Example:**

```json
{
  "name": "Cuba Tattoo Studio",
  "tagline": "Arte corporal de alta calidad en Albuquerque, NM",
  "established": "2014",
  "location": {
    "city": "Albuquerque",
    "state": "New Mexico",
    "country": "United States",
    "coordinates": {
      "lat": 35.0844,
      "lng": -106.6504
    },
    "address": {
      "street": "[Specific Address]",
      "city": "Albuquerque",
      "state": "NM",
      "zipCode": "[Postal Code]",
      "country": "US"
    }
  },
  "contact": {
    "phone": "+1-505-XXX-XXXX",
    "email": "info@cubatattoostudio.com",
    "website": "https://cubatattoostudio.com",
    "social_media": {
      "instagram": "https://www.instagram.com/cubatattoostudio",
      "facebook": "https://www.facebook.com/cubatattoostudio"
    }
  },
  "hours": {
    "monday": { "open": "10:00", "close": "20:00", "status": "open" },
    "tuesday": { "open": "10:00", "close": "20:00", "status": "open" },
    "wednesday": { "open": "10:00", "close": "20:00", "status": "open" },
    "thursday": { "open": "10:00", "close": "20:00", "status": "open" },
    "friday": { "open": "10:00", "close": "20:00", "status": "open" },
    "saturday": { "open": "10:00", "close": "18:00", "status": "open" },
    "sunday": { "open": "12:00", "close": "17:00", "status": "open" }
  },
  "services": [
    "Custom tattoo designs",
    "Cover-up tattoos",
    "Tattoo touch-ups",
    "Free consultations",
    "Aftercare guidance"
  ],
  "artists_count": 4,
  "portfolio_count": 150,
  "years_experience": 10
}
```

**Implementation:**

```javascript
// src/pages/api/info.json.js
import { artists } from '../../data/artists.json';
import { styles } from '../../data/tattoo-styles.json';

export async function GET() {
  const studioInfo = {
    name: "Cuba Tattoo Studio",
    tagline: "Arte corporal de alta calidad en Albuquerque, NM",
    established: "2014",
    location: {
      city: "Albuquerque",
      state: "New Mexico",
      country: "United States",
      region: "Southwest",
      coordinates: {
        lat: 35.0844,
        lng: -106.6504
      },
      address: {
        street: "[Specific Address]",
        city: "Albuquerque",
        state: "NM",
        zipCode: "[Postal Code]",
        country: "US"
      },
      timezone: "America/Denver"
    },
    contact: {
      phone: "+1-505-XXX-XXXX",
      email: "info@cubatattoostudio.com",
      website: "https://cubatattoostudio.com",
      booking_url: "https://cubatattoostudio.com/reservas",
      social_media: {
        instagram: "https://www.instagram.com/cubatattoostudio",
        facebook: "https://www.facebook.com/cubatattoostudio"
      }
    },
    hours: {
      monday: { open: "10:00", close: "20:00", status: "open" },
      tuesday: { open: "10:00", close: "20:00", status: "open" },
      wednesday: { open: "10:00", close: "20:00", status: "open" },
      thursday: { open: "10:00", close: "20:00", status: "open" },
      friday: { open: "10:00", close: "20:00", status: "open" },
      saturday: { open: "10:00", close: "18:00", status: "open" },
      sunday: { open: "12:00", close: "17:00", status: "open" }
    },
    services: [
      "Custom tattoo designs",
      "Cover-up tattoos",
      "Tattoo touch-ups",
      "Free consultations",
      "Aftercare guidance"
    ],
    artists_count: artists.length,
    portfolio_count: artists.reduce((total, artist) => total + artist.portfolio.length, 0),
    years_experience: new Date().getFullYear() - 2014
  };

  return new Response(JSON.stringify(studioInfo), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
}
```

### Artists Data

#### GET /api/artists.json

Returns all artists with their portfolio information.

**Response Example:**

```json
{
  "artists": [
    {
      "id": "david",
      "name": "David",
      "slug": "david",
      "specialties": ["Japanese", "Blackwork", "Traditional"],
      "bio": "David is an artist specialized in traditional Japanese tattoos...",
      "experience": "8+ years",
      "image": "/images/artists/david.jpg",
      "featured": true,
      "portfolio_count": 12,
      "contact": {
        "instagram": "@david_tattoos",
        "booking_preference": "consultation_required"
      }
    }
  ],
  "total_artists": 4,
  "featured_artists": 2
}
```

**Implementation:**

```javascript
// src/pages/api/artists.json.js
import { artists } from '../../data/artists.json';

export async function GET() {
  const artistsData = {
    artists: artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      specialties: artist.specialties,
      bio: artist.bio,
      experience: artist.experience,
      image: artist.image,
      featured: artist.featured,
      portfolio_count: artist.portfolio.length,
      contact: artist.contact
    })),
    total_artists: artists.length,
    featured_artists: artists.filter(artist => artist.featured).length
  };

  return new Response(JSON.stringify(artistsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
    }
  });
}
```

#### GET /api/artists/[slug].json

Returns detailed information for a specific artist.

**Response Example:**

```json
{
  "artist": {
    "id": "david",
    "name": "David",
    "slug": "david",
    "specialties": ["Japanese", "Blackwork", "Traditional"],
    "bio": "David is an artist specialized in traditional Japanese tattoos and blackwork with over 8 years of experience...",
    "experience": "8+ years",
    "image": "/images/artists/david.jpg",
    "featured": true,
    "portfolio": [
      {
        "id": "david-1",
        "image": "/images/portfolio/david-dragon.jpg",
        "title": "Japanese Dragon",
        "style": "Japanese",
        "description": "Traditional Japanese dragon full arm sleeve",
        "size": "large",
        "bodyPart": "arm"
      }
    ],
    "contact": {
      "instagram": "@david_tattoos",
      "booking_preference": "consultation_required"
    }
  }
}
```

### Portfolio Data

#### GET /api/portfolio.json

Returns all portfolio items with filtering options.

**Query Parameters:**
- `artist` - Filter by artist slug
- `style` - Filter by tattoo style
- `size` - Filter by tattoo size (small, medium, large)
- `featured` - Show only featured work (true/false)
- `limit` - Limit number of results
- `offset` - Pagination offset

**Response Example:**

```json
{
  "portfolio": [
    {
      "id": "david-1",
      "artist": {
        "id": "david",
        "name": "David",
        "slug": "david"
      },
      "image": "/images/portfolio/david-dragon.jpg",
      "title": "Japanese Dragon",
      "style": "Japanese",
      "description": "Traditional Japanese dragon full arm sleeve",
      "size": "large",
      "bodyPart": "arm",
      "featured": true,
      "created_at": "2024-01-15"
    }
  ],
  "total_items": 48,
  "filtered_items": 12,
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

## 📝 Form Submission Endpoints

### Booking Form Submission

#### POST /api/booking

Submits a new booking request.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1-505-123-4567",
  "tattooDescription": "I want a Japanese dragon on my arm",
  "tattooSize": "large",
  "bodyPlacement": "right arm",
  "preferredArtist": "david",
  "referenceImages": [
    "data:image/jpeg;base64,..."
  ],
  "specialRequests": "I prefer afternoon appointments",
  "preferredDate": "2024-02-15",
  "hasAllergies": false,
  "allergyDetails": "",
  "agreedToTerms": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking request submitted successfully",
  "booking_id": "BK-2024-001",
  "next_steps": [
    "We will review your request within 24 hours",
    "You will receive a confirmation email",
    "Our team will contact you to schedule a consultation"
  ],
  "estimated_response_time": "24 hours"
}
```

**Implementation:**

```javascript
// src/pages/api/booking.js
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'tattooDescription', 'tattooSize', 'bodyPlacement'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields',
        missing_fields: missingFields
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate booking ID
    const bookingId = `BK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // Process booking (send email, save to database, etc.)
    await processBooking({
      ...data,
      bookingId,
      submittedAt: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Booking request submitted successfully',
      booking_id: bookingId,
      next_steps: [
        'We will review your request within 24 hours',
        'You will receive a confirmation email',
        'Our team will contact you to schedule a consultation'
      ],
      estimated_response_time: '24 hours'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Booking submission error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      message: 'Please try again later or contact us directly'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function processBooking(bookingData) {
  // Send email notification
  await sendBookingNotification(bookingData);
  
  // Save to database (if using one)
  // await saveBookingToDatabase(bookingData);
  
  // Send confirmation email to customer
  await sendConfirmationEmail(bookingData);
}

async function sendBookingNotification(bookingData) {
  // Implementation depends on email service (SendGrid, Mailgun, etc.)
  const emailData = {
    to: 'bookings@cubatattoostudio.com',
    subject: `New Booking Request - ${bookingData.bookingId}`,
    html: generateBookingEmailTemplate(bookingData)
  };
  
  // Send email using your preferred service
  // await emailService.send(emailData);
}
```

### Contact Form Submission

#### POST /api/contact

Submits a general contact form.

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Question about pricing",
  "message": "I'd like to know more about your pricing for small tattoos.",
  "phone": "+1-505-123-4567"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "reference_id": "MSG-2024-001"
}
```

## 🔍 Search and Filter APIs

### Portfolio Search

#### GET /api/search/portfolio

Searches portfolio items by various criteria.

**Query Parameters:**
- `q` - Search query (searches titles and descriptions)
- `artist` - Filter by artist
- `style` - Filter by style
- `size` - Filter by size
- `body_part` - Filter by body part
- `sort` - Sort order (newest, oldest, popular)
- `limit` - Results per page (default: 20)
- `page` - Page number (default: 1)

**Example Request:**
```
GET /api/search/portfolio?q=dragon&style=Japanese&artist=david&limit=10
```

**Response:**

```json
{
  "results": [
    {
      "id": "david-1",
      "title": "Japanese Dragon",
      "artist": "David",
      "style": "Japanese",
      "image": "/images/portfolio/david-dragon.jpg",
      "description": "Traditional Japanese dragon full arm sleeve",
      "relevance_score": 0.95
    }
  ],
  "total_results": 3,
  "query": "dragon",
  "filters_applied": {
    "style": "Japanese",
    "artist": "david"
  },
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "results_per_page": 10
  }
}
```

## 📊 Analytics and Metrics

### Site Analytics

#### GET /api/analytics/summary

Returns basic site analytics (requires authentication).

**Response:**

```json
{
  "period": "last_30_days",
  "metrics": {
    "page_views": 15420,
    "unique_visitors": 8930,
    "booking_submissions": 45,
    "contact_submissions": 23,
    "bounce_rate": 0.32,
    "average_session_duration": 180
  },
  "top_pages": [
    { "path": "/", "views": 5420 },
    { "path": "/portfolio", "views": 3210 },
    { "path": "/artistas", "views": 2890 }
  ],
  "popular_artists": [
    { "name": "David", "profile_views": 890 },
    { "name": "Karli", "profile_views": 670 }
  ]
}
```

## 🔒 Security and Rate Limiting

### Rate Limiting

All API endpoints implement rate limiting to prevent abuse:

- **Data endpoints**: 100 requests per minute per IP
- **Form submissions**: 5 requests per minute per IP
- **Search endpoints**: 50 requests per minute per IP

### CSRF Protection

Form submission endpoints include CSRF token validation:

```javascript
// CSRF token validation
const csrfToken = request.headers.get('X-CSRF-Token');
if (!validateCSRFToken(csrfToken)) {
  return new Response(JSON.stringify({
    success: false,
    error: 'Invalid CSRF token'
  }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Input Validation

All inputs are validated and sanitized:

```javascript
// Input validation example
function validateBookingData(data) {
  const errors = [];
  
  // Required field validation
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Phone validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(data.phone.replace(/[\s-()]/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  return errors;
}
```

## 🧪 Testing APIs

### Using curl

```bash
# Get studio info
curl -X GET "https://cubatattoostudio.com/api/info.json"

# Submit booking form
curl -X POST "https://cubatattoostudio.com/api/booking" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1-505-123-4567",
    "tattooDescription": "Test tattoo",
    "tattooSize": "small",
    "bodyPlacement": "wrist",
    "agreedToTerms": true
  }'

# Search portfolio
curl -X GET "https://cubatattoostudio.com/api/search/portfolio?q=dragon&style=Japanese"
```

### Using JavaScript

```javascript
// Fetch studio info
const studioInfo = await fetch('/api/info.json')
  .then(response => response.json());

// Submit booking form
const bookingResponse = await fetch('/api/booking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken()
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1-505-123-4567',
    tattooDescription: 'Dragon tattoo',
    tattooSize: 'large',
    bodyPlacement: 'arm',
    agreedToTerms: true
  })
});

const result = await bookingResponse.json();
console.log(result);
```

## 📚 Error Handling

### Standard Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789"
}
```

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized
- **403**: Forbidden (CSRF, rate limiting)
- **404**: Not Found
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

## 🔧 API Client Libraries

### JavaScript/TypeScript Client

```typescript
// src/utils/api-client.ts
class CubaTattooAPI {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getStudioInfo() {
    const response = await fetch(`${this.baseUrl}/info.json`);
    return response.json();
  }

  async getArtists() {
    const response = await fetch(`${this.baseUrl}/artists.json`);
    return response.json();
  }

  async getArtist(slug: string) {
    const response = await fetch(`${this.baseUrl}/artists/${slug}.json`);
    return response.json();
  }

  async submitBooking(bookingData: BookingData) {
    const response = await fetch(`${this.baseUrl}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await this.getCsrfToken()
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  }

  async searchPortfolio(query: SearchParams) {
    const params = new URLSearchParams(query);
    const response = await fetch(`${this.baseUrl}/search/portfolio?${params}`);
    return response.json();
  }

  private async getCsrfToken(): Promise<string> {
    if (!this.csrfToken) {
      const response = await fetch('/api/csrf-token');
      const data = await response.json();
      this.csrfToken = data.token;
    }
    return this.csrfToken;
  }
}

// Usage
const api = new CubaTattooAPI();
const studioInfo = await api.getStudioInfo();
const artists = await api.getArtists();
```

---

*This API documentation provides comprehensive information about all available endpoints. For additional support or questions about the API, please contact the development team.*