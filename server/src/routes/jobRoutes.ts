import { Router } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import { requireAuth, AuthRequest, requireAnyRole } from "../middleware/authMiddleware";
import { applications, jobs, notifications, users } from "../store";
import { Job, Notification } from "../models";

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", requireAuth, (req: AuthRequest, res) => {
  // Learners see active jobs; employers/admins can see all
  if (req.user?.role === "learner") {
    return res.json(jobs.filter((j) => j.isActive));
  }
  return res.json(jobs);
});

router.get("/mine", requireAuth, requireAnyRole(["employer", "admin"]), (req: AuthRequest, res) => {
  const mine = jobs.filter((j) => j.createdBy === req.user!.id);
  return res.json(mine);
});

router.post(
  "/",
  requireAuth,
  requireAnyRole(["employer", "admin"]),
  body("title").isString().isLength({ min: 3 }),
  body("companyName").isString().isLength({ min: 2 }),
  body("location").isString().isLength({ min: 2 }),
  body("employmentType").isIn(["full-time", "part-time", "internship", "contract"]),
  body("description").isString().isLength({ min: 20 }),
  body("requirements").isString().isLength({ min: 10 }),
  validate,
  (req: AuthRequest, res) => {
    const payload = req.body as Omit<Job, "id" | "createdBy" | "createdAt" | "isActive">;

    const job: Job = {
      id: uuid(),
      ...payload,
      createdBy: req.user!.id,
      createdAt: new Date(),
      isActive: true,
    };
    jobs.push(job);

    // Notify learners that a new job is available
    const learnerIds = users.filter((u) => u.role === "learner").map((u) => u.id);
    learnerIds.forEach((userId) => {
      const n: Notification = {
        id: uuid(),
        userId,
        type: "job_posted",
        title: "New job posted",
        body: `${job.title} at ${job.companyName} (${job.location})`,
        createdAt: new Date(),
        link: "/jobs",
      };
      notifications.push(n);
    });

    return res.status(201).json(job);
  }
);

router.post(
  "/:jobId/apply",
  requireAuth,
  requireAnyRole(["learner", "admin"]),
  body("message").optional().isString().isLength({ max: 2000 }),
  validate,
  (req: AuthRequest, res) => {
    const job = jobs.find((j) => j.id === req.params.jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }

    const already = applications.some(
      (a) => a.jobId === job.id && a.userId === req.user!.id
    );
    if (already) {
      return res.status(409).json({ message: "You already applied for this job" });
    }

    const applicationId = uuid();
    applications.push({
      id: applicationId,
      jobId: job.id,
      userId: req.user!.id,
      message: req.body.message,
      createdAt: new Date(),
    });

    // Notify employer
    notifications.push({
      id: uuid(),
      userId: job.createdBy,
      type: "job_applied",
      title: "New job application",
      body: `A learner applied for: ${job.title}`,
      createdAt: new Date(),
      link: "/employer",
    });

    // Notify learner
    notifications.push({
      id: uuid(),
      userId: req.user!.id,
      type: "job_applied",
      title: "Application sent",
      body: `You applied for: ${job.title} at ${job.companyName}`,
      createdAt: new Date(),
      link: "/jobs",
    });

    return res.status(201).json({ id: applicationId });
  }
);

router.get(
  "/:jobId/applications",
  requireAuth,
  requireAnyRole(["employer", "admin"]),
  (req: AuthRequest, res) => {
    const job = jobs.find((j) => j.id === req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user!.role === "employer" && job.createdBy !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const jobApps = applications
      .filter((a) => a.jobId === job.id)
      .map((a) => {
        const user = users.find((u) => u.id === a.userId);
        return {
          ...a,
          applicantName: user?.name,
          applicantEmail: user?.email,
        };
      });

    return res.json(jobApps);
  }
);

router.patch(
  "/:jobId",
  requireAuth,
  requireAnyRole(["employer", "admin"]),
  body("isActive").optional().isBoolean(),
  validate,
  (req: AuthRequest, res) => {
    const job = jobs.find((j) => j.id === req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user!.role === "employer" && job.createdBy !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.body.isActive !== undefined) job.isActive = !!req.body.isActive;
    return res.json(job);
  }
);

export default router;

