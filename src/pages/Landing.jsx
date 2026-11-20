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

  // scroll to anchor links like /#features, otherwise go to top
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <div className="p-3 md:p-8">
      <div className="mx-auto max-w-[1472px] rounded-3xl bg-surface p-4 sm:p-6 md:rounded-[36px] md:p-12">
        <Navbar />

        {/* ---------- Hero ---------- */}
        <section className="mt-8 grid items-start gap-10 md:mt-12 lg:grid-cols-2 lg:gap-14">
          <div>
            {/* AI badge */}
            <span className="neu-inset inline-flex h-11 items-center gap-2 rounded-full px-5 text-base text-brand sm:h-14 sm:gap-3 sm:px-8 sm:text-lg">
              <Sparkles size={18} />
              AI-powered code practice
            </span>

            {/* Headline — scales from phones to desktops */}
            <h1 className="text-emboss mt-6 text-3xl font-semibold leading-[1.2] sm:text-4xl md:mt-8 md:text-5xl lg:text-6xl">
              Practice code.
              <br />
              Understand it deeper.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl md:text-2xl lg:mt-20">
              Solve problems in your favorite language and get instant AI feedback
              on correctness and complexity.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                to="/signup"
                className="neu-brand inline-flex h-12 items-center justify-center rounded-[20px] px-8 text-base font-semibold text-white transition active:translate-y-px sm:h-14 sm:text-lg md:text-xl"
              >
                Start practicing
              </Link>
              <Link
                to="/problems"
                className="neu-raised-sm inline-flex h-12 items-center justify-center rounded-[20px] px-8 text-base font-semibold transition active:neu-inset sm:h-14 sm:text-lg md:text-xl"
              >
                Browse problems
              </Link>
            </div>

            {/* Search bar */}
            <label className="neu-inset mt-8 flex h-14 max-w-[680px] items-center gap-4 rounded-full px-6 text-muted md:h-[72px] md:mt-10 md:px-8">
              <Search size={22} />
              <input
                type="text"
                placeholder="Search two sum, binary search…"
                className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted sm:text-xl md:text-2xl"
              />
            </label>
          </div>

          {/* Preview card — hidden on mobile so the page doesn't feel cluttered */}
          <aside className="hidden rounded-[40px] p-6 neu-raised md:p-9 lg:mt-12 lg:block">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-medium">Two Sum</h3>
              <span className="neu-inset rounded-3xl px-5 py-1.5 text-lg text-brand">Easy</span>
            </div>

            <div className="neu-inset mt-8 overflow-x-auto rounded-[32px] p-6">
              <pre className="font-mono text-base leading-10 md:text-lg">{`def two_sum(nums, target):\n  seen = {}\n  for i, n in enumerate(nums):\n    ...`}</pre>
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
        <section id="features" className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-10">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="neu-raised rounded-[36px] p-7 md:p-10">
              <div className="neu-raised-sm grid size-16 place-items-center rounded-full text-muted md:size-[72px]">
                <Icon size={26} />
              </div>
              <h3 className="mt-6 text-xl font-medium md:mt-8 md:text-2xl">{title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted md:text-xl">{text}</p>
            </article>
          ))}
        </section>

        {/* ---------- CTA banner ---------- */}
        <section className="neu-inset mt-12 rounded-[36px] px-5 py-10 text-center md:mt-16 md:rounded-[48px] md:px-6 md:py-14">
          <h2 className="text-emboss text-2xl font-medium sm:text-3xl md:text-4xl">
            Ready for your first problem?
          </h2>
          <p className="mt-4 text-lg text-muted sm:text-xl md:text-2xl">
            Create a free account and start in under a minute.
          </p>
          <Link
            to="/signup"
            className="neu-brand mt-8 inline-flex h-12 items-center justify-center rounded-[20px] px-8 text-base font-semibold text-white transition active:translate-y-px sm:h-14 sm:text-lg md:text-xl md:mt-9"
          >
            Create account
          </Link>
        </section>

        <Footer />
      </div>
    </div>
  );
}
