import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLeaderboardData } from "../services/leaderboardService";

export const loadLeaderboard = createAsyncThunk(
  "leaderboard/loadLeaderboard",
  async (period, { rejectWithValue }) => {
    try {
      const data = await fetchLeaderboardData(period);
      return { period, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const emptyBoard = (label, chartTitle) => ({
  label,
  resets: "Checking board resets...",
  chartTitle,
  totalPlayers: 0,
  you: { rank: 1, points: 0, streak: 0, solved: 0, gap: 0 },
  players: [],
});

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    period: "daily",
    boards: {
      daily: emptyBoard("Daily", "Points today"),
      weekly: emptyBoard("Weekly", "Points this week"),
    },
    loading: false,
    error: "",
  },
  reducers: {
    setPeriod(state, action) {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        const { period, data } = action.payload;
        if (data) {
          state.boards[period] = {
            ...state.boards[period],
            ...data,
            players: data.players || [],
            you: data.you || state.boards[period].you,
          };
        }
      })
      .addCase(loadLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not load leaderboard";
      });
  },
});

export const { setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
