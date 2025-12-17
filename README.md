# Cuba Tattoo Studio

A modern, high-performance web application for Cuba Tattoo Studio, featuring a client-side AI assistant and a guided booking system.

## 🌟 Features

*   **Astro Framework**: Blazing fast static site generation with selective hydration.
*   **AI Concierge**: An intelligent chat assistant powered by `@xenova/transformers` that runs entirely in your browser (no data leaves your device).
*   **Guided Booking**: A conversational wizard to gather tattoo ideas, reference images, and scheduling preferences.
*   **Content Collections**: Easy-to-manage data for Artists, Tattoos, Flash Designs, and Studio Info.
*   **Responsive Design**: Built with TailwindCSS for a seamless experience on mobile and desktop.

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs/) directory:

*   [**Architecture**](./docs/ARCHITECTURE.md): Tech stack and structure.
*   [**AI System**](./docs/AI.md): How the in-browser LLM works.
*   [**Data Models**](./docs/API.md): Content schemas.
*   [**Deployment**](./docs/DEPLOYMENT.md): Build and deploy instructions.
*   [**Future Roadmap**](./docs/FUTURE.md): Recommendations for improvements.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Download the AI Model**:
    This is required for the chat assistant to function locally.
    ```bash
    npm run download-model
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🛠️ Project Structure

```text
/
├── public/                 # Static assets & AI models
├── src/
│   ├── components/         # React & Astro components
│   │   ├── AI/             # Chat Assistant logic
│   │   └── ...
│   ├── content/            # Data (Artists, Portfolio, etc.)
│   ├── layouts/            # Page layouts
│   ├── lib/                # Utilities & Web Workers
│   └── pages/              # Routes
└── astro.config.mjs        # Configuration
```

## 📝 License

Proprietary. All rights reserved.
