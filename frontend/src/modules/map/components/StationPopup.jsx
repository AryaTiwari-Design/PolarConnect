import { Link } from 'react-router-dom'

export default function StationPopup({ station }) {
  return (
    <article className="station-popup">
      <img src={station.image} alt={station.imageAlt || station.name} />
      <div className="station-popup__body">
        <p>{station.status}</p>
        <h3>{station.name}</h3>
        <span>{station.region}</span>
        <Link to={`/search?station=${encodeURIComponent(station.name)}`}>
          View station research
        </Link>
      </div>
    </article>
  )
}
