import { User, Course, Progress, Certificate, Resource } from "./models";
import { v4 as uuid } from "uuid";

// In-memory store for initial implementation.
// This can be replaced with a real database (PostgreSQL/MongoDB/MySQL).

export const users: User[] = [];
export const courses: Course[] = [];
export const progresses: Progress[] = [];
export const certificates: Certificate[] = [];
export const resources: Resource[] = [];

export function createDefaultAdmin() {
  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    users.push({
      id: uuid(),
      name: "Platform Admin",
      email: "admin@example.com",
      passwordHash: "",
      role: "admin",
      createdAt: new Date(),
    });
  }
}

