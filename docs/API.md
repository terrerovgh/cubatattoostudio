# API Documentation

The Cuba Tattoo Studio API is built on Cloudflare Workers using Astro's SSR mode (`output: 'server'`). It handles dynamic functionality like bookings, flash drops, image management, and admin authentication.

## Authentication

### Admin Access
Endpoints under `/api/admin/*` and sensitive operations (like deleting images) are protected by a shared secret (`ADMIN_PASSWORD`).

- **Method:** Cookie-based session or `Authorization` header check depending on the route.
- **Implementation:** Constant-time string comparison to prevent timing attacks.

### Image Uploads
The upload endpoint requires a Bearer token.

- **Header:** `Authorization: Bearer <UPLOAD_SECRET>`
- **Env Variable:** `UPLOAD_SECRET` must be set in `.env` or Cloudflare dashboard.

---

## Endpoints

### 📅 Booking

#### `GET /api/booking/availability`
Checks availability for a specific artist and date range.

**Query Params:**
- `artist_id` (string): 'david', 'nina', or 'karli'
- `start_date` (string): ISO date (YYYY-MM-DD)
- `end_date` (string): ISO date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    { "date": "2024-03-20", "slots": ["10:00", "14:00"] }
  ]
}
```

#### `POST /api/booking/create`
Creates a new booking request.

**Body:**
```json
{
  "artist_id": "david",
  "service_id": "custom-tattoo",
  "date": "2024-03-20",
  "time": "10:00",
  "client_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0123"
  }
}
```

---

### ⚡ Flash Drops

#### `GET /api/flash/drops`
Lists active flash designs available for claiming.

**Query Params:**
- `artist_id` (optional): Filter by artist.
- `status` (optional): 'available' (default) or 'all'.

**Response:**
```json
{
  "success": true,
  "data": {
    "designs": [
      {
        "id": "123",
        "title": "Snake & Dagger",
        "price": 150,
        "is_drop": true,
        "drop_quantity": 5,
        "claimed_count": 2
      }
    ]
  }
}
```

#### `POST /api/flash/claim`
Claims a flash design. Reduces available quantity.

**Body:**
```json
{
  "flash_design_id": "123",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### 🖼️ Images (R2)

#### `POST /api/images/upload`
Uploads an image to Cloudflare R2 bucket.

**Headers:**
- `Authorization: Bearer <UPLOAD_SECRET>`
- `Content-Type: multipart/form-data`

**Body (FormData):**
- `file`: The image file.
- `artist`: Artist ID (folder name).
- `caption`: Optional description.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "unique-id",
    "url": "https://cubatattoostudio.com/api/images/gallery/david/unique-id.jpg"
  }
}
```

#### `GET /api/images/:id`
Serves an image from R2.
- Supports `If-None-Match` (ETag) for caching.
- Returns 304 Not Modified if cached.

#### `DELETE /api/images/:id`
Deletes an image from R2. Requires Admin Auth.

---

### 🔐 Admin

#### `POST /api/admin/login`
Verifies the admin password and sets a session cookie.

**Body:**
```json
{
  "password": "your-admin-password"
}
```

#### `GET /api/admin/bookings`
Lists all bookings with status.

**Query Params:**
- `status` (optional): 'pending', 'confirmed', 'completed'.
- `limit` (optional): Pagination limit.
- `offset` (optional): Pagination offset.

---

## Database Schema (D1)

The API interacts with a SQLite database (Cloudflare D1). See `src/lib/db/schema.sql` for table definitions:
- `bookings`
- `flash_designs`
- `flash_claims`
- `clients`
