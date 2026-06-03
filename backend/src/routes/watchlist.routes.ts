import { Router } from "express";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlist.controller";
import authMiddleware from "../middleware/auth.middleware";
import { validateWatchlistAdd } from "../middleware/validate.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getWatchlist);
router.post("/add", validateWatchlistAdd, addToWatchlist);
router.delete("/remove/:movieId", removeFromWatchlist);

export default router;
