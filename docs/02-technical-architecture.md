# Technical Architecture

This document outlines the technical specifications, project structure, and design system for the Cubatattoo Studio website.

## Core Technology Stack

The technology stack is selected to ensure performance, scalability, and a seamless integration with the specified tools and libraries. As the project is deployed on **Cloudflare Pages**, the stack is streamlined for a static and server-side rendering (SSR) environment.

-   **Framework**: **React with Next.js**. Chosen for its Server-Side Rendering (SSR) and Static Site Generation (SSG) capabilities, which are crucial for superior Search Engine Optimization (SEO) and fast load times.
-   **Language**: **TypeScript**. Used to ensure type safety throughout the application, which is essential for building a scalable and maintainable codebase.
-   **Styling**: **Tailwind CSS**. A utility-first CSS framework adopted for rapid and consistent UI development directly within the JSX code.
-   **Deployment**: **Cloudflare Pages**. A platform for deploying and hosting modern web projects, providing a global CDN, continuous deployment from GitHub, and serverless functions.

## Project Directory Structure

The following directory structure is to be strictly followed to ensure modularity, separation of concerns, and long-term maintainability.

```
cubatattoo-studio/
├── public/
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── app/              # Next.js 13+ App Router
│   │   ├── (pages)/
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── artists/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [artistId]/page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── studio/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── common/             # Reusable components (e.g., Button, Footer)
│   │   ├── layout/             # Layout components (e.g., Navbar, Wrapper)
│   │   └── react-bits/         # CRITICAL: For components copied from reactbits.dev
│   ├── lib/                  # Helper functions, constants
│   └── styles/
│       └── globals.css
├── package.json
└── tsconfig.json
```

## Design System

### Color Palette

The color palette is selected to evoke sophistication and boldness.

-   **Primary (Background)**: `Almost Black (#111111)` - Provides a dramatic backdrop that makes images and text stand out.
-   **Primary (Text)**: `White (#FFFFFF)` - Ensures maximum readability on the dark background.
-   **Accent**: `Bold Red (#B91C1C)` - Reserved for calls-to-action (CTAs), important links, and highlighted elements.
-   **Secondary**: `Gray (#A1A1AA)` - Used for less prominent text, subtle borders, and metadata.

### Typography

The typography choice is fundamental to communicating the brand's duality: strength and clarity.

-   **Headings**: A bold, slightly condensed sans-serif font (e.g., **Anton** or **Oswald**). This typeface conveys strength and confidence.
-   **Body Text**: A clean, highly readable sans-serif font (e.g., **Inter** or **Roboto**). Clarity is paramount for functional information like artist bios, policies, and FAQs.
