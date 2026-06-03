import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "fallback_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  tmdbApiKey: process.env.TMDB_API_KEY || "",
  tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  groqApiKey: process.env.GROQ_API_KEY || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
