import { Router } from "express";
import {
  getTrending,
  getNowPlaying,
  getTopRated,
  getUpcoming,
  getMovieById,
  searchMovies,
  getMoviesByGenre,
  getGenres,
} from "../controllers/movie.controller";

const router = Router();

router.get("/trending", getTrending);
router.get("/now-playing", getNowPlaying);
router.get("/top-rated", getTopRated);
router.get("/upcoming", getUpcoming);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/by-genre", getMoviesByGenre);
router.get("/:id", getMovieById);

export default router;
