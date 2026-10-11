import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async function and tracks loading / error / data.
 *   const { data, loading, error, reload } = useFetch(() => listResearch(), [])
 * `deps` decides when it runs again (like useEffect).
 */
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err) => alive && setState({ data: null, loading: false, error: err.message || 'Something went wrong' }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
