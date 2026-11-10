import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const configuredSecret = process.env.SESSION_SECRET;
if (!configuredSecret || configuredSecret.trim().length < 32 ||
    /^(replace_|your_|change.?me)/i.test(configuredSecret.trim())) {
  throw new Error("SESSION_SECRET must be a strong, non-placeholder secret of at least 32 characters");
}
const JWT_SECRET: string = configuredSecret;

export interface AuthPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  (req as any).user = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user as AuthPayload;
    if (user.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}

