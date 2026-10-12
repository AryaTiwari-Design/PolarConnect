import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import { Loading, ErrorState } from '../../../components/States'
import { getLesson } from '../services/education'
import Quiz from './Quiz'
import { useLanguage } from '../../../context/LanguageContext'

export default function LessonPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { data: lesson, loading, error, reload } = useFetch(() => getLesson(id), [id])
  const [showQuiz, setShowQuiz] = useState(false)

  if (loading) return <div className="container-page"><Loading /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  return (
    <div className="container-page max-w-3xl">
      <Link to="/academy" className="text-sm font-semibold text-glacier-600 hover:underline">{t('backAcademy')}</Link>

      <header className="mt-4">
        <div className="flex items-center gap-2">
          <span className="chip">{lesson.level}</span>
          <span className="text-xs text-navy-600">{lesson.readMinutes} {t('minRead')}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{lesson.icon} {lesson.title}</h1>
        <p className="mt-2 text-navy-600">{lesson.summary}</p>
      </header>

      <div className="mt-8 space-y-5 text-base leading-7">
        {lesson.content.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="mt-10">
        {!showQuiz ? (
          <div className="quiz-launch">
            <div>
              <p className="eyebrow">{t('quickChallenge')}</p>
              <h2>{t('challengeReady')}</h2>
              <p>
                {lesson.completed
                  ? `${t('challengeCompleted')} ${lesson.score}/${lesson.total}. ${t('challengeCompletedSuffix')}`
                  : t('challengeIntro')}
              </p>
            </div>
            <button className="btn-primary" onClick={() => setShowQuiz(true)}>
              {lesson.completed ? t('retakeChallenge') : t('startChallenge')}
            </button>
          </div>
        ) : (
          <Quiz quizId={lesson.quizId} />
        )}
      </div>
    </div>
  )
}
