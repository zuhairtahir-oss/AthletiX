import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Radio, Users, Shield, GitCompareArrows, Trophy, Activity } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { GameCard } from "../components/games/GameCard";
import { SportDot } from "../components/leagues/SportDot";
import { useLiveGames } from "../hooks/useLiveGames";
import { useLeagues } from "../hooks/useLeagues";
import { SPORT_LABELS } from "../utils/sport";
import { cn } from "../utils/cn";
import type { League, Sport } from "../types/espn";

const WORKFLOWS = [
  {
    to: "/live",
    icon: Radio,
    title: "Live",
    description: "Scores and status for games in progress.",
  },
  {
    to: "/players",
    icon: Users,
    title: "Players",
    description: "Search players and dig into sport-specific stats.",
  },
  {
    to: "/teams",
    icon: Shield,
    title: "Teams",
    description: "Rosters, standings, and schedules.",
  },
  {
    to: "/compare",
    icon: GitCompareArrows,
    title: "Compare",
    description: "Put two players or teams side by side.",
  },
];

function groupLeaguesBySport(leagues: League[]): Array<{ sport: Sport; leagues: League[] }> {
  const bySport = new Map<Sport, League[]>();
  for (const league of leagues) {
    const existing = bySport.get(league.sport) ?? [];
    existing.push(league);
    bySport.set(league.sport, existing);
  }
  return Array.from(bySport.entries()).map(([sport, leagueList]) => ({ sport, leagues: leagueList }));
}

/**
 * Home leads with what's actually happening right now (live games,
 * pulled from the same feed as the Live page) rather than decorative
 * stat cards with no real meaning. The league directory below groups
 * every supported league by sport so the multi-sport scope of the
 * product is visible at a glance.
 */
export default function HomePage() {
  const liveGames = useLiveGames();
  const { data: leagues, isLoading: leaguesLoading } = useLeagues();

  const sportGroups = useMemo(() => groupLeaguesBySport(leagues ?? []), [leagues]);
  const featuredGames = (liveGames.data ?? []).slice(0, 3);
  const liveCount = liveGames.data?.length ?? 0;
  const sportsCovered = sportGroups.length;
  const leaguesTracked = leagues?.length ?? 0;

  const snapshotStats = [
    { label: "Live right now", value: liveCount, icon: Radio, accent: "text-live" },
    { label: "Sports covered", value: sportsCovered, icon: Trophy, accent: "text-brand" },
    { label: "Leagues tracked", value: leaguesTracked, icon: Shield, accent: "text-accent" },
  ];

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-field-grid opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-radial-brand" aria-hidden="true" />
        <div className="relative grid grid-cols-1 items-center gap-10 py-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="flex flex-col gap-6 animate-fade-up">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              <Activity className="h-3 w-3" aria-hidden="true" />
              Multi-Sport Intelligence
            </span>
            <h1 className="max-w-xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-text sm:text-6xl">
              Follow every
              <span className="text-brand"> game</span>,
              <br className="hidden sm:block" />
              team, and player.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-text-secondary">
              AthletiX tracks live scores, player and team profiles, and head-to-head
              comparisons across basketball, hockey, football, baseball, and soccer —
              all in one place.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/live">
                <Button icon={<Radio className="h-4 w-4" aria-hidden="true" />}>View live games</Button>
              </Link>
              <Link to="/compare">
                <Button variant="secondary" icon={<GitCompareArrows className="h-4 w-4" aria-hidden="true" />}>
                  Compare
                </Button>
              </Link>
            </div>
          </div>

          <Card className="surface-hairline flex flex-col gap-1 p-2 animate-fade-up sm:p-3">
            {snapshotStats.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-md px-4 py-4 transition-colors hover:bg-surface-hover sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-elevated", accent)}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-text-secondary">{label}</span>
                </div>
                <span className="font-tabular text-2xl font-bold text-text">{value}</span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* Live Right Now */}
      <section aria-labelledby="live-now-heading" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
            </span>
            <h2 id="live-now-heading" className="text-sm font-bold uppercase tracking-[0.12em] text-text-secondary">
              Live Right Now
            </h2>
          </div>
          <Link to="/live" className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-strong">
            See all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {liveGames.isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[152px]" />
            ))}
          </div>
        )}

        {liveGames.isSuccess && featuredGames.length === 0 && (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <Radio className="h-5 w-5 text-text-muted" aria-hidden="true" />
            <p className="text-sm font-semibold text-text">No games live right now</p>
            <p className="max-w-sm text-sm text-text-secondary">
              Check the Live page for today&apos;s full schedule across every league.
            </p>
          </Card>
        )}

        {featuredGames.length > 0 && (
          <div
            className={cn(
              "stagger grid grid-cols-1 gap-4 sm:grid-cols-2",
              featuredGames.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            )}
          >
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Explore */}
      <section aria-labelledby="explore-heading" className="flex flex-col gap-5">
        <h2 id="explore-heading" className="text-sm font-bold uppercase tracking-[0.12em] text-text-secondary">
          Explore
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOWS.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.to} to={section.to} className="block">
                <Card interactive className="group flex h-full flex-col gap-4 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-on-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-text">{section.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{section.description}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand">
                    Explore
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Supported Leagues */}
      <section aria-labelledby="leagues-heading" className="flex flex-col gap-5">
        <h2 id="leagues-heading" className="text-sm font-bold uppercase tracking-[0.12em] text-text-secondary">
          Supported Leagues
        </h2>

        {leaguesLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        )}

        {sportGroups.length > 0 && (
          <Card className="surface-hairline flex flex-col divide-y divide-border">
            {sportGroups.map((group) => (
              <div
                key={group.sport}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
              >
                <div className="flex shrink-0 items-center gap-2 sm:w-40">
                  <SportDot sport={group.sport} />
                  <p className="text-sm font-semibold text-text">{SPORT_LABELS[group.sport]}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.leagues.map((league) => (
                    <Link
                      key={league.slug}
                      to={`/teams?league=${league.slug}`}
                      className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-sm text-text-secondary transition-all duration-[var(--duration-fast)] hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                    >
                      {league.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
