import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchlist, removeFromWatchlist } from "../store/watchlistSlice";
import { RootState, AppDispatch } from "../store/store";
import Loader from "../components/Loader";

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const Watchlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.watchlist);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(fetchWatchlist());
  }, [dispatch, token, navigate]);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-black min-h-screen text-white pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-gray-400 text-sm mb-8">{items.length} movie{items.length !== 1 ? "s" : ""} saved</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Your watchlist is empty.</p>
            <button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded transition">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div key={item.movieId} className="relative group rounded-lg overflow-hidden bg-gray-900 cursor-pointer" onClick={() => navigate(`/movie/${item.movieId}`)}>
                <img
                  src={item.posterPath ? `${IMAGE_BASE}/w300${item.posterPath}` : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-2">
                  <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                  <p className="text-yellow-400 text-xs">⭐ {item.voteAverage.toFixed(1)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(removeFromWatchlist(item.movieId)); }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
