import { Request, Response, NextFunction } from "express";

// Regex patterns — tight validation taaki garbage data na aaye
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

interface ValidationError {
  field: string;
  message: string;
}

const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!name || typeof name !== "string" || !NAME_REGEX.test(name.trim())) {
    errors.push({ field: "name", message: "Name must be 2-50 characters, letters only." });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Please provide a valid email address." });
  }

  if (!password || typeof password !== "string" || password.length < 6 || password.length > 100) {
    errors.push({ field: "password", message: "Password must be between 6 and 100 characters." });
  }

  // commonly used passwords block karo
  const commonPasswords = ["123456", "password", "123456789", "qwerty", "abc123", "password1"];
  if (password && commonPasswords.includes(password.toLowerCase())) {
    errors.push({ field: "password", message: "This password is too common. Please choose a stronger one." });
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, message: "Validation failed.", errors });
    return;
  }

  next();
};

const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Please provide a valid email address." });
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push({ field: "password", message: "Password is required." });
  }

  // password length check — 200 chars se zyada? sus hai
  if (password && password.length > 200) {
    errors.push({ field: "password", message: "Invalid credentials." });
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, message: "Validation failed.", errors });
    return;
  }

  next();
};

const validateWatchlistAdd = (req: Request, res: Response, next: NextFunction): void => {
  const { movieId, title } = req.body;

  if (!movieId || typeof movieId !== "number" || !Number.isInteger(movieId) || movieId <= 0) {
    res.status(400).json({ success: false, message: "Invalid movie ID." });
    return;
  }

  if (!title || typeof title !== "string" || title.trim().length === 0 || title.length > 200) {
    res.status(400).json({ success: false, message: "Invalid movie title." });
    return;
  }

  next();
};

export { validateRegister, validateLogin, validateWatchlistAdd };
