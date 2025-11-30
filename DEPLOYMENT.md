# Deployment Guide

This project is optimized for deployment on **Cloudflare Pages**, but can be deployed to any host that supports Astro (Vercel, Netlify, etc.).

## Cloudflare Pages

### 1. Connect Repository
1.  Log in to the Cloudflare Dashboard.
2.  Go to **Pages** > **Create a project** > **Connect to Git**.
3.  Select the `cubatattoostudio` repository.

### 2. Build Configuration
Configure the build settings as follows:
- **Framework Preset**: Astro
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Environment Variables
Add the following environment variables in the Cloudflare Pages dashboard (Settings > Environment variables):
- `PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

### 4. Deploy
Click **Save and Deploy**. Cloudflare will build and deploy the site.

## Manual Build

To build the project locally for testing:

```bash
npm run build
```

To preview the build:

```bash
npm run preview
```

## Troubleshooting

- **Supabase Connection**: Ensure environment variables are correctly set in the deployment platform.
- **Node Version**: Ensure the build environment uses Node.js 18+.
