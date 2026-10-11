import { useState } from 'react'
import useFetch from '../../../hooks/useFetch'
import { Loading, ErrorState } from '../../../components/States'
import { getQuiz, submitQuiz } from '../services/education'

export default function Quiz({ quizId, onFinished }) {
  const { data: quiz, loading, error, reload } = useFetch(() => getQuiz(quizId), [quizId])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (loading) return <Loading label="Loading quiz…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  const questions = quiz.questions
  const q = questions[index]
  const isLast = index === questions.length - 1
  const allAnswered = questions.every((_, i) => answers[i] !== undefined)

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
    setIndex(0)
    setResult(null)
  }

  // ---------- results ----------
  if (result) {
    const perfect = result.score === result.total
    return (
      <div className="panel p-6">
        <h2 className="text-2xl font-bold">
          {perfect ? 'Perfect score!' : `You scored ${result.score} out of ${result.total}`}
        </h2>
        <p className="mt-1 text-sm text-navy-600">
          {result.xpEarned > 0
            ? `You earned ${result.xpEarned} XP.`
            : 'No new XP this time. XP is awarded the first time you finish a quiz.'}
        </p>

        {result.newBadges.length > 0 && (
          <div className="mt-4 rounded-xl border border-ember-300 bg-ember-300/20 p-4">
            <p className="text-sm font-bold">New badge{result.newBadges.length > 1 ? 's' : ''} unlocked</p>
            <ul className="mt-2 flex flex-wrap gap-3">
              {result.newBadges.map((b) => (
                <li key={b.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold">
                  <span className="text-2xl" aria-hidden="true">{b.icon}</span>{b.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="mt-6 space-y-4">
          {questions.map((qq, i) => {
            const r = result.results[i]
            return (
              <li key={qq.id} className={`rounded-xl border p-4 ${r.correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <p className="font-semibold">{qq.text}</p>
                <p className="mt-1 text-sm">
                  Your answer: <strong>{qq.options[answers[i]]}</strong> {r.correct ? '(correct)' : '(not quite)'}
                </p>
                {!r.correct && <p className="text-sm">Correct answer: <strong>{qq.options[r.correctIndex]}</strong></p>}
                <p className="mt-1 text-sm text-navy-600">{r.explanation}</p>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={retry} className="btn-secondary">Try again</button>
        </div>
      </div>
    )
  }

  // ---------- question ----------
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between text-sm text-navy-600">
        <span>Question {index + 1} of {questions.length}</span>
        <span>{Object.keys(answers).length} answered</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-glacier-100">
        <div className="h-full bg-glacier-500 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <fieldset className="mt-5">
        <legend className="text-lg font-bold leading-snug">{q.text}</legend>
        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[index] === i
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                  selected ? 'border-glacier-600 bg-glacier-100 font-semibold' : 'border-glacier-200 hover:border-glacier-400'}`}
              >
                <input
                  type="radio" name={`q-${q.id}`} className="h-4 w-4 accent-[#2275a9]"
                  checked={selected} onChange={() => setAnswers((a) => ({ ...a, [index]: i }))}
                />
                {opt}
              </label>
            )
          })}
        </div>
      </fieldset>

      {submitError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{submitError}</p>}

      <div className="mt-6 flex justify-between">
        <button className="btn-secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>Previous</button>
        {isLast ? (
          <button className="btn-primary" disabled={!allAnswered || submitting} onClick={submit}>
            {submitting ? 'Scoring…' : 'Submit answers'}
          </button>
        ) : (
          <button className="btn-primary" disabled={answers[index] === undefined} onClick={() => setIndex((i) => i + 1)}>Next question</button>
        )}
      </div>
    </div>
  )
}
