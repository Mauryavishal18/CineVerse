import { Request, Response } from "express";
import { env } from "../config/env";

const fetchFromTMDB = async (endpoint: string): Promise<any> => {
  const url = `${env.tmdbBaseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.tmdbApiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
};

export const getTrending = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchFromTMDB("/trending/movie/week?language=en-US");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending movies." });
  }
};

export const getNowPlaying = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1 } = req.query;
    const data = await fetchFromTMDB(`/movie/now_playing?language=en-US&page=${page}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch now playing movies." });
  }
};

export const getTopRated = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1 } = req.query;
    const data = await fetchFromTMDB(`/movie/top_rated?language=en-US&page=${page}`);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top rated movies." });
  }
};

export const getUpcoming = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchFromTMDB("/movie/upcoming?language=en-US");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch upcoming movies." });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `/movie/${id}?language=en-US&append_to_response=videos,credits`
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie details." });
  }
};

export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      res.status(400).json({ message: "Search query is required." });
      return;
    }

    const data = await fetchFromTMDB(
      `/search/movie?query=${encodeURIComponent(query as string)}&language=en-US&page=${page}`
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Search failed." });
  }
};

export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genreId, page = 1 } = req.query;

    if (!genreId) {
      res.status(400).json({ message: "Genre ID is required." });
      return;
    }

    const data = await fetchFromTMDB(
      `/discover/movie?with_genres=${genreId}&language=en-US&page=${page}&sort_by=popularity.desc`
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies by genre." });
  }
};

export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchFromTMDB("/genre/movie/list?language=en-US");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch genres." });
  }
};
