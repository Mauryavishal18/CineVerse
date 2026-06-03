import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => { if (token) navigate("/"); }, [token, navigate]);
  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4"
      style={{ backgroundImage: "url(https://image.tmdb.org/t/p/original/sIEOBxHiMaBgBFIeQPEinRGq3JA.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-md bg-black/80 rounded-xl p-8 backdrop-blur">
        <h1 className="text-white text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-gray-400 text-sm mb-6">Welcome back to CineVerse 🎬</p>
        {error && <div className="bg-red-900/50 border border-red-600 text-red-300 text-sm px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="bg-gray-800 text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="bg-gray-800 text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
          <button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded transition">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-6 text-center">
          New to CineVerse?{" "}
          <Link to="/register" className="text-white hover:underline">Sign up now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
