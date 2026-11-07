import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown, MessageSquareText } from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import { highlight } from "../components/CodeEditor";

const scoreText = (s) => (s >= 80 ? "text-brand" : s >= 60 ? "text-amber-700" : "text-red-700");
const scoreBar = (s) => (s >= 80 ? "bg-brand" : s >= 60 ? "bg-amber-700" : "bg-red-700");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// "Today, 10:42" · "Yesterday, 18:05" · "Mon, 14:20" · "Mar 3, 09:12"
function formatWhen(iso) {
  const date = new Date(iso);
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const day =
    diff === 0 ? "Today"
    : diff === 1 ? "Yesterday"
    : diff < 7 ? date.toLocaleDateString([], { weekday: "short" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${day}, ${time}`;
}

/* ---------- One expanded panel ---------- */
function Details({ submission, id }) {
  const { code, language, timeComplexity, spaceComplexity, feedback, problemId } = submission;

  const lines = code.trimEnd().split("\n");
  const preview = lines.slice(0, 3).join("\n");
  const hasMore = lines.length > 3;

  return (
    <div id={id} className="neu-inset mb-6 grid gap-6 rounded-[28px] p-6 md:grid-cols-2 md:gap-10">
      <div className="min-w-0">
        <pre className="neu-scroll overflow-x-auto font-mono text-[15px] leading-8">
          {highlight(preview, language)}
          {hasMore && <span className="text-muted">{"\n    …"}</span>}
        </pre>

        <Link
          to={`/problems/${problemId}`}
          state={{ submission }}
          className="neu-raised-sm mt-5 inline-flex h-14 items-center rounded-2xl px-8 text-lg font-medium transition hover:text-brand active:translate-y-px"
        >
          Open in workspace
        </Link>
      </div>

      <div>
        <div className="flex flex-wrap gap-3">
          <span className="neu-raised-sm rounded-full px-5 py-2 text-lg">Time {timeComplexity}</span>
          <span className="neu-raised-sm rounded-full px-5 py-2 text-lg">Space {spaceComplexity}</span>
        </div>

        <p className="mt-5 flex items-start gap-3 text-lg leading-relaxed">
          <MessageSquareText size={20} className="mt-1 shrink-0 text-brand" />
          {feedback}
        </p>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
function Submissions() {
  const items = useSelector((state) => state.submissions.items);
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  const average = useMemo(
    () => (items.length ? Math.round(items.reduce((sum, s) => sum + s.correctness, 0) / items.length) : 0),
    [items]
  );

  return (
    <div>
      {/* ---------- Header ---------- */}
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-emboss text-3xl font-semibold md:text-4xl">My submissions</h1>
        <p className="text-lg text-muted">
          {items.length} {items.length === 1 ? "submission" : "submissions"} · {average}% average
        </p>
      </header>

      {/* ---------- List ---------- */}
      <section className="neu-raised mt-8 rounded-[32px] px-6 md:px-8">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xl">No submissions yet</p>
            <Link
              to="/problems"
              className="neu-raised-sm mt-6 inline-flex h-12 items-center rounded-full px-8 text-lg text-brand"
            >
              Browse problems
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-track">
            {items.map((s) => {
              const open = openId === s.id;
              const panelId = `submission-${s.id}`;

              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="group flex w-full items-center gap-4 py-5 text-left md:gap-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xl font-medium transition group-hover:text-brand">
                        {s.title}
                      </span>
                      <span className="mt-1 block text-lg text-muted">{formatWhen(s.createdAt)}</span>
                    </span>

                    <span className="hidden w-28 shrink-0 text-lg text-muted sm:block">{s.language}</span>

                    <span className="neu-inset hidden h-3 w-28 shrink-0 overflow-hidden rounded-full md:block">
                      <span
                        className={`block h-full rounded-full ${scoreBar(s.correctness)}`}
                        style={{ width: `${s.correctness}%` }}
                      />
                    </span>

                    <span className={`w-14 shrink-0 text-right text-lg font-semibold ${scoreText(s.correctness)}`}>
                      {s.correctness}%
                    </span>

                    <ChevronDown
                      size={22}
                      className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && <Details submission={s} id={panelId} />}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default withPageShell(Submissions);