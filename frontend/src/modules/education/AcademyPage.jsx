import { useEffect, useState } from "react";
import { Award, CheckCircle2, Flame, Trophy } from "lucide-react";
import { educationApi } from "../../services/api";

export default function AcademyPage() {
  const [lessons, setLessons] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    educationApi.lessons().then(setLessons);
    educationApi.progress().then(setProgress);
  }, []);

  async function openQuiz(lessonId) {
    const data = await educationApi.quiz(lessonId);
    setQuiz(data);
    setAnswers([]);
    setResult(null);
  }

  async function submitQuiz() {
    const data = await educationApi.submit(quiz.id, answers);
    setResult(data);
    setProgress(await educationApi.progress());
  }

  const answeredCount = answers.filter((answer) => answer !== undefined).length;
  const progressPercent = quiz ? Math.round((answeredCount / quiz.questions.length) * 100) : 0;

  return (
    <section className="academy-page">
      <div className="learning-hero academy-hero">
        <div>
          <p className="eyebrow">Polar Academy</p>
          <h1>Level up your polar science brain</h1>
          <p>Short missions, quiz streaks, XP, and badges that make research feel easier to explore.</p>
        </div>
        <Trophy size={48} />
      </div>
      <div className="metrics">
        <article><strong>{progress?.xp ?? 0}</strong><span>Total XP</span></article>
        <article><strong>{progress?.level ?? 1}</strong><span>Explorer level</span></article>
        <article><strong>{progress?.badges?.length ?? 0}</strong><span>Badges unlocked</span></article>
      </div>
      <div className="grid lesson-grid">
        {lessons.map((lesson) => (
          <article className="card lesson-card" key={lesson.id}>
            <div className="lesson-icon"><Flame size={22} /></div>
            <h3>{lesson.title}</h3>
            <p>{lesson.summary}</p>
            <small>{lesson.level} mission - {lesson.minutes} min</small>
            <button className="primary" onClick={() => openQuiz(lesson.id)}><CheckCircle2 size={16} /> Start quiz</button>
          </article>
        ))}
      </div>
      {quiz && (
        <section className="quiz-panel">
          <div className="quiz-header">
            <div>
              <p className="eyebrow">Challenge mode</p>
              <h2>{quiz.title}</h2>
            </div>
            <strong>{answeredCount}/{quiz.questions.length}</strong>
          </div>
          <div className="quiz-progress"><span style={{ width: `${progressPercent}%` }} /></div>
          {quiz.questions.map((question, index) => (
            <fieldset className="question-card" key={question.id}>
              <legend>{question.prompt}</legend>
              {question.options.map((option, optionIndex) => (
                <label
                  className={`option ${answers[index] === optionIndex ? "selected" : ""} ${
                    result?.review?.[index]?.correct === optionIndex ? "correct" : ""
                  } ${result?.review?.[index]?.selected === optionIndex && !result?.review?.[index]?.is_correct ? "wrong" : ""}`}
                  key={option}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[index] === optionIndex}
                    onChange={() => {
                      const next = [...answers];
                      next[index] = optionIndex;
                      setAnswers(next);
                    }}
                  />
                  {option}
                </label>
              ))}
              {result?.review?.[index] && <p className="explanation">{result.review[index].explanation}</p>}
            </fieldset>
          ))}
          <button className="primary big-action" onClick={submitQuiz}>Submit mission</button>
          {result && (
            <p className="success result-banner">
              <Award size={18} />
              Score {result.score}/{result.total}. XP +{result.xp_awarded}
            </p>
          )}
        </section>
      )}
    </section>
  );
}
