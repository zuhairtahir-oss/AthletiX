import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Radio, Users, Shield, GitCompareArrows, Trophy } from "lucide-react";
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
    { label: "Live right now", value: liveCount, icon: Radio },
    { label: "Sports covered", value: sportsCovered, icon: Trophy },
    { label: "Leagues tracked", value: leaguesTracked, icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-16">
      <section className="grid grid-cols-1 items-center gap-10 py-4 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Multi-Sport Intelligence
          </p>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-text sm:text-6xl">
            Scores, rosters, and comparisons in one place.
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-text-secondary">
            AthletiX tracks live games, player and team profiles, and head-to-head
            comparisons across basketball, hockey, football, baseball, and soccer.
          </p>
          <div className="flex items-center gap-3">
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

        <Card className="flex flex-col gap-1 p-2 sm:p-3">
          {snapshotStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-md px-4 py-4 sm:px-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-text-secondary">{label}</span>
              </div>
              <span className="font-tabular text-2xl font-bold text-text">{value}</span>
            </div>
          ))}
        </Card>
      </section>

      <section aria-labelledby="live-now-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="live-now-heading" className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Live Right Now
          </h2>
          <Link to="/live" className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-strong">
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
              "grid grid-cols-1 gap-4 sm:grid-cols-2",
              featuredGames.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            )}
          >
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="explore-heading" className="flex flex-col gap-4">
        <h2 id="explore-heading" className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Explore
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOWS.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.to} to={section.to} className="block">
                <Card interactive className="group flex h-full flex-col gap-4 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-text">{section.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{section.description}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand">
                    Explore
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="leagues-heading" className="flex flex-col gap-4">
        <h2 id="leagues-heading" className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
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
          <Card className="flex flex-col divide-y divide-border">
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
                      className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-sm text-text-secondary transition-colors hover:border-brand/40 hover:text-brand"
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
