import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Sparkles, ListChecks, BrainCircuit, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Curated problems",
    text: "Filter by difficulty and topic to find your next challenge.",
  },
  {
    icon: BrainCircuit,
    title: "AI assessment",
    text: "Get correctness estimates, feedback, and complexity analysis.",
  },
  {
    icon: TrendingUp,
    title: "Track progress",
    text: "See your streaks, solved problems, and strongest topics.",
  },
];

const SCORE = 92;
const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

export default function Landing() {
  const { hash } = useLocation();

  // makes /#features links scroll to the section, otherwise start at the top
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="p-3 md:p-8">
      <div className="mx-auto max-w-[1472px] rounded-3xl bg-surface p-6 md:rounded-[36px] md:p-12">
        <Navbar />

        {/* ---------- Hero ---------- */}
        <section className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="neu-inset inline-flex h-14 items-center gap-3 rounded-full px-8 text-lg text-brand">
              <Sparkles size={20} /> AI-powered code practice
            </span>

            <h1 className="text-emboss mt-9 text-5xl font-semibold leading-[1.2] md:text-6xl">
              Practice code.
              <br />
              Understand it deeper.
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-muted md:text-2xl lg:mt-24">
              Solve problems in your favorite language and get instant AI feedback
              on correctness and complexity.
            </p>

            <div className="mt-12 flex flex-col gap-6 sm:flex-row">
              <Link
                to="/signup"
                className="neu-brand inline-flex h-14 items-center justify-center rounded-[20px] px-10 text-lg font-semibold text-white transition active:translate-y-px md:text-xl"
              >
                Start practicing
              </Link>
              <Link
                to="/problems"
                className="neu-raised-sm inline-flex h-14 items-center justify-center rounded-[20px] px-10 text-lg font-semibold transition active:neu-inset md:text-xl"
              >
                Browse problems
              </Link>
            </div>

            <label className="neu-inset mt-10 flex h-[72px] max-w-[680px] items-center gap-5 rounded-full px-8 text-muted md:h-20">
              <Search size={24} />
              <input
                type="text"
                placeholder="Search two sum, binary search"
                className="flex-1 bg-transparent text-xl text-ink outline-none placeholder:text-muted md:text-2xl"
              />
            </label>
          </div>

          {/* Preview card */}
          <aside className="neu-raised rounded-[40px] p-6 md:p-9 lg:mt-12">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-medium">Two Sum</h3>
              <span className="neu-inset rounded-3xl px-5 py-1.5 text-lg text-brand">Easy</span>
            </div>

            <div className="neu-inset mt-8 overflow-x-auto rounded-[32px] p-6">
              <pre className="font-mono text-base leading-10 md:text-lg">{`def two_sum(nums, target):
  seen = {}
  for i, n in enumerate(nums):
    ...`}</pre>
            </div>

            <div className="mt-8 flex items-center gap-8">
              <div className="relative size-[116px] shrink-0">
                <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                  <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-track" />
                  <circle
                    cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10"
                    strokeLinecap="round" className="stroke-brand"
                    strokeDasharray={`${(SCORE / 100) * CIRC} ${CIRC}`}
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-2xl font-medium">
                  {SCORE}%
                </span>
              </div>

              <div className="space-y-1 text-xl leading-relaxed text-muted">
                <p>Estimated correctness</p>
                <p>
                  Time <b className="font-semibold text-ink">O(n)</b> · Space{" "}
                  <b className="font-semibold text-ink">O(n)</b>
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* ---------- Features ---------- */}
        <section id="features" className="mt-20 grid gap-10 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="neu-raised min-h-[300px] rounded-[36px] p-8 md:p-10">
              <div className="neu-raised-sm grid size-[72px] place-items-center rounded-full text-muted">
                <Icon size={28} />
              </div>
              <h3 className="mt-8 text-2xl font-medium">{title}</h3>
              <p className="mt-3 text-xl leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </section>

        {/* -------------------- */}
        <section className="neu-inset mt-16 rounded-[48px] px-6 py-14 text-center">
          <h2 className="text-emboss text-3xl font-medium md:text-4xl">
            Ready for your first problem?
          </h2>
          <p className="mt-4 text-xl text-muted md:text-2xl">
            Create a free account and start in under a minute.
          </p>
          <Link
            to="/signup"
            className="neu-brand mt-9 inline-flex h-14 items-center justify-center rounded-[20px] px-10 text-lg font-semibold text-white transition active:translate-y-px md:text-xl"
          >
            Create account
          </Link>
        </section>

        <Footer />
      </div>
    </div>
  );
}