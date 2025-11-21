# Guía de Contribución

¡Gracias por tu interés en contribuir a Cuba Tattoo Studio! Esta guía te ayudará a comenzar.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Convenciones de Commits](#convenciones-de-commits)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)

## Código de Conducta

Este proyecto sigue un Código de Conducta para crear un ambiente acogedor y inclusivo. Todos los contribuyentes deben:

- ✅ Ser respetuosos con los demás
- ✅ Aceptar críticas constructivas
- ✅ Centrarse en lo que es mejor para la comunidad
- ✅ Mostrar empatía hacia otros miembros
- ❌ No usar lenguaje o imágenes sexualizadas
- ❌ No hacer ataques personales o políticos
- ❌ No acosar pública o privadamente
- ❌ No publicar información privada sin permiso

## Cómo Contribuir

### Tipos de Contribuciones

Aceptamos varios tipos de contribuciones:

1. **Bug Fixes**: Correcciones de errores
2. **Features**: Nuevas funcionalidades
3. **Documentación**: Mejoras o correcciones a la documentation
4. **Optimizaciones**: Mejoras de performance
5. **Diseño**: Mejoras visuales o de UX
6. **Contenido**: Actualización de textos, imágenes, etc.

### Primeros Pasos

1. **Fork el repositorio**
2. **Clone tu fork**:
   ```bash
   git clone https://github.com/TU-USERNAME/cubatattoostudio.git
   cd cubatattoostudio
   ```
3. **Añade el remote upstream**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/cubatattoostudio.git
   ```
4. **Instala dependencias**:
   ```bash
   npm install
   ```
5. **Crea una branch**:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

## Proceso de Desarrollo

### Workflow Recomendado

1. **Sincroniza tu fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Crea feature branch**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # o
   git checkout -b fix/corregir-bug
   ```

3. **Haz tus cambios**:
   - Escribe código siguiendo los estándares
   - Añade comentarios donde sea necesario
   - Asegúrate de que funcione localmente

4. **Prueba localmente**:
   ```bash
   npm run dev      # Desarrollo
   npm run build    # Build
   npm run preview  # Preview del build
   ```

5. **Commit tus cambios**:
   ```bash
   git add .
   git commit -m "feat: añadir nueva funcionalidad"
   ```

6. **Push a tu fork**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

7. **Abre Pull Request** en GitHub

### Ramas (Branches)

- `main`: Código en producción
- `develop`: Desarrollo activo (si existe)
- `feature/*`: Nuevas funcionalidades
- `fix/*`: Corrección de bugs
- `docs/*`: Cambios de documentación
- `refactor/*`: Refactorización de código
- `style/*`: Cambios de estilos/diseño

## Estándares de Código

### Estilo General

- **Indentación**: 4 espacios (no tabs)
- **Comillas**: Dobles para HTML/Astro, simples para JS/TS
- **Punto y coma**: Opcional en JS, pero consistente
- **Trailing commas**: Sí, en objetos y arrays multilinea

### Astro Components

```astro
---
// 1. Imports organizados por tipo
import Layout from "../layouts/Layout.astro";
import { Icon } from "lucide-react";

// 2. Props interface (TypeScript)
interface Props {
    title: string;
    description?: string;
}

// 3. Extraer props
const { title, description = "Default" } = Astro.props;

// 4. Lógica del componente
const formattedTitle = title.toUpperCase();
---

<!-- 5. Template limpio y semántico -->
<section class="py-20 md:py-32">
    <h1>{formattedTitle}</h1>
    {description && <p>{description}</p>}
</section>

<!-- 6. Styles scoped (solo si es necesario) -->
<style>
    /* Preferir Tailwind, pero si necesitas: */
    section {
        /* custom styles */
    }
</style>
```

### TailwindCSS

**Orden de clases** (recomendado):
```astro
<div class="
    flex items-center justify-center    /* Layout */
    w-full h-screen px-6 py-32          /* Sizing */
    text-xl font-medium                 /* Typography */
    bg-black text-white border-t        /* Visual */
    opacity-90 shadow-xl                /* Effects */
    transition-all duration-300         /* Animations */
">
```

**Evitar**:
- Estilos inline (`style=""`) - usar Tailwind
- Clases custom excesivas - preferir utilities
- `!important` - estructurar mejor las clases

### TypeScript

```typescript
// Interfaces para props
interface ComponentProps {
    title: string;
    count?: number;
    items: string[];
}

// Type para objetos
type User = {
    name: string;
    email: string;
    role: 'admin' | 'user';
};

// Evitar any
const data: unknown = fetchData();
if (isValidData(data)) {
    // Type narrowing
}
```

### Naming Conventions

- **Componentes**: `PascalCase.astro` (Hero.astro)
- **Variables**: `camelCase` (myVariable)
- **Constantes**: `UPPER_SNAKE_CASE` (API_KEY)
- **CSS Classes**: `kebab-case` (reveal-hidden)
- **IDs HTML**: `kebab-case` (hero-section)

## Proceso de Pull Request

### Antes de Abrir PR

- [ ] Código sigue los estándares del proyecto
- [ ] Funciona localmente sin errores
- [ ] Build de producción exitoso (`npm run build`)
- [ ] Cambios probados en múltiples navegadores
- [ ] Responsive design verificado
- [ ] No hay console.errors o warnings
- [ ] Documentación actualizada (si aplica)

### Template de PR

```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
[Describe las pruebas realizadas]

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado un self-review
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] Build exitoso localmente

## Screenshots (si aplica)
[Añadir screenshots de cambios visuales]

## Issues relacionados
Closes #123
```

### Revisión de Código

Los mantainers revisarán tu PR y pueden:
- Aprobar y mergear
- Solicitar cambios
- Añadir comentarios o sugerencias
- Cerrar si no cumple estándares

**Tiempo de respuesta**: ~1-3 días laborables

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios de documentación
- `style`: Cambios de formato/estilos
- `refactor`: Refactorización de código
- `perf`: Mejoras de performance
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
# Feature
git commit -m "feat(artists): añadir nuevo artista a la galería"

# Bug fix
git commit -m "fix(navbar): corregir menú móvil que no cierra"

# Documentation
git commit -m "docs(readme): actualizar instrucciones de instalación"

# Style
git commit -m "style(hero): ajustar spacing en hero section"

# Refactor
git commit -m "refactor(gallery): simplificar lógica de masonry grid"

# Performance
git commit -m "perf(images): optimizar imágenes a webp"
```

### Breaking Changes

```bash
git commit -m "feat(api): cambiar estructura de datos

BREAKING CHANGE: el formato de respuesta cambió de X a Y"
```

## Reportar Bugs

### Antes de Reportar

1. **Busca** si el bug ya fue reportado
2. **Verifica** que ocurre en la última versión
3. **Intenta reproducir** consistentemente

### Template de Bug Report

```markdown
**Descripción del Bug**
[Descripción clara y concisa]

**Para Reproducir**
Pasos:
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
[Qué debería pasar]

**Screenshots**
[Si aplica, añadir screenshots]

**Entorno**
- OS: [ej. macOS 14.0]
- Browser: [ej. Chrome 120]
- Versión: [ej. 1.0.0]

**Contexto Adicional**
[Cualquier otra información relevante]
```

### Severidad

- 🔴 **Critical**: El sitio no funciona
- 🟠 **High**: Funcionalidad importante rota
- 🟡 **Medium**: Funcionalidad menor rota
- 🟢 **Low**: Problema cosmético

## Solicitar Features

### Template de Feature Request

```markdown
**¿Tu feature request está relacionada a un problema?**
[ej. Siempre me frustra que...]

**Describe la solución que te gustaría**
[Descripción clara de lo que quieres que pase]

**Describe alternativas que has considerado**
[Otras soluciones o features]

**Contexto adicional**
[Screenshots, mockups, etc.]
```

### Criterio de Aceptación

Features serán evaluadas basadas en:
- Alineación con objetivos del proyecto
- Complejidad de implementación
- Impacto en performance
- Beneficio para usuarios
- Mantenibilidad

## Directrices Específicas

### Añadir Nuevo Componente

1. Crear en `src/components/NombreComponente.astro`
2. Seguir estructura estándar
3. Documentar props en comentarios
4. Añadir animaciones reveal si aplica
5. Asegurar responsive design
6. Actualizar COMPONENTS.md

### Modificar Estilos

1. Preferir Tailwind utilities
2. Si necesitas custom CSS, añadir a `global.css`
3. Mantener dark mode consistency
4. Probar en Chrome, Firefox, Safari
5. Verificar responsive (móvil, tablet, desktop)

### Añadir Imágenes

1. Optimizar antes de añadir (WebP recomendado)
2. Colocar en `/public/carpeta-apropiada/`
3. Usar nombres descriptivos kebab-case
4. Incluir alt text descriptivo
5. Verificar que carga correctamente

### Actualizar Documentación

1. Mantener formato Markdown consistente
2. Añadir tabla de contenidos si es largo
3. Usar ejemplos de código cuando sea útil
4. Mantener información actualizada
5. Verificar links internos funcionan

## Recursos

- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Markdown Guide](https://www.markdownguide.org/)

## Preguntas

Si tienes preguntas sobre cómo contribuir:
- Abre un issue con label `question`
- Contacta a los maintainers
- Consulta la documentación existente

---

¡Gracias por contribuir a Cuba Tattoo Studio! 🎨✨

**Última actualización**: 2025-11-21
