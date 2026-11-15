import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Check, Code2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { login } from "../redux/authSlice";
import { signupUser } from "../services/authService";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9._]{3,20}$/;

const INPUT =
  "neu-inset w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-lg text-ink outline-none placeholder:text-muted";

export default function Signup() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  if (isAuthenticated) return <Navigate to="/home" replace />;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setServerError("");
  };

  const errors = {
    username: USERNAME_RE.test(form.username.trim())
      ? ""
      : "3–20 characters: letters, numbers, . or _",
    email: EMAIL_RE.test(form.email.trim()) ? "" : "Enter a valid email.",
    password: form.password.length >= 8 ? "" : "Use at least 8 characters.",
    agree: agree ? "" : "Please accept the terms to continue.",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  // password hint shows while typing (like your design), the rest after submit
  const showPwError = (tried || form.password.length > 0) && errors.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (hasErrors) return;

    setSaving(true);
    try {
      const { token, user } = await signupUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      showToast("Account created. Welcome to Devlog!");
      dispatch(login({ user, token, remember: true }));
      // the guard above redirects to /home
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <main className="bg-surface grid min-h-screen place-items-center px-4 py-10">
      <div className="neu-raised w-full max-w-[460px] rounded-[2.5rem] px-6 py-10 sm:px-11">
        <Link
          to="/"
          aria-label="Devlog home"
          className="neu-raised-sm mx-auto grid size-[84px] place-items-center rounded-3xl text-brand"
        >
          <Code2 size={30} />
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-emboss text-4xl font-semibold text-ink">
            Create your account
          </h1>
          <p className="mt-2 text-lg text-muted">Start climbing the leaderboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-muted">
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                id="username"
                autoComplete="username"
                placeholder="alex.codes"
                maxLength={20}
                className={INPUT}
                value={form.username}
                onChange={set("username")}
              />
            </div>
            {tried && errors.username && (
              <p className="mt-2 text-sm text-red-700">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-muted">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={INPUT}
                value={form.email}
                onChange={set("email")}
              />
            </div>
            {tried && errors.email && (
              <p className="mt-2 text-sm text-red-700">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-muted">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                className={INPUT}
                value={form.password}
                onChange={set("password")}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {showPwError && (
              <p className="mt-2 text-red-700">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-center gap-3 text-muted">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${
                  agree ? "neu-inset" : "neu-raised-sm"
                }`}
              >
                {agree && <Check className="h-4 w-4" />}
              </span>
              I agree to the terms and privacy policy
            </label>
            {tried && errors.agree && (
              <p className="mt-2 text-sm text-red-700">{errors.agree}</p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-center text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="neu-brand w-full rounded-2xl py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-lg text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}