import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../store";
import { User, UserRole } from "../models";
import { v4 as uuid } from "uuid";

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  body("name").isString().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["learner", "admin"]),
  validate,
  async (req, res) => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    const existing = users.find((u) => u.email === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuid(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || "learner",
      createdAt: new Date(),
    };
    users.push(user);

    const token = createToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  validate,
  async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

function createToken(user: User) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export default router;

