import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  description: string;
  category: "word" | "excel" | "digital-skills" | "career";
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios.get("/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="page">
      <h1>Digital skills courses</h1>
      <p className="page-intro">
        Learn the essentials of Microsoft Word, Excel, digital tools, and
        career preparation through short, focused modules.
      </p>
      <div className="card-grid">
        {courses.map((course) => (
          <article key={course.id} className="card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span className="badge">{course.category}</span>
          </article>
        ))}
        {!courses.length && (
          <p>No courses yet. Ask an administrator to add content.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

