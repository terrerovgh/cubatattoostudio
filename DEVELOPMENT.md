# Development Guide

This guide covers how to set up the development environment and work on the Cuba Tattoo Studio project.

## Prerequisites

- **Node.js**: Version 18 or higher (LTS recommended).
- **Package Manager**: `npm` or `pnpm`.
- **Git**: For version control.
- **VS Code**: Recommended editor with extensions:
    - ESLint
    - Prettier
    - Astro
    - Tailwind CSS

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd cubatattoostudio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory based on `.env.example`. You will need Supabase credentials.
    ```env
    PUBLIC_SUPABASE_URL=your_supabase_url
    PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:4321`.

## Project Structure

- `src/pages`: Astro pages and API routes.
- `src/components`: React and Astro components.
- `src/lib`: Utility functions and Supabase client.
- `src/styles`: Global CSS and Tailwind configuration.

## Common Tasks

### Adding a New Component
1.  Create the component in `src/components`.
2.  Use `.astro` for static/layout components.
3.  Use `.tsx` for interactive components.
4.  Export it and import it where needed.

### Database Changes
1.  Modify `supabase/schema.sql` to reflect the desired schema.
2.  Create a migration file in `supabase/migrations` if using Supabase CLI.
3.  Apply changes to your local or remote Supabase instance.

### Running Tests
- Unit Tests: `npm run test`
- E2E Tests: `npm run test:e2e`

## Code Style
- The project uses **Prettier** for formatting and **ESLint** for linting.
- Run `npm run lint` to check for issues.
- Run `npm run format` to fix formatting.
