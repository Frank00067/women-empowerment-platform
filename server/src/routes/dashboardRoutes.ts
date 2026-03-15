import { Router } from "express";
import { requireAuth, AuthRequest, requireRole } from "../middleware/authMiddleware";
import { progresses, certificates, courses, users } from "../store";

const router = Router();

router.get("/learner", requireAuth, (req: AuthRequest, res) => {
  const userProgress = progresses.filter((p) => p.userId === req.user!.id);
  const userCertificates = certificates.filter(
    (c) => c.userId === req.user!.id
  );

  const detailedProgress = userProgress.map((p) => {
    const course = courses.find((c) => c.id === p.courseId);
    return {
      ...p,
      courseTitle: course?.title,
      totalLessons: course?.lessons.length || 0,
    };
  });

  res.json({
    progress: detailedProgress,
    certificates: userCertificates,
  });
});

router.get("/admin", requireAuth, requireRole("admin"), (_req, res) => {
  const totalUsers = users.length;
  const totalLearners = users.filter((u) => u.role === "learner").length;
  const totalCourses = courses.length;
  const totalCertificates = certificates.length;

  res.json({
    stats: {
      totalUsers,
      totalLearners,
      totalCourses,
      totalCertificates,
    },
    recentCertificates: certificates.slice(-10),
  });
});

export default router;

