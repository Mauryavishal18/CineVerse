import { Response } from "express";
import Groq from "groq-sdk";
import { env } from "../config/env";
import { AuthRequest } from "../types";

const groq = new Groq({ apiKey: env.groqApiKey });

export const getAIRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { watchedMovies, preferredGenres, mood } = req.body;

    if (!watchedMovies || watchedMovies.length === 0) {
      res.status(400).json({ message: "Please provide at least one watched movie." });
      return;
    }

    const prompt = `You are a movie recommendation expert. Based on the following information, suggest 5 movies.

User's watched movies: ${watchedMovies.join(", ")}
Preferred genres: ${preferredGenres?.join(", ") || "any"}
Current mood: ${mood || "not specified"}

Respond ONLY with a valid JSON array (no extra text, no markdown). Example format:
[
  {
    "title": "Movie Name",
    "year": 2021,
    "reason": "Short reason why this suits the user",
    "genre": "Action/Drama",
    "rating": 8.2
  }
]`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawResponse = completion.choices[0]?.message?.content || "[]";

    let recommendations;
    try {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      recommendations = [];
    }

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ message: "AI recommendation failed. Try again later." });
  }
};
