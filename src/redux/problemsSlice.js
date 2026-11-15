import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchQuestions,
  fetchTags,
  fetchSources,
} from "../services/questionService";
import { questionTitle } from "../utils/questionTitle";
import { sourceName } from "../utils/sourceName";

const defaultFilters = {
  difficulty: "All",
  topic: "All",
  status: "All", // not sent to the server yet (needs submissions)
  source: "All",
  search: "",
  page: 1,
};

// the database shape -> the shape the page already uses
function toProblem(q) {
  return {
    id: q._id,
    title: questionTitle(q.statement),
    statement: q.statement,
    difficulty: q.difficulty,
    topic: q.tags[0] || "",
    tags: q.tags,
    source: sourceName(q.source),
    sourceUrl: q.sourceUrl,
    status: "Unsolved", // real status comes from submissions later
  };
}

// loads ONE page of questions using the filters saved in the store
export const loadQuestions = createAsyncThunk(
  "problems/loadQuestions",
  async (_, { getState, rejectWithValue }) => {
    try {
      const f = getState().problems.filters;
      return await fetchQuestions({
        difficulty: f.difficulty,
        tag: f.topic,
        source: f.source,
        search: f.search,
        page: f.page,
        limit: 15,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// topics for the dropdown
export const loadTags = createAsyncThunk(
  "problems/loadTags",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTags();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// counts for the source chips
export const loadSources = createAsyncThunk(
  "problems/loadSources",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSources();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    items: [], // only the current page
    total: 0, // questions matching the filters
    pages: 1,
    topics: [],
    sourceCounts: {}, // { Codeforces: 127, ... }
    filters: defaultFilters,
    loading: false,
    error: "",
    requestId: null, // used to ignore outdated responses
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
    setSearch(state, { payload }) {
      state.filters.search = payload;
      state.filters.page = 1;
    },
    setPage(state, { payload }) {
      state.filters.page = payload;
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
    },

    // still used by ProblemDetail after a submission
    setProblemStatus(state, { payload }) {
      const problem = state.items.find((p) => p.id === payload.id);
      if (problem && problem.status !== "Solved") problem.status = payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuestions.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        state.requestId = action.meta.requestId;
      })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        // a newer request was sent meanwhile, so ignore this old answer
        if (action.meta.requestId !== state.requestId) return;
        state.loading = false;
        state.items = action.payload.questions.map(toProblem);
        state.total = action.payload.total;
        state.pages = action.payload.pages || 1;
      })
      .addCase(loadQuestions.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.loading = false;
        state.error = action.payload || "Could not load questions";
      })
      .addCase(loadTags.fulfilled, (state, action) => {
        state.topics = action.payload;
      })
      .addCase(loadSources.fulfilled, (state, action) => {
        const counts = {};
        for (const s of action.payload) {
          counts[sourceName(s._id)] = s.count;
        }
        state.sourceCounts = counts;
      });
  },
});

export const {
  setDifficulty,
  setTopic,
  setStatus,
  setSource,
  setSearch,
  setPage,
  resetFilters,
  setProblemStatus,
} = problemsSlice.actions;

export default problemsSlice.reducer;