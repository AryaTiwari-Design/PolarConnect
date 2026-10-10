import { Link } from 'react-router-dom'

export default function StationPopup({ station }) {
  return (
    <div className="w-60 text-navy-900">
      <h3 className="text-base font-bold">{station.name}</h3>
      <p className="text-xs text-navy-600">{station.country} · since {station.established} · {station.status}</p>
      <p className="mt-2 text-sm leading-snug">{station.description}</p>
      <Link
        to={`/search?station=${encodeURIComponent(station.name)}`}
        className="mt-3 inline-block rounded-md bg-glacier-600 px-3 py-1.5 text-xs font-semibold !text-white hover:bg-glacier-700"
      >
        Research from this station
      </Link>
    </div>
  )
}
