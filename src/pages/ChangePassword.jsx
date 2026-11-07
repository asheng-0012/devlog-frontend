import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Circle, Eye, EyeOff } from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import { useToast } from "../context/ToastContext";
import { mockChangePassword } from "../utils/mockChangePassword";

const INPUT =
  "neu-inset w-full rounded-2xl bg-transparent py-4 pl-5 pr-14 text-lg text-ink outline-none placeholder:text-muted";

function checksFor(pw) {
  return {
    length: pw.length >= 8,
    letter: /[A-Za-z]/.test(pw),
    number: /\d/.test(pw),
  };
}

function strengthOf(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = ["Weak", "Weak", "Fair", "Good", "Strong"][score];
  const color = ["", "bg-red-700", "bg-amber-700", "bg-brand", "bg-brand"][score];
  return { score, label, color };
}

// Defined outside the page so typing doesn't remount it and lose focus.
function PasswordField({ id, label, value, onChange, show, onToggle, error, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={INPUT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

function ChangePassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [tried, setTried] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setServerError("");
  };
  const toggle = (key) => () => setShow((s) => ({ ...s, [key]: !s[key] }));

  const checks = checksFor(form.next);
  const strength = strengthOf(form.next);

  const errors = {
    current: form.current ? "" : "Enter your current password.",
    next: !(checks.length && checks.letter && checks.number)
      ? "New password doesn't meet the requirements."
      : form.next === form.current
      ? "New password must be different from the current one."
      : "",
    confirm: form.confirm === form.next ? "" : "Passwords don't match.",
  };
  const hasErrors = Boolean(errors.current || errors.next || errors.confirm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (hasErrors) return;

    setSaving(true);
    try {
      await mockChangePassword(form.current, form.next);
      showToast("Password updated");
      navigate("/settings");
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  const rules = [
    { ok: checks.length, text: "At least 8 characters" },
    { ok: checks.letter, text: "Contains a letter" },
    { ok: checks.number, text: "Contains a number" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <Link
          to="/settings"
          className="mb-3 inline-flex items-center gap-2 text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to settings
        </Link>
        <h1 className="text-emboss text-4xl font-semibold text-ink">
          Change password
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <section className="neu-raised max-w-3xl space-y-6 rounded-3xl p-5 sm:p-8">
          <PasswordField
            id="current"
            label="Current password"
            value={form.current}
            onChange={set("current")}
            show={show.current}
            onToggle={toggle("current")}
            autoComplete="current-password"
            error={tried ? errors.current : ""}
          />

          <div className="space-y-4">
            <PasswordField
              id="next"
              label="New password"
              value={form.next}
              onChange={set("next")}
              show={show.next}
              onToggle={toggle("next")}
              autoComplete="new-password"
              error={tried ? errors.next : ""}
            />

            {/* Strength meter */}
            <div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i <= strength.score ? strength.color : "neu-inset"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 h-5 text-sm text-muted">
                {strength.label && `Strength: ${strength.label}`}
              </p>
            </div>

            {/* Requirements */}
            <ul className="space-y-1.5">
              {rules.map((r) => (
                <li
                  key={r.text}
                  className={`flex items-center gap-2 text-sm ${
                    r.ok ? "text-brand" : "text-muted"
                  }`}
                >
                  {r.ok ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  {r.text}
                </li>
              ))}
            </ul>
          </div>

          <PasswordField
            id="confirm"
            label="Confirm new password"
            value={form.confirm}
            onChange={set("confirm")}
            show={show.confirm}
            onToggle={toggle("confirm")}
            autoComplete="new-password"
            error={tried ? errors.confirm : ""}
          />

          {serverError && (
            <p role="alert" className="text-red-700">
              {serverError}
            </p>
          )}
        </section>

        <div className="mt-6 flex max-w-3xl items-center justify-end gap-4">
          <Link
            to="/settings"
            className="neu-raised-sm rounded-2xl px-8 py-4 text-lg font-medium text-ink"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="neu-brand rounded-2xl px-8 py-4 text-lg font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withPageShell(ChangePassword);