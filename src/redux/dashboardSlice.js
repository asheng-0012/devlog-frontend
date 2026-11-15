import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardData } from "../services/dashboardService";

export const loadDashboard = createAsyncThunk(
  "dashboard/loadDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardData();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: { solved: 0, streak: 0, avgCorrectness: 0, submissions: 0 },
    week: [
      { day: "M", solved: 0 },
      { day: "T", solved: 0 },
      { day: "W", solved: 0 },
      { day: "T", solved: 0 },
      { day: "F", solved: 0 },
      { day: "S", solved: 0 },
      { day: "S", solved: 0 },
    ],
    recent: [],
    recommended: [
      { id: "binary-search", title: "Binary Search", difficulty: "Easy", topic: "Arrays" },
      { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", topic: "Hashing" },
      { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", topic: "Graphs" },
    ],
    solvedProblemIds: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.stats) state.stats = action.payload.stats;
        if (action.payload.week) state.week = action.payload.week;
        if (action.payload.recent) state.recent = action.payload.recent;
        if (action.payload.solvedProblemIds) state.solvedProblemIds = action.payload.solvedProblemIds;
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not load dashboard data";
      });
  },
});

export default dashboardSlice.reducer;
