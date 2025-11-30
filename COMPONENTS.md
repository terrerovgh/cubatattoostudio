# Components Documentation

This document provides an overview of the key components in the Cuba Tattoo Studio project.

## Core Components (`src/components/`)

These components form the main building blocks of the public-facing website.

### `Navbar.astro`
- **Type**: Astro Component
- **Description**: The main navigation bar. It is responsive and includes links to different sections of the page (Hero, Artists, Gallery, etc.).
- **Features**: Sticky positioning, mobile menu toggle.

### `Hero.astro` & `HeroSection.tsx`
- **Type**: Astro & React Component
- **Description**: The landing section of the homepage.
- **Features**: 
    - Parallax background effect.
    - Animated logo and text.
    - Call-to-action buttons.

### `Services.astro` & `ServicesSection.tsx`
- **Type**: Astro & React Component
- **Description**: Displays the tattoo styles/disciplines offered by the studio.
- **Features**: 
    - Fetches service data from Supabase.
    - Grid layout with icons and descriptions.

### `Artists.astro` & `ArtistsSection.tsx`
- **Type**: Astro & React Component
- **Description**: Showcases the studio's artists.
- **Features**: 
    - Fetches artist profiles from Supabase.
    - Displays avatars, names, and specialties.
    - Links to individual artist portfolios.

### `Gallery.astro` & `GallerySection.tsx`
- **Type**: Astro & React Component
- **Description**: A masonry-style gallery of tattoo works.
- **Features**: 
    - Fetches images from Supabase Storage/Database.
    - Filtering by style or artist.
    - Lightbox or modal view for details.

### `DomeGallery.tsx`
- **Type**: React Component
- **Description**: A 3D interactive gallery experience.
- **Features**: 
    - Uses 3D transforms for a "dome" or spherical layout.
    - Interactive rotation and zooming.

### `Booking.astro` & `BookingSection.tsx`
- **Type**: Astro & React Component
- **Description**: The contact and booking form.
- **Features**: 
    - Form validation.
    - Google Maps integration for location.
    - Submission handling (integrates with backend/email service).

### `Footer.astro`
- **Type**: Astro Component
- **Description**: The site footer.
- **Features**: Social media links, contact info, copyright.

## Admin Dashboard Components (`src/components/admin/`)

These components are part of the protected admin interface.

### `DashboardPage.tsx`
- **Description**: The main layout/container for the dashboard views.

### `Sidebar.tsx`
- **Description**: Navigation sidebar for the admin area.
- **Features**: Links to different management sections (Artists, Works, Services, etc.), logout button.

### `DashboardStats.tsx`
- **Description**: Displays high-level metrics (total artists, works, views).

### `ActivityChart.tsx` & `DistributionChart.tsx`
- **Description**: Visualizations for data analytics using Recharts.

### `AdminGuard.tsx`
- **Description**: A wrapper component that checks for admin privileges before rendering children. Redirects unauthorized users.

## Authentication Components (`src/components/auth/`)

### `AuthProvider.tsx`
- **Description**: A React Context Provider that manages the global authentication state (user, session, loading status).
- **Usage**: Wraps the root of the React tree (or specific sections) to provide auth context.

### `Login.tsx`
- **Description**: The login form component.
- **Features**: Email/Password login, Google OAuth login.

### `ProtectedRoute.tsx`
- **Description**: A Higher-Order Component (or wrapper) that enforces authentication requirements for routes.

## UI Components (`src/components/ui/`)

Shared, reusable UI primitives based on Shadcn UI.
- `Button`, `Input`, `Label`, `Card`, `Dialog`, etc.
