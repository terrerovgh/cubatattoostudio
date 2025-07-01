import { createSignal } from 'solid-js';

export default function CitasForm() {
  const [formData, setFormData] = createSignal({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de envío del formulario, ej:
    // fetch('/api/citas', { method: 'POST', body: JSON.stringify(formData()) })
    //   .then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch(error => console.error('Error:', error));
    console.log('Form submitted:', formData());
    // Resetear formulario o mostrar mensaje de éxito/error
    // setFormData({ name: '', email: '', message: '' }); // Opcional: resetear
  };

  return (
    <div>
      <h3 class="text-3xl font-bold text-white mb-8">Envíanos un Mensaje</h3>
      <form onSubmit={handleSubmit}>
        <div class="space-y-4">
          <div>
            <label for="name" class="sr-only">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Nombre"
              class="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-amber-400 focus:border-amber-400"
              value={formData().name}
              onInput={handleInputChange}
              required
            />
          </div>
          <div>
            <label for="email" class="sr-only">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Correo Electrónico"
              class="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-amber-400 focus:border-amber-400"
              value={formData().email}
              onInput={handleInputChange}
              required
            />
          </div>
          <div>
            <label for="message" class="sr-only">Mensaje</label>
            <textarea
              name="message"
              id="message"
              placeholder="Mensaje"
              class="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-amber-400 focus:border-amber-400"
              rows="5"
              value={formData().message}
              onInput={handleInputChange}
              required
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          class="mt-6 px-6 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
