import { useState } from "react";

const CVBuilderPage = () => {
  const [fullName, setFullName] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  const cvText = `
${fullName.toUpperCase()}

PROFILE
${summary}

EXPERIENCE
${experience}

EDUCATION
${education}

SKILLS
${skills}
`.trim();

  return (
    <div className="page cv-builder">
      <h1>CV / Resume builder</h1>
      <p className="page-intro">
        Use this guided template to create a simple, professional CV ready to
        download or copy into Word.
      </p>
      <div className="cv-grid">
        <form className="cv-form">
          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Amina Ndlovu"
            />
          </label>
          <label>
            Profile summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="2–3 sentences about your strengths and goals."
            />
          </label>
          <label>
            Experience
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="- Role, Organisation, dates
- Key achievement"
            />
          </label>
          <label>
            Education
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="- Qualification, Institution, year"
            />
          </label>
          <label>
            Skills
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Microsoft Word, Excel, Communication, Teamwork"
            />
          </label>
        </form>
        <section className="cv-preview">
          <h2>Preview</h2>
          <pre>{cvText}</pre>
        </section>
      </div>
    </div>
  );
};

export default CVBuilderPage;

