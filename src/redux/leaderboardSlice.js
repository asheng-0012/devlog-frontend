import { createSlice } from "@reduxjs/toolkit";

// Mock data. Later the backend (an aggregation over Submissions) will
// fill this in, and only this slice's data source will change.
const boards = {
  daily: {
    label: "Daily",
    resets: "Daily board resets in 6 hours",
    chartTitle: "Points today",
    totalPlayers: 612,
    you: { rank: 41, points: 60, streak: 3, solved: 2, gap: 15 },
    players: [
      { rank: 1, name: "kenji_k", solved: 7, points: 230 },
      { rank: 2, name: "mira.dev", solved: 6, points: 205 },
      { rank: 3, name: "lena_p", solved: 6, points: 185 },
      { rank: 4, name: "arjun", solved: 5, points: 160 },
      { rank: 5, name: "sofia.codes", solved: 4, points: 140 },
      { rank: 6, name: "omar.h", solved: 4, points: 120 },
      { rank: 7, name: "tess", solved: 3, points: 95 },
    ],
  },
  weekly: {
    label: "Weekly",
    resets: "Weekly board resets in 3 days",
    chartTitle: "Points this week",
    totalPlayers: 1284,
    you: { rank: 23, points: 340, streak: 3, solved: 14, gap: 42 },
    players: [
      { rank: 1, name: "mira.dev", solved: 38, points: 940 },
      { rank: 2, name: "kenji_k", solved: 35, points: 880 },
      { rank: 3, name: "sofia.codes", solved: 33, points: 820 },
      { rank: 4, name: "arjun", solved: 31, points: 760 },
      { rank: 5, name: "lena_p", solved: 29, points: 700 },
      { rank: 6, name: "omar.h", solved: 27, points: 655 },
      { rank: 7, name: "tess", solved: 25, points: 610 },
    ],
  },
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    period: "daily", // daily is shown first
    boards,
  },
  reducers: {
    setPeriod(state, action) {
      state.period = action.payload;
    },
  },
});

export const { setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;