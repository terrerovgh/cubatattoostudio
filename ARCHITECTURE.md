# Architecture Documentation

## Overview

Cuba Tattoo Studio is a modern, high-performance web application built with **Astro 5**, **React 19**, and **TailwindCSS 4**. It leverages **Supabase** for backend services including database, authentication, and storage.

## Tech Stack

### Frontend
- **Framework**: [Astro](https://astro.build) (v5.16) - Chosen for its "Islands Architecture" which provides excellent performance by shipping zero JavaScript by default for static content.
- **UI Library**: [React](https://react.dev) (v19.2) - Used for interactive components, particularly the Admin Dashboard and complex UI elements like the Dome Gallery.
- **Styling**: [TailwindCSS](https://tailwindcss.com) (v4.1) - Utility-first CSS framework for rapid and consistent styling.
- **Component Library**: [Shadcn UI](https://ui.shadcn.com) - Reusable components built on Radix UI primitives.
- **Icons**: [Lucide React](https://lucide.dev) - Consistent icon set.

### Backend (Supabase)
- **Database**: PostgreSQL - Relational database for structured data (artists, works, services).
- **Authentication**: Supabase Auth - Handles user management, login (Email/Password, OAuth), and session management.
- **Storage**: Supabase Storage - Stores images (artist avatars, tattoo portfolio, site assets).
- **Security**: Row Level Security (RLS) - Enforces data access policies directly at the database level.

### State Management
- **Zustand**: Lightweight state management for complex client-side state (e.g., Visual Editor).
- **React Context**: Used for Authentication state (`AuthProvider`).

## Project Structure

The project follows a standard Astro project structure with some custom organization for the hybrid React/Astro approach.

```
/
├── public/                     # Static assets (images, fonts, etc.)
├── src/
│   ├── components/            # UI Components
│   │   ├── admin/            # React components for the Admin Dashboard
│   │   ├── auth/             # Authentication components (Login, ProtectedRoute)
│   │   ├── ui/               # Shared UI components (Buttons, Inputs, etc.)
│   │   └── *.astro/*.tsx     # Feature-specific components (Hero, Gallery, etc.)
│   ├── layouts/              # Page layouts (Layout.astro, DashboardLayout.tsx)
│   ├── lib/                  # Utilities, helpers, and Supabase client
│   ├── pages/                # File-based routing
│   │   ├── admin/            # Admin dashboard routes
│   │   ├── api/              # API endpoints (if any)
│   │   └── index.astro       # Main landing page
│   ├── styles/               # Global styles
│   └── types/                # TypeScript definitions
├── supabase/                  # Database configuration
│   ├── migrations/           # SQL migrations
│   └── schema.sql            # Current schema definition
└── ...config files           # Astro, Tailwind, TypeScript configs
```

## Key Architectural Decisions

### Astro Islands
We use Astro files (`.astro`) for the main site layout and static sections to ensure fast initial load times. React components (`.tsx`) are "hydrated" only when necessary using client directives (e.g., `client:load`, `client:visible`).

- **Static Sections**: Navbar, Footer, basic content sections.
- **Interactive Islands**: Dome Gallery, Booking Form, Admin Dashboard.

### Supabase Integration
The application interacts with Supabase primarily through the client-side library `@supabase/supabase-js`.
- **Data Fetching**: Done directly in components or via helper functions in `src/lib/supabase-helpers.ts`.
- **Real-time**: The app is set up to potentially use Supabase Realtime for live updates, though currently primarily uses standard fetch.

### Admin Dashboard
The Admin Dashboard is a Single Page Application (SPA) embedded within the Astro site under the `/admin` route. It is fully client-side rendered using React to provide a rich, app-like experience for content management.

## Data Flow

1.  **Public View**:
    - Astro pages fetch initial data at build time or request time (SSR).
    - Client-side components fetch additional data (e.g., gallery pagination) directly from Supabase.
2.  **Admin View**:
    - Authenticated users access the dashboard.
    - React components fetch data securely using the user's session token.
    - Mutations (Create, Update, Delete) are sent to Supabase, which enforces RLS policies.
