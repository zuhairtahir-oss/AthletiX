import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, User, Shield, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { useLeagues } from "../../hooks/useLeagues";
import { Skeleton } from "../ui/Skeleton";
import { SportDot } from "../leagues/SportDot";
import type { SearchResult, Sport } from "../../types/espn";

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

/**
 * App-wide command-style search, opened from the navbar (button or
 * "/" shortcut). Lets a user jump straight to any player or team
 * without first navigating to the Players/Teams page. Results are
 * filtered to leagues AthletiX actually supports so nothing here leads
 * to a broken detail page.
 */
export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: leagues } = useLeagues();
  const searchQuery = useSearch(query);

  const supportedSlugs = useMemo(() => new Set((leagues ?? []).map((l) => l.slug)), [leagues]);
  const players = (searchQuery.data?.players ?? []).filter((r) => r.league && supportedSlugs.has(r.league));
  const teams = (searchQuery.data?.teams ?? []).filter((r) => r.league && supportedSlugs.has(r.league));
  const trimmed = query.trim();
  const hasQuery = trimmed.length >= 2;

  function leagueName(slug: string | null): string | undefined {
    return leagues?.find((l) => l.slug === slug)?.name;
  }

  useEffect(() => {
    if (open) {
      // Delay focus slightly so the element exists after the portal mounts.
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search players and teams"
        className="w-full max-w-xl overflow-hidden rounded-lg border border-border-strong bg-surface shadow-elevation-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players and teams..."
            className="h-12 w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            aria-label="Search players and teams"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text"
            aria-label="Close search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!hasQuery && (
            <p className="px-3 py-6 text-center text-sm text-text-secondary">
              Type at least 2 characters to search.
            </p>
          )}

          {hasQuery && searchQuery.isLoading && (
            <div className="flex flex-col gap-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          )}

          {hasQuery && searchQuery.isSuccess && players.length === 0 && teams.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text-secondary">
              No results for &ldquo;{trimmed}&rdquo;.
            </p>
          )}

          {hasQuery && teams.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">Teams</p>
              {teams.slice(0, 5).map((result) => (
                <ResultRow
                  key={`${result.league}-${result.id}`}
                  result={result}
                  to={`/teams/${result.league}/${result.id}`}
                  leagueName={leagueName(result.league)}
                  fallbackIcon={<Shield className="h-4 w-4" aria-hidden="true" />}
                  onClick={handleClose}
                />
              ))}
            </div>
          )}

          {hasQuery && players.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">Players</p>
              {players.slice(0, 6).map((result) => (
                <ResultRow
                  key={`${result.league}-${result.id}`}
                  result={result}
                  to={`/players/${result.league}/${result.id}`}
                  leagueName={leagueName(result.league)}
                  fallbackIcon={<User className="h-4 w-4" aria-hidden="true" />}
                  onClick={handleClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ResultRowProps {
  result: SearchResult;
  to: string;
  leagueName: string | undefined;
  fallbackIcon: React.ReactNode;
  onClick: () => void;
}

function ResultRow({ result, to, leagueName, fallbackIcon, onClick }: ResultRowProps) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-surface-hover">
      {result.image ? (
        <img src={result.image} alt="" className="h-8 w-8 rounded-full bg-surface-elevated object-cover" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-text-muted">
          {fallbackIcon}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text">{result.name}</p>
        <p className="truncate text-xs text-text-secondary">{result.subtitle}</p>
        {leagueName && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
            <SportDot sport={result.sport as Sport} />
            {leagueName}
          </p>
        )}
      </div>
    </Link>
  );
}
