import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { users } from "../store";
import { UserRole } from "../models";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as {
      userId: string;
      role: UserRole;
    };

    const user = users.find((u) => u.id === payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(role: UserRole) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

