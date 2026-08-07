import { Link } from "react-router-dom";
import { User, Shield } from "lucide-react";
import { Card } from "../ui/Card";
import { SportDot } from "../leagues/SportDot";
import { useLeagues } from "../../hooks/useLeagues";
import type { SearchResult, Sport } from "../../types/espn";

interface SearchResultCardProps {
  result: SearchResult;
}

/**
 * Generic result card for both players and teams — search returns a
 * mixed set, and the two entity types share enough layout (image,
 * name, subtitle, league) that one component covers both. Always
 * shows name + team/subtitle + league + a sport-colored dot, so a
 * result never leaves the sport/league ambiguous.
 */
export function SearchResultCard({ result }: SearchResultCardProps) {
  const { data: leagues } = useLeagues();
  const to = result.type === "player" ? `/players/${result.league}/${result.id}` : `/teams/${result.league}/${result.id}`;
  const league = leagues?.find((l) => l.slug === result.league);

  return (
    <Link to={to}>
      <Card interactive className="flex items-center gap-3 p-3">
        {result.image ? (
          <img
            src={result.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full border border-border bg-surface-elevated object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted">
            {result.type === "player" ? (
              <User className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Shield className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{result.name}</p>
          <p className="truncate text-xs text-text-secondary">{result.subtitle}</p>
          {league && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
              <SportDot sport={result.sport as Sport} />
              {league.name}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
