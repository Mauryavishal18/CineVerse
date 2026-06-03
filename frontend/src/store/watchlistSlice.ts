import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { WatchlistState, WatchlistItem } from "../types";

const initialState: WatchlistState = {
  items: [],
  isLoading: false,
};

export const fetchWatchlist = createAsyncThunk("watchlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/watchlist");
    return res.data.data;
  } catch {
    return rejectWithValue("Failed to load watchlist.");
  }
});

export const addToWatchlist = createAsyncThunk(
  "watchlist/add",
  async (movie: Omit<WatchlistItem, "addedAt">, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/watchlist/add", movie);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Could not add to watchlist.");
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  "watchlist/remove",
  async (movieId: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/watchlist/remove/${movieId}`);
      return res.data.data;
    } catch {
      return rejectWithValue("Could not remove from watchlist.");
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchWatchlist.rejected, (state) => { state.isLoading = false; })
      .addCase(addToWatchlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export default watchlistSlice.reducer;
