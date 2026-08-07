import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, CalendarClock, Factory as History, MapPin } from "lucide-react";
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

function SectionHeading({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-text-secondary">
      <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
      {children}
    </h2>
  );
}

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
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
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
            actions={<TeamBadge team={team} size="xl" />}
          />

          {team.venue && (
            <div className="-mt-2 flex items-center gap-1.5 text-sm text-text-muted">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {team.venue}
            </div>
          )}

          {teamStandingsGroup && league && (
            <section aria-labelledby="standings-heading" className="flex flex-col gap-3.5">
              <SectionHeading icon={Users}>Standings</SectionHeading>
              <StandingsTable group={teamStandingsGroup} leagueSlug={league} highlightTeamId={id} />
            </section>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section aria-labelledby="upcoming-heading" className="flex flex-col gap-3.5">
              <SectionHeading icon={CalendarClock}>Upcoming</SectionHeading>
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

            <section aria-labelledby="recent-heading" className="flex flex-col gap-3.5">
              <SectionHeading icon={History}>Recent Results</SectionHeading>
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

          <section aria-labelledby="roster-heading" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <SectionHeading icon={Users}>Roster</SectionHeading>
              {team.roster.length > 0 && (
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-bold text-text-muted">
                  {team.roster.length}
                </span>
              )}
            </div>

            {team.roster.length === 0 ? (
              <EmptyState
                icon={<Users className="h-5 w-5" aria-hidden="true" />}
                title="No roster available"
                description="Roster data isn't available for this team right now."
              />
            ) : (
              <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
