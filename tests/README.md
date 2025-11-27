# Pruebas

## Matriz de casos
- API usuarios (`src/pages/api/users.ts`):
  - GET: 401 sin token, 403 sin rol admin, 200 mezcla `auth.admin.listUsers` + `profiles`, 400 en errores.
  - POST: `create` (400 sin email/password, rollback en fallo perfil), `update` (400 sin `userId`, actualiza `display_name`/`role`), `delete` (200 con `userId`), actualización de `role` por compatibilidad.
- Autenticación:
  - `AuthProvider`: estado inicial desde `getSession`, suscripción `onAuthStateChange`, `signInWithPassword` rama dev, `signOut`.
  - `ProtectedRoute`: redirección a `/login` sin sesión.
  - `AdminGuard`: bypass dev y por `adminEmails`, verificación `profiles.role`.
- Tablas admin:
  - `UsersTable`: render, filtro, orden, paginación, cambio de rol, modales CRUD con mocks `fetch`.
  - Utilidades: `filterRows`, `sortRows`, `paginateRows`.
- E2E (Playwright):
  - Autenticación:
    - Login con email/contraseña exitoso redirige al dashboard.
    - Protección de rutas: acceso no autorizado a `/admin/users` redirige a login.
  - Admin usuarios:
    - Filtrado por texto (nombre, email).
    - Ordenamiento por columna (nombre, email, rol, fecha).
    - Paginación (tamaño de página, navegación).
    - Cambio de rol (user <-> admin) actualiza la UI.
  - API Mocking: interceptación de endpoints Supabase (`auth/v1/*`, `rest/v1/*`) para aislamiento total.

## Cómo ejecutar
- Unit/integración: `npm run test`
- Cobertura: `npm run test:coverage` (reporte en `coverage/index.html`)
- E2E: `npm run test:e2e` (reporte en `playwright-report/index.html`)

## Artefactos
- Cobertura HTML en `coverage/index.html`
- Estadísticas de bundle en `dist/stats.html`
