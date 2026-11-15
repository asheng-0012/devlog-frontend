import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import { loadDashboard } from "../redux/dashboardSlice";

const DAILY_GOAL = 5; // problems per day

const scoreColor = (s) =>
  s >= 80 ? "text-brand" : s >= 60 ? "text-amber-700" : "text-red-700";

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { stats, week, recent } = useSelector((state) => state.dashboard);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(loadDashboard());
  }, [dispatch]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const STATS = [
    { label: "Solved", value: stats.solved },
    { label: "Streak", value: `${stats.streak} days` },
    { label: "Avg correctness", value: `${stats.avgCorrectness}%` },
    { label: "Submissions", value: stats.submissions },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/problems?q=${encodeURIComponent(q)}` : "/problems");
  };

  return (
    <div>
      {/* ---------- Header ---------- */}
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-emboss text-3xl font-semibold md:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-lg text-muted">
            You're on a {stats.streak} day streak. Keep it going.
          </p>
        </div>

        <div className="flex w-full items-center gap-5 sm:w-auto">
          <form
            onSubmit={handleSearch}
            role="search"
            className="neu-inset flex h-[72px] flex-1 items-center gap-4 rounded-3xl px-7 text-muted sm:w-80 sm:flex-none"
          >
            <Search size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems"
              className="min-w-0 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-muted"
            />
          </form>

          <Link
            to="/profile"
            aria-label="Profile"
            className="neu-raised-sm grid size-[72px] shrink-0 place-items-center rounded-full text-xl font-semibold text-brand"
          >
            {getInitials(user?.name) || "?"}
          </Link>
        </div>
      </header>

      {/* ---------- Stats ---------- */}
      <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value }) => (
          <article key={label} className="neu-raised rounded-3xl p-6">
            <p className="text-lg text-muted">{label}</p>
            <p className="mt-3 text-4xl font-medium">{value}</p>
          </article>
        ))}
      </section>

      {/* ---------- Main section ---------- */}
      <div className="mt-8 space-y-8">
        {/* This week */}
        <section className="neu-raised rounded-[32px] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">This week</h2>
            <span className="text-muted">Goal: {DAILY_GOAL} / day</span>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            {week.map(({ day, solved }, i) => {
              const pct = Math.min(100, (solved / DAILY_GOAL) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div
                    className="neu-inset flex h-[120px] w-8 items-end overflow-hidden rounded-full"
                    role="img"
                    title={`${solved} solved`}
                    aria-label={`${day}: ${solved} of ${DAILY_GOAL} problems solved`}
                  >
                    <div
                      className="w-full rounded-full bg-brand transition-[height] duration-500"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-lg text-muted">{day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent submissions */}
        <section className="neu-raised rounded-[32px] p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Recent submissions</h2>
            <Link to="/submissions" className="text-lg text-brand hover:underline">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="mt-6 text-lg text-muted">No submissions yet. Solve your first problem!</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {recent.map(({ id, title, language, correctness }) => (
                <li key={id}>
                  <Link
                    to={`/problems/${id}`}
                    className="neu-inset flex h-[76px] items-center gap-4 rounded-full px-6 text-lg"
                  >
                    <span className="flex-1 truncate font-medium">{title}</span>
                    <span className="hidden w-28 text-muted sm:block">{language}</span>
                    <span className={`w-14 text-right font-semibold ${scoreColor(correctness)}`}>
                      {correctness}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default withPageShell(Home);