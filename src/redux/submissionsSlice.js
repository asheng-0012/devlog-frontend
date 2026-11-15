import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserSubmissions } from "../services/submissionService";

// Load all submissions for the logged-in user from the backend
export const loadSubmissions = createAsyncThunk(
  "submissions/loadSubmissions",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserSubmissions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const submissionsSlice = createSlice({
  name: "submissions",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    addSubmission(state, { payload }) {
      state.items.unshift(payload);
    },
    clearSubmissions(state) {
      state.items = [];
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubmissions.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload || []).map((s) => ({ ...s, id: s._id || s.id }));
      })
      .addCase(loadSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not load submissions";
      });
  },
});

export const { addSubmission, clearSubmissions } = submissionsSlice.actions;
export default submissionsSlice.reducer;
