/// <reference types="astro/client" />

interface Env {
  // Storage
  R2_BUCKET: R2Bucket;
  DB: D1Database;
  ASSETS: Fetcher;

  // Auth & Sessions
  AUTH_SESSIONS: KVNamespace;
  RATE_LIMITER: KVNamespace;
  ADMIN_PASSWORD: string;
  UPLOAD_SECRET: string;

  // Payments
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Chat
  CHAT_ROOM: DurableObjectNamespace;

  // AI
  AI: Ai;

  // Config
  SITE_URL: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    session?: import('./types/auth').SessionData | null;
  }
}
