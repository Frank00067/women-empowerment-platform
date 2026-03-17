import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

type EmploymentType = "full-time" | "part-time" | "internship" | "contract";

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  requirements: string;
  isActive: boolean;
}

interface Application {
  id: string;
  jobId: string;
  userId: string;
  message?: string;
  createdAt: string;
  applicantName?: string;
  applicantEmail?: string;
}

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full-time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  async function load() {
    const res = await axios.get("/api/jobs/mine");
    setJobs(res.data);
  }

  async function loadApps(jobId: string) {
    const res = await axios.get(`/api/jobs/${jobId}/applications`);
    setApps(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  const createJob = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await axios.post("/api/jobs", {
        title,
        companyName,
        location,
        employmentType,
        description,
        requirements,
      });
      setTitle("");
      setDescription("");
      setRequirements("");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create job");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (job: Job) => {
    setBusy(true);
    setError(null);
    try {
      await axios.patch(`/api/jobs/${job.id}`, { isActive: !job.isActive });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update job");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <h1>Employer dashboard</h1>
      <p className="page-intro">
        Post jobs for women and review applications from learners.
      </p>
      {error && <div className="error-banner">{error}</div>}

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Post a job</h2>
        <form onSubmit={createJob}>
          <label>
            Job title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Company name
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </label>
          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          <label>
            Employment type
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            >
              <option value="full-time">full-time</option>
              <option value="part-time">part-time</option>
              <option value="internship">internship</option>
              <option value="contract">contract</option>
            </select>
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the role and responsibilities (min ~20 chars)."
            />
          </label>
          <label>
            Requirements
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
              placeholder="List requirements (skills, experience)."
            />
          </label>
          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Posting..." : "Post job"}
          </button>
        </form>
      </section>

      <section>
        <h2>Your jobs</h2>
        <ul className="card-list">
          {jobs.map((job) => (
            <li key={job.id} className="card">
              <h3>{job.title}</h3>
              <p className="auth-footer">
                <b>{job.companyName}</b> • {job.location} • {job.employmentType} •{" "}
                {job.isActive ? "active" : "inactive"}
              </p>
              <button
                className="secondary-btn"
                onClick={() => toggleActive(job)}
                disabled={busy}
              >
                {job.isActive ? "Deactivate" : "Activate"}
              </button>{" "}
              <button
                className="primary-btn ghost"
                onClick={async () => {
                  setSelectedJobId(job.id);
                  await loadApps(job.id);
                }}
                disabled={busy}
              >
                View applications
              </button>
            </li>
          ))}
        </ul>
        {!jobs.length && <p>No jobs posted yet.</p>}
      </section>

      {selectedJobId && (
        <section>
          <h2>Applications</h2>
          <ul className="card-list">
            {apps.map((a) => (
              <li key={a.id} className="card">
                <h3>{a.applicantName || "Applicant"}</h3>
                <p className="auth-footer">{a.applicantEmail}</p>
                {a.message && <p>{a.message}</p>}
                <p className="auth-footer">
                  Applied: {new Date(a.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          {!apps.length && <p>No applications yet for this job.</p>}
        </section>
      )}
    </div>
  );
};

export default EmployerDashboard;

