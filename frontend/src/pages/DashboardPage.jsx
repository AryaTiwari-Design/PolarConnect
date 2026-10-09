import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { educationApi, researchApi } from "../services/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    researchApi.list().then(setPapers);
    educationApi.progress().then(setProgress);
  }, []);

  return (
    <section>
      <p className="eyebrow">Welcome back</p>
      <h1>{user?.name}'s PolarConnect dashboard</h1>
      <div className="metrics">
        <article><strong>{papers.length}</strong><span>Research records</span></article>
        <article><strong>{progress?.xp ?? 0}</strong><span>XP earned</span></article>
        <article><strong>{progress?.badges?.length ?? 0}</strong><span>Badges</span></article>
      </div>
      <div className="section-header"><h2>Recent research</h2></div>
      <div className="grid">
        {papers.slice(0, 4).map((paper) => (
          <article className="card" key={paper.id}>
            <span className={`status ${paper.status}`}>{paper.status}</span>
            <h3>{paper.title}</h3>
            <p>{paper.abstract}</p>
            <small>{paper.topic} · {paper.station || "Polar"} · {paper.year || "Year unknown"}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
