import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest } from "../types";

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// token blacklist — logout ke baad token phir kaam na kare
// production mein Redis use karo is set ki jagah
const blacklistedTokens = new Set<string>();

export const blacklistToken = (token: string): void => {
  blacklistedTokens.add(token);

  // expired tokens auto-clean karte rehte hain
  // warna Set mein memory barta jayega
  setTimeout(() => blacklistedTokens.delete(token), 7 * 24 * 60 * 60 * 1000);
};

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Access denied. Please log in." });
    return;
  }

  const token = authHeader.split(" ")[1];

  // token format check — ek dot bhi galat nahi hona chahiye
  if (!token || token.split(".").length !== 3) {
    res.status(401).json({ success: false, message: "Invalid token format." });
    return;
  }

  // blacklisted token — logout ke baad wala token
  if (blacklistedTokens.has(token)) {
    res.status(401).json({ success: false, message: "Token has been invalidated. Please log in again." });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    // token mein id aur email dono hone chahiye
    if (!decoded.id || !decoded.email) {
      res.status(401).json({ success: false, message: "Invalid token payload." });
      return;
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    } else {
      res.status(401).json({ success: false, message: "Authentication failed." });
    }
  }
};

export default authMiddleware;
