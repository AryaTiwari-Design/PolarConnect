import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import useFetch from '../../../hooks/useFetch'
import { ErrorState, Loading } from '../../../components/States'
import { listStations } from '../services/stations'
import StationPopup from './StationPopup'

const pin = (station, active) =>
  L.divIcon({
    className: `station-pin${station.country === 'India' ? ' is-india' : ''}${active ? ' is-active' : ''}`,
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })

// Moves the map to the selected station, then tells us when it has arrived
function FlyTo({ target, onArrive }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], 5, { duration: 1.1 })
    map.once('moveend', onArrive)
    return () => map.off('moveend', onArrive)
  }, [target, map, onArrive])
  return null
}

export default function StationsMap() {
  const { data, loading, error, reload } = useFetch(listStations, [])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const markers = useRef({})

  const stations = data?.items || []
  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase()
    return f ? stations.filter((s) => `${s.name} ${s.country}`.toLowerCase().includes(f)) : stations
  }, [stations, filter])

  const openPopup = useMemo(() => () => selected && markers.current[selected.id]?.openPopup(), [selected])

  if (loading) return <div className="container-page"><Loading label="Loading stations…" /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Antarctica research stations</h1>
      <p className="mt-2 max-w-2xl text-navy-600">
        Pick a station to see where it is and what is studied there. Indian stations are shown in amber.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="panel flex max-h-[560px] flex-col">
          <div className="border-b border-glacier-200 p-3">
            <label htmlFor="station-filter" className="sr-only">Filter stations</label>
            <input id="station-filter" className="input" placeholder="Filter by name or country" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {visible.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSelected(s)}
                  className={`w-full border-b border-glacier-100 px-4 py-3 text-left transition hover:bg-glacier-50 ${selected?.id === s.id ? 'bg-glacier-100' : ''}`}
                >
                  <span className="block text-sm font-bold">{s.name}</span>
                  <span className="block text-xs text-navy-600">{s.country} · {s.status}</span>
                </button>
              </li>
            ))}
            {visible.length === 0 && <li className="p-4 text-sm text-navy-600">No stations match “{filter}”.</li>}
          </ul>
        </aside>

        <div className="isolate overflow-hidden rounded-xl border border-glacier-200">
          <MapContainer center={[-72, 40]} zoom={2} minZoom={2} worldCopyJump className="h-[420px] w-full lg:h-[560px]">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo target={selected} onArrive={openPopup} />
            {visible.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={pin(s, selected?.id === s.id)}
                ref={(m) => { if (m) markers.current[s.id] = m }}
                eventHandlers={{ click: () => setSelected(s) }}
              >
                <Popup><StationPopup station={s} /></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selected && (
        <section className="panel mt-4 p-5">
          <h2 className="text-xl font-bold">{selected.name}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy-800">
            {selected.facts.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}
