import { Response } from "express";
import { Watchlist } from "../models/Watchlist.model";
import { AuthRequest } from "../types";

export const getWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = await Watchlist.create({ userId, movies: [] });
    }

    res.status(200).json({ success: true, data: watchlist.movies });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch watchlist." });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { movieId, title, posterPath, voteAverage, releaseDate } = req.body;

    if (!movieId || !title) {
      res.status(400).json({ message: "Movie ID and title are required." });
      return;
    }

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = new Watchlist({ userId, movies: [] });
    }

    const alreadyAdded = watchlist.movies.some((m) => m.movieId === movieId);
    if (alreadyAdded) {
      res.status(409).json({ message: "Movie already in watchlist." });
      return;
    }

    watchlist.movies.push({
      movieId,
      title,
      posterPath: posterPath || "",
      voteAverage: voteAverage || 0,
      releaseDate: releaseDate || "",
      addedAt: new Date(),
    });

    await watchlist.save();
    res.status(200).json({ success: true, message: "Added to watchlist.", data: watchlist.movies });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to watchlist." });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { movieId } = req.params;

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      res.status(404).json({ message: "Watchlist not found." });
      return;
    }

    const initialLength = watchlist.movies.length;
    watchlist.movies = watchlist.movies.filter((m) => m.movieId !== Number(movieId));

    if (watchlist.movies.length === initialLength) {
      res.status(404).json({ message: "Movie not found in watchlist." });
      return;
    }

    await watchlist.save();
    res.status(200).json({ success: true, message: "Removed from watchlist.", data: watchlist.movies });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from watchlist." });
  }
};
