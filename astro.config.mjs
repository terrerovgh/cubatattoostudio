// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), compression()],
    build: {
      rollupOptions: {
        plugins: [visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true, brotliSize: true })],
      },
    },
  },

  integrations: [react()],
  adapter: cloudflare(),
  output: 'server'
});
