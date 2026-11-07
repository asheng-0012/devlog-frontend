export const SOURCE_COUNTS = {
  Codeforces: 127,
  GeeksforGeeks: 46,
  CodeChef: 40,
  Codewars: 29,
  Kattis: 21,
  AtCoder: 14,
  LeetCode: 14,
  HackerRank: 9,
};

export const SOURCES = Object.keys(SOURCE_COUNTS);

export const TOPICS = [
  "Arrays", "Strings", "Hashing", "Math", "Sorting",
  "Greedy", "Graphs", "Trees", "Dynamic Programming", "Binary Search",
];

const TOTAL = 300;
const SOLVED = 48;
const ATTEMPTED = 30;

// seeded random: same "random" data on every reload
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pickDifficulty = () => {
  const r = rand();
  return r < 0.4 ? "Easy" : r < 0.8 ? "Medium" : "Hard";
};

// the first six match your design
const FIRST = [
  { title: "Given an array A[] of size N. Let us call difference between indices of an element's first and last appearance in the array A[] a gap. Find the maximum possible gap. Note that if any element appears only once, then the gap for that element is 0.", source: "GeeksforGeeks", difficulty: "Easy", topic: "Arrays" },
  { title: "You are given a string s consisting of lowercase letters. In one operation you can remove any character...", source: "Codeforces", difficulty: "Medium", topic: "Strings" },
  { title: "Chef has N candies and wants to share them equally between his M friends. Find the leftover candies...", source: "CodeChef", difficulty: "Easy", topic: "Math" },
  { title: "There is a grid with H rows and W columns. Each cell is either empty or blocked. Find the shortest path...", source: "AtCoder", difficulty: "Hard", topic: "Graphs" },
  { title: "Write a function that takes a list of integers and returns the sum of all the even numbers in it.", source: "Codewars", difficulty: "Easy", topic: "Arrays" },
  { title: "Given two integers a and b, print the number of integers in the range [a, b] divisible by three.", source: "Kattis", difficulty: "Medium", topic: "Math" },
];

const TITLES = [
  "Given a sorted array and a target value, return the index where the target would be inserted.",
  "Find the length of the longest substring without repeating characters in the given string.",
  "You are given a binary tree. Return its maximum depth, counting the number of nodes on the longest path.",
  "Given a list of intervals, merge all overlapping intervals and return the result.",
  "Count the number of connected components in an undirected graph with N nodes and M edges.",
  "Given N coins of different values, find the minimum number of coins needed to make amount K.",
  "Check whether the given string of brackets is balanced and properly nested.",
  "Given an array of integers, find two numbers such that they add up to a specific target.",
  "Sort the array of N integers using the fewest possible swaps and print that number.",
  "You are given a string. Find the first non-repeating character and print its position.",
  "Given a matrix of size N x M, rotate it by 90 degrees clockwise in place.",
  "Find the k-th smallest element in an unsorted array without sorting the whole array.",
];

// remaining sources so that the totals match SOURCE_COUNTS exactly
const pool = [];
SOURCES.forEach((source) => {
  const used = FIRST.filter((f) => f.source === source).length;
  for (let i = 0; i < SOURCE_COUNTS[source] - used; i++) pool.push(source);
});
shuffle(pool);

const rest = pool.map((source, i) => ({
  title: TITLES[i % TITLES.length],
  source,
  difficulty: pickDifficulty(),
  topic: TOPICS[Math.floor(rand() * TOPICS.length)],
}));

// exactly 48 solved, 30 attempted, the rest todo
const statuses = shuffle(
  Array.from({ length: TOTAL }, (_, i) =>
    i < SOLVED ? "Solved" : i < SOLVED + ATTEMPTED ? "Attempted" : "Todo"
  )
);

export const PROBLEMS = [...FIRST, ...rest].map((p, i) => ({
  id: i + 1,
  ...p,
  status: statuses[i],
}));