// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    server: {
      cors: true
    },
    plugins: [tailwindcss(), solid()]
  }
});
