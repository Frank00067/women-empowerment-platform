import { useEffect, useState } from "react";
import axios from "axios";

interface AdminStats {
  totalUsers: number;
  totalLearners: number;
  totalCourses: number;
  totalCertificates: number;
}

interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateCode: string;
}

interface AdminDashboardData {
  stats: AdminStats;
  recentCertificates: Certificate[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    axios.get("/api/dashboard/admin").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h1>Admin overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Learners</h3>
          <p>{data.stats.totalLearners}</p>
        </div>
        <div className="stat-card">
          <h3>Courses</h3>
          <p>{data.stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Certificates issued</h3>
          <p>{data.stats.totalCertificates}</p>
        </div>
        <div className="stat-card">
          <h3>Total users</h3>
          <p>{data.stats.totalUsers}</p>
        </div>
      </div>
      <section>
        <h2>Recent certificates</h2>
        {data.recentCertificates.length ? (
          <ul className="card-list">
            {data.recentCertificates.map((c) => (
              <li key={c.id} className="card">
                <p>Code: {c.certificateCode}</p>
                <p>Course: {c.courseId}</p>
                <p>Learner: {c.userId}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No certificates yet.</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;

