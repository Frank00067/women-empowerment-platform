import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

type EmploymentType = "full-time" | "part-time" | "internship" | "contract";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  requirements: string;
  createdAt: string;
  isActive: boolean;
}

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);

  const activeJobs = useMemo(
    () => jobs.filter((j) => (user?.role === "learner" ? j.isActive : true)),
    [jobs, user?.role]
  );

  async function load() {
    const res = await axios.get("/api/jobs");
    setJobs(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  const apply = async (e: FormEvent, jobId: string) => {
    e.preventDefault();
    setStatus(null);
    try {
      await axios.post(`/api/jobs/${jobId}/apply`, { message: message[jobId] });
      setStatus("Application sent. Check Notifications for updates.");
    } catch (err: any) {
      setStatus(err?.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="page">
      <h1>Jobs</h1>
      <p className="page-intro">
        Browse women-friendly opportunities and apply directly. Employers can post
        and manage jobs from the Employer dashboard.
      </p>
      {status && <div className="error-banner">{status}</div>}

      <div className="card-grid">
        {activeJobs.map((job) => (
          <article key={job.id} className="card">
            <h3>{job.title}</h3>
            <p className="auth-footer">
              <b>{job.companyName}</b> • {job.location} • {job.employmentType}{" "}
              {!job.isActive && "• (inactive)"}
            </p>
            <p>{job.description}</p>
            <details>
              <summary>Requirements</summary>
              <pre style={{ whiteSpace: "pre-wrap", margin: "0.75rem 0 0" }}>
                {job.requirements}
              </pre>
            </details>

            {user?.role === "learner" && job.isActive && (
              <form onSubmit={(e) => apply(e, job.id)} style={{ marginTop: "0.75rem" }}>
                <label>
                  Application message (optional)
                  <textarea
                    value={message[job.id] || ""}
                    onChange={(e) =>
                      setMessage((m) => ({ ...m, [job.id]: e.target.value }))
                    }
                    placeholder="Short note to the employer (why you're a good fit)."
                  />
                </label>
                <button className="primary-btn" type="submit">
                  Apply
                </button>
              </form>
            )}
          </article>
        ))}
        {!activeJobs.length && <p>No jobs available yet.</p>}
      </div>
    </div>
  );
};

export default JobsPage;

