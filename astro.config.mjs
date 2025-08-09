// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://cubatattoostudio.com',
  integrations: [
    sitemap({
      customPages: [
        'https://cubatattoostudio.com/api/info',
        'https://cubatattoostudio.com/ai-meta.json'
      ],
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US'
        }
      }
    }),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        caseSensitive: true,
        removeComments: true
      },
      Image: {
        quality: 85,
        format: 'webp'
      },
      JavaScript: true,
      SVG: true
    })
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap']
          }
        }
      }
    }
  }
});