import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Movie } from "../types";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import Loader from "../components/Loader";

const Home = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, nowRes, topRes, upcomingRes] = await Promise.all([
          axiosInstance.get("/movies/trending"),
          axiosInstance.get("/movies/now-playing"),
          axiosInstance.get("/movies/top-rated"),
          axiosInstance.get("/movies/upcoming"),
        ]);
        setTrending(trendingRes.data.data.results);
        setNowPlaying(nowRes.data.data.results);
        setTopRated(topRes.data.data.results);
        setUpcoming(upcomingRes.data.data.results);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-black min-h-screen">
      {trending.length > 0 && <HeroBanner movie={trending[0]} />}
      <div className="py-6">
        <MovieRow title="🔥 Trending This Week" movies={trending} />
        <MovieRow title="🎬 Now Playing" movies={nowPlaying} />
        <MovieRow title="⭐ Top Rated" movies={topRated} />
        <MovieRow title="📅 Upcoming" movies={upcoming} />
      </div>
    </div>
  );
};

export default Home;
