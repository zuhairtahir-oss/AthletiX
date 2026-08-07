import { Link } from "react-router-dom";
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
      <Card interactive className="flex items-center gap-3 p-4">
        <TeamBadge team={team} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{team.name}</p>
          {team.location && <p className="truncate text-xs text-text-secondary">{team.location}</p>}
        </div>
      </Card>
    </Link>
  );
}
