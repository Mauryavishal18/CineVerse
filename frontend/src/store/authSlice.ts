import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AuthState } from "../types";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("cineverse_token"),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      localStorage.setItem("cineverse_token", res.data.token);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      localStorage.setItem("cineverse_token", res.data.token);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed.");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Session expired.");
    }
  }
);

// server ko bhi notify karo — token blacklist ho jaaye
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // server logout fail ho toh bhi local cleanup karo
    } finally {
      localStorage.removeItem("cineverse_token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("cineverse_token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.user = action.payload.user; })
      .addCase(fetchCurrentUser.rejected, (state) => { state.user = null; state.token = null; localStorage.removeItem("cineverse_token"); })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.token = null; })
      .addCase(logoutUser.rejected, (state) => { state.user = null; state.token = null; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
