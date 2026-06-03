import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => { if (token) navigate("/"); }, [token, navigate]);
  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-8">
        <h1 className="text-white text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-400 text-sm mb-6">Join CineVerse and never miss a movie 🍿</p>
        {error && <div className="bg-red-900/50 border border-red-600 text-red-300 text-sm px-4 py-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-gray-800 text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="bg-gray-800 text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 text-sm" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="bg-gray-800 text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 text-sm" minLength={6} required />
          <button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded transition">
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
