import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between">
      <Link to="/" className="flex items-center gap-4">
        <span className="neu-raised-sm grid size-14 place-items-center rounded-2xl text-muted md:size-[72px]">
          <Code2 size={28} />
        </span>
        <span className="text-2xl font-semibold tracking-[0.12em]">DEVLOG</span>
      </Link>

      <nav className="hidden gap-12 text-xl text-muted lg:flex">
        <a href="#problems" className="hover:text-ink">Problems</a>
        <a href="#features" className="hover:text-ink">Features</a>
        <a href="#how-it-works" className="hover:text-ink">How it works</a>
      </nav>

      <div className="flex items-center gap-4 text-lg md:gap-6 md:text-xl">
        <Link to="/login" className="text-muted hover:text-ink">Log in</Link>
        <Link
          to="/signup"
          className="neu-raised-sm flex h-12 items-center rounded-2xl px-6 font-semibold active:neu-inset md:h-[72px] md:px-8"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}