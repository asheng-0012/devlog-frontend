import { createSlice } from "@reduxjs/toolkit";
import { loadAuth } from "../utils/authStorage";

const GUEST = {
  name: "",
  email: "",
  bio: "",
  avatar: null,
  showOnLeaderboard: true,
};

const stored = loadAuth();

const initialState = {
  user: stored?.user ?? GUEST,
  isAuthenticated: Boolean(stored?.user),
  remember: stored?.remember ?? false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.remember = action.payload.remember;
      state.isAuthenticated = true;
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { login, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;