import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SUGGESTED_QUESTIONS } from '../utils/constants'

function Sources({ sources }) {
  if (!sources) return null
  if (sources.length === 0) {
    return <p className="mt-3 text-xs text-navy-600">No sources: nothing in the approved papers matched.</p>
  }
  return (
    <div className="mt-3 border-t border-glacier-200 pt-3">
      <p className="text-xs font-semibold text-navy-600">Sources from approved papers</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {sources.map((s, i) => (
          <li key={`${s.paper_id}-${s.page}-${i}`}>
            <Link
              to={`/research/${s.paper_id}`}
              className="inline-flex max-w-xs items-center gap-1.5 rounded-lg border border-glacier-200 bg-glacier-50 px-2.5 py-1.5 text-xs font-semibold text-glacier-700 hover:border-glacier-500"
            >
              <span className="truncate">{s.title}</span>
              <span className="shrink-0 rounded bg-glacier-100 px-1.5 py-0.5">p. {s.page}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Message({ m }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
        isUser ? 'bg-glacier-600 text-white' : 'border border-glacier-200 bg-white text-navy-900'}`}>
        <p className="whitespace-pre-wrap">{m.content}</p>
        {!isUser && <Sources sources={m.sources} />}
      </div>
    </div>
  )
}

export default function ChatUI({ messages, sending, error, onSend, initialInput = '' }) {
  const [input, setInput] = useState(initialInput)
  const endRef = useRef(null)

  useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}, [messages, sending])

  const submit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    onSend(text)
  }

  return (
    <div className="panel flex h-[calc(100vh-14rem)] min-h-[460px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="mx-auto max-w-lg py-8 text-center">
            <div className="text-4xl" aria-hidden="true">🧊</div>
            <h2 className="mt-3 text-xl font-bold">Ask anything about polar research</h2>
            <p className="mt-1 text-sm text-navy-600">
              Answers come only from papers approved by our admins, and every answer shows the paper and page it came from.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} onClick={() => onSend(q)} className="rounded-full border border-glacier-200 bg-glacier-50 px-3 py-1.5 text-sm font-medium text-navy-800 hover:border-glacier-500">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => <Message key={i} m={m} />)}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-glacier-200 bg-white px-4 py-3" role="status" aria-label="Searching approved papers">
              <span className="typing-dot h-2 w-2 rounded-full bg-glacier-500" />
              <span className="typing-dot h-2 w-2 rounded-full bg-glacier-500" />
              <span className="typing-dot h-2 w-2 rounded-full bg-glacier-500" />
            </div>
          </div>
        )}
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-glacier-200 p-3">
        <label htmlFor="chat-input" className="sr-only">Your question</label>
        <input
          id="chat-input"
          className="input"
          placeholder="Ask about ice, oceans, wildlife, stations…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
        />
        <button className="btn-primary" disabled={!input.trim() || sending}>Ask</button>
      </form>
    </div>
  )
}