// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // Importar la integración oficial de Tailwind
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), // Añadir la integración de Tailwind
    solid()     // Mantener la integración de SolidJS
  ],
  i18n: { // Mantener la configuración i18n existente
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: { // Se puede mantener la configuración de Vite si es necesaria para otras cosas
    server: {
      cors: true
    }
    // plugins: [tailwindcss(), solid()] // Tailwind y Solid ahora se manejan a través de `integrations`
  }
});