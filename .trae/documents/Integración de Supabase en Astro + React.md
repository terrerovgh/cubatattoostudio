## Objetivo
- Conectar el sitio (Astro + islas React) a Supabase para datos, auth y storage.

## Alcance inicial
- Cliente de Supabase reutilizable.
- Variables de entorno públicas para cliente.
- Ejemplos de lectura de tablas en Astro y en componentes React.
- Opcional: autenticación por email/OTP y almacenamiento de imágenes.

## Paquetes
- Añadir `@supabase/supabase-js` como dependencia de producción.

## Variables de entorno
- Definir `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`.
- Desarrollo: archivo `.env` en la raíz.
- Producción (Cloudflare Pages): configurar variables en el dashboard del proyecto.

## Cliente de Supabase
- Crear `src/lib/supabaseClient.ts` con un singleton:
```ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)
```

## Uso en Astro y React
- Astro: consumir datos en páginas como `src/pages/index.astro` y rutas dinámicas `artists/[...slug].astro`, `works/[...slug].astro`.
- React: consumir desde componentes como `src/components/DomeGallery.tsx` usando `useEffect`/`useState`.

### Ejemplo en React
```tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function ArtistsList() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('artists').select('*').then(({ data }) => setItems(data ?? []))
  }, [])
  return (
    <ul>{items.map((a: any) => <li key={a.id}>{a.name}</li>)}</ul>
  )
}
```

### Ejemplo en Astro
```astro
---
import { supabase } from '@/lib/supabaseClient'
const { data: works } = await supabase.from('works').select('*')
---
<ul>
  {works?.map((w) => (<li>{w.title}</li>))}
</ul>
```

## Modelado de datos sugerido
- `artists` (id, name, bio, slug, avatar_url)
- `services` (id, name, description, price)
- `works` (id, title, artist_id, image_url, slug)
- `appointments` (id, client_name, phone, date, service_id, notes)

## Autenticación (opcional)
- Habilitar correo/OTP en Supabase.
- UI mínima: formulario de email y botón de magic link:
```ts
await supabase.auth.signInWithOtp({ email })
```
- Estado de sesión en cliente con `supabase.auth.getSession()` y `onAuthStateChange`.

## Almacenamiento (opcional)
- Bucket `works` para imágenes de trabajos.
- Subida desde React:
```ts
await supabase.storage.from('works').upload(`work-${id}.jpg`, file)
```
- Obtener URL pública:
```ts
const { data } = supabase.storage.from('works').getPublicUrl(path)
```

## Seguridad y políticas
- Mantener RLS activado en tablas.
- Políticas de lectura pública para `artists`, `services`, `works` si el contenido es público.
- Escritura restringida a usuarios autenticados.

## Endpoints opcionales
- Si se requiere lógica del lado servidor, crear endpoints en `src/pages/api/*` para operaciones sensibles y consumirlos desde el cliente.

## Verificación
- Desarrollo: variables en `.env`, ejecutar `dev` y validar lecturas/render.
- Pruebas manuales: listas de artistas/obras cargan correctamente; subir imagen y obtener URL.
- Producción: configurar variables en Cloudflare Pages y validar en `preview`.

## Cambios propuestos
- `package.json`: añadir `@supabase/supabase-js`.
- `src/lib/supabaseClient.ts`: nuevo archivo.
- Integración de lecturas en `index.astro`, `artists/[...slug].astro`, `works/[...slug].astro` y componentes React donde se muestren datos.

## Entregables
- Cliente de Supabase funcional.
- Páginas/componentes leyendo datos reales.
- (Opcional) UI básica de auth y carga/visualización de imágenes desde Storage.