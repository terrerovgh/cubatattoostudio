# Cubatattoostudio

This repository contains the source for the Cuba Tattoo Studio website built with Astro.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

### Using Docker

You can also run the project in a Docker container:

```bash
docker compose up
```

This builds the image and starts the dev server on port `4321`.

The site is available in English and Spanish under `/en/` and `/es/`.

## Animations

Scroll-triggered animations are implemented with GSAP. The hero section plays a
video (`public/video/studio.mp4`) when scrolled into view.
