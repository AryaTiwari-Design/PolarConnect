import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatUI from '../components/ChatUI'
import { Loading } from '../components/States'
import { askQuestion, getChatHistory } from '../services/chat'

export default function Chat() {
  const [params] = useSearchParams()
  const [messages, setMessages] = useState([])
  const [ready, setReady] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getChatHistory()
      .then((d) => setMessages(d.items || []))
      .catch(() => {}) // history is optional, chat still works without it
      .finally(() => setReady(true))
  }, [])

  const send = async (text) => {
    setError('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setSending(true)
    try {
      const res = await askQuestion(text)
      setMessages((m) => [...m, { role: 'assistant', content: res.answer, sources: res.sources || [] }])
    } catch (err) {
      setError(err.message || 'The assistant could not answer. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">AI science assistant</h1>
      <p className="mb-5 mt-1 text-navy-600">Ask in plain language. Answers use approved papers only.</p>
      {ready ? <ChatUI messages={messages} sending={sending} error={error} onSend={send} initialInput={params.get('q') || ''} /> : <Loading />}
    </div>
  )
}
