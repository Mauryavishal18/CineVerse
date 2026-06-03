import { useRef } from "react";
import { Movie } from "../types";
import MovieCard from "./MovieCard";

interface Props { title: string; movies: Movie[]; }

const MovieRow = ({ title, movies }: Props) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-8 px-4 md:px-8">
      <h2 className="text-white text-xl font-semibold mb-3">{title}</h2>
      <div className="relative group">
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-8 h-full opacity-0 group-hover:opacity-100 transition rounded-r">‹</button>
        <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
          {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-8 h-full opacity-0 group-hover:opacity-100 transition rounded-l">›</button>
      </div>
    </div>
  );
};

export default MovieRow;
