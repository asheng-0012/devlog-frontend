import { createSlice } from "@reduxjs/toolkit";

// a date N days ago at a given time
const daysAgo = (d, h, m) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
};

// mock history; problemId points to a row in the problems list
const SEED = [
  {
    id: 1,
    problemId: 7,
    title: "Valid Parentheses",
    language: "Python",
    correctness: 96,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    feedback: "Clean stack usage and clear naming.",
    code: `def is_valid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack
`,
    createdAt: daysAgo(0, 10, 42),
  },
  {
    id: 2,
    problemId: 8,
    title: "Merge Intervals",
    language: "JavaScript",
    correctness: 72,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    feedback: "Sorting is right, but the overlap check misses intervals that touch at one point.",
    code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (const cur of intervals.slice(1)) {
    const last = out[out.length - 1];
    if (cur[0] < last[1]) last[1] = Math.max(last[1], cur[1]);
    else out.push(cur);
  }
  return out;
}
`,
    createdAt: daysAgo(1, 18, 5),
  },
  {
    id: 3,
    problemId: 9,
    title: "LRU Cache",
    language: "Java",
    correctness: 41,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    feedback: "Eviction scans the whole list. Use a HashMap with a doubly linked list for O(1).",
    code: `class LRUCache {
    private final int capacity;
    private final java.util.List<int[]> items = new java.util.ArrayList<>();

    public LRUCache(int capacity) {
        this.capacity = capacity;
    }

    public int get(int key) {
        for (int[] e : items) if (e[0] == key) return e[1];
        return -1;
    }
}
`,
    createdAt: daysAgo(2, 14, 20),
  },
  {
    id: 4,
    problemId: 13,
    title: "Two Sum",
    language: "Python",
    correctness: 92,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    feedback: "Single pass with a hash map. Nicely done.",
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
`,
    createdAt: daysAgo(3, 9, 12),
  },
];

const submissionsSlice = createSlice({
  name: "submissions",
  initialState: { items: SEED }, // newest first
  reducers: {
    addSubmission(state, { payload }) {
      state.items.unshift(payload);
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
