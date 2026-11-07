import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, BrainCircuit, Braces, ChevronDown, Clock,
  ExternalLink, Loader2, Lock, RotateCcw, Sparkles,
} from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import CodeEditor from "../components/CodeEditor";
import { useToast } from "../context/ToastContext";
import { LANGUAGES, STARTER_CODE } from "../data/starterCode";
import { PROBLEM_DETAILS, SOURCE_URLS } from "../data/problemDetails";
import { mockAssess } from "../utils/mockAssess";
import { addSubmission } from "../redux/submissionsSlice";
import { setProblemStatus } from "../redux/problemsSlice";

const TIME_LIMIT = 10 * 60; // seconds
const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

const DIFFICULTY_COLOR = {
  Easy: "text-brand",
  Medium: "text-amber-700",
  Hard: "text-red-700",
};

const scoreColor = (s) =>
  s >= 80 ? "text-brand" : s >= 60 ? "text-amber-700" : "text-red-700";

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

/* ---------- Small pieces ---------- */
// not a button: it switches by itself when the status changes
function StatusIndicator({ submitted }) {
  const segment = (active, text) => (
    <span
      className={`flex h-12 items-center rounded-full px-6 text-lg transition ${
        active ? "neu-raised-sm font-medium text-ink" : "text-muted"
      }`}
    >
      {text}
    </span>
  );

  return (
    <div role="status" className="flex items-center gap-4">
      <span className="text-lg text-muted">Status</span>
      <div className="neu-inset flex h-16 items-center gap-1 rounded-full p-2">
        {segment(!submitted, "Solving")}
        {segment(submitted, "After submit")}
      </div>
    </div>
  );
}

function LanguageSelect({ value, onChange, disabled }) {
  return (
    <label
      className={`neu-raised-sm relative flex h-16 items-center gap-3 rounded-3xl px-6 text-lg focus-within:ring-2 focus-within:ring-brand ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <Braces size={20} className="text-muted" />
      <span>{value}</span>
      <ChevronDown size={18} className="text-muted" />
      {/* real select on top, invisible: keeps native keyboard + mobile behavior */}
      <select
        aria-label="Language"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </label>
  );
}

function Statement({ problem }) {
  const details = PROBLEM_DETAILS[problem.id];

  return (
    <div className="space-y-6 text-lg leading-relaxed">
      <p>{details?.statement ?? problem.title}</p>

      {details?.examples.map((ex, i) => (
        <div key={i}>
          <p className="font-semibold text-muted">Example {i + 1}:</p>
          <p className="mt-1">Input:</p>
          <p className="whitespace-pre-line">{ex.input}</p>
          <p className="mt-1">Output:</p>
          <p>{ex.output}</p>
          {ex.explanation && <p className="mt-2 text-muted">Explanation: {ex.explanation}</p>}
        </div>
      ))}

      {details?.constraints && (
        <div>
          <p className="font-semibold text-muted">Constraints:</p>
          <ul className="mt-1 list-disc pl-6">
            {details.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {!details && (
        <p className="text-base text-muted">
          Examples and constraints will appear here once the backend supplies them.
        </p>
      )}
    </div>
  );
}

function History({ items, canLoad, onLoad }) {
  if (items.length === 0) {
    return <p className="text-lg text-muted">No submissions for this problem yet.</p>;
  }

  return (
    <div>
      {canLoad && <p className="mb-4 text-base text-muted">Click an entry to load its code into the editor.</p>}
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              disabled={!canLoad}
              onClick={() => onLoad(s)}
              className="neu-raised-sm flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left text-lg transition disabled:cursor-default"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{s.language}</span>
                <span className="block text-base text-muted">{formatDate(s.createdAt)}</span>
              </span>
              <span className={`font-semibold ${scoreColor(s.correctness)}`}>{s.correctness}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssessmentCard({ status, result }) {
  const done = status === "submitted" && result;
  const ringColor = done
    ? result.correctness >= 80 ? "stroke-brand" : result.correctness >= 50 ? "stroke-amber-700" : "stroke-red-700"
    : "";

  return (
    <section aria-live="polite" className="neu-raised rounded-[32px] p-6 md:p-8">
      <h2 className="flex items-center gap-3 text-xl font-medium">
        <BrainCircuit size={22} className="text-brand" /> AI assessment
      </h2>

      {done ? (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-8">
            <div className="relative size-[110px] shrink-0">
              <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-track" />
                <circle
                  cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" strokeLinecap="round"
                  className={`${ringColor} transition-all duration-700`}
                  strokeDasharray={`${(result.correctness / 100) * CIRC} ${CIRC}`}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-2xl font-medium">
                {result.correctness}%
              </span>
            </div>

            <div className="space-y-1 text-lg leading-relaxed text-muted">
              <p>Estimated correctness</p>
              <p>
                Time <b className="font-semibold text-ink">{result.timeComplexity}</b> · Space{" "}
                <b className="font-semibold text-ink">{result.spaceComplexity}</b>
              </p>
            </div>
          </div>

          <p className="neu-inset mt-6 rounded-3xl p-5 text-lg leading-relaxed">{result.feedback}</p>
        </>
      ) : (
        <div className="mt-6 flex items-center gap-6">
          <div className="neu-inset grid size-[92px] shrink-0 place-items-center rounded-full text-muted">
            {status === "submitting" ? <Loader2 size={30} className="animate-spin" /> : <Sparkles size={30} />}
          </div>
          <p className="text-lg leading-relaxed text-muted">
            {status === "submitting"
              ? "Analyzing your code…"
              : "Submit your solution to get a correctness estimate, complexity analysis, and feedback."}
          </p>
        </div>
      )}
    </section>
  );
}

/* ---------- The whole solving screen ---------- */
function Solver({ problem, onRetry, initial }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const allSubmissions = useSelector((state) => state.submissions.items);
  const history = useMemo(
    () => allSubmissions.filter((s) => s.problemId === problem.id),
    [allSubmissions, problem.id]
  );

  // "initial" is a past submission sent from the Submissions page ("Open in workspace").
  // When it exists we start already "submitted": a read-only review of that attempt.
  const reviewing = Boolean(initial);

  const [status, setStatus] = useState(reviewing ? "submitted" : "solving"); // solving → submitting → submitted
  const [language, setLanguage] = useState(initial?.language ?? "Python");
  const [codes, setCodes] = useState(() =>
    initial ? { ...STARTER_CODE, [initial.language]: initial.code } : STARTER_CODE
  ); // one draft per language
  const [result, setResult] = useState(
    initial
      ? {
          correctness: initial.correctness,
          timeComplexity: initial.timeComplexity,
          spaceComplexity: initial.spaceComplexity,
          feedback: initial.feedback,
        }
      : null
  );
  const [tab, setTab] = useState("statement");
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT);

  const deadline = useRef(Date.now() + TIME_LIMIT * 1000);
  const assessmentRef = useRef(null);

  const code = codes[language];
  const setCode = (value) => setCodes((prev) => ({ ...prev, [language]: value }));
  const solving = status === "solving";

  /* countdown: measured against a deadline, so it stays accurate even if the tab is throttled */
  useEffect(() => {
    if (!solving) return;
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [solving]);

  /* time is up → auto-submit */
  useEffect(() => {
    if (solving && secondsLeft === 0) submit({ auto: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, solving]);

  /* bring the result into view after a NEW submit (not when just reviewing) */
  useEffect(() => {
    if (status === "submitted" && !reviewing) {
      assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [status, reviewing]);

  const submit = async ({ auto = false } = {}) => {
    if (status !== "solving") return;

    const untouched = code.trim() === STARTER_CODE[language].trim();

    if (untouched && !auto) {
      showToast("Write your solution first");
      return;
    }

    if (untouched && auto) {
      setResult({
        correctness: 0,
        timeComplexity: "—",
        spaceComplexity: "—",
        feedback: "Time ran out before you wrote a solution. Try again when you're ready.",
      });
      setStatus("submitted");
      showToast("Time's up!");
      return;
    }

    if (auto) showToast("Time's up. Submitting your code…");
    setStatus("submitting");

    const assessment = await mockAssess({ code, language });
    setResult(assessment);
    setStatus("submitted");

    dispatch(
      addSubmission({
        id: Date.now(),
        problemId: problem.id,
        title: problem.title,
        language,
        code,
        ...assessment,
        createdAt: new Date().toISOString(),
      })
    );
    dispatch(
      setProblemStatus({
        id: problem.id,
        status: assessment.correctness >= 80 ? "Solved" : "Attempted",
      })
    );
    if (!auto) showToast(assessment.correctness >= 80 ? "Solved! 🎉" : "Submitted. Keep improving!");
  };

  const loadSubmission = (s) => {
    setLanguage(s.language);
    setCodes((prev) => ({ ...prev, [s.language]: s.code }));
    showToast("Loaded into the editor");
  };

  const urgency = secondsLeft <= 60 ? "text-red-700" : secondsLeft <= 180 ? "text-amber-700" : "text-ink";
  const barColor = secondsLeft <= 60 ? "bg-red-700" : secondsLeft <= 180 ? "bg-amber-700" : "bg-brand";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {reviewing ? (
          <p className="neu-inset rounded-full px-5 py-2 text-lg text-muted">
            Viewing your submission from {formatDate(initial.createdAt)}
          </p>
        ) : (
          <span />
        )}
        <StatusIndicator submitted={status === "submitted"} />
      </div>

      {/* ---------- Title row ---------- */}
      <header className="mt-6 flex flex-wrap items-center gap-4 md:gap-5">
        <Link
          to="/problems"
          aria-label="Back to problems"
          className="neu-raised-sm grid size-16 place-items-center rounded-2xl text-muted transition hover:text-ink"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-emboss text-3xl font-semibold md:text-4xl">Problem #{problem.id}</h1>
        <span className={`neu-inset rounded-full px-5 py-2 text-lg ${DIFFICULTY_COLOR[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <span className="neu-inset rounded-full px-5 py-2 text-lg text-muted">{problem.source}</span>
        <a
          href={SOURCE_URLS[problem.source]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-lg text-brand hover:underline"
        >
          <ExternalLink size={18} /> View original
        </a>
      </header>

      {/* ---------- Timer, language, submit ---------- */}
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <div role="timer" aria-label="Time remaining" className="neu-raised-sm flex h-16 items-center gap-4 rounded-3xl px-6">
          <Clock size={20} className="text-muted" />
          <span className={`font-mono text-xl ${urgency}`}>
            {reviewing ? "--:--" : formatTime(secondsLeft)}
          </span>
          <span className="text-muted">of {formatTime(TIME_LIMIT)}</span>
        </div>

        <LanguageSelect value={language} onChange={setLanguage} disabled={!solving} />

        {status === "submitted" ? (
          <button
            type="button"
            onClick={onRetry}
            className="neu-raised-sm flex h-16 items-center gap-3 rounded-3xl px-10 text-lg font-semibold text-brand transition active:translate-y-px"
          >
            <RotateCcw size={20} /> Try again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => submit()}
            disabled={status === "submitting"}
            className="neu-brand flex h-16 items-center gap-3 rounded-3xl px-10 text-lg font-semibold text-white transition active:translate-y-px disabled:opacity-70"
          >
            {status === "submitting" && <Loader2 size={20} className="animate-spin" />}
            {status === "submitting" ? "Analyzing…" : "Submit for assessment"}
          </button>
        )}
      </div>

      {/* time bar */}
      <div
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={TIME_LIMIT}
        aria-valuenow={reviewing ? 0 : secondsLeft}
        className="neu-inset mt-6 h-3 overflow-hidden rounded-full"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-linear ${barColor}`}
          style={{ width: reviewing ? "0%" : `${(secondsLeft / TIME_LIMIT) * 100}%` }}
        />
      </div>

      {/* ---------- Two columns ---------- */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left: statement / history. On desktop it is absolutely sized so it matches the right column's height */}
        <div className="relative h-[520px] lg:h-auto">
          <section className="neu-raised flex h-full flex-col rounded-[32px] p-6 lg:absolute lg:inset-0">
            <div role="group" aria-label="Problem panel" className="neu-inset flex h-16 w-fit shrink-0 items-center gap-1 rounded-full p-2">
              {[
                ["statement", "Statement"],
                ["history", "History"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={tab === key}
                  onClick={() => setTab(key)}
                  className={`h-12 rounded-full px-6 text-lg transition ${
                    tab === key ? "neu-raised-sm font-medium text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="neu-inset neu-scroll mt-5 min-h-0 flex-1 overflow-y-auto rounded-[28px] p-6">
              {tab === "statement" ? (
                <Statement problem={problem} />
              ) : (
                <History items={history} canLoad={solving} onLoad={loadSubmission} />
              )}
            </div>
          </section>
        </div>

        {/* Right: editor + assessment */}
        <div className="min-w-0 space-y-8">
          <section className="neu-raised relative h-[460px] rounded-[32px] p-3">
            <CodeEditor value={code} onChange={setCode} language={language} readOnly={!solving} />

            {!solving && (
              <span className="neu-inset pointer-events-none absolute bottom-5 right-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-base text-muted">
                <Lock size={14} /> Read-only
              </span>
            )}
          </section>

          <div ref={assessmentRef}>
            <AssessmentCard status={status} result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
function ProblemDetail() {
  const { id } = useParams();
  const { state } = useLocation(); // carries the submission from "Open in workspace"
  const problem = useSelector((s) => s.problems.items.find((p) => p.id === Number(id)));
  const [attempt, setAttempt] = useState(0);

  if (!problem) {
    return (
      <div className="py-10">
        <h1 className="text-emboss text-3xl font-semibold">Problem not found</h1>
        <Link to="/problems" className="mt-6 inline-block text-lg text-brand hover:underline">
          ← Back to problems
        </Link>
      </div>
    );
  }

  // changing the key throws the old Solver away and builds a fresh one:
  // that is how "Try again" and opening another problem reset the timer, editor and result.
  // "initial" is only passed on the first attempt, so "Try again" gives a clean editor.
  return (
    <Solver
      key={`${problem.id}-${attempt}`}
      problem={problem}
      initial={attempt === 0 ? state?.submission : undefined}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  );
}

export default withPageShell(ProblemDetail);