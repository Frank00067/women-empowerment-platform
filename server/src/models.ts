export type UserRole = "learner" | "admin" | "employer";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "word" | "excel" | "digital-skills" | "career";
  lessons: Lesson[];
  isPublished: boolean;
  createdBy: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  completedAt?: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateCode: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link";
  url: string;
  description?: string;
  mentorship?: boolean;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: "full-time" | "part-time" | "internship" | "contract";
  description: string;
  requirements: string;
  createdBy: string; // employer userId
  createdAt: Date;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string; // learner userId
  message?: string;
  createdAt: Date;
}

export type NotificationType =
  | "job_posted"
  | "job_applied"
  | "course_completed"
  | "general";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: Date;
  readAt?: Date;
  link?: string;
}

