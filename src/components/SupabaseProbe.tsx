import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseProbe() {
  const [status, setStatus] = useState<'ok' | 'error' | 'idle'>('idle')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    supabase
      .from('artists')
      .select('*', { count: 'exact', head: true })
      .then((res) => {
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
  return (
    <div className="px-4 py-2 text-xs text-center text-neutral-500">
      {status === 'ok' ? (
        <span>Supabase conectado{typeof count === 'number' ? ` · artistas: ${count}` : ''}</span>
      ) : (
        <span>No se pudo conectar a Supabase</span>
      )}
    </div>
  )
}