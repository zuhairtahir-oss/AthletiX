import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";

const FOOTER_LINKS = [
  { to: "/live", label: "Live" },
  { to: "/players", label: "Players" },
  { to: "/teams", label: "Teams" },
  { to: "/compare", label: "Compare" },
];

/**
 * Minimal footer. No fake social links or newsletter signup — just
 * brand mark, a short nav, and a data attribution line (required since
 * the app consumes a third-party sports API).
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3">
            <Link to="/" aria-label="AthletiX home">
              <Logo />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-text-muted">
              Multi-sport intelligence — live scores, rosters, standings, and head-to-head
              comparisons across basketball, hockey, football, baseball, and soccer.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-text-secondary transition-colors duration-[var(--duration-fast)] hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center">
          <p>Sports data provided by public APIs. Built for demonstration purposes.</p>
          <p>&copy; {new Date().getFullYear()} AthletiX</p>
        </div>
      </div>
    </footer>
  );
}
