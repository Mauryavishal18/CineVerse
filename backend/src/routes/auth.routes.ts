import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";
import { validateRegister, validateLogin } from "../middleware/validate.middleware";

const router = Router();

// auth routes pe rate limiting aur validation dono lagao
router.post("/register", authRateLimiter, validateRegister, register);
router.post("/login", authRateLimiter, validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;
