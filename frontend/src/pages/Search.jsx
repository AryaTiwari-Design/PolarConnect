import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { EmptyState, ErrorState, Loading } from '../components/States'
import ResearchCard from '../components/ResearchCard'
import { listResearch } from '../services/research'
import { listStations } from '../modules/map/services/stations'
import { CATEGORIES } from '../utils/constants'
import { yearOptions } from '../utils/helpers'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const year = params.get('year') || ''
  const category = params.get('category') || ''
  const station = params.get('station') || ''

  // Wait a moment after typing before searching
  const [text, setText] = useState(q)
  useEffect(() => {
    const t = setTimeout(() => update('q', text), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const update = (key, value) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  const stations = useFetch(listStations, [])
  const { data, loading, error, reload } = useFetch(() => listResearch({ q, year, category, station }), [q, year, category, station])
  const hasFilters = q || year || category || station

  const clear = () => {
    setText('')
    setParams({}, { replace: true })
  }

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Search research</h1>
      <p className="mt-1 text-navy-600">Search titles, authors, topics and summaries across approved papers.</p>

      <div className="panel mt-6 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="q" className="label">Keywords</label>
          <input id="q" className="input" placeholder="For example: krill, ice shelf, ozone" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <label htmlFor="year" className="label">Year</label>
          <select id="year" className="input" value={year} onChange={(e) => update('year', e.target.value)}>
            <option value="">Any year</option>
            {yearOptions().map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="label">Category</label>
          <select id="category" className="input" value={category} onChange={(e) => update('category', e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="station" className="label">Station</label>
          <select id="station" className="input" value={station} onChange={(e) => update('station', e.target.value)}>
            <option value="">All stations</option>
            {(stations.data?.items || []).map((s) => <option key={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn-secondary w-full" onClick={clear} disabled={!hasFilters}>Clear filters</button>
        </div>
      </div>

      <div className="mt-6" aria-live="polite">
        {loading ? <Loading label="Searching…" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <EmptyState icon="🔍" title="No papers match your search" text="Try fewer keywords or clear a filter. Only approved papers appear in search." action={hasFilters && <button onClick={clear} className="btn-primary">Clear filters</button>} />
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-navy-600">{data.items.length} paper{data.items.length > 1 ? 's' : ''} found</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => <ResearchCard key={p.id} paper={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
