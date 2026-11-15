import api from "../utils/api";

function fail(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }
  throw new Error("Can't reach the server. Is the backend running?");
}

// GET /api/leaderboard?period=daily|weekly
export async function fetchLeaderboardData(period = "daily") {
  try {
    const res = await api.get(`/api/leaderboard?period=${period}`);
    return res.data;
  } catch (error) {
    fail(error);
  }
}

