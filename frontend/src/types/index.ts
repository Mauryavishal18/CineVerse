export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  videos?: { results: VideoResult[] };
  credits?: { cast: CastMember[] };
}

export interface VideoResult {
  key: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WatchlistItem {
  movieId: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  addedAt: string;
}

export interface AIRecommendation {
  title: string;
  year: number;
  reason: string;
  genre: string;
  rating: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
}
