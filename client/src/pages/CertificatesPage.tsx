import { useEffect, useState } from "react";
import axios from "axios";

interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  certificateCode: string;
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    axios.get("/api/dashboard/learner").then((res) => {
      setCertificates(res.data.certificates);
    });
  }, []);

  return (
    <div className="page">
      <h1>Your certificates</h1>
      <p className="page-intro">
        Download and share certificates for courses you have successfully
        completed.
      </p>
      <div className="card-grid">
        {certificates.map((c) => (
          <article key={c.id} className="card">
            <h3>Course ID: {c.courseId}</h3>
            <p>Code: {c.certificateCode}</p>
            <p>
              Issued on{" "}
              {new Date(c.issuedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </article>
        ))}
        {!certificates.length && (
          <p>You will see your certificates here after completing courses.</p>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;

