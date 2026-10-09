import { useEffect, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { chatApi } from "../services/api";

const prompts = [
  "Explain Antarctica like I am in class 8",
  "Why do scientists study Antarctic ice?",
  "What is special about Indian Antarctic stations?",
];

function AnswerText({ text }) {
  return (
    <div className="answer-text">
      {text.split("\n").filter(Boolean).map((line, index) => {
        if (line.endsWith(":")) return <h4 key={index}>{line}</h4>;
        if (line.startsWith("- ")) return <p className="answer-bullet" key={index}>{line.slice(2)}</p>;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

export default function ChatPage() {
  const [question, setQuestion] = useState("What does Antarctica tell us about climate change?");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chatApi.history().then(setMessages);
  }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    const answer = await chatApi.ask(question);
    setMessages([{ question, answer: answer.answer, sources: answer.sources, created_at: new Date().toISOString() }, ...messages]);
    setQuestion("");
    setLoading(false);
  }

  return (
    <section className="chat-page">
      <div className="learning-hero compact">
        <div>
          <p className="eyebrow">Grounded assistant</p>
          <h1>Ask PolarConnect AI</h1>
          <p>Clear student-friendly answers, grounded in approved polar research, with sources you can check.</p>
        </div>
        <Sparkles size={42} />
      </div>
      <div className="prompt-row">
        {prompts.map((prompt) => (
          <button type="button" key={prompt} onClick={() => setQuestion(prompt)}>{prompt}</button>
        ))}
      </div>
      <form className="chat-box" onSubmit={submit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          placeholder="Ask a polar science question..."
        />
        <button className="primary" disabled={loading || !question.trim()}>
          <Send size={16} />
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      <div className="conversation">
        {messages.map((message, index) => (
          <article className="message" key={`${message.created_at}-${index}`}>
            <strong className="question-title">{message.question}</strong>
            <AnswerText text={message.answer} />
            {message.sources?.length > 0 && (
              <div className="sources">
                {message.sources.map((source) => (
                  <span key={`${source.paper_id}-${source.page}`}>{source.title}, page {source.page}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
