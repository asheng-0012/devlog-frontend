import { NavLink, useLocation } from "react-router-dom";
import {
  Code2,
  LayoutDashboard,
  ListChecks,
  History,
  Trophy,
  Settings,
} from "lucide-react";

const LINKS = [
  { to: "/home", label: "Dashboard", icon: LayoutDashboard },
  { to: "/problems", label: "Problems", icon: ListChecks },
  { to: "/submissions", label: "Submissions", icon: History },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const ITEM = "grid size-12 place-items-center rounded-2xl transition md:size-[68px]";

export default function MainNavbar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-2xl bg-surface p-2 shadow-lg
                 md:inset-x-auto md:bottom-16 md:left-[max(4rem,calc((100vw-1472px)/2+2rem))] md:top-16
                 md:w-[76px] md:flex-col md:bg-transparent md:p-0 md:shadow-none"
    >
      <div className="flex items-center gap-2 md:flex-col md:gap-4">
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="Landing page"
          className={`${ITEM} neu-raised-sm text-brand`}
        >
          <Code2 size={26} />
        </NavLink>

        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              `${ITEM} ${
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

      {/* CHANGED: Settings replaces the Log out button.
          Also highlighted on /profile (the Home avatar link). */}
      <NavLink
        to="/settings"
        title="Settings"
        aria-label="Settings"
        className={({ isActive }) =>
          `${ITEM} ${
            isActive || pathname === "/profile"
              ? "neu-inset text-brand"
              : "text-muted hover:text-ink active:neu-inset"
          }`
        }
      >
        <Settings size={26} />
      </NavLink>
    </nav>
  );
}