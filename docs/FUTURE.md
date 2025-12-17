# Future Recommendations

## 1. Backend Integration for Booking
**Current State**: The booking flow ends with a console log or a simulated success message.
**Recommendation**: Implement a real backend endpoint (`POST /api/booking`) that:
*   Receives the `dossier` JSON.
*   Sends an email notification to the studio/artist.
*   Sends a confirmation email to the client.
*   Stores the booking in a database (Supabase, Firebase, or SQL).

## 2. Server-Side AI Option
**Current State**: AI runs purely on the client.
**Issue**: Large download size (~500MB) blocks users with poor connections or mobile data caps.
**Recommendation**: Create a hybrid approach.
*   Check client capabilities/connection type.
*   If low-end/mobile, proxy the request to a server-side LLM (OpenAI, Anthropic, or a self-hosted open-source model).

## 3. SEO & Accessibility
*   **SEO**: Ensure all artist pages and portfolio items have proper metadata, OpenGraph tags, and structured data (JSON-LD) for Local Business.
*   **Accessibility**: The custom Chat Assistant needs rigorous testing with screen readers (ARIA labels, focus management).

## 4. Calendar Integration
**Current State**: The Calendar component is likely visual or uses mock data.
**Recommendation**: Integrate with a real scheduling API (Google Calendar, Calendly, or a custom DB) to show real-time availability.

## 5. Image Handling
**Current State**: Images are uploaded via `createObjectURL` (local only) or assumed to be handled.
**Recommendation**: When a user uploads a reference image in the chat:
*   Upload it to a storage bucket (AWS S3, Cloudflare R2).
*   Include the public URL in the final dossier sent to the artist.

## 6. Model Optimization
**Current State**: Using `Qwen1.5-0.5B-Chat`.
**Recommendation**:
*   Explore smaller or more specialized models if available.
*   Implement lazy loading: Only download the model if the user explicitly asks a question that static responses cannot answer.
