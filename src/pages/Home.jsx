import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import MainNavbar from "../components/MainNavbar";

/* ---------- Mock data (replace with API data later) ---------- */
const USER = { name: "Alex", initials: "AK", streak: 6 };

const STATS = [
  { label: "Solved", value: "48" },
  { label: "Streak", value: "6 days" },
  { label: "Avg correctness", value: "86%" },
  { label: "Submissions", value: "112" },
];

const WEEK = [
  { day: "M", value: 60 },
  { day: "T", value: 85 },
  { day: "W", value: 35 },
  { day: "T", value: 70 },
  { day: "F", value: 100 },
  { day: "S", value: 45 },
  { day: "S", value: 18 },
];

const RECENT = [
  { id: "valid-parentheses", title: "Valid Parentheses", lang: "Python", score: 96 },
  { id: "merge-intervals", title: "Merge Intervals", lang: "JavaScript", score: 72 },
  { id: "lru-cache", title: "LRU Cache", lang: "Java", score: 41 },
];

const RECOMMENDED = [
  { id: "binary-search", title: "Binary Search", difficulty: "Easy", topic: "Arrays" },
  { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", topic: "Hashing" },
  { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", topic: "Graphs" },
];

const scoreColor = (s) =>
  s >= 80 ? "text-brand" : s >= 60 ? "text-amber-700" : "text-red-700";

/* ---------- Page ---------- */
export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/problems?q=${encodeURIComponent(q)}` : "/problems");
  };

  const solveRandom = () => {
    const pick = RECOMMENDED[Math.floor(Math.random() * RECOMMENDED.length)];
    navigate(`/problems/${pick.id}`);
  };

  return (
    <div className="p-3 md:p-8">
      <div className="mx-auto flex max-w-[1472px] flex-col gap-6 rounded-3xl bg-surface p-5 md:min-h-[calc(100vh-4rem)] md:flex-row md:gap-10 md:rounded-[36px] md:p-8">
        <MainNavbar />

        <main className="min-w-0 flex-1">
          {/* ---------- Header ---------- */}
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-emboss text-3xl font-semibold md:text-4xl">
                Welcome back, {USER.name}
              </h1>
              <p className="mt-2 text-lg text-muted">
                You're on a {USER.streak} day streak. Keep it going.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <form
                onSubmit={handleSearch}
                role="search"
                className="neu-inset flex h-[72px] w-full items-center gap-4 rounded-3xl px-7 text-muted sm:w-80"
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
                {USER.initials}
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

          {/* ---------- Main grid ---------- */}
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
            {/* Left column */}
            <div className="space-y-8">
              {/* This week */}
              <section className="neu-raised rounded-[32px] p-6 md:p-8">
                <h2 className="text-xl font-medium">This week</h2>

                <div className="mt-6 flex justify-between gap-2">
                  {WEEK.map(({ day, value }, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div
                        className="neu-inset flex h-[120px] w-8 items-end overflow-hidden rounded-full"
                        role="img"
                        aria-label={`${day}: ${value}% of daily goal`}
                      >
                        <div
                          className="w-full rounded-full bg-brand"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <span className="text-lg text-muted">{day}</span>
                    </div>
                  ))}
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

                <ul className="mt-6 space-y-4">
                  {RECENT.map(({ id, title, lang, score }) => (
                    <li key={id}>
                      <Link
                        to={`/problems/${id}`}
                        className="neu-inset flex h-[76px] items-center gap-4 rounded-full px-6 text-lg"
                      >
                        <span className="flex-1 truncate font-medium">{title}</span>
                        <span className="hidden w-28 text-muted sm:block">{lang}</span>
                        <span className={`w-14 text-right font-semibold ${scoreColor(score)}`}>
                          {score}%
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right column */}
            <aside className="neu-raised rounded-[32px] p-6 md:p-8">
              <h2 className="text-xl font-medium">Recommended for you</h2>

              <ul className="mt-6 space-y-4">
                {RECOMMENDED.map(({ id, title, difficulty, topic }) => (
                  <li key={id}>
                    <Link
                      to={`/problems/${id}`}
                      className="neu-inset block rounded-3xl px-6 py-5"
                    >
                      <p className="text-lg font-medium">{title}</p>
                      <p className="mt-1 text-muted">
                        {difficulty} · {topic}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={solveRandom}
                className="neu-brand mt-6 h-[72px] w-full rounded-3xl text-lg font-semibold text-white transition active:translate-y-px"
              >
                Solve a random one
              </button>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}