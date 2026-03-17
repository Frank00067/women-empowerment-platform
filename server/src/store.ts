import { User, Course, Progress, Certificate, Resource } from "./models";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

// In-memory store for initial implementation.
// This can be replaced with a real database (PostgreSQL/MongoDB/MySQL).

export const users: User[] = [];
export const courses: Course[] = [];
export const progresses: Progress[] = [];
export const certificates: Certificate[] = [];
export const resources: Resource[] = [];

export function seedData() {
  const shouldSeed = (process.env.SEED_DATA || "true").toLowerCase() === "true";
  if (!shouldSeed) return;

  createDefaultAdmin();
  createStarterCourses();
  createStarterResources();
}

export function createDefaultAdmin() {
  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    const email = (process.env.DEFAULT_ADMIN_EMAIL || "admin@demo.com").toLowerCase();
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "password123";
    const passwordHash = bcrypt.hashSync(password, 10);

    users.push({
      id: uuid(),
      name: "Platform Admin",
      email,
      passwordHash,
      role: "admin",
      createdAt: new Date(),
    });
  }
}

function createStarterCourses() {
  if (courses.length > 0) return;

  const admin = users.find((u) => u.role === "admin");
  const createdBy = admin?.id || uuid();

  courses.push(
    {
      id: uuid(),
      title: "Microsoft Word Basics",
      description:
        "Learn document creation, formatting, styles, and saving/exporting professional documents.",
      category: "word",
      isPublished: true,
      createdBy,
      lessons: [
        {
          id: uuid(),
          title: "Getting started with Word",
          content:
            "Understand the Word interface, create a new document, and practice basic editing.",
          order: 1,
        },
        {
          id: uuid(),
          title: "Formatting like a pro",
          content:
            "Use fonts, headings, spacing, alignment, and styles to make clean documents.",
          order: 2,
        },
        {
          id: uuid(),
          title: "Tables, lists, and export",
          content:
            "Create tables and bullet lists, then save and export your document to PDF.",
          order: 3,
        },
      ],
    },
    {
      id: uuid(),
      title: "Microsoft Excel Essentials",
      description:
        "Build confidence with spreadsheets: data entry, formulas, formatting, and simple charts.",
      category: "excel",
      isPublished: true,
      createdBy,
      lessons: [
        {
          id: uuid(),
          title: "Excel basics",
          content:
            "Workbooks, worksheets, cells, rows/columns, and efficient data entry tips.",
          order: 1,
        },
        {
          id: uuid(),
          title: "Formulas and functions",
          content:
            "Learn SUM, AVERAGE, IF, and best practices for writing formulas.",
          order: 2,
        },
        {
          id: uuid(),
          title: "Charts and presentation",
          content:
            "Create a simple chart and format your sheet for sharing and printing.",
          order: 3,
        },
      ],
    },
    {
      id: uuid(),
      title: "Career Readiness: CV + Job Applications",
      description:
        "Write a strong CV, tailor it for roles, and prepare for interviews with practical tips.",
      category: "career",
      isPublished: true,
      createdBy,
      lessons: [
        {
          id: uuid(),
          title: "Build your CV structure",
          content:
            "Sections that matter: summary, skills, experience, education, and achievements.",
          order: 1,
        },
        {
          id: uuid(),
          title: "Tailor your application",
          content:
            "How to match your CV to a job description and write a simple cover note.",
          order: 2,
        },
        {
          id: uuid(),
          title: "Interview confidence",
          content:
            "Common interview questions and a checklist to prepare with confidence.",
          order: 3,
        },
      ],
    }
  );
}

function createStarterResources() {
  if (resources.length > 0) return;

  resources.push(
    {
      id: uuid(),
      title: "Mentorship: How to find and work with a mentor",
      type: "link",
      url: "https://www.careeronestop.org/JobSearch/Network/mentor.aspx",
      description:
        "Practical guidance on finding a mentor and building a mentoring relationship.",
      mentorship: true,
    },
    {
      id: uuid(),
      title: "Interview preparation checklist",
      type: "link",
      url: "https://www.indeed.com/career-advice/interviewing/interview-preparation",
      description:
        "A simple checklist to help you prepare for interviews and reduce anxiety.",
      mentorship: true,
    },
    {
      id: uuid(),
      title: "Excel practice ideas (projects)",
      type: "link",
      url: "https://support.microsoft.com/en-us/excel",
      description:
        "Explore Excel help topics and try small spreadsheet projects for practice.",
      mentorship: false,
    }
  );
}

