import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";
import { notifications } from "../store";

const router = Router();

router.get("/", requireAuth, (req: AuthRequest, res) => {
  const mine = notifications
    .filter((n) => n.userId === req.user!.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  res.json(mine);
});

router.post("/mark-all-read", requireAuth, (req: AuthRequest, res) => {
  const now = new Date();
  notifications.forEach((n) => {
    if (n.userId === req.user!.id && !n.readAt) {
      n.readAt = now;
    }
  });
  res.status(204).send();
});

router.post("/:id/read", requireAuth, (req: AuthRequest, res) => {
  const n = notifications.find((x) => x.id === req.params.id);
  if (!n || n.userId !== req.user!.id) {
    return res.status(404).json({ message: "Notification not found" });
  }
  n.readAt = new Date();
  res.json(n);
});

export default router;

