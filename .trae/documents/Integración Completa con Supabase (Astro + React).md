## Estado Actual
- Cliente de Supabase con modo mock y detección de credenciales en `src/lib/supabase.ts:4-20,58-70`.
- Helpers y CRUD básicos para contenido, artistas, works y storage en `src/lib/supabase-helpers.ts`.
- Dashboard de administración con formularios y tablas para artistas y works (por ejemplo `src/components/admin/artists/ArtistsTable.tsx`, `src/components/admin/works/WorkForm.tsx`).
- Autenticación base (login con email/Google) en `src/components/auth/*`; guardado solo por sesión (`AdminGuard.tsx`, `ProtectedRoute.tsx`).
- Esquema, RLS e índices iniciales en `supabase/schema.sql` y migraciones `supabase/migrations/*`.
- Scripts de seed para contenido y migración de archivos a DB (`scripts/seed-content.ts`, `scripts/seed-database.ts`).
- La web pública consume contenido estático con `astro:content` (p.ej. `src/components/Artists.astro`, `src/pages/artists/[...slug].astro`).

## Objetivo
Implementar integración completa y robusta con Supabase (conexión, auth, roles/permisos, CRUD de usuarios/artistas/works, búsqueda/filtrado, modelo de datos, seed, pruebas y documentación) accesible desde el dashboard y la web pública con políticas correctas.

## 1. Configuración de Conexión
- Variables en `.env`: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Endurecer manejo de errores en el cliente:
  - Lanzar error en producción si faltan credenciales (`src/lib/supabase.ts:54-56`) y mantener mock solo en dev.
  - Añadir logs y métricas para fallos de conexión inicial.
- SSR/CSR: usar el cliente desde Astro server (fetch en `.astro`) para web pública y desde React en dashboard.

## 2. Gestión de Usuarios y Autenticación
- Flujos:
  - Registro: `supabase.auth.signUp` con verificación de email.
  - Login: existente (`AuthProvider.tsx:51-90`).
  - Recuperación de contraseña: `supabase.auth.resetPasswordForEmail(email, { redirectTo })` y `supabase.auth.updateUser({ password })` tras el enlace.
- Roles y perfiles:
  - Crear tabla `profiles` (id uuid PK ref `auth.users`, `role` enum ['admin','artist','viewer'], `display_name`, `avatar_url`, timestamps).
  - Sincronizar artistas con usuarios: `artists.user_id` referencia a `profiles.id`.
  - Políticas basadas en perfiles (evitar dependencia de `auth.jwt()->>'role'`):
    - Admin: `EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')`.
    - Artista: join con `artists.user_id = auth.uid()`.
  - Componentes:
    - Añadir `AdminGuard` con validación de rol (lee perfil del usuario autenticado y redirige si no es admin).
    - Página/tabla de usuarios para gestión de perfiles por admin (CRUD: asignar rol, actualizar nombre/avatar).

## 3. Gestión de Artistas
- Modelo: ya creado (`artists`), añadir búsqueda/filtrado:
  - API helpers: `getArtists({ q, specialty, active })` con `ilike` y `eq`.
  - Índices: `CREATE INDEX idx_artists_slug ON artists(slug);` (si no existe) y mantener `display_order`.
- Dashboard:
  - Añadir inputs de búsqueda y filtros por `specialty` y `is_active` en `ArtistsTable.tsx`.
  - Validaciones/errores ya cubiertos (mejorar mensajes).
- Web pública:
  - Cambiar `src/components/Artists.astro` para leer desde Supabase (`artists` activos ordenados) en lugar de `astro:content`.

## 4. Gestión de Trabajos (Works)
- Modelo: `works` extendido; relación many-to-many con `work_artists` (existe en migraciones).
- CRUD completo:
  - Formulario de works soporta multi-artista vía `work_artists` (UI: añadir/eliminar colaboradores, roles `primary/collaboration/guest`).
  - Helpers: `saveWorkWithArtists(work, artistIds)` en `supabase-helpers.ts:157-168` → extender para upsert en `work_artists`.
- Búsqueda/filtrado:
  - Por `tags` (`GIN`), `service_id`, `artist_id`, `published`, `featured`.
  - Índices ya creados para `tags` y `published`; añadir en `created_at DESC`.
- Web pública:
  - Listados y detalle leen `published=true` y relaciones (artista/servicio) desde Supabase (reemplazar `getCollection` en páginas de works).

## 5. Servicios y Contenido del Sitio
- Servicios (`services`): CRUD desde dashboard, lectura pública de activos.
- Contenido (`site_content`): mantener helpers (`getSiteContent`, `updateSiteContent`) y consumir en páginas públicas (hero, gallery, services, booking, footer) en lugar de archivos locales.

## 6. Esquema de Base de Datos y RLS
- Tablas:
  - `profiles` (nueva), `artists`, `services`, `works`, `work_artists`, `site_content`, `site_config`, `animations`, `activity_log`.
- Relaciones:
  - `profiles.id` ↔ `auth.users.id`.
  - `artists.user_id` ↔ `profiles.id`; `work_artists(work_id, artist_id)`.
- RLS (producción):
  - Lectura pública: artistas activos, servicios activos, works publicados, site_content.
  - Artistas autenticados: gestionar su perfil y sus works.
  - Admin: gestionar todo via `EXISTS perfiles`.
- Índices:
  - `artists(is_active)`, `artists(slug)`, `works(published)`, `works(tags GIN)`, `works(created_at DESC)`, `services(slug)`, `work_artists(work_id)`, `work_artists(artist_id)`, `site_content(section)`.

## 7. Datos de Prueba
- Scripts:
  - `seed-content.ts`: ya inserta secciones; mantener.
  - `seed-database.ts`: migrar artistas/works desde contenido local; ampliar para servicios y relaciones `work_artists`.
  - Nuevo `seed-users`: crear usuario admin y perfilarlo (usa `SUPABASE_SERVICE_ROLE_KEY`):
    - Crear usuario vía Admin API.
    - Insertar `profiles` con `role='admin'`.
    - Opcional: enlazar un artista.
- Storage: subir imágenes a buckets (`avatars`, `works`, `site-assets`) y reemplazar URLs locales.

## 8. Pruebas
- Unitarias (Vitest):
  - Helpers de Supabase (`supabase-helpers.ts`) con cliente mock (ya hay patrón mock en `supabase.ts:15-53`).
  - Validaciones de formularios (`WorkForm.tsx` y similares) testeando lógica pura.
- Integración:
  - Pruebas contra un proyecto de Supabase de pruebas usando `SUPABASE_SERVICE_ROLE_KEY` (limpieza entre tests).
  - Flujos de auth: registro, login, reset password.
- E2E (opcional): Playwright para dashboard básico (crear/editar/eliminar artista y work).
- Scripts de ejecución: `npm test` y `npm run test:e2e` con documentación.

## 9. Documentación
- Ampliar `docs/supabase-integration.md` y `SUPABASE_SETUP.md` con:
  - Config de entorno dev/prod (CORS, URLs, keys).
  - Ejemplos de uso (fetch SSR en `.astro`, helpers React).
  - Guía de RLS y roles vía `profiles`.
  - Cómo ejecutar seeds y pruebas.

## 10. Accesibilidad desde Dashboard y Web Pública
- Dashboard:
  - Rutas admin protegidas por rol (no solo sesión): actualizar `AdminGuard` para validar `profiles.role`.
  - Vistas CRUD completas para usuarios (perfiles), artistas, works, servicios y contenido.
- Web pública:
  - Lecturas SSR desde Supabase con filtros de publicación/actividad.
  - Búsqueda/filtrado en páginas públicas (por tags/servicios/artistas).

## 11. Entregables
- SQL de `profiles` y políticas RLS (producción) consolidado en nueva migración.
- Helpers actualizados (`saveWorkWithArtists`, `getArtists` con filtros, `getWorks` con filtros).
- Componentes UI con búsqueda/filtrado en admin y lecturas Supabase en público.
- Scripts seed completos (usuarios, artistas, servicios, works, relaciones, contenido, storage).
- Configuración de pruebas (Vitest) y guías.
- Documentación ampliada.

## 12. Plan de Ejecución
1) Crear migración `profiles` + RLS y actualizar índices.
2) Actualizar cliente y guards de rol.
3) Ampliar helpers y CRUD (multi-artista, búsqueda/filtrado).
4) Migrar páginas públicas a Supabase SSR.
5) Completar scripts de seed (incluye usuarios e imágenes).
6) Configurar y escribir pruebas unitarias/integración.
7) Ampliar documentación y verificación en preview.

## Notas de Seguridad
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente; solo en scripts/servidor.
- Revisar CORS y RLS antes de producción.
- Validar inputs en formularios y sanitizar contenido JSON.
