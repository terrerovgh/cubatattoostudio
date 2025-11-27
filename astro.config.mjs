// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: cloudflare(),
  output: 'server',
  vite: {
    plugins: [
      tailwindcss(),
      compression(),
      {
        name: 'inject-shim',
        enforce: 'pre',
        transform(code, id) {
          // Inject shim into the Astro React renderer
          // This ensures it runs before React is used
          if (id.includes('@astrojs/react') && id.includes('server.js')) {
            return `import { MessageChannel, MessagePort } from 'node:worker_threads';
if (!globalThis.MessageChannel) {
  globalThis.MessageChannel = MessageChannel;
  globalThis.MessagePort = MessagePort;
}
${code}`;
          }
        }
      }
    ],
    ssr: {
      external: ['node:worker_threads'],
    },
    build: {
      rollupOptions: {
        plugins: [visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true, brotliSize: true })],
      },
    },
  },
});
