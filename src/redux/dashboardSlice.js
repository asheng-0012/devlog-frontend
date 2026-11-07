import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: { solved: 48, streak: 6, avgCorrectness: 86, submissions: 112 },
    // problems solved per day (Mon → Sun)
    week: [
      { day: "M", solved: 3 },
      { day: "T", solved: 4 },
      { day: "W", solved: 2 },
      { day: "T", solved: 4 },
      { day: "F", solved: 5 },
      { day: "S", solved: 2 },
      { day: "S", solved: 1 },
    ],
    recent: [
      { id: "valid-parentheses", title: "Valid Parentheses", language: "Python", correctness: 96 },
      { id: "merge-intervals", title: "Merge Intervals", language: "JavaScript", correctness: 72 },
      { id: "lru-cache", title: "LRU Cache", language: "Java", correctness: 41 },
    ],
    recommended: [
      { id: "binary-search", title: "Binary Search", difficulty: "Easy", topic: "Arrays" },
      { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", topic: "Hashing" },
      { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", topic: "Graphs" },
    ],
  },
  reducers: {},
});

export default dashboardSlice.reducer;