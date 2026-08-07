import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Card } from "../ui/Card";
import type { Player } from "../../types/espn";

interface PlayerListItemProps {
  player: Player;
  leagueSlug: string;
}

export function PlayerListItem({ player, leagueSlug }: PlayerListItemProps) {
  return (
    <Link to={`/players/${leagueSlug}/${player.id}`}>
      <Card interactive className="flex items-center gap-3 p-3">
        {player.headshot ? (
          <img
            src={player.headshot}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-border bg-surface-elevated object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted">
            <User className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{player.name}</p>
          <p className="truncate text-xs text-text-secondary">
            {player.position ?? "—"}
            {player.jersey ? ` · #${player.jersey}` : ""}
          </p>
        </div>
      </Card>
    </Link>
  );
}
