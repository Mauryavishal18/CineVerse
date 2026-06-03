import { useNavigate } from "react-router-dom";
import { Movie } from "../types";

interface Props { movie: Movie; }

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const HeroBanner = ({ movie }: Props) => {
  const navigate = useNavigate();
  const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE}/original${movie.backdrop_path}` : "";

  return (
    <div
      className="relative h-[70vh] flex items-end pb-16 px-8 bg-cover bg-center bg-gray-900"
      style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="relative z-10 max-w-lg">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-3 leading-tight">{movie.title}</h1>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-5">{movie.overview}</p>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/movie/${movie.id}`)} className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2.5 rounded text-sm transition">
            ▶ Play
          </button>
          <button onClick={() => navigate(`/movie/${movie.id}`)} className="bg-gray-500/70 hover:bg-gray-500/90 text-white font-semibold px-6 py-2.5 rounded text-sm transition">
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
