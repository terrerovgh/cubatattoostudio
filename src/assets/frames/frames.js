// Lista de frames para la animación de scroll de la máquina de tatuar
// Inspirado en el proyecto moto-scroll de midudev

const FRAMES = [
  './assets/frames/tattoo-machine-000.svg',
  './assets/frames/tattoo-machine-007.svg',
  './assets/frames/tattoo-machine-015.svg',
  './assets/frames/tattoo-machine-022.svg',
  './assets/frames/tattoo-machine-029.svg'
];

// Número máximo de frames
const MAX_FRAMES = FRAMES.length;

// Exportar para uso en main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FRAMES, MAX_FRAMES };
} else {
  window.TATTOO_FRAMES = FRAMES;
  window.MAX_TATTOO_FRAMES = MAX_FRAMES;
}