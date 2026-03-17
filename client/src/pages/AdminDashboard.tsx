import { useEffect, useState } from "react";
import axios from "axios";

type CourseCategory = "word" | "excel" | "digital-skills" | "career";

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

interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  isPublished: boolean;
  lessons: { id: string; title: string; content: string; order: number }[];
}

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link";
  url: string;
  description?: string;
  mentorship?: boolean;
}

interface AdminDashboardData {
  stats: AdminStats;
  recentCertificates: Certificate[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] =
    useState<CourseCategory>("digital-skills");
  const [courseLessonsText, setCourseLessonsText] = useState(
    "Lesson 1 title | Lesson 1 content\nLesson 2 title | Lesson 2 content"
  );

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState<Resource["type"]>("link");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceMentorship, setResourceMentorship] = useState(true);

  useEffect(() => {
    refreshAll();
  }, []);

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  async function refreshAll() {
    const [adminDash, courseList, resourceList] = await Promise.all([
      axios.get("/api/dashboard/admin"),
      axios.get("/api/courses"),
      axios.get("/api/resources"),
    ]);
    setData(adminDash.data);
    setCourses(courseList.data);
    setResources(resourceList.data);
  }

  function parseLessons(text: string) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const lessons = lines
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        const title = parts[0];
        const content = parts.slice(1).join(" | ").trim();
        if (!title || !content) return null;
        return { title, content };
      })
      .filter(Boolean) as { title: string; content: string }[];

    return lessons;
  }

  async function createCourse() {
    setBusy(true);
    setError(null);
    try {
      const lessons = parseLessons(courseLessonsText);
      if (!courseTitle.trim()) throw new Error("Course title is required.");
      if (courseDescription.trim().length < 10)
        throw new Error("Course description must be at least 10 characters.");
      if (lessons.length < 1)
        throw new Error(
          "Add at least 1 lesson. Format: Title | Content (one per line)."
        );

      await axios.post("/api/courses", {
        title: courseTitle.trim(),
        description: courseDescription.trim(),
        category: courseCategory,
        lessons,
      });

      setCourseTitle("");
      setCourseDescription("");
      await refreshAll();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to create course");
    } finally {
      setBusy(false);
    }
  }

  async function deleteCourse(courseId: string) {
    setBusy(true);
    setError(null);
    try {
      await axios.delete(`/api/courses/${courseId}`);
      await refreshAll();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete course");
    } finally {
      setBusy(false);
    }
  }

  async function createResource() {
    setBusy(true);
    setError(null);
    try {
      if (!resourceTitle.trim()) throw new Error("Resource title is required.");
      if (!resourceUrl.trim()) throw new Error("Resource URL is required.");

      await axios.post("/api/resources", {
        title: resourceTitle.trim(),
        type: resourceType,
        url: resourceUrl.trim(),
        description: resourceDescription.trim() || undefined,
        mentorship: resourceMentorship,
      });

      setResourceTitle("");
      setResourceUrl("");
      setResourceDescription("");
      await refreshAll();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to create resource");
    } finally {
      setBusy(false);
    }
  }

  async function deleteResource(resourceId: string) {
    setBusy(true);
    setError(null);
    try {
      await axios.delete(`/api/resources/${resourceId}`);
      await refreshAll();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete resource");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dashboard">
      <h1>Admin overview</h1>
      {error && <div className="error-banner">{error}</div>}
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
        <h2>Create a course</h2>
        <div className="card">
          <label>
            Title
            <input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. Microsoft Excel Basics"
            />
          </label>
          <label>
            Description
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Short description learners will see."
            />
          </label>
          <label>
            Category
            <select
              value={courseCategory}
              onChange={(e) => setCourseCategory(e.target.value as CourseCategory)}
            >
              <option value="word">word</option>
              <option value="excel">excel</option>
              <option value="digital-skills">digital-skills</option>
              <option value="career">career</option>
            </select>
          </label>
          <label>
            Lessons (one per line: <code>Title | Content</code>)
            <textarea
              value={courseLessonsText}
              onChange={(e) => setCourseLessonsText(e.target.value)}
            />
          </label>
          <button className="primary-btn" onClick={createCourse} disabled={busy}>
            {busy ? "Working..." : "Create course"}
          </button>
        </div>
      </section>

      <section>
        <h2>Courses</h2>
        {courses.length ? (
          <ul className="card-list">
            {courses.map((c) => (
              <li key={c.id} className="card">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <p className="auth-footer">
                  Category: <b>{c.category}</b> • Lessons: <b>{c.lessons.length}</b>
                </p>
                <button
                  className="secondary-btn"
                  onClick={() => deleteCourse(c.id)}
                  disabled={busy}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses yet.</p>
        )}
      </section>

      <section>
        <h2>Add mentorship/resources</h2>
        <div className="card">
          <label>
            Title
            <input
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              placeholder="e.g. Women in Tech mentorship program"
            />
          </label>
          <label>
            Type
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as Resource["type"])}
            >
              <option value="link">link</option>
              <option value="video">video</option>
              <option value="pdf">pdf</option>
            </select>
          </label>
          <label>
            URL
            <input
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>
          <label>
            Description (optional)
            <textarea
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={resourceMentorship}
              onChange={(e) => setResourceMentorship(e.target.checked)}
            />{" "}
            Show under mentorship page
          </label>
          <button className="primary-btn" onClick={createResource} disabled={busy}>
            {busy ? "Working..." : "Add resource"}
          </button>
        </div>
      </section>

      <section>
        <h2>Resources</h2>
        {resources.length ? (
          <ul className="card-list">
            {resources.map((r) => (
              <li key={r.id} className="card">
                <h3>{r.title}</h3>
                {r.description && <p>{r.description}</p>}
                <p className="auth-footer">
                  Type: <b>{r.type}</b> • Mentorship: <b>{r.mentorship ? "yes" : "no"}</b>
                </p>
                <a className="primary-btn ghost" href={r.url} target="_blank">
                  Open
                </a>{" "}
                <button
                  className="secondary-btn"
                  onClick={() => deleteResource(r.id)}
                  disabled={busy}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No resources yet.</p>
        )}
      </section>

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

