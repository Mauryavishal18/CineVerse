import { Request, Response, NextFunction } from "express";

// simple in-memory rate limiter — Redis nahi hai toh ye kaam karega
// production mein express-rate-limit + Redis use karna

interface RateLimitEntry {
  count: number;
  firstRequestTime: number;
}

const store = new Map<string, RateLimitEntry>();

const createRateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const entry = store.get(ip);

    if (!entry || now - entry.firstRequestTime > windowMs) {
      // naya window start karo
      store.set(ip, { count: 1, firstRequestTime: now });
      next();
      return;
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please slow down and try again later.",
      });
      return;
    }

    entry.count += 1;
    next();
  };
};

// auth routes ke liye strict limit — brute force se bachao
export const authRateLimiter = createRateLimiter(10, 15 * 60 * 1000); // 10 req per 15 min

// general API ke liye thoda loose
export const apiRateLimiter = createRateLimiter(100, 60 * 1000); // 100 req per min

// cleanup old entries every 10 minutes taaki memory leak na ho
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  for (const [key, value] of store.entries()) {
    if (now - value.firstRequestTime > windowMs) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);
