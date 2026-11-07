const TIME = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"];
const SPACE = ["O(1)", "O(n)", "O(n)", "O(log n)"];

const FEEDBACK = {
  high: "Clean and correct approach. Edge cases look well handled, and the complexity is close to optimal.",
  mid: "The core idea is right, but a few edge cases (empty input, duplicates) may fail. Consider a more efficient data structure.",
  low: "The solution looks incomplete or incorrect. Re-read the problem statement and try a simple approach first.",
};

export function mockAssess({ code }) {
  // turn the code into a number, so the same code always gives the same result
  let hash = 0;
  for (const ch of code) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;

  const length = code.trim().length;
  const correctness = length < 60 ? 15 + (hash % 25) : 55 + (hash % 45); // short code: 15-39, longer: 55-99

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          correctness,
          timeComplexity: TIME[hash % TIME.length],
          spaceComplexity: SPACE[hash % SPACE.length],
          feedback:
            correctness >= 80 ? FEEDBACK.high : correctness >= 50 ? FEEDBACK.mid : FEEDBACK.low,
        }),
      1500
    )
  );
}