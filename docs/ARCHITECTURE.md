# Architecture

## Technology Stack

The project utilizes a modern frontend stack focused on performance and interactivity:

*   **Framework**: [Astro](https://astro.build/) (v5) - Handles routing, SSG/SSR, and component isolation.
*   **UI Library**: [React](https://react.dev/) (v19) - Used for interactive components (e.g., Chat Assistant, Booking Calendar).
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) (v4) - Utility-first CSS framework.
*   **Animations**:
    *   [Framer Motion](https://www.framer.com/motion/) - For React component animations (modals, transitions).
    *   [GSAP](https://gsap.com/) - For high-performance animations.
*   **AI**: [`@xenova/transformers`](https://github.com/xenova/transformers.js) - Runs Transformer models directly in the browser using WebGPU/WASM.
*   **Deployment**: configured for Cloudflare (via `wrangler.json`).

## Project Structure

```text
/
├── public/                 # Static assets (images, fonts)
│   ├── models/             # Downloaded AI models (Xenova/Qwen1.5-0.5B-Chat)
├── scripts/
│   └── download_model.js   # Script to fetch AI model files
├── src/
│   ├── components/
│   │   ├── AI/             # ChatAssistant and AI-related components
│   │   ├── Booking/        # Calendar and booking logic
│   │   ├── artist/         # Artist profile components
│   │   └── ...             # Shared UI components (Navbar, Footer, Modals)
│   ├── content/            # Astro Content Collections (Data source)
│   │   ├── config.ts       # Zod schemas for collections
│   │   └── ...             # JSON/Markdown files for artists, tattoos, etc.
│   ├── layouts/            # Page layouts
│   ├── lib/
│   │   └── ai-worker.js    # Web Worker for AI model inference
│   ├── pages/
│   │   ├── [artist]/       # Dynamic routes for artist profiles
│   │   ├── api/            # API endpoints
│   │   └── ...             # Static pages (index, calendar)
│   └── styles/             # Global styles
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration (if present, else auto-detected)
├── tsconfig.json           # TypeScript configuration
└── wrangler.json           # Cloudflare configuration
```

## Key Architectural Decisions

### 1. Astro for Performance
Astro is used as the backbone to ship zero JavaScript by default for static content. React is only hydrated where necessary (e.g., the Chat Assistant), ensuring fast initial load times.

### 2. Client-Side AI (WebGPU)
Instead of relying on a costly external API (like OpenAI), the project runs a quantized LLM (`Qwen1.5-0.5B-Chat`) directly in the user's browser.
*   **Benefits**: Privacy (data stays local), zero backend cost, offline capability (once cached).
*   **Trade-offs**: Initial download size (~300-500MB), requires client hardware capability (WebGPU preferred).

### 3. Content Collections as Database
The site uses Astro's Content Collections to manage structured data (Artists, Tattoos, Flash Designs, etc.). This allows for type-safe data access without a dedicated backend database for read-heavy operations.

### 4. Hybrid Booking System
The booking system is a hybrid approach:
*   **Flow**: Guided by the AI/Chat interface.
*   **Logic**: State managed in React (`ChatAssistant.tsx`).
*   **Submission**: Currently mocked/simulated in the frontend, but designed to interact with API endpoints (`src/pages/api/booking/`).
