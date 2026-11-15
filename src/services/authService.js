import api from "../utils/api";

// turn an axios error into a normal Error with a readable message
function fail(error) {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }
  throw new Error("Can't reach the server. Is the backend running?");
}

export async function loginUser(email, password) {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data; // { token, user }
  } catch (error) {
    fail(error);
  }
}

export async function signupUser({ username, email, password }) {
  try {
    const res = await api.post("/api/auth/signup", { username, email, password });
    return res.data; // { token, user }
  } catch (error) {
    fail(error);
  }
}

export async function changePasswordRequest(currentPassword, newPassword) {
  try {
    const res = await api.put("/api/auth/password", { currentPassword, newPassword });
    return res.data;
  } catch (error) {
    fail(error);
  }
}

export async function updateProfileRequest(data) {
  try {
    const res = await api.put("/api/auth/profile", data);
    return res.data; // updated user
  } catch (error) {
    fail(error);
  }
}