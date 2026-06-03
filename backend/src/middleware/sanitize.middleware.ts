import { Request, Response, NextFunction } from "express";

// XSS attack se bachao — user input mein script tags inject karne ki koshish
// dangerous characters ko strip karte hain

const stripDangerousChars = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "") // script tags
      .replace(/<[^>]+>/g, "")                              // any HTML tags
      .replace(/javascript:/gi, "")                         // javascript: URLs
      .replace(/on\w+\s*=/gi, "")                           // onclick= etc
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(stripDangerousChars);
  }

  if (value !== null && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(value as object)) {
      sanitized[key] = stripDangerousChars((value as Record<string, unknown>)[key]);
    }
    return sanitized;
  }

  return value;
};

// NoSQL injection se bachao — MongoDB operators like $where, $gt wagerah
const stripMongoOperators = (value: unknown): unknown => {
  if (typeof value === "string") {
    // $ se shuru hone wale keys dangerous hain MongoDB mein
    if (value.startsWith("$")) return "";
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stripMongoOperators);
  }

  if (value !== null && typeof value === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(value as object)) {
      // key khud bhi sanitize karo
      if (key.startsWith("$")) continue;
      sanitized[key] = stripMongoOperators((value as Record<string, unknown>)[key]);
    }
    return sanitized;
  }

  return value;
};

export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = stripDangerousChars(stripMongoOperators(req.body));
  }
  next();
};

export const sanitizeQuery = (req: Request, res: Response, next: NextFunction): void => {
  if (req.query) {
    req.query = stripDangerousChars(stripMongoOperators(req.query)) as typeof req.query;
  }
  next();
};
