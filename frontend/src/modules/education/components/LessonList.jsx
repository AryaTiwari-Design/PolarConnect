import { Link } from 'react-router-dom'

export default function LessonList({ lessons }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {lessons.map((l) => (
        <li key={l.id}>
          <Link to={`/academy/${l.id}`} className="panel flex h-full gap-4 p-5 transition hover:border-glacier-400">
            <div className="text-3xl" aria-hidden="true">{l.icon}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{l.level}</span>
                <span className="text-xs text-navy-600">{l.readMinutes} min read</span>
              </div>
              <h3 className="mt-2 text-lg font-bold leading-snug">{l.title}</h3>
              <p className="mt-1 text-sm text-navy-600">{l.summary}</p>
              <p className={`mt-3 text-xs font-semibold ${l.completed ? 'text-aurora-700' : 'text-glacier-600'}`}>
                {l.completed ? `Quiz done: ${l.score}/${l.total}` : 'Start lesson and quiz'}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
