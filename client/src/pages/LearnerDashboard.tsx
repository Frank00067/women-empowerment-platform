import { useEffect, useState } from "react";
import axios from "axios";

interface Progress {
  id: string;
  courseId: string;
  courseTitle?: string;
  completedLessonIds: string[];
  totalLessons: number;
  completedAt?: string;
}

interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  certificateCode: string;
}

interface DashboardResponse {
  progress: Progress[];
  certificates: Certificate[];
}

const LearnerDashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    axios.get("/api/dashboard/learner").then((res) => setData(res.data));
  }, []);

  return (
    <div className="dashboard">
      <h1>Your learning journey</h1>
      <div className="dashboard-grid">
        <section>
          <h2>Course progress</h2>
          {data?.progress.length ? (
            <ul className="card-list">
              {data.progress.map((p) => {
                const percentage =
                  p.totalLessons === 0
                    ? 0
                    : Math.round(
                        (p.completedLessonIds.length / p.totalLessons) * 100
                      );
                return (
                  <li key={p.id} className="card">
                    <h3>{p.courseTitle || "Course"}</h3>
                    <p>
                      {p.completedLessonIds.length} of {p.totalLessons} lessons
                      completed
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Enroll in a course to start tracking your progress.</p>
          )}
        </section>
        <section>
          <h2>Certificates</h2>
          {data?.certificates.length ? (
            <ul className="card-list">
              {data.certificates.map((c) => (
                <li key={c.id} className="card">
                  <h3>Course certificate</h3>
                  <p>Code: {c.certificateCode}</p>
                  <p>
                    Issued on{" "}
                    {new Date(c.issuedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You will see your certificates here after completing courses.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default LearnerDashboard;

