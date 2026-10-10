import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ResearchCard({ paper, showStatus = false }) {
  return (
    <article className="panel flex flex-col p-5 transition hover:border-glacier-400">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{paper.category}</span>
        {showStatus && <StatusBadge status={paper.status} />}
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link to={`/research/${paper.id}`} className="hover:text-glacier-600">{paper.title}</Link>
      </h3>
      <p className="mt-1 text-sm text-navy-600">{paper.authors} · {paper.year}</p>
      <p className="mt-3 line-clamp-3 text-sm text-navy-800">{paper.abstract}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-navy-600">
        <span>{paper.station ? `Station: ${paper.station}` : 'No station listed'}</span>
        <Link to={`/research/${paper.id}`} className="font-semibold text-glacier-600 hover:underline">Read details</Link>
      </div>
    </article>
  )
}
