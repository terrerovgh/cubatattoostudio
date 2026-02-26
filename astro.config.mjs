// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: [],
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            'three': ['three'],
            'gsap': ['gsap'],
            'vendor-react': ['react', 'react-dom'],
            'vendor-stores': ['nanostores', '@nanostores/react'],
          },
        },
      },
    },
    // Exclude test files from the Astro/Vite build
    server: {
      fs: { strict: false },
    },
  },
});
