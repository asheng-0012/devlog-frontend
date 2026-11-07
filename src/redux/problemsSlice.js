import { createSlice } from "@reduxjs/toolkit";
import { PROBLEMS } from "../data/mockProblems";

const defaultFilters = {
  difficulty: "All",
  topic: "All",
  status: "All",
  source: "All",
  page: 1,
};

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    items: PROBLEMS,
    filters: defaultFilters,
  },
  reducers: {
    // changing any filter sends you back to page 1
    setDifficulty(state, { payload }) {
      state.filters.difficulty = payload;
      state.filters.page = 1;
    },
    setTopic(state, { payload }) {
      state.filters.topic = payload;
      state.filters.page = 1;
    },
    setStatus(state, { payload }) {
      state.filters.status = payload;
      state.filters.page = 1;
    },
    setSource(state, { payload }) {
      state.filters.source = payload;
      state.filters.page = 1;
    },
    setPage(state, { payload }) {
      state.filters.page = payload;
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
    },

    // NEW: used after a submission; never downgrades a Solved problem
    setProblemStatus(state, { payload }) {
      const problem = state.items.find((p) => p.id === payload.id);
      if (problem && problem.status !== "Solved") problem.status = payload.status;
    },
  },
});

export const {
  setDifficulty,
  setTopic,
  setStatus,
  setSource,
  setPage,
  resetFilters,
  setProblemStatus,
} = problemsSlice.actions;

export default problemsSlice.reducer;