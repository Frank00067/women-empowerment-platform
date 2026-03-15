import { useEffect, useState } from "react";
import axios from "axios";

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link";
  url: string;
  description?: string;
}

const MentorshipPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    axios.get("/api/resources/mentorship").then((res) => setResources(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Mentorship & opportunities</h1>
      <p className="page-intro">
        Explore mentorship programmes, webinars, and curated resources to
        support your career journey.
      </p>
      <div className="card-grid">
        {resources.map((r) => (
          <article key={r.id} className="card">
            <h3>{r.title}</h3>
            {r.description && <p>{r.description}</p>}
            <a className="primary-btn ghost" href={r.url} target="_blank">
              Open resource
            </a>
          </article>
        ))}
        {!resources.length && (
          <p>Mentorship resources will appear here when added by an admin.</p>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;

