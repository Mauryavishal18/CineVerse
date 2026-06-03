import { Request, Response, NextFunction } from "express";

// Security headers manually set karte hain — helmet ka lightweight alternative
// ye headers browsers ko batate hain ki kya allowed hai aur kya nahi

export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Clickjacking se bachao — site ko iframe mein load nahi hone deta
  res.setHeader("X-Frame-Options", "DENY");

  // Browser sniffing band karo — MIME type confusion attacks se bachao
  res.setHeader("X-Content-Type-Options", "nosniff");

  // XSS protection for older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer info limit karo — dusri sites ko apni URL na dikhao
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Kaunse browser features use ho sakti hain — unnecessary cheezein band
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // HTTPS enforce karo (production mein)
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Server ka naam chhupao — attackers ko tech stack na pata chale
  res.removeHeader("X-Powered-By");

  // Content Security Policy — kahan se scripts/styles load ho sakti hain
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' https://image.tmdb.org data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );

  next();
};
