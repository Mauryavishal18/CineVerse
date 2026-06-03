import { Router } from "express";
import { getAIRecommendations } from "../controllers/ai.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/recommend", authMiddleware, getAIRecommendations);

export default router;
