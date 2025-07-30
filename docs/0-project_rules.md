---
layout: single
title: "Guía Rápida y Reglas del Proyecto"
permalink: /0-project_rules/
nav_order: 2
---

# Guía Rápida y Reglas del Proyecto

## Objetivo
Crear el sitio web insignia de Cubatattoo Studio, fusionando arte y funcionalidad para convertir visitantes en clientes.

## Reglas Clave
- Seguir la arquitectura y estructura de directorios prescrita.
- Usar Next.js, TypeScript y Tailwind CSS.
- Integrar componentes de reactbits.dev siguiendo el protocolo AIOp.
- Implementar por fases y presentar cambios para revisión.
- Mantener código limpio y bien documentado.

## Estructura de Directorios
```text
cubatattoo-studio/
├── public/
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── page.tsx
│   │   │   ├── artists/
│   │   │   │   ├── page.tsx
│   │   │   │   └──/page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── studio/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── react-bits/
│   ├── lib/
│   └── styles/
│       └── globals.css
├── package.json
└── tsconfig.json
```

## Paleta de Colores
- Fondo: #111111
- Texto: #FFFFFF
- Acento: #B91C1C
- Secundario: #A1A1AA

## Tipografía
- Encabezados: Anton, Oswald
- Cuerpo: Inter, Roboto

## Contexto Estratégico
El Blueprint de este proyecto se fundamenta en la visión de establecer a Cubatattoo Studio como un referente en la industria del tatuaje, destacando por su enfoque artístico y profesionalismo. El público objetivo abarca tanto a aficionados del arte corporal como a aquellos que buscan una experiencia única y personalizada en el proceso de tatuarse.

## Contexto Arquitectónico
La arquitectura del sitio web se concibe para ser una extensión virtual del estudio, donde cada sección y página refleje la estética y valores de Cubatattoo Studio. Se prestará especial atención a la presentación del portafolio de artistas, asegurando que cada obra y estilo tenga su debido protagonismo.

## Contexto Operativo
Operativamente, el proyecto se regirá por el protocolo AIOp para la integración de componentes de reactbits.dev, garantizando así una cohesión y funcionalidad óptimas. La gobernanza del proyecto estará a cargo del equipo directivo de Cubatattoo Studio, quienes tendrán la última palabra en las decisiones clave y aprobaciones.

## Instrucciones Operativas

### 1. Protocolo de Integración de Componentes (AIOp)
- Navegar a la URL del componente en reactbits.dev.
- Seleccionar las pestañas "TypeScript" y "Tailwind" en el visor de código.
- Verificar la sección "Install dependencies" y ejecutar `npm install [dependencia]` si es necesario.
- Copiar el código completo del componente.
- Crear el archivo en `/src/components/react-bits/` usando el nombre exacto del componente en PascalCase.
- Pegar el código y guardar.
- Importar el componente en la página o módulo correspondiente.

### 2. Implementación por Fases
- Construir una página o componente principal a la vez.
- Presentar los cambios para revisión y esperar aprobación antes de continuar.
- Mantener la calidad del código y la documentación.

### 3. Gobernanza y Mantenimiento
- El equipo directivo revisa y aprueba cada fase.
- Para actualizar componentes de reactbits.dev, repetir el protocolo AIOp y verificar si existen versiones nuevas.
- Documentar cada cambio relevante en el repositorio y en la documentación técnica.

### 4. Estrategia de Carga de Contexto
- Antes de iniciar el desarrollo, cargar el Blueprint completo en el contexto del agente o equipo.
- Usar el Blueprint como referencia principal para todas las decisiones técnicas y de diseño.

### 5. Ciclo de Trabajo Recomendado
1. Prompt: Solicitar la construcción de una característica específica.
2. Construcción: El agente implementa la tarea siguiendo el Blueprint.
3. Revisión: El usuario revisa los cambios y aprueba o solicita ajustes.
4. Documentación: Registrar la implementación y cualquier decisión relevante.

---

## Diagramas y Ejemplos

### Diagrama de Arquitectura del Proyecto

```text
cubatattoo-studio/
├── public/
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── artists/         # Artistas
│   │   │   ├── portfolio/       # Portafolio
│   │   │   ├── studio/          # Estudio
│   │   │   └── contact/         # Contacto
│   │   └── layout.tsx           # Layout global
│   ├── components/
│   │   ├── common/              # Botones, Footer, etc.
│   │   ├── layout/              # Navbar, Wrapper
│   │   └── react-bits/          # Componentes de reactbits.dev
│   ├── lib/                     # Utilidades
│   └── styles/
│       └── globals.css          # Estilos globales
├── package.json
└── tsconfig.json
```

### Diagrama de Flujo Operativo

```text
[Prompt Usuario]
      |
      v
[Agente IA]
      |
      v
[Construcción de Feature]
      |
      v
[Revisión y Aprobación]
      |
      v
[Documentación y Mantenimiento]
```

### Ejemplo de Integración de Componente

1. Accede a [Letter Glitch](https://reactbits.dev/animated-content/letter-glitch).
2. Selecciona "TypeScript" y "Tailwind".
3. Instala dependencias:
   ```bash
   npm install framer-motion
   ```
4. Copia el código y crea `/src/components/react-bits/LetterGlitch.tsx`.
5. Importa en la página:
   ```tsx
   import LetterGlitch from '@/components/react-bits/LetterGlitch';
   ```

---

## Ejemplos y Diagramas Adicionales

### Ejemplo de Estructura de Componente en /react-bits/

```tsx
// src/components/react-bits/SpotlightCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
  name: string;
  image: string;
  bio: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ name, image, bio }) => (
  <motion.div className="card">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>{bio}</p>
  </motion.div>
);

export default SpotlightCard;
```

### Diagrama de Interacción Frontend <-> Backend (API)

```text
[Componente React]
   |
   v
[fetch()/axios]
   |
   v
[API REST Next.js]
   |
   v
[Base de Datos]
```

### Ejemplo de Flujo de Datos en una Página

```text
[Props] ---> [Componente Principal] ---> [Estado Local] ---> [API] ---> [Renderizado]
```

### Diagrama de Dependencias entre Componentes

```text
[Layout]
  |-- [Navbar]
  |-- [Footer]
  |-- [Page Content]
         |-- [Hero]
         |-- [SpotlightCard]
         |-- [Masonry]
         |-- [Form]
```

### Ejemplo de Código: Formulario de Contacto

```tsx
// src/app/(pages)/contact/FormContact.tsx
import React, { useState } from 'react';

const FormContact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    artist: '',
    idea: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario a la API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Nombre" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Teléfono" onChange={handleChange} required />
      <select name="artist" onChange={handleChange} required>
        <option value="">Artista Preferido</option>
        {/* Opciones dinámicas */}
      </select>
      <textarea name="idea" placeholder="Describe tu idea" onChange={handleChange} required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default FormContact;
```

---
