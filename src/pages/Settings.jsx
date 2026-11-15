import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import { useToast } from "../context/ToastContext";
import { updateProfile, logout } from "../redux/authSlice";
import { updateProfileRequest } from "../services/authService";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function pick(user) {
  return {
    name: user.name ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
    avatar: user.avatar ?? null,
    showOnLeaderboard: user.showOnLeaderboard ?? true,
  };
}

const INPUT =
  "neu-inset w-full rounded-2xl bg-transparent px-5 py-4 text-lg text-ink outline-none placeholder:text-muted";

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useSelector((s) => s.auth.user);
  const fileRef = useRef(null);

  const saved = pick(user);
  const [draft, setDraft] = useState(saved);
  const [tried, setTried] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirty = Object.keys(saved).some((k) => saved[k] !== draft[k]);

  const errors = {
    name: draft.name.trim() ? "" : "Display name can't be empty.",
    email: EMAIL_RE.test(draft.email.trim()) ? "" : "Enter a valid email.",
  };

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2 MB");
      return;
    }
    // Local preview only. Later: upload with Multer and store the returned URL.
    set("avatar", URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setTried(true);
    if (errors.name || errors.email) return;
    const clean = {
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      bio: draft.bio.trim(),
    };
    try {
      const updatedUser = await updateProfileRequest(clean);
      dispatch(updateProfile(updatedUser));
      setDraft(pick(updatedUser));
      setTried(false);
      showToast("Changes saved successfully");
    } catch (err) {
      showToast(err.message || "Failed to save profile");
    }
  };

  const handleCancel = () => {
    if (dirty) showToast("Changes discarded");
    setDraft(saved);
    setTried(false);
  };

  const handleLogout = () => {
    // Mock: clears the auth flag. Later: also remove the JWT from storage.
    dispatch(logout());
    showToast("Logged out");
    navigate("/");
  };

  const handleDelete = () => {
    // Mock: just logs out. Later: DELETE /api/users/me.
    dispatch(logout());
    showToast("Account deleted");
    navigate("/");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-emboss text-4xl font-semibold text-ink">Settings</h1>

      {/* Profile */}
      <section className="neu-raised rounded-3xl p-5 sm:p-8">
        <h2 className="text-xl font-medium text-ink">Profile</h2>

        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-5 md:w-[210px] md:shrink-0">
            <div className="neu-raised flex h-36 w-36 items-center justify-center overflow-hidden rounded-full">
              {draft.avatar ? (
                <img
                  src={draft.avatar}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-medium text-brand">
                  {initials(draft.name)}
                </span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="neu-raised-sm rounded-xl px-5 py-3 text-lg text-ink transition hover:text-brand"
            >
              Change photo
            </button>
            {draft.avatar && (
              <button
                type="button"
                onClick={() => set("avatar", null)}
                className="-mt-2 text-sm text-muted hover:text-ink"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="min-w-0 flex-1 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-muted">
                Display name
              </label>
              <input
                id="name"
                className={INPUT}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={40}
              />
              {tried && errors.name && (
                <p className="mt-2 text-sm text-red-700">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={INPUT}
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {tried && errors.email && (
                <p className="mt-2 text-sm text-red-700">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-muted">
                Bio
              </label>
              <textarea
                id="bio"
                rows={2}
                maxLength={160}
                className={`${INPUT} resize-none`}
                placeholder="Tell others a little about you"
                value={draft.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
              <p className="mt-1 text-right text-sm text-muted">
                {draft.bio.length}/160
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard visibility */}
      <section className="neu-raised rounded-3xl p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-ink">
              Show me on the leaderboard
            </h2>
            <p className="mt-1 text-muted">Others can see your username and points.</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={draft.showOnLeaderboard}
            aria-label="Show me on the leaderboard"
            onClick={() => set("showOnLeaderboard", !draft.showOnLeaderboard)}
            className="neu-inset relative h-10 w-[72px] shrink-0 rounded-full"
          >
            <span
              className={`absolute top-1.5 h-7 w-7 rounded-full transition-all duration-200 ${
                draft.showOnLeaderboard
                  ? "left-[38px] bg-brand"
                  : "left-1.5 bg-muted/60"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-lg">
          <Link to="/change-password" className="text-ink hover:text-brand">
            Change password
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-ink hover:text-brand"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-red-700 hover:underline"
          >
            Delete account
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="neu-raised-sm rounded-2xl px-8 py-4 text-lg font-medium text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="neu-brand rounded-2xl px-8 py-4 text-lg font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="neu-raised bg-surface w-full max-w-md rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-medium text-ink">Delete your account?</h3>
            <p className="mt-2 text-muted">
              This removes your profile, submissions and leaderboard rank. It
              can't be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="neu-raised-sm rounded-xl px-5 py-3 text-ink"
              >
                Keep account
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-700 px-5 py-3 font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withPageShell(Settings);