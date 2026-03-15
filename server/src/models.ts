export type UserRole = "learner" | "admin";

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

