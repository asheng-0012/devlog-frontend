import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Problems", href: "#problems" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

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
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="hover:text-ink transition-colors">
              {label}
            </a>
          ))}
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
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="rounded-xl px-4 py-3 text-lg text-muted hover:text-ink transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
