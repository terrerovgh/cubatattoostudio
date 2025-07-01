import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Configuraciones globales de GSAP (opcional, pero recomendado por el plan)
  gsap.defaults({
    force3D: true, // Promueve el uso de aceleración por hardware
    // ease: "power1.out", // Podrías definir un ease por defecto si quieres
  });

  // Podrías exportar gsap y ScrollTrigger si quieres importarlos desde aquí
  // en lugar de directamente desde 'gsap' en otros módulos cliente.
  // export { gsap, ScrollTrigger };
}

// Este archivo se puede importar en el layout principal o en componentes específicos
// que necesiten GSAP para asegurar que ScrollTrigger esté registrado.
// Por ejemplo, en Layout.astro: <script type="module" src="../scripts/animations.js"></script>
// O importarlo en un script de un componente Astro: import '../scripts/animations.js';
// Si se usa en muchos sitios, importarlo una vez en el layout es buena idea.

console.log("GSAP and ScrollTrigger registered globally.");
