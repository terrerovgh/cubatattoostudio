# Alcance
- Aumentar cobertura de pruebas (>90%) en `src/pages/api/users.ts`, módulo de autenticación y tablas de administración.
- Implementar flujo E2E completo (registro, login, logout, CRUD, navegación, permisos).
- Optimizar bundles: análisis de dependencias, code splitting, tree shaking y assets.
- Integrar todo en CI con reportes de cobertura y tiempos de ejecución aceptables.

## Preparación del entorno de testing
1. Vitest
- Activar cobertura con umbrales (`statements`, `branches`, `functions`, `lines` ≥90%).
- Añadir `setupFiles` para mocks de Supabase y utilidades DOM.
- Incorporar `@testing-library/react` y `@testing-library/user-event` para tests de componentes.
2. Playwright
- Configurar proyectos para `chromium` y `webkit`, trazas (`trace: on-first-retry`), screenshots y videos en fallos.
- Reutilizar servidor (`reuseExistingServer: true`) ya establecido.
3. Fixtures
- Reutilizar scripts `seed-*` para preparar datos de prueba (`scripts/seed-users.ts`, `seed-database.ts`, `seed-content.ts`).

## Pruebas del módulo de usuarios (`src/pages/api/users.ts`)
1. Unidad
- `decodeJwt` (`src/pages/api/users.ts:9-22`): entradas válidas/invalidas, tokens mal formados.
2. Integración (mock de `@supabase/supabase-js`)
- GET (`src/pages/api/users.ts:24-87`):
  - 401 sin `Bearer` o `sub`.
  - 403 cuando `profiles.role !== 'admin'` y no está en `adminEmails`.
  - 200 con mezcla de `auth.admin.listUsers()` y `profiles`.
  - Errores de `listUsers` y de `profiles` (400).
- POST (`src/pages/api/users.ts:89-234`):
  - `create`: 400 sin `email`/`password`; caso feliz con rollback si `profiles.insert` falla.
  - `update`: 400 sin `userId`; actualiza `display_name`/`role` y retorna fila.
  - `delete`: 400 sin `userId`; elimina en `auth` y en `profiles` (200).
  - Compatibilidad: `role` por defecto (`src/pages/api/users.ts:220-231`).
3. Validación de entrada
- Introducir esquema con `zod` para `action`, `userId`, `role`, `email`, `password`, `displayName` y retornar 400 en invalidaciones.
4. Autorización
- Tests que ejercitan la lógica de `adminEmails` y `profiles.role` (evitar regresiones).

## Pruebas del módulo de autenticación
1. `AuthProvider` (`src/components/auth/AuthProvider.tsx`)
- Estado inicial: `getSession` establece `session`/`user` y `loading` (`src/components/auth/AuthProvider.tsx:25-36`).
- Suscripción `onAuthStateChange` actualiza estado (`src/components/auth/AuthProvider.tsx:38-45`).
- `signInWithPassword`: rama de modo dev (mock) (`src/components/auth/AuthProvider.tsx:63-85`) y flujo real.
- `signInWithGoogle`, `signOut`, `signUp`, `resetPassword`: casos felices y errores.
2. Protección de rutas
- `ProtectedRoute`: redirección a `/login` sin sesión; render con `loading` y con sesión.
- `AdminGuard` (`src/components/admin/AdminGuard.tsx`):
  - Bypass en dev (`src/components/admin/AdminGuard.tsx:16-21`).
  - Bypass por `adminEmails` (`src/components/admin/AdminGuard.tsx:33-39`).
  - Acceso por `profiles.role === 'admin'` (`src/components/admin/AdminGuard.tsx:40-51`).

## Pruebas de tablas de administración
- `UsersTable.tsx`, `WorksTable.tsx`, `ArtistsTable.tsx`, `ServicesTable.tsx`:
  - Render básico y estados (`loading`, `error`, `success`).
  - Acciones: crear/editar/eliminar usuario (mock de `fetch` a `/api/users`).
  - Filtros/orden/paginación: añadir y probar utilidades (cliente) o consultas parametrizadas en Supabase.
  - Permisos: asegurar que las acciones envían `Bearer` con `access_token`.

## End-to-End (Playwright)
- Autenticación:
  - Registro (email/password), login, logout; cobertura de errores y éxito.
  - Modo dev de `AuthProvider` para flujos sin backend.
- CRUD básico:
  - Crear/editar/eliminar usuario en `/admin/users` y verificar tabla.
  - Operaciones en `works`, `artists`, `services` si aplica.
- Navegación:
  - Transiciones entre `dashboard`, `users`, `works`, `services`, `content`.
- Permisos:
  - Acceso denegado sin sesión y sin rol admin; acceso permitido con admin.
- Artefactos: trazas, screenshots y videos en errores.

## Optimización de bundles
1. Análisis
- Añadir visualizador de bundles (p.ej., `rollup-plugin-visualizer`) y generar reporte tras `astro build`.
2. Code splitting
- Asegurar carga diferida de vistas pesadas (gráficos `recharts`, editor, media library) mediante `dynamic import()` o islas de Astro.
3. Tree shaking
- Auditar importaciones de librerías (p.ej., `lucide-react`, `immer`, `recharts`) para uso modular.
4. Assets
- Optimizar imágenes y fuentes; revisar tamaños y formatos; activar compresión y cache control en producción.

## Integración continua (CI)
- Crear `.github/workflows/ci.yml` con jobs:
  - `lint`: `eslint` y `prettier --check`.
  - `test`: `vitest --coverage` con umbrales ≥90%.
  - `e2e`: instalar navegadores Playwright, levantar `astro dev` y correr `playwright test`.
  - `build`: `astro build` y publicación de artefactos (visualización de bundle y cobertura HTML).
- Cache de dependencias y de navegadores para acelerar.

## Documentación de casos de prueba
- Añadir `tests/README.md` con matriz de casos (CRUD, validaciones, errores, permisos, auth, E2E, tablas) y cómo correr localmente y en CI.

## Métricas y tiempos
- Umbral de cobertura configurado en Vitest; fallará el job si <90%.
- Minimizar tiempos con mocks de Supabase en unidad/integración y seeding único para E2E.

## Entregables
- Nuevos tests unitarios/integración/E2E con cobertura >90%.
- Config actualizada de Vitest y Playwright.
- Reporte de bundle y acciones de optimización aplicadas.
- Pipeline CI con artefactos de cobertura y bundle.

¿Confirmas este plan para proceder con la implementación?