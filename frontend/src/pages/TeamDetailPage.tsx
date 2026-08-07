import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, CalendarClock, History } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Card } from "../components/ui/Card";
import { TeamBadge } from "../components/teams/TeamBadge";
import { PlayerListItem } from "../components/players/PlayerListItem";
import { StandingsTable } from "../components/standings/StandingsTable";
import { GameListRow } from "../components/games/GameListRow";
import { useTeam } from "../hooks/useTeams";
import { useStandings } from "../hooks/useStandings";

export default function TeamDetailPage() {
  const { league, id } = useParams<{ league: string; id: string }>();
  const { data: team, isLoading, isError, refetch } = useTeam(league, id);
  const standingsQuery = useStandings(league);

  const teamStandingsGroup = standingsQuery.data?.find((group) =>
    group.rows.some((row) => row.team.id === id)
  );

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/teams"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Teams
      </Link>

      {isLoading && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <ErrorState
          title="Team not found"
          description="We couldn't load this team. Check the link or try again."
          onRetry={() => refetch()}
        />
      )}

      {team && (
        <>
          <PageHeader
            eyebrow={team.league}
            title={team.name}
            description={team.venue ?? team.location ?? undefined}
            actions={<TeamBadge team={team} size="lg" />}
          />

          {teamStandingsGroup && league && (
            <section aria-labelledby="standings-heading" className="flex flex-col gap-3">
              <h2 id="standings-heading" className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Standings
              </h2>
              <StandingsTable group={teamStandingsGroup} leagueSlug={league} highlightTeamId={id} />
            </section>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section aria-labelledby="upcoming-heading" className="flex flex-col gap-3">
              <h2
                id="upcoming-heading"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Upcoming
              </h2>
              {team.schedule.upcoming.length === 0 ? (
                <p className="text-sm text-text-secondary">No upcoming games scheduled.</p>
              ) : (
                <Card className="px-3">
                  {team.schedule.upcoming.map((game) => (
                    <GameListRow key={game.id} game={game} />
                  ))}
                </Card>
              )}
            </section>

            <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
              <h2
                id="recent-heading"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary"
              >
                <History className="h-4 w-4" aria-hidden="true" />
                Recent Results
              </h2>
              {team.schedule.recent.length === 0 ? (
                <p className="text-sm text-text-secondary">No completed games yet this season.</p>
              ) : (
                <Card className="px-3">
                  {team.schedule.recent.map((game) => (
                    <GameListRow key={game.id} game={game} />
                  ))}
                </Card>
              )}
            </section>
          </div>

          <section aria-labelledby="roster-heading">
            <h2 id="roster-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
              Roster
            </h2>

            {team.roster.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" aria-hidden="true" />}
                title="No roster available"
                description="Roster data isn't available for this team right now."
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {team.roster.map((player) => (
                  <PlayerListItem key={player.id} player={player} leagueSlug={league as string} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
