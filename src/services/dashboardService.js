import api from "../utils/api";

function fail(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }
  throw new Error("Can't reach the server. Is the backend running?");
}

// GET /api/dashboard — real stats, streak, weekly counts, solved IDs
export async function fetchDashboardData() {
  try {
    const res = await api.get("/api/dashboard");
    return res.data;
  } catch (error) {
    fail(error);
  }
}

