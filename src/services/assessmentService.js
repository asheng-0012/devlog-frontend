import api from "../utils/api";

function fail(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }
  throw new Error("Can't reach the server. Is the backend running?");
}

// POST /api/assess — invoke Gemini AI instructor
export async function assessSolution({ problemStatement, language, code }) {
  try {
    const res = await api.post("/api/assess", { problemStatement, language, code });
    return res.data; // { correctness, timeComplexity, spaceComplexity, points, feedback, improvements }
  } catch (error) {
    fail(error);
  }
}

