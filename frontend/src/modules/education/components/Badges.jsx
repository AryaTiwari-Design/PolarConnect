export default function Badges({ badges = [] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {badges.map((b) => (
        <li
          key={b.id}
          className={`rounded-xl border p-4 text-center ${b.earned ? 'border-ember-300 bg-ember-300/20' : 'border-glacier-200 bg-white'}`}
        >
          <div className={`text-3xl ${b.earned ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">{b.icon}</div>
          <p className="mt-2 text-sm font-bold">{b.name}</p>
          <p className="mt-0.5 text-xs text-navy-600">{b.earned ? 'Earned' : b.description}</p>
        </li>
      ))}
    </ul>
  )
}
