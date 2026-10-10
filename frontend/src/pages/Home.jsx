import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = [
  ['Researchers upload', 'Scientists submit expedition reports and papers with clear metadata.'],
  ['Admins verify', 'Only papers an admin approves become visible. Nothing unchecked reaches students.'],
  ['The AI reads approved papers', 'It answers in plain language and shows the paper and page behind each answer.'],
  ['Students explore and learn', 'Search, map the stations, take short lessons and quizzes, earn XP and badges.'],
]

const features = [
  ['📚', 'Research library', 'Every approved paper in one place, searchable by year, topic and station.'],
  ['🤖', 'Ask the assistant', 'Plain-language answers with citations. If the papers do not cover it, it says so.'],
  ['🗺️', 'Station map', 'See where Maitri, Bharati and other stations are, and open their research.'],
  ['🎓', 'Polar Academy', 'Bite-sized lessons and quizzes that turn reading into progress.'],
]

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Polar research you can understand, with the sources to prove it.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-glacier-200">
              PolarConnect turns verified Antarctic science into simple answers, an interactive station map and short lessons for students.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link to="/chat" className="btn-light">Ask the AI assistant</Link>
                  <Link to="/dashboard" className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Go to dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-light">Create a free account</Link>
                  <Link to="/login" className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Log in</Link>
                </>
              )}
            </div>
          </div>

          {/* A sample answer: the one thing that makes this platform different */}
          <figure className="rounded-2xl bg-white p-5 text-navy-900 shadow-2xl shadow-black/30" aria-label="Example of a cited answer">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl bg-glacier-600 px-4 py-2.5 text-sm text-white">
              Why are Antarctic ice shelves thinning?
            </div>
            <div className="mt-3 rounded-2xl border border-glacier-200 px-4 py-3 text-sm leading-relaxed">
              Warmer ocean water is reaching the undersides of ice shelves and melting them from below. Thinner shelves hold back the glaciers behind them less well.
              <div className="mt-3 border-t border-glacier-200 pt-3">
                <p className="text-xs font-semibold text-navy-600">Sources from approved papers</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-glacier-700">
                  <span className="rounded-lg border border-glacier-200 bg-glacier-50 px-2.5 py-1.5">Ice Shelf Thinning: A Decade of Satellite Altimetry · p. 18</span>
                  <span className="rounded-lg border border-glacier-200 bg-glacier-50 px-2.5 py-1.5">Sea Ice Extent and Climate Feedbacks · p. 7</span>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">How a paper becomes an answer</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <li key={title} className="border-t-2 border-glacier-500 pt-4">
              <span className="font-display text-sm font-bold text-glacier-600">Step {i + 1}</span>
              <h3 className="mt-1 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-navy-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-glacier-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Everything in one place</h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {features.map(([icon, title, text]) => (
              <div key={title} className="flex gap-4">
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-navy-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-glacier-100 px-6 py-10 sm:px-10">
          <h2 className="max-w-2xl text-2xl font-extrabold sm:text-3xl">Bridging complex polar research and student learning</h2>
          <p className="mt-3 max-w-2xl text-navy-800">
            Our goal is to turn verified scientific documents into understandable, interactive and trustworthy educational content, so anyone curious about the poles can learn from the real science.
          </p>
          {!user && <Link to="/register" className="btn-primary mt-6">Start exploring</Link>}
        </div>
      </section>
    </>
  )
}
