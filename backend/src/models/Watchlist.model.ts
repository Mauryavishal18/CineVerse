import mongoose, { Document, Schema } from "mongoose";

interface IWatchlistItem {
  movieId: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  addedAt: Date;
}

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  movies: IWatchlistItem[];
}

const watchlistItemSchema = new Schema<IWatchlistItem>({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String, default: "" },
  voteAverage: { type: Number, default: 0 },
  releaseDate: { type: String, default: "" },
  addedAt: { type: Date, default: Date.now },
});

const watchlistSchema = new Schema<IWatchlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    movies: [watchlistItemSchema],
  },
  { timestamps: true }
);

export const Watchlist = mongoose.model<IWatchlist>("Watchlist", watchlistSchema);
