export default function XPBar({ xp = 0, level = 1, levelStartXp = 0, nextLevelXp = 100 }) {
  const span = Math.max(nextLevelXp - levelStartXp, 1)
  const pct = Math.min(100, Math.round(((xp - levelStartXp) / span) * 100))

  return (
    <div className="panel p-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-600">Your level</p>
          <p className="font-display text-3xl font-extrabold">Level {level}</p>
        </div>
        <p className="text-sm font-semibold text-ember-600">{xp} XP</p>
      </div>
      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-glacier-100"
        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level"
      >
        <div className="h-full rounded-full bg-ember-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-navy-600">{Math.max(nextLevelXp - xp, 0)} XP to reach level {level + 1}</p>
    </div>
  )
}
