import { NavLink, useNavigate } from "react-router-dom";
import {
  Code2,
  LayoutDashboard,
  ListChecks,
  History,
  TrendingUp,
  LogOut,
} from "lucide-react";

const LINKS = [
  { to: "/home", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/problems", label: "Problems", icon: ListChecks },
  { to: "/submissions", label: "Submissions", icon: History },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function MainNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear your auth state / token here
    navigate("/");
  };

  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between gap-4 md:w-[76px] md:shrink-0 md:flex-col md:items-center"
    >
      <div className="flex items-center gap-3 md:flex-col md:gap-6">
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="Home"
          className="neu-raised-sm grid size-14 place-items-center rounded-2xl text-brand md:size-[76px]"
        >
          <Code2 size={26} />
        </NavLink>

        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              `grid size-14 place-items-center rounded-2xl transition md:size-[76px] ${
                isActive
                  ? "neu-inset text-brand"
                  : "text-muted hover:text-ink active:neu-inset"
              }`
            }
          >
            <Icon size={26} />
          </NavLink>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        title="Log out"
        aria-label="Log out"
        className="grid size-14 place-items-center rounded-2xl text-muted transition hover:text-ink active:neu-inset md:size-[76px]"
      >
        <LogOut size={26} />
      </button>
    </nav>
  );
}