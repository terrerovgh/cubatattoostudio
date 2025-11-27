**Diagnóstico**
- El build falla por `NoAdapterInstalled`: el proyecto usa páginas y rutas server-rendered (`prerender = false`) y no tiene adapter configurado.
- Confirmado en `astro.config.mjs:13` que sólo integra React y no define `adapter` ni `output`.
- Existen endpoints bajo `src/pages/api/*` y varias páginas admin con `prerender = false` (por ejemplo `src/pages/api/site-content.ts:5`, `src/pages/admin/editor/[page].astro`).
- Los endpoints usan APIs de Node (`Buffer`), por ejemplo `src/pages/api/site-content.ts:3`, lo que requiere compatibilidad Node en Cloudflare o refactor a Web APIs.

**Cambios propuestos**
1) Añadir adapter de Cloudflare
- Instalar `@astrojs/cloudflare` como dependencia.
- Actualizar `astro.config.mjs` para usar el adapter y explicitar modo server:
```
import cloudflare from '@astrojs/cloudflare'
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [react()],
  adapter: cloudflare(),
  output: 'server'
})
```

2) Activar compatibilidad Node en Cloudflare Pages
- Editar `wrangler.toml:1-3` y añadir:
```
compatibility_flags = ["nodejs_compat"]
```
- Mantener `pages_build_output_dir = "dist"` (`wrangler.toml:2`).

3) Verificación del build
- Ejecutar `npm install @astrojs/cloudflare` y `npm run build`.
- Confirmar que se genera `dist` con el worker de Cloudflare (por ejemplo `_worker.js`/`functions`) y que el build no arroja `NoAdapterInstalled`.
- Hacer smoke test local (`astro preview`) y en Pages Preview para endpoints `/api/*` y páginas admin.

**Mejora opcional (evita nodejs_compat)**
- Sustituir `Buffer` en `src/pages/api/*.ts` por una función de decodificación base64url con Web APIs (`atob`/`TextDecoder`). Esto elimina la necesidad de `nodejs_compat` en `wrangler.toml`.

**Resultado esperado**
- El build de Astro finaliza correctamente y Cloudflare Pages puede desplegar SSR/híbrido, manteniendo endpoints y páginas admin funcionales.