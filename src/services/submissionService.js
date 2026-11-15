import api from "../utils/api";

// Turn an axios error into a plain Error with a readable message
function fail(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }
  throw new Error("Can't reach the server. Is the backend running?");
}

// POST /api/submissions — save one submission to MongoDB
export async function saveSubmission(data) {
  try {
    const res = await api.post("/api/submissions", data);
    return res.data;
  } catch (error) {
    fail(error);
  }
}

// GET /api/submissions — fetch all submissions for the logged-in user
export async function fetchUserSubmissions() {
  try {
    const res = await api.get("/api/submissions");
    return res.data; // array of submission objects
  } catch (error) {
    fail(error);
  }
}

