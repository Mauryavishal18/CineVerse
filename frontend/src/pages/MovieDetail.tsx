import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { Movie } from "../types";
import { addToWatchlist, removeFromWatchlist } from "../store/watchlistSlice";
import { RootState, AppDispatch } from "../store/store";
import Loader from "../components/Loader";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const { items } = useSelector((state: RootState) => state.watchlist);
  const { token } = useSelector((state: RootState) => state.auth);
  const isInWatchlist = items.some((item) => item.movieId === Number(id));

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosInstance.get(`/movies/${id}`);
        setMovie(res.data.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!token) { navigate("/login"); return; }
    if (!movie) return;
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist({ movieId: movie.id, title: movie.title, posterPath: movie.poster_path || "", voteAverage: movie.vote_average, releaseDate: movie.release_date }));
    }
  };

  const trailerKey = movie?.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer")?.key || movie?.videos?.results.find((v) => v.site === "YouTube")?.key;

  if (isLoading) return <Loader />;
  if (!movie) return <div className="text-white text-center pt-20">Movie not found.</div>;

  const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE}/original${movie.backdrop_path}` : "";

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-black/20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={movie.poster_path ? `${IMAGE_BASE}/w300${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
            alt={movie.title}
            className="w-40 md:w-56 rounded-xl shadow-2xl flex-shrink-0 self-start"
          />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic text-sm mb-3">{movie.tagline}</p>}
            <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-4">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.release_date?.split("-")[0]}</span>
              {movie.runtime && <><span>•</span><span>{movie.runtime} min</span></>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g) => (
                <span key={g.id} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{g.name}</span>
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{movie.overview}</p>
            <div className="flex gap-3 flex-wrap">
              {trailerKey && (
                <button onClick={() => setShowTrailer(true)} className="bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2.5 rounded text-sm transition">
                  ▶ Watch Trailer
                </button>
              )}
              <button onClick={handleWatchlistToggle} className={`font-semibold px-6 py-2.5 rounded text-sm transition ${isInWatchlist ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}`}>
                {isInWatchlist ? "− Remove from Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {movie.credits && movie.credits.cast.length > 0 && (
          <div className="mt-10 pb-10">
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {movie.credits.cast.slice(0, 10).map((member) => (
                <div key={member.id} className="flex-shrink-0 w-20 text-center">
                  <img
                    src={member.profile_path ? `${IMAGE_BASE}/w185${member.profile_path}` : "https://via.placeholder.com/80x80?text=?"}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-1"
                  />
                  <p className="text-xs text-gray-300 line-clamp-1">{member.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} className="w-full h-full rounded-xl" allowFullScreen allow="autoplay" />
          </div>
          <button onClick={() => setShowTrailer(false)} className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300">✕</button>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
