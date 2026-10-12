import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import useFetch from '../../../hooks/useFetch'
import { ErrorState, Loading } from '../../../components/States'
import StationPopup from './StationPopup'
import { indianStations, listStations } from '../services/stations'

const stats = [
  ['3', 'Indian Antarctic bases'],
  ['2', 'Active year-round stations'],
  ['1983', 'First Indian base established'],
]

const pin = (station, active) =>
  L.divIcon({
    className: `station-pin india-pin${active ? ' is-active' : ''}${station.status.toLowerCase().includes('decommissioned') ? ' is-retired' : ''}`,
    html: '<span><i></i></span>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  })

function FlyTo({ target, onArrive }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], 6, { duration: 1.15 })
    map.once('moveend', onArrive)
    return () => map.off('moveend', onArrive)
  }, [target, map, onArrive])
  return null
}

export default function StationsMap() {
  const { data, loading, error, reload } = useFetch(listStations, [])
  const stations = data?.items?.length ? data.items : indianStations
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('all')
  const markers = useRef({})

  const visible = useMemo(() => {
    if (mode === 'active') return stations.filter((s) => s.status.toLowerCase().includes('operational'))
    if (mode === 'historic') return stations.filter((s) => !s.status.toLowerCase().includes('operational'))
    return stations
  }, [mode, stations])

  const openPopup = useMemo(() => () => selected && markers.current[selected.id]?.openPopup(), [selected])

  useEffect(() => {
    if (!visible.some((s) => s.id === selected?.id)) setSelected(visible[0])
  }, [visible, selected])

  if (loading) return <div className="container-page"><Loading label="Loading Indian research centres..." /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  return (
    <div className="map-page">
      <section className="map-hero">
        <div>
          <p className="eyebrow">Indian Antarctic Programme</p>
          <h1>India’s research footprint on the ice</h1>
          <p>
            Explore Maitri, Bharati and the historic Dakshin Gangotri base on a satellite-style Antarctic map with station imagery, science focus areas and operational context.
          </p>
          <span className="data-source-pill">
            Data source: {data?.source === 'backend' ? 'FastAPI research-stations endpoint + verified NCPOR/PIB profiles' : 'verified NCPOR/PIB station profiles'}
          </span>
        </div>
        <dl>
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="map-workspace">
        <aside className="station-rail" aria-label="Indian research centres">
          <div className="segmented-control" aria-label="Station filter">
            {[
              ['all', 'All'],
              ['active', 'Active'],
              ['historic', 'Historic'],
            ].map(([value, label]) => (
              <button key={value} className={mode === value ? 'is-selected' : ''} onClick={() => setMode(value)}>
                {label}
              </button>
            ))}
          </div>

          <div className="station-list">
            {visible.map((station) => (
              <button
                key={station.id}
                className={`station-card ${selected?.id === station.id ? 'is-selected' : ''}`}
                onClick={() => setSelected(station)}
              >
                <img src={station.image} alt="" />
                <span>
                  <strong>{station.name}</strong>
                  <small>{station.status}</small>
                  <em>{station.region}</em>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="map-shell">
          <MapContainer center={[-70.25, 43]} zoom={3} minZoom={2} maxZoom={9} worldCopyJump className="polar-map">
            <TileLayer
              attribution='Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='Labels &copy; Esri'
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              opacity={0.62}
            />
            <FlyTo target={selected} onArrive={openPopup} />
            {visible.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={pin(station, selected?.id === station.id)}
                ref={(marker) => { if (marker) markers.current[station.id] = marker }}
                eventHandlers={{ click: () => setSelected(station) }}
              >
                <Popup minWidth={260}><StationPopup station={station} /></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {selected && (
        <section className="station-detail">
          <div className="station-detail__media">
            <img src={selected.image} alt={selected.imageAlt} />
            <span>{selected.imageCredit}</span>
          </div>
          <div className="station-detail__content">
            <p className="eyebrow">{selected.type}</p>
            <div className="station-detail__heading">
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.region}</p>
              </div>
              <span>{selected.established}</span>
            </div>
            <p className="station-detail__description">{selected.description}</p>

            <div className="detail-grid">
              <div>
                <h3>Science Focus</h3>
                <div className="chip-cloud">
                  {selected.focus.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div>
                <h3>Operational Notes</h3>
                <ul>
                  {selected.logistics.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="fact-strip">
              {selected.facts.map((fact) => <p key={fact}>{fact}</p>)}
            </div>

            <a className="source-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">
              Source: {selected.sourceLabel}
            </a>
          </div>
        </section>
      )}
    </div>
  )
}
