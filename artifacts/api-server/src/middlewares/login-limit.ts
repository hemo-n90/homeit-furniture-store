import type { Request, Response, NextFunction } from "express";

// Per-process guard. Use a shared gateway/store when running multiple replicas.
export function createLoginLimiter(now = Date.now) {
  const attempts = new Map<string, { count: number; expires: number }>();
  const windowMs = 15 * 60 * 1000;
  return (req: Request, res: Response, next: NextFunction) => {
    const time = now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let entry = attempts.get(key);
    if (!entry || entry.expires <= time) {
      if (attempts.size >= 10000) {
        for (const [ip, value] of attempts) if (value.expires <= time) attempts.delete(ip);
        if (attempts.size >= 10000) return res.status(429).json({ error: "Too many login attempts" });
      }
      entry = { count: 0, expires: time + windowMs };
      attempts.set(key, entry);
    }
    entry.count++;
    if (entry.count > 10) {
      res.setHeader("Retry-After", String(Math.ceil((entry.expires - time) / 1000)));
      return res.status(429).json({ error: "Too many login attempts" });
    }
    return next();
  };
}
