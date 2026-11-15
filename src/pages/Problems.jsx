import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2, CircleDot, Circle,
  ChevronDown, ChevronLeft, ChevronRight, Search, X,
} from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import {
  setDifficulty, setTopic, setStatus, setSource, setSearch, setPage, resetFilters,
  loadQuestions, loadTags, loadSources,
} from "../redux/problemsSlice";

const PAGE_SIZE = 15;
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const STATUSES = ["All", "Solved", "Attempted", "Todo"];
const GAP = "…";

const DIFFICULTY_COLOR = {
  Easy: "text-brand",
  Medium: "text-amber-700",
  Hard: "text-red-700",
};

const STATUS_ICON = {
  Solved: { Icon: CheckCircle2, className: "text-brand" },
  Attempted: { Icon: CircleDot, className: "text-amber-700" },
  Todo: { Icon: Circle, className: "text-muted" },
};

/* 1 2 3 … 20  style page list */
function getPageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 2) { pages.add(2); pages.add(3); }
  if (current >= total - 1) { pages.add(total - 1); pages.add(total - 2); }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(GAP);
    out.push(p);
  });
  return out;
}

/* ---------- Small pieces ---------- */
function Dropdown({ label, value, options, onChange }) {
  return (
    <label className="neu-raised-sm relative flex h-16 cursor-pointer items-center gap-3 rounded-full px-7 text-lg text-muted focus-within:ring-2 focus-within:ring-brand">
      <span>{label}: {value}</span>
      <ChevronDown size={18} />
      {/* real select sits invisibly on top, so we keep native keyboard + mobile behavior */}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const base = "grid size-14 place-items-center rounded-2xl text-lg transition";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${base} neu-raised-sm text-muted disabled:opacity-40`}
      >
        <ChevronLeft size={22} />
      </button>

      {getPageList(page, totalPages).map((item, i) =>
        item === GAP ? (
          <span key={`gap-${i}`} className="px-1 text-muted">{GAP}</span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${base} ${
              item === page
                ? "neu-inset font-semibold text-brand"
                : "neu-raised-sm text-muted hover:text-ink"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${base} neu-raised-sm text-muted disabled:opacity-40`}
      >
        <ChevronRight size={22} />
      </button>
    </nav>
  );
}

/* ---------- Page ---------- */
function Problems() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  // what the user is typing right now (the address bar only updates after a short pause)
  const [text, setText] = useState(q);

  const { items, total, pages, topics, sourceCounts, filters, loading, error } =
    useSelector((state) => state.problems);

  const page = filters.page;
  const sourceNames = Object.keys(sourceCounts);
  const allCount = Object.values(sourceCounts).reduce((sum, n) => sum + n, 0);

  const hasFilters =
    q ||
    filters.difficulty !== "All" ||
    filters.topic !== "All" ||
    filters.status !== "All" ||
    filters.source !== "All";

  const clearAll = () => {
    dispatch(resetFilters());
    setText("");
    setSearchParams({});
  };

  // put the search text into the address bar (?q=)
  const applySearch = (value) => {
    const trimmed = value.trim();
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
  };

  const clearSearch = () => {
    setText("");
    setSearchParams({}, { replace: true });
  };

  // topics + source counts are loaded once
  useEffect(() => {
    dispatch(loadTags());
    dispatch(loadSources());
  }, [dispatch]);

  // if ?q= changes from outside (Home page link, Clear filters), update the input
  useEffect(() => {
    setText(q);
  }, [q]);

  // wait 400ms after the user stops typing, then search
  useEffect(() => {
    if (text.trim() === q) return;
    const timer = setTimeout(() => applySearch(text), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, q]);

  // copy the ?q= text from the address bar into the store
  useEffect(() => {
    if (q !== filters.search) dispatch(setSearch(q));
  }, [q, filters.search, dispatch]);

  // load one page from the server whenever a filter or the page changes
  useEffect(() => {
    dispatch(loadQuestions());
  }, [
    dispatch,
    filters.difficulty,
    filters.topic,
    filters.source,
    filters.search,
    filters.page,
  ]);

  // jump back to the top when the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div>
      {/* ---------- Header ---------- */}
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-emboss text-3xl font-semibold md:text-4xl">Problems</h1>
        <p className="text-lg text-muted">{total} problems</p>
      </header>

      {/* ---------- Search ---------- */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          applySearch(text); // Enter searches right away
        }}
        className="neu-inset mt-8 flex h-16 items-center gap-4 rounded-full px-7 focus-within:ring-2 focus-within:ring-brand"
      >
        <Search size={22} className="shrink-0 text-muted" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search problems…"
          aria-label="Search problems"
          className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
        />
        {text && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearSearch}
            className="shrink-0 text-muted transition hover:text-ink"
          >
            <X size={20} />
          </button>
        )}
      </form>

      {/* ---------- Filters ---------- */}
      <div className="mt-6 flex flex-wrap items-center gap-5">
        {/* difficulty tabs */}
        <div role="group" aria-label="Difficulty" className="neu-inset flex h-16 items-center gap-1 rounded-full p-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={filters.difficulty === d}
              onClick={() => dispatch(setDifficulty(d))}
              className={`h-12 rounded-full px-5 text-lg transition md:px-7 ${
                filters.difficulty === d
                  ? "neu-raised-sm font-medium text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <Dropdown
          label="Topic"
          value={filters.topic}
          options={["All", ...topics]}
          onChange={(v) => dispatch(setTopic(v))}
        />
        <Dropdown
          label="Status"
          value={filters.status}
          options={STATUSES}
          onChange={(v) => dispatch(setStatus(v))}
        />
      </div>

      {/* ---------- Source chips ---------- */}
      <p className="mt-8 text-lg text-muted">Source</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {["All", ...sourceNames].map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filters.source === s}
            onClick={() => dispatch(setSource(s))}
            className={`neu-raised-sm h-14 rounded-full px-7 text-lg transition ${
              filters.source === s ? "text-brand" : "text-muted hover:text-ink"
            }`}
          >
            {s} <span className="ml-1">{s === "All" ? allCount : sourceCounts[s]}</span>
          </button>
        ))}
      </div>

      {/* ---------- List ---------- */}
      <section className="neu-raised mt-8 rounded-[32px] p-6 md:p-8">
        {error ? (
          <div className="py-10 text-center">
            <p className="text-xl text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => dispatch(loadQuestions())}
              className="neu-raised-sm mt-6 h-12 rounded-full px-8 text-lg text-brand"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 && loading ? (
          <p className="py-10 text-center text-xl text-muted">Loading problems…</p>
        ) : items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xl">No problems match your filters</p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="neu-raised-sm mt-6 h-12 rounded-full px-8 text-lg text-brand"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className={`divide-y divide-track transition-opacity ${loading ? "opacity-50" : ""}`}>
            {items.map(({ id, title, source, difficulty, status }, index) => {
              const { Icon, className } = STATUS_ICON[status] || STATUS_ICON.Todo;
              return (
                <li key={id}>
                  <Link to={`/problems/${id}`} className="group flex items-center gap-4 py-5 text-lg md:gap-6">
                    <span title={status} className={`shrink-0 ${className}`}>
                      <Icon size={22} />
                      <span className="sr-only">{status}</span>
                    </span>
                    {/* the real id is a long database id, so show the row number instead */}
                    <span className="w-14 shrink-0 font-semibold">
                      #{(page - 1) * PAGE_SIZE + index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate transition group-hover:text-brand">
                      {title}
                    </span>
                    <span className="hidden w-36 shrink-0 text-muted md:block">{source}</span>
                    <span className={`w-20 shrink-0 text-right font-medium ${DIFFICULTY_COLOR[difficulty]}`}>
                      {difficulty}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Pagination page={page} totalPages={pages} onChange={(p) => dispatch(setPage(p))} />
    </div>
  );
}

export default withPageShell(Problems);