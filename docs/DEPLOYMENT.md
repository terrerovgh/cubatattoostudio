# Deployment

## Prerequisites

*   Node.js (v18+)
*   NPM or PNPM

## Build Steps

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Download AI Model**:
    **Crucial Step**: The AI model must be present in the `public/models` directory for the application to function correctly in production.
    ```bash
    npm run download-model
    ```

3.  **Build the Site**:
    ```bash
    npm run build
    ```
    This will generate the static assets and server functions in the `dist/` directory (or `.vercel/output`, `.cloudflare/` depending on the adapter).

## Deployment Targets

### Cloudflare Pages
The project includes a `wrangler.json`, suggesting it is optimized for Cloudflare.

1.  Ensure you have `wrangler` installed and authenticated.
2.  Deploy using:
    ```bash
    npx wrangler pages deploy dist
    ```
    *Note: You may need to configure the build command in Cloudflare dashboard to include `npm run download-model` before `npm run build`.*

### Environment Variables
Currently, the project does not rely on sensitive `.env` secrets for the core functionality, as the AI is client-side and data is in files.

## Optimization
*   **Caching**: Ensure the web server serves the `.onnx` and `.json` model files with long cache expiration headers (`Cache-Control: public, max-age=31536000, immutable`).
*   **Compression**: Enable Brotli/Gzip compression for the model assets to reduce bandwidth usage.
