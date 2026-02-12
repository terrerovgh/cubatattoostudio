#!/usr/bin/env node

/**
 * Migrate existing gallery images from public/gallery/ to Cloudflare R2.
 *
 * Usage:
 *   npm run migrate-r2
 *
 * Requires wrangler CLI to be authenticated (run `wrangler login` first).
 * Uploads each image using `wrangler r2 object put`.
 */

import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_GALLERY = resolve(__dirname, '../public/gallery');
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'cubatattoostudio';

const ARTISTS = ['studio', 'david', 'nina', 'karli'];

async function main() {
  console.log('Starting R2 migration...');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Source: ${PUBLIC_GALLERY}\n`);

  let uploaded = 0;
  let skipped = 0;

  for (const artist of ARTISTS) {
    const artistDir = join(PUBLIC_GALLERY, artist);
    if (!existsSync(artistDir)) {
      console.log(`  Skipping ${artist}/ (directory not found)`);
      skipped++;
      continue;
    }

    const files = readdirSync(artistDir).filter((f) =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(f),
    );

    for (const file of files) {
      const filePath = join(artistDir, file);
      const r2Key = `gallery/${artist}/${file}`;

      console.log(`  Uploading ${r2Key}...`);
      try {
        execSync(
          `npx wrangler r2 object put "${BUCKET_NAME}/${r2Key}" --file "${filePath}" --content-type "image/jpeg"`,
          { stdio: 'pipe' },
        );
        uploaded++;
        console.log(`    Done.`);
      } catch (err) {
        console.error(`    Failed: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  console.log(`\nMigration complete: ${uploaded} uploaded, ${skipped} skipped.`);
}

main().catch(console.error);
