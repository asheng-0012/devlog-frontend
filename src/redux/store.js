import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import problemsReducer from "./problemsSlice";
import submissionsReducer from "./submissionsSlice";
import leaderboardReducer from "./leaderboardSlice";
import { saveAuth, clearAuth } from "../utils/authStorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    problems: problemsReducer,
    submissions: submissionsReducer,
    leaderboard: leaderboardReducer,
  },
});

// Keep browser storage in sync with the auth slice
let prevAuth = store.getState().auth;
store.subscribe(() => {
  const auth = store.getState().auth;
  if (auth === prevAuth) return; // some other slice changed
  prevAuth = auth;

  if (auth.isAuthenticated) {
    saveAuth({ user: auth.user, token: auth.token, remember: auth.remember });
  } else {
    clearAuth();
  }
});

export default store;