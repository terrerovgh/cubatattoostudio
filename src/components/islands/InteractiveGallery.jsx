import { createSignal, For } from 'solid-js';
import { imagenesGaleria } from '../../data/galeria.js'; // Importar datos de galeria.js

// Definir las categorías de filtro basadas en los datos o predefinidas
const categoriasFiltro = [
  { key: 'all', nombre: 'Todos' },
  { key: 'traditional', nombre: 'Tradicional' }, // Asumiendo que 'traditional' es una categoría en tus datos
  { key: 'realistic', nombre: 'Realista' },
  { key: 'geometric', nombre: 'Geométrico' },
  { key: 'color', nombre: 'Color' },
  // Añade más categorías si es necesario, deben coincidir con `item.categoria` en galeria.js
];

export default function InteractiveGallery() {
  const [activeFilter, setActiveFilter] = createSignal('all');

  const filteredItems = () => {
    if (activeFilter() === 'all') {
      return imagenesGaleria;
    }
    return imagenesGaleria.filter(item => item.categoria.toLowerCase() === activeFilter());
  };

  return (
    <>
      {/* Filtros de Galería */}
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <For each={categoriasFiltro}>
          {(filtro) => (
            <button
              class={`gallery-filter px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${
                activeFilter() === filtro.key
                  ? 'bg-amber-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-amber-400 hover:text-black'
              }`}
              onClick={() => setActiveFilter(filtro.key)}
            >
              {filtro.nombre}
            </button>
          )}
        </For>
      </div>

      {/* Grid de Galería */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <For each={filteredItems()}>
          {(item) => (
            <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 group">
              <img
                src={item.url}
                alt={item.titulo || 'Imagen de galería'}
                class="w-full h-72 object-cover"
                loading="lazy"
              />
              <div class="p-4">
                <h3 class="text-xl font-semibold text-white mb-1 truncate group-hover:text-amber-400">{item.titulo}</h3>
                <p class="text-sm text-gray-400 capitalize">{item.categoria}</p>
              </div>
            </div>
          )}
        </For>
      </div>
      {filteredItems().length === 0 && (
        <p class="text-center text-gray-400 mt-8 text-lg">No hay imágenes disponibles para esta categoría.</p>
      )}
    </>
  );
}
