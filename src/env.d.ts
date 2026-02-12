/// <reference types="astro/client" />

interface Env {
  R2_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  UPLOAD_SECRET: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
