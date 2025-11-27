import { useEffect, useState } from 'react'
import type { PostgrestResponse } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export default function SupabaseProbe() {
  const [status, setStatus] = useState<'ok' | 'error' | 'idle'>('idle')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    supabase
      .from('artists')
      .select('*', { count: 'exact', head: true })
      .then((res: PostgrestResponse<any>) => {
        if (!mounted) return
        if (res.error) {
          setStatus('error')
          return
        }
        setCount(res.count ?? 0)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
    return () => {
      mounted = false
    }
  }, [])

  if (status === 'idle') return null

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md bg-red-900/90 border border-red-500 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm">
        <h3 className="font-bold mb-1">Error de Conexión</h3>
        <p className="text-sm opacity-90">
          No se pudo conectar a Supabase. Verifica que las variables de entorno <code>PUBLIC_SUPABASE_URL</code> y <code>PUBLIC_SUPABASE_ANON_KEY</code> estén configuradas correctamente en tu panel de Cloudflare Pages.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-2 text-xs text-center text-neutral-500">
      <span>Supabase conectado{typeof count === 'number' ? ` · artistas: ${count}` : ''}</span>
    </div>
  )
}
