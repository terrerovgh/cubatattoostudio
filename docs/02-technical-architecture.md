# Technical Architecture

This document outlines the technical specifications, project structure, and design system for the Cubatattoo Studio website.

## Core Technology Stack

The technology stack is selected to ensure performance, scalability, and a seamless integration with the specified tools and libraries. As the project is deployed on **Cloudflare Pages**, the stack is streamlined for a static and server-side rendering (SSR) environment.

-   **Framework**: **Astro**. Chosen for its focus on content-rich websites, delivering exceptional performance by shipping zero JavaScript by default.
-   **Styling**: **Tailwind CSS**. A utility-first CSS framework adopted for rapid and consistent UI development.
-   **Animation**: **Framer Motion & GSAP**. A combination of powerful animation libraries to create fluid and engaging user experiences.
-   **UI Components**: A selection of components from **reactbits.dev**. Leveraged to accelerate development with pre-built, high-quality UI elements.
-   **Deployment**: **Cloudflare Pages**. A platform for deploying and hosting modern web projects, providing a global CDN, continuous deployment from GitHub, and serverless functions.

## Project Directory Structure

The following directory structure is to be strictly followed to ensure modularity, separation of concerns, and long-term maintainability.

```
cubatattoo-studio/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.astro
│   │   │   └── Footer.astro
│   │   └── layout/
│   │       ├── Header.astro
│   │       └── Navbar.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── artists/
│   │   │   ├── index.astro
│   │   │   └── [artist].astro
│   │   ├── portfolio.astro
│   │   ├── studio.astro
│   │   └── contact.astro
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── package.json
├── astro.config.mjs
└── tsconfig.json
```

## Routing

Astro uses a file-based routing system. Each `.astro` file in the `src/pages` directory becomes a page on the website.

-   **Static Routes**: A file at `src/pages/about.astro` will be available at `/about`.
-   **Dynamic Routes**: A file at `src/pages/artists/[artist].astro` will generate a page for each artist. The `getStaticPaths` function is used to define the paths that will be pre-rendered at build time.

This approach simplifies the routing logic and keeps it co-located with the page content.

## Design System

### Color Palette

The color palette is selected to evoke sophistication and boldness.

-   **Primary (Background)**: `Almost Black (#111111)` - Provides a dramatic backdrop that makes images and text stand out.
-   **Primary (Text)**: `White (#FFFFFF)` - Ensures maximum readability on the dark background.
-   **Accent**: `Bold Red (#B91C1C)` - Reserved for calls-to-action (CTAs), important links, and highlighted elements.
-   **Secondary**: `Gray (#A1A1AA)` - Used for less prominent text, subtle borders, and metadata.

### Typography

The typography choice is fundamental to communicating the brand's duality: strength and clarity.

-   **Headings**: A bold, slightly condensed sans-serif font (e.g., **Anton** or **Oswald**). This typeface conveys strength and confidence. A **slab serif** font could also be a strong alternative to better match the logo's "Americana" aesthetic.
-   **Body Text**: A clean, highly readable sans-serif font (e.g., **Inter** or **Roboto**). Clarity is paramount for functional information like artist bios, policies, and FAQs.
