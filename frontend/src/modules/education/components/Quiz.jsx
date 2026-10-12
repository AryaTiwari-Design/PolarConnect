import { useState } from 'react'
import useFetch from '../../../hooks/useFetch'
import { Loading, ErrorState } from '../../../components/States'
import { getQuiz, submitQuiz } from '../services/education'
import { useLanguage } from '../../../context/LanguageContext'

function resultMessage(score, total, t) {
  const ratio = score / total
  if (ratio === 1) return [t('missionComplete'), t('perfectScore')]
  if (ratio >= 0.67) return [t('strongWork'), t('strongWorkText')]
  return [t('goodAttempt'), t('goodAttemptText')]
}

function bestCorrectStreak(results = []) {
  return results.reduce(
    (state, item) => {
      const current = item.correct ? state.current + 1 : 0
      return { current, best: Math.max(state.best, current) }
    },
    { current: 0, best: 0 },
  ).best
}

export default function Quiz({ quizId, onFinished }) {
  const { t } = useLanguage()
  const { data: quiz, loading, error, reload } = useFetch(() => getQuiz(quizId), [quizId])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [hintsUsed, setHintsUsed] = useState({})

  const answeredCount = Object.keys(answers).length

  if (loading) return <Loading label={t('preparingQuiz')} />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const questions = quiz?.questions || []
  if (!questions.length) return <ErrorState message={t('noQuizQuestions')} onRetry={reload} />

  const q = questions[index]
  const isLast = index === questions.length - 1
  const allAnswered = questions.every((_, i) => answers[i] !== undefined)
  const progress = Math.round((answeredCount / questions.length) * 100)
  const checkpoint = Math.min(4, Math.floor((answeredCount / questions.length) * 4))
  const energy = Math.round((answeredCount / questions.length) * 100)
  const hintCount = Object.keys(hintsUsed).length
  const missionScore = Math.max(0, answeredCount * 12 + checkpoint * 8 - hintCount * 4)
  const selectedAnswer = answers[index]
  const [title, subtitle] = result ? resultMessage(result.score, result.total, t) : []
  const encouragement = [t('quizEncouragement1'), t('quizEncouragement2'), t('quizEncouragement3'), t('quizEncouragement4')]

  const submit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await submitQuiz(quizId, questions.map((_, i) => answers[i]))
      setResult(res)
      onFinished?.(res)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const retry = () => {
    setAnswers({})
    setHintsUsed({})
    setIndex(0)
    setResult(null)
    setSubmitError('')
  }

  const selectAnswer = (optionIndex) => {
    setAnswers((current) => ({ ...current, [index]: optionIndex }))
  }

  const jumpToFirstMissed = () => {
    const missed = questions.findIndex((_, i) => answers[i] === undefined)
    if (missed >= 0) setIndex(missed)
  }

  const useHint = () => {
    if (!q.hint) return
    setHintsUsed((current) => ({ ...current, [index]: true }))
  }

  const remaining = questions.length - answeredCount
  const statusText = allAnswered
    ? t('allSetSubmit')
    : `${remaining} ${remaining === 1 ? t('questionLeft') : t('questionsLeft')}`

  if (result) {
    const accuracy = Math.round((result.score / result.total) * 100)
    const medal = accuracy === 100 ? t('goldMedal') : accuracy >= 70 ? t('silverMedal') : t('bronzeMedal')
    const streak = bestCorrectStreak(result.results)

    return (
      <section className="quiz-shell quiz-results" aria-live="polite">
        <div className="quiz-results__hero">
          <p className="eyebrow">{t('quizDebrief')}</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="score-ring" aria-label={`Score ${result.score} out of ${result.total}`}>
            <strong>{result.score}/{result.total}</strong>
            <span>{t('score')}</span>
          </div>
          <p className="quiz-xp">
            {result.xpEarned > 0
              ? `${t('xpEarnedPrefix')} ${result.xpEarned} ${t('xpEarnedSuffix')}`
              : t('noNewXp')}
          </p>
          <div className="quiz-stat-grid">
            <div>
              <span>{t('accuracy')}</span>
              <strong>{accuracy}%</strong>
            </div>
            <div>
              <span>{t('streak')}</span>
              <strong>{streak}x</strong>
            </div>
            <div>
              <span>{t('medalEarned')}</span>
              <strong>{medal}</strong>
            </div>
          </div>
        </div>

        {result.newBadges.length > 0 && (
          <div className="badge-party">
            <p>{result.newBadges.length > 1 ? t('newBadgesUnlocked') : t('newBadgeUnlocked')}</p>
            <ul>
              {result.newBadges.map((badge) => (
                <li key={badge.id}>
                  <span aria-hidden="true">{badge.icon}</span>
                  {badge.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="answer-review">
          {questions.map((qq, i) => {
            const review = result.results[i]
            const chosen = answers[i]
            return (
              <li key={qq.id} className={review.correct ? 'is-correct' : 'is-missed'}>
                <div>
                  <span>{review.correct ? t('correct') : t('review')}</span>
                  <h3>{qq.text}</h3>
                </div>
                <p>{t('yourPick')}: <strong>{qq.options[chosen]}</strong></p>
                {!review.correct && <p>{t('bestAnswer')}: <strong>{qq.options[review.correctIndex]}</strong></p>}
                <small>{review.explanation}</small>
              </li>
            )
          })}
        </ol>

        <div className="quiz-actions">
          <button onClick={retry} className="btn-secondary">{t('tryAgain')}</button>
        </div>
      </section>
    )
  }

  return (
    <section className="quiz-shell">
      <div className="quiz-topbar">
        <div>
          <p className="eyebrow">{t('knowledgeCheck')}</p>
          <h2>{quiz.title}</h2>
        </div>
        <div className="quiz-meter" aria-label={`${progress}% complete`}>
          <strong>{progress}%</strong>
          <span>{t('complete')}</span>
        </div>
      </div>

      <div className="quiz-progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-game-hud" aria-label={t('missionHud')}>
        <div>
          <span>{t('missionEnergy')}</span>
          <strong>{energy}%</strong>
        </div>
        <div>
          <span>{t('answered')}</span>
          <strong>{answeredCount}/{questions.length}</strong>
        </div>
        <div>
          <span>{t('checkpoint')}</span>
          <strong>{checkpoint}/4</strong>
        </div>
        <div>
          <span>{t('hintsUsed')}</span>
          <strong>{hintCount}</strong>
        </div>
        <div>
          <span>{t('missionScore')}</span>
          <strong>{missionScore}</strong>
        </div>
      </div>

      <div className="mission-track" aria-label={t('missionTrack')}>
        {questions.map((question, i) => {
          const state = answers[i] !== undefined ? 'is-cleared' : i === index ? 'is-active' : ''
          return <span key={question.id} className={state} />
        })}
      </div>

      <div className="question-dots" aria-label={t('questionProgress')}>
        {questions.map((question, i) => (
          <button
            key={question.id}
            className={`${i === index ? 'is-current' : ''} ${answers[i] !== undefined ? 'is-answered' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`${t('question')} ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="question-card">
        <div className="question-card__header">
          <span>{t('question')} {index + 1} {t('of')} {questions.length}</span>
          <strong>{encouragement[index % encouragement.length]}</strong>
        </div>
        <div className="question-meta">
          <span>{q.difficulty || t('fieldLevel')}</span>
          <span>{t('questionReward')} +12</span>
        </div>
        <fieldset>
          <legend>{q.text}</legend>
          <div className="option-grid">
            {q.options.map((option, optionIndex) => {
              const selected = selectedAnswer === optionIndex
              return (
                <button
                  type="button"
                  key={option}
                  className={`option-card ${selected ? 'is-selected' : ''}`}
                  onClick={() => selectAnswer(optionIndex)}
                  aria-pressed={selected}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  <strong>{option}</strong>
                </button>
              )
            })}
          </div>
        </fieldset>
        {q.hint && (
          <div className="hint-panel">
            {hintsUsed[index] ? (
              <p><strong>{t('signalHint')}:</strong> {q.hint}</p>
            ) : (
              <button type="button" onClick={useHint}>{t('useSignalHint')}</button>
            )}
          </div>
        )}
      </div>

      {submitError && <p className="quiz-alert" role="alert">{submitError}</p>}

      <div className="quiz-actions">
        <button className="btn-secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>{t('back')}</button>
        <p>{statusText}</p>
        {isLast ? (
          <button className="btn-primary" disabled={!allAnswered || submitting} onClick={submit}>
            {submitting ? t('checking') : t('finishQuiz')}
          </button>
        ) : (
          <button className="btn-primary" disabled={selectedAnswer === undefined} onClick={() => setIndex((i) => i + 1)}>
            {t('next')}
          </button>
        )}
      </div>

      {!allAnswered && isLast && (
        <button className="quiz-skip-link" onClick={jumpToFirstMissed}>{t('jumpUnanswered')}</button>
      )}
    </section>
  )
}
