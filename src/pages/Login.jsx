import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Check, Code2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { login } from "../redux/authSlice";
import { mockLogin } from "../utils/mockAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT =
  "neu-inset w-full rounded-2xl bg-transparent py-4 pl-12 pr-12 text-lg text-ink outline-none placeholder:text-muted";

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { showToast } = useToast();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  // Already logged in (or just logged in): go where the user was heading
  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? "/home"} replace />;
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setServerError("");
  };

  const errors = {
    email: EMAIL_RE.test(form.email.trim()) ? "" : "Enter a valid email.",
    password: form.password ? "" : "Enter your password.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (errors.email || errors.password) return;

    setSaving(true);
    try {
      const user = await mockLogin(form.email, form.password);
      showToast(`Welcome back, ${user.name.split(" ")[0]}`);
      dispatch(login({ user, remember }));
      // the guard above redirects once isAuthenticated becomes true
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  const handleForgot = () =>
    showToast("Password reset isn't available in this demo");

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
            Welcome back
          </h1>
          <p className="mt-2 text-lg text-muted">Log in to keep practicing</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
            {tried && errors.password && (
              <p className="mt-2 text-sm text-red-700">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-muted">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span
                className={`grid size-8 place-items-center rounded-lg text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${
                  remember ? "neu-inset" : "neu-raised-sm"
                }`}
              >
                {remember && <Check className="h-4 w-4" />}
              </span>
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgot}
              className="text-brand hover:underline"
            >
              Forgot password?
            </button>
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
            {saving ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-lg text-muted">
          New to DEVLOG?{" "}
          <Link to="/signup" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}