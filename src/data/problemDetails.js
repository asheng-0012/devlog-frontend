// placeholder links to each platform; the backend will supply real per-problem URLs
export const SOURCE_URLS = {
  Codeforces: "https://codeforces.com/problemset",
  GeeksforGeeks: "https://www.geeksforgeeks.org/",
  CodeChef: "https://www.codechef.com/practice",
  Codewars: "https://www.codewars.com/kata/search",
  Kattis: "https://open.kattis.com/problems",
  AtCoder: "https://atcoder.jp/contests/archive",
  LeetCode: "https://leetcode.com/problemset/",
  HackerRank: "https://www.hackerrank.com/domains",
};

export const PROBLEM_DETAILS = {
  1: {
    statement:
      "Given an array A[] of size N. Let us call difference between indices of an element's first and last appearance in the array A[] a gap. Find the maximum possible gap. Note that if any element appears only once, then the gap for that element is 0.",
    examples: [
      {
        input: "N = 9\nA[] = {2, 1, 3, 4, 2, 1, 5, 1, 7}",
        output: "6",
        explanation:
          "The value 1 first appears at index 1 and last at index 7, so its gap is 7 − 1 = 6, the largest of all values.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10⁵", "1 ≤ A[i] ≤ 10⁵"],
  },
};
