import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth, requireRole, AuthRequest } from "../middleware/authMiddleware";
import { courses, progresses, certificates, notifications } from "../store";
import { Course, Lesson } from "../models";
import { v4 as uuid } from "uuid";

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", requireAuth, (req: AuthRequest, res) => {
  if (req.user?.role === "admin") {
    return res.json(courses);
  }
  const publicCourses = courses.filter((c) => c.isPublished);
  return res.json(publicCourses);
});

router.get("/:courseId", requireAuth, (req, res) => {
  const course = courses.find((c) => c.id === req.params.courseId);
  if (!course || !course.isPublished) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json(course);
});

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  body("title").isString().isLength({ min: 3 }),
  body("description").isString().isLength({ min: 10 }),
  body("category").isIn(["word", "excel", "digital-skills", "career"]),
  body("lessons").isArray({ min: 1 }),
  validate,
  (req: AuthRequest, res) => {
    const { title, description, category, lessons } = req.body as {
      title: string;
      description: string;
      category: Course["category"];
      lessons: { title: string; content: string }[];
    };

    const courseLessons: Lesson[] = lessons.map((l, index) => ({
      id: uuid(),
      title: l.title,
      content: l.content,
      order: index + 1,
    }));

    const course: Course = {
      id: uuid(),
      title,
      description,
      category,
      lessons: courseLessons,
      isPublished: true,
      createdBy: req.user!.id,
    };

    courses.push(course);
    res.status(201).json(course);
  }
);

router.put(
  "/:courseId",
  requireAuth,
  requireRole("admin"),
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("isPublished").optional().isBoolean(),
  validate,
  (req, res) => {
    const course = courses.find((c) => c.id === req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { title, description, isPublished } = req.body as Partial<Course>;
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (isPublished !== undefined) course.isPublished = isPublished;

    res.json(course);
  }
);

router.delete("/:courseId", requireAuth, requireRole("admin"), (req, res) => {
  const index = courses.findIndex((c) => c.id === req.params.courseId);
  if (index === -1) {
    return res.status(404).json({ message: "Course not found" });
  }
  courses.splice(index, 1);
  res.status(204).send();
});

router.post(
  "/:courseId/lessons/:lessonId/complete",
  requireAuth,
  (req: AuthRequest, res) => {
    const { courseId, lessonId } = req.params;
    const course = courses.find((c) => c.id === courseId && c.isPublished);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    let progress = progresses.find(
      (p) => p.userId === req.user!.id && p.courseId === courseId
    );
    if (!progress) {
      progress = {
        id: uuid(),
        userId: req.user!.id,
        courseId,
        completedLessonIds: [],
      };
      progresses.push(progress);
    }

    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
    }

    const allLessonIds = course.lessons.map((l) => l.id);
    const allCompleted = allLessonIds.every((id) =>
      progress!.completedLessonIds.includes(id)
    );

    if (allCompleted && !progress.completedAt) {
      progress.completedAt = new Date();

      const existingCert = certificates.find(
        (c) => c.userId === req.user!.id && c.courseId === courseId
      );
      if (!existingCert) {
        certificates.push({
          id: uuid(),
          userId: req.user!.id,
          courseId,
          issuedAt: new Date(),
          certificateCode: `CERT-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`,
        });
      }

      notifications.push({
        id: uuid(),
        userId: req.user!.id,
        type: "course_completed",
        title: "Course completed",
        body: `You completed: ${course.title}. Your certificate is ready.`,
        createdAt: new Date(),
        link: "/certificates",
      });
    }

    res.json(progress);
  }
);

export default router;

