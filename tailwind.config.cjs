/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1a1a1a', // Ejemplo de ink-black
        'accent': { // Ejemplo de colores de acento
          DEFAULT: '#facc15', // amber-400 como ejemplo
          dark: '#eab308',  // amber-500 como ejemplo
        },
        // Definir más colores según el diseño del estudio
      },
      fontFamily: {
        // Definir fuentes personalizadas si se usan
        // sans: ['NombreFuenteSans', 'sans-serif'],
        // serif: ['NombreFuenteSerif', 'serif'],
      },
    },
  },
  plugins: [],
};
