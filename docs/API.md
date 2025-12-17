# Data Models (API)

The application uses **Astro Content Collections** to structure its data. While there is no traditional database, these collections serve as the "API" for the static site generation.

All schemas are defined in `src/content/config.ts` using Zod.

## Collections

### `artists`
Represents the tattoo artists in the studio.
*   `name` (string): Artist's name.
*   `style` (string): Primary style (e.g., "Realism").
*   `role` (string): "Resident Artist", etc.
*   `status` (enum): 'walk-ins', 'booking', 'closed'.
*   `coverImage` (string): Path to cover image.
*   `socials` (object): Instagram handle, etc.
*   **Relations**: Optional references to `schedules`, `bookingInfo`, `bio`.

### `tattoos`
Individual tattoo portfolio items.
*   `image` (string): Path to image.
*   `artist` (reference): Link to `artists` collection.
*   `tags` (string[]): Descriptive tags.

### `flashDesigns`
Pre-made designs available for tattooing.
*   `title` (string)
*   `price` (string, optional)
*   `image` (string)
*   `artist` (reference): Link to `artists`.
*   `available` (boolean)

### `gallery`
General gallery items (likely a curated mix or studio shots).
*   `image` (string)
*   `tags` (string[])
*   `featured` (boolean)

### `services`
Services offered by the studio (e.g., Tattooing, Piercing, Laser Removal).
*   `title` (string)
*   `description` (string)
*   `media` (string)
*   `type` (enum): 'image' or 'video'.

### `chat`
Configuration for the Chat Assistant.
*   `assistantName` (string)
*   `welcomeMessage` (string)
*   `staticResponses` (array): Offline triggers and responses.
*   `bookingSteps` (array): Configuration for the guided booking flow (questions, input types).

### `bookingInfo`
Booking policies and details.
*   `deposit` (string)
*   `policy` (string)

### `schedules`
Artist availability.
*   `days` (string[])
*   `hours` (object): start/end times.

## API Routes
Located in `src/pages/api/`.

### `api/booking/` (Implied)
*   **Purpose**: To handle the submission of booking dossiers.
*   **Current State**: The frontend `ChatAssistant` prepares a dossier object. The actual POST request logic would reside here or be integrated into a serverless function (e.g., Cloudflare Worker) to send emails or save to a DB.
