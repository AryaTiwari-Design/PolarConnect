import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { researchApi } from "../services/api";

export default function AdminPage() {
  const [pending, setPending] = useState([]);

  function load() {
    researchApi.pending().then(setPending);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, action) {
    if (action === "approve") await researchApi.approve(id);
    else await researchApi.reject(id);
    load();
  }

  return (
    <section>
      <p className="eyebrow">Review queue</p>
      <h1>Admin approval</h1>
      <div className="grid">
        {pending.map((paper) => (
          <article className="card" key={paper.id}>
            <span className="status pending">pending</span>
            <h3>{paper.title}</h3>
            <p>{paper.abstract}</p>
            <small>{paper.topic} · {paper.station}</small>
            <div className="button-row">
              <button className="primary" onClick={() => decide(paper.id, "approve")}><Check size={16} /> Approve</button>
              <button onClick={() => decide(paper.id, "reject")}><X size={16} /> Reject</button>
            </div>
          </article>
        ))}
      </div>
      {pending.length === 0 && <p className="empty">No pending papers right now.</p>}
    </section>
  );
}
