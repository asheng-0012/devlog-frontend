import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";

// Problems uses React Router (protected page — redirects to login if not signed in)
// Features scrolls to the section on the landing page
const NAV_LINKS = [
  { label: "Features", href: "#features", anchor: true },
];

// smooth scroll helper so the Features anchor doesn't hard-jump
function scrollToFeatures(e) {
  e.preventDefault();
  document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 md:gap-4">
          <span className="neu-raised-sm grid size-12 place-items-center rounded-2xl text-muted md:size-[72px]">
            <Code2 size={26} />
          </span>
          <span className="text-xl font-semibold tracking-[0.12em] md:text-2xl">DEVLOG</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden gap-10 text-xl text-muted lg:flex">
          <Link to="/problems" className="hover:text-ink transition-colors">Problems</Link>
          <a href="#features" onClick={scrollToFeatures} className="hover:text-ink transition-colors">Features</a>
        </nav>

        {/* Right side: auth buttons + hamburger */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/login" className="text-base text-muted hover:text-ink transition-colors md:text-xl">
            Log in
          </Link>
          <Link
            to="/signup"
            className="neu-raised-sm flex h-10 items-center rounded-2xl px-5 text-sm font-semibold active:neu-inset md:h-[72px] md:px-8 md:text-xl"
          >
            Sign up
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="neu-raised-sm grid size-10 place-items-center rounded-xl text-muted lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="neu-inset mt-4 flex flex-col gap-1 rounded-2xl p-4 lg:hidden">
          <Link
            to="/problems"
            className="rounded-xl px-4 py-3 text-lg text-muted hover:text-ink transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Problems
          </Link>
          <a
            href="#features"
            className="rounded-xl px-4 py-3 text-lg text-muted hover:text-ink transition-colors"
            onClick={(e) => { scrollToFeatures(e); setMenuOpen(false); }}
          >
            Features
          </a>
        </nav>
      )}
    </header>
  );
}
