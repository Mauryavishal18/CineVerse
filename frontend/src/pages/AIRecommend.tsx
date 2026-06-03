import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { AIRecommendation } from "../types";
import { RootState } from "../store/store";

const MOOD_OPTIONS = ["Happy", "Sad", "Excited", "Chill", "Thrilled", "Romantic"];

const AIRecommend = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { items: watchlistItems } = useSelector((state: RootState) => state.watchlist);

  const [watchedInput, setWatchedInput] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) { navigate("/login"); return null; }

  const handleGetRecommendations = async () => {
    setError("");
    const watchlistTitles = watchlistItems.map((item) => item.title);
    const manualMovies = watchedInput.split(",").map((s) => s.trim()).filter(Boolean);
    const allWatched = [...new Set([...watchlistTitles, ...manualMovies])];

    if (allWatched.length === 0) { setError("Please add at least one movie you've watched."); return; }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/ai/recommend", {
        watchedMovies: allWatched,
        mood: selectedMood || undefined,
      });
      setRecommendations(res.data.data);
    } catch (err) {
      setError("AI recommendation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🤖 AI Movie Picks</h1>
        <p className="text-gray-400 text-sm mb-8">Powered by Groq AI — personalized just for you</p>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <label className="block text-sm text-gray-300 mb-2">Movies you've watched (comma separated)</label>
          <textarea
            value={watchedInput}
            onChange={(e) => setWatchedInput(e.target.value)}
            placeholder="e.g. Interstellar, The Dark Knight, Inception..."
            className="w-full bg-gray-800 text-white text-sm px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
          />
          {watchlistItems.length > 0 && (
            <p className="text-gray-500 text-xs mt-1">Your watchlist ({watchlistItems.length} movies) will also be included automatically.</p>
          )}

          <label className="block text-sm text-gray-300 mt-4 mb-2">What's your mood right now?</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(selectedMood === mood ? "" : mood)}
                className={`text-sm px-4 py-1.5 rounded-full border transition ${selectedMood === mood ? "bg-red-600 border-red-600 text-white" : "border-gray-600 text-gray-300 hover:border-gray-400"}`}
              >
                {mood}
              </button>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded transition w-full"
          >
            {isLoading ? "Asking AI..." : "Get Recommendations ✨"}
          </button>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">AI suggests you watch:</h2>
            <div className="flex flex-col gap-4 pb-10">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-5 flex gap-4 items-start">
                  <div className="bg-red-600 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-white font-semibold">{rec.title} ({rec.year})</h3>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{rec.genre}</span>
                        <span className="text-yellow-400">⭐ {rec.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommend;
