import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Movie } from "../types";
import { addToWatchlist, removeFromWatchlist } from "../store/watchlistSlice";
import { RootState, AppDispatch } from "../store/store";

interface Props {
  movie: Movie;
}

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const MovieCard = ({ movie }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.watchlist);
  const { token } = useSelector((state: RootState) => state.auth);

  const isInWatchlist = items.some((item) => item.movieId === movie.id);
  const posterUrl = movie.poster_path ? `${IMAGE_BASE}/w300${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image";

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) { navigate("/login"); return; }

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path || "",
        voteAverage: movie.vote_average,
        releaseDate: movie.release_date,
      }));
    }
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 w-36 md:w-44 hover:scale-105 transition-transform duration-200"
    >
      <img src={posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
        <p className="text-white text-xs font-medium line-clamp-2 mb-1">{movie.title}</p>
        <p className="text-yellow-400 text-xs mb-2">⭐ {movie.vote_average.toFixed(1)}</p>
        <button
          onClick={handleWatchlistToggle}
          className={`text-xs py-1 rounded font-medium transition ${isInWatchlist ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white hover:bg-gray-200 text-black"}`}
        >
          {isInWatchlist ? "− Remove" : "+ Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
