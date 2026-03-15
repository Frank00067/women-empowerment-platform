import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth, requireRole } from "../middleware/authMiddleware";
import { resources } from "../store";
import { Resource } from "../models";
import { v4 as uuid } from "uuid";

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", requireAuth, (_req, res) => {
  res.json(resources);
});

router.get("/mentorship", requireAuth, (_req, res) => {
  res.json(resources.filter((r) => r.mentorship));
});

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  body("title").isString().isLength({ min: 3 }),
  body("type").isIn(["pdf", "video", "link"]),
  body("url").isString(),
  body("description").optional().isString(),
  body("mentorship").optional().isBoolean(),
  validate,
  (req, res) => {
    const { title, type, url, description, mentorship } = req.body as Resource;
    const resource: Resource = {
      id: uuid(),
      title,
      type,
      url,
      description,
      mentorship,
    };
    resources.push(resource);
    res.status(201).json(resource);
  }
);

router.delete("/:resourceId", requireAuth, requireRole("admin"), (req, res) => {
  const index = resources.findIndex((r) => r.id === req.params.resourceId);
  if (index === -1) {
    return res.status(404).json({ message: "Resource not found" });
  }
  resources.splice(index, 1);
  res.status(204).send();
});

export default router;

