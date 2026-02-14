/// <reference types="astro/client" />

interface Env {
  R2_BUCKET: R2Bucket;
  DB: D1Database;
  ASSETS: Fetcher;
  UPLOAD_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ADMIN_PASSWORD: string;
  SITE_URL: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
