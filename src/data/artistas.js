// src/data/artistas.js
export const artistas = [
  {
    id: "david-rodriguez", // Usar un slug como ID es bueno para las URLs
    slug: "david-rodriguez",
    nombre: "David Rodriguez",
    especialidad: "Realismo y Black & Grey",
    bio: "David es un maestro del realismo, con más de 10 años de experiencia transformando ideas en arte sobre la piel.",
    imagenPerfil: "/assets/images/placeholder-artista-david.jpg", // Ejemplo
    portfolio: [
      "/assets/images/placeholder-david-trabajo1.jpg",
      "/assets/images/placeholder-david-trabajo2.jpg",
    ]
  },
  {
    id: "karla-mendez",
    slug: "karla-mendez",
    nombre: "Karla Mendez",
    especialidad: "Geométrico y Dotwork",
    bio: "Karla encuentra la belleza en la precisión, creando diseños geométricos intrincados y detallados trabajos de puntillismo.",
    imagenPerfil: "/assets/images/placeholder-artista-karla.jpg",
    portfolio: [
      "/assets/images/placeholder-karla-trabajo1.jpg",
      "/assets/images/placeholder-karla-trabajo2.jpg",
    ]
  },
  {
    id: "nina-campos",
    slug: "nina-campos",
    nombre: "Nina Campos",
    especialidad: "Acuarela y Color",
    bio: "Nina es conocida por sus vibrantes tatuajes estilo acuarela, aportando un toque único y colorido a cada pieza.",
    imagenPerfil: "/assets/images/placeholder-artista-nina.jpg",
    portfolio: [
      "/assets/images/placeholder-nina-trabajo1.jpg",
      "/assets/images/placeholder-nina-trabajo2.jpg",
    ]
  }
];

// Función de ejemplo para obtener artista por slug (para [slug].astro)
export function getArtistaBySlug(slug) {
  return artistas.find(artista => artista.slug === slug);
}

export default artistas;
