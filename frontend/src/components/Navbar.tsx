import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { logoutUser } from "../store/authSlice";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser()); // server side token blacklist
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent px-4 md:px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-red-600 font-bold text-2xl tracking-wider">
          CINEVERSE
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/movies/genre?id=28" className="hover:text-white transition">Action</Link>
          <Link to="/movies/genre?id=35" className="hover:text-white transition">Comedy</Link>
          <Link to="/movies/genre?id=18" className="hover:text-white transition">Drama</Link>
          {user && (
            <>
              <Link to="/watchlist" className="hover:text-white transition">Watchlist</Link>
              <Link to="/ai-recommend" className="hover:text-white transition">AI Picks</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden md:flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="bg-black/50 border border-gray-600 text-white text-sm px-3 py-1.5 rounded-l outline-none focus:border-red-500 w-44"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-r text-white text-sm transition">
              🔍
            </button>
          </form>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm hidden md:block">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded transition">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
