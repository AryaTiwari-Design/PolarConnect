import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function getRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  return SpeechRecognition ? new SpeechRecognition() : null
}

export default function VoiceInputButton({ onText, disabled = false }) {
  const { language, t } = useLanguage()
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  const toggle = () => {
    setError('')
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = getRecognition()
    if (!recognition) {
      setError(t('voiceUnsupported'))
      return
    }

    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      if (transcript) onText(transcript)
    }
    recognition.onerror = () => setError(t('voiceUnsupported'))
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  return (
    <span className="voice-control">
      <button type="button" disabled={disabled} onClick={toggle} className={listening ? 'is-listening' : ''}>
        <span aria-hidden="true">{listening ? '■' : '●'}</span>
        {listening ? t('voiceStop') : t('voiceStart')}
      </button>
      {listening && <small>{t('voiceListening')}</small>}
      {error && <small role="alert">{error}</small>}
    </span>
  )
}
