**Diagnóstico**
- Los gráficos usan `recharts` con `ResponsiveContainer` en `ActivityChart.tsx:52` y `DistributionChart.tsx:59`.
- El contenedor inmediato de los charts define altura (`h-80`) pero el ancho del área principal se anima por `transition-all duration-300` en `src/layouts/DashboardLayout.tsx:15` (`<main className="pl-72 transition-all duration-300">`).
- Durante esa transición inicial, el ancho puede ser 0 y `ResponsiveContainer` calcula dimensiones incorrectas; los gráficos quedan invisibles o mal dimensionados.

**Corrección**
- Quitar la animación de ancho inicial para evitar el cálculo 0:
  - Editar `src/layouts/DashboardLayout.tsx:15` y eliminar `transition-all duration-300`, dejando `className="pl-72"`.
- Mantener `ResponsiveContainer width="100%" height="100%"` y los wrappers `h-80 w-full` ya presentes.
- Opcional (solo si persiste el problema): tras el montaje disparar un `resize` para que Recharts recalcule dimensiones.
  - Añadir en `ActivityChart.tsx` y `DistributionChart.tsx` un `useEffect(() => { window.dispatchEvent(new Event('resize')); }, []);`.
- Opcional (mejora futura): crear un pequeño wrapper con `ResizeObserver` (sin dependencias) para notificar cambios de tamaño a Recharts en layouts con transiciones.

**Verificación**
- Levantar el servidor y abrir `http://localhost:4321/admin/dashboard`.
- Confirmar que `Activity Overview` y `Content Distribution` muestran los gráficos con ejes y leyenda correctamente a primer render.
- Reducir/expandir el viewport para validar respuesta de `ResponsiveContainer`.
- Verificar que los datos de distribución se cargan (si las tablas `artists`, `works`, `services` tienen contenido) y que el line chart no queda plano si hay actividad reciente.

¿Procedo con estos cambios y la verificación local?