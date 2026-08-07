import { useMemo, useState } from "react";
import { User, Shield } from "lucide-react";
import { SearchBar } from "../search/SearchBar";
import { Card } from "../ui/Card";
import { useSearch } from "../../hooks/useSearch";
import { useLeagues } from "../../hooks/useLeagues";
import type { SearchResult } from "../../types/espn";

interface ComparePickerProps {
  mode: "player" | "team";
  label: string;
  onSelect: (result: SearchResult) => void;
}

/**
 * Search-driven picker for one side of a comparison. Reuses the same
 * cross-sport search backend as the Players/Teams pages so users can
 * compare across leagues (e.g. a Premier League team vs a La Liga team).
 */
export function ComparePicker({ mode, label, onSelect }: ComparePickerProps) {
  const [query, setQuery] = useState("");
  const { data: leagues } = useLeagues();
  const searchQuery = useSearch(query);
  const supportedSlugs = useMemo(() => new Set((leagues ?? []).map((l) => l.slug)), [leagues]);

  const results = (mode === "player" ? searchQuery.data?.players : searchQuery.data?.teams) ?? [];
  const filtered = results.filter((result) => result.league && supportedSlugs.has(result.league));
  const trimmed = query.trim();

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={mode === "player" ? "Search for a player" : "Search for a team"}
      />
      {trimmed.length >= 2 && (
        <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
          {filtered.length === 0 && !searchQuery.isLoading && (
            <p className="px-1 text-sm text-text-secondary">No matches found.</p>
          )}
          {filtered.map((result) => (
            <button
              key={`${result.league}-${result.id}`}
              type="button"
              className="w-full text-left"
              onClick={() => onSelect(result)}
            >
              <Card interactive className="flex items-center gap-3 p-2.5">
                {result.image ? (
                  <img src={result.image} alt="" className="h-8 w-8 rounded-full bg-surface-elevated object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-text-muted">
                    {mode === "player" ? (
                      <User className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Shield className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{result.name}</p>
                  <p className="truncate text-xs text-text-secondary">{result.subtitle}</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
