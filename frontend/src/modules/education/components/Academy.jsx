import { Link } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import { Loading, ErrorState } from '../../../components/States'
import { getBadges, getXp, listLessons } from '../services/education'
import XPBar from './XPBar'
import Badges from './Badges'
import LessonList from './LessonList'

export default function Academy() {
  const { data, loading, error, reload } = useFetch(
    async () => {
      const [lessons, xp, badges] = await Promise.all([listLessons(), getXp(), getBadges()])
      return { lessons: lessons.items, xp, badges: badges.items }
    },
    [],
  )

  if (loading) return <div className="container-page"><Loading label="Loading Polar Academy…" /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  const done = data.lessons.filter((l) => l.completed).length

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Polar Academy</h1>
      <p className="mt-2 max-w-2xl text-navy-600">
        Short lessons written from verified polar science. Finish a quiz to earn XP, level up and collect badges.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1"><XPBar {...data.xp} /></div>
        <div className="panel p-5 md:col-span-2">
          <p className="text-sm font-semibold text-navy-600">Lessons completed</p>
          <p className="font-display text-3xl font-extrabold">{done} of {data.lessons.length}</p>
          <p className="mt-2 text-sm text-navy-600">
            Stuck on something? <Link to="/chat" className="font-semibold text-glacier-600 hover:underline">Ask the AI assistant</Link> and get an answer with sources.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Lessons</h2>
      <div className="mt-4"><LessonList lessons={data.lessons} /></div>

      <h2 className="mt-10 text-xl font-bold">Badges</h2>
      <div className="mt-4"><Badges badges={data.badges} /></div>
    </div>
  )
}
