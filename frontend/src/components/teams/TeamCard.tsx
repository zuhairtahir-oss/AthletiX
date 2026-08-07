import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";
import { TeamBadge } from "./TeamBadge";
import type { Team } from "../../types/espn";

interface TeamCardProps {
  team: Team;
  leagueSlug: string;
}

export function TeamCard({ team, leagueSlug }: TeamCardProps) {
  return (
    <Link to={`/teams/${leagueSlug}/${team.id}`}>
      <Card interactive className="group flex items-center gap-4 p-4">
        <TeamBadge team={team} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{team.name}</p>
          {team.location && <p className="truncate text-xs text-text-secondary">{team.location}</p>}
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-all duration-[var(--duration-base)] group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Card>
    </Link>
  );
}
