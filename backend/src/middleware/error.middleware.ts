import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// production mein stack trace kabhi client ko mat bhejna
// attacker ko internal structure pata nahi chalna chahiye
const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  // 500 errors ka real message chhupao — generic message do
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "An unexpected error occurred. Please try again."
      : err.message || "Something went wrong.";

  // server side pe poora error log karo debugging ke liye
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      path: req.path,
    }),
  });
};

export default errorMiddleware;
