import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { researchApi } from "../services/api";

export default function ResearchPage() {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", abstract: "", topic: "Climate", station: "Maitri", year: 2026, file_path: "" });

  function load() {
    researchApi.list(query ? { q: query } : {}).then(setPapers);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    await researchApi.create(form);
    setForm({ title: "", abstract: "", topic: "Climate", station: "Maitri", year: 2026, file_path: "" });
    load();
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <p className="eyebrow">Repository</p>
          <h1>Approved polar research</h1>
        </div>
        <form className="search-row" onSubmit={(event) => { event.preventDefault(); load(); }}>
          <input placeholder="Search title, abstract or topic" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="primary">Search</button>
        </form>
      </div>
      {(user.role === "researcher" || user.role === "admin") && (
        <form className="upload-form" onSubmit={submit}>
          <h2><Plus size={18} /> Submit research</h2>
          <input required placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input placeholder="Short abstract" value={form.abstract} onChange={(event) => setForm({ ...form, abstract: event.target.value })} />
          <input placeholder="Topic" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
          <input placeholder="Station" value={form.station} onChange={(event) => setForm({ ...form, station: event.target.value })} />
          <input type="number" placeholder="Year" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} />
          <input placeholder="PDF path, e.g. research_docs/approved/p1.pdf" value={form.file_path} onChange={(event) => setForm({ ...form, file_path: event.target.value })} />
          <button className="primary">Submit for approval</button>
        </form>
      )}
      <div className="grid">
        {papers.map((paper) => (
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
