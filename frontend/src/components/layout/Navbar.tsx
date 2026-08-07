import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Radio, Users, Shield, GitCompareArrows, Search, House } from "lucide-react";
import { Logo } from "../brand/Logo";
import { GlobalSearch } from "../search/GlobalSearch";
import { cn } from "../../utils/cn";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, icon: House },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/players", label: "Players", icon: Users },
  { to: "/teams", label: "Teams", icon: Shield },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
];

/**
 * Primary top navigation. A top bar (rather than a sidebar) fits a
 * content-browsing sports product better than an admin-dashboard
 * layout — the surface area is a handful of peer sections, not a deep
 * tool hierarchy. Icons next to each label give quicker visual
 * scanning; a global search trigger (with a "/" shortcut) lets users
 * jump straight to a player or team from anywhere in the app.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="shrink-0" aria-label="AthletiX home">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150",
                    isActive ? "text-text" : "text-text-secondary hover:text-text"
                  )
                }
              >
                {({ isActive }) => (
                  <span className="relative flex items-center gap-1.5">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[9px] left-0 right-0 h-0.5 rounded-full bg-brand" />
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-text-muted hover:border-border-strong hover:text-text-secondary"
            aria-label="Search players and teams"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-muted sm:inline">
              /
            </kbd>
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-border px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
                    isActive
                      ? "bg-surface-elevated text-text"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text"
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      )}

      <GlobalSearch open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
