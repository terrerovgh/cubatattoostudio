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
        enforce: 'post',
        renderChunk(code, chunk) {
          // Inject shim into the Astro React renderer chunk
          // This runs after bundling and ensures the polyfill is at the top of the chunk
          if (chunk.fileName.includes('_@astro-renderers')) {
            const polyfill = `
if (typeof globalThis.MessageChannel === 'undefined') {
  class MockMessagePort {
    constructor() {
      this.onmessage = null;
    }
    postMessage(data) {
      const other = this.other;
      if (other && other.onmessage) {
        setTimeout(() => other.onmessage({ data }), 0);
      }
    }
  }
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new MockMessagePort();
      this.port2 = new MockMessagePort();
      this.port1.other = this.port2;
      this.port2.other = this.port1;
    }
  };
  globalThis.MessagePort = MockMessagePort;
}
`;
            return polyfill + code;
          }
        }
      }
    ],
    ssr: {
      // external: ['node:worker_threads'], // Removed as we are using pure JS polyfill
    },
    build: {
      rollupOptions: {
        plugins: [visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true, brotliSize: true })],
      },
    },
  },
});
