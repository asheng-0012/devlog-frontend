const KEY = "devlog_auth";

export function loadAuth() {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function saveAuth({ user, token, remember }) {
  clearAuth();
  // blob: URLs (photo previews) die on refresh, so don't save them
  const safeUser = {
    ...user,
    avatar: user.avatar?.startsWith("blob:") ? null : user.avatar,
  };
  try {
    // remember me -> localStorage (survives closing the browser)
    // otherwise   -> sessionStorage (cleared when the tab closes)
    (remember ? localStorage : sessionStorage).setItem(
      KEY,
      JSON.stringify({ user: safeUser, token, remember })
    );
  } catch {
    /* storage unavailable */
  }
}