import { useState } from "react";
import { GitCompareArrows, User, Shield } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ComparePicker } from "../components/compare/ComparePicker";
import { ComparisonBar } from "../components/compare/ComparisonBar";
import { TeamBadge } from "../components/teams/TeamBadge";
import { usePlayerComparison, useTeamComparison } from "../hooks/useCompare";
import type { ComparisonSide } from "../services/compareService";
import type { SearchResult } from "../types/espn";

type CompareMode = "player" | "team";

function toSide(result: SearchResult): ComparisonSide {
  return { league: result.league as string, id: result.id };
}

export default function ComparePage() {
  const [mode, setMode] = useState<CompareMode>("player");
  const [sideA, setSideA] = useState<ComparisonSide | undefined>();
  const [sideB, setSideB] = useState<ComparisonSide | undefined>();
  const [labelA, setLabelA] = useState<string | undefined>();
  const [labelB, setLabelB] = useState<string | undefined>();

  const playerComparison = usePlayerComparison(mode === "player" ? sideA : undefined, mode === "player" ? sideB : undefined);
  const teamComparison = useTeamComparison(mode === "team" ? sideA : undefined, mode === "team" ? sideB : undefined);
  const activeQuery = mode === "player" ? playerComparison : teamComparison;

  function switchMode(next: CompareMode) {
    setMode(next);
    setSideA(undefined);
    setSideB(undefined);
    setLabelA(undefined);
    setLabelB(undefined);
  }

  function selectSide(side: "a" | "b", result: SearchResult) {
    if (side === "a") {
      setSideA(toSide(result));
      setLabelA(result.name);
    } else {
      setSideB(toSide(result));
      setLabelB(result.name);
    }
  }

  const hasBothSides = sideA !== undefined && sideB !== undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Analysis"
        title="Compare"
        description="Put two players or teams side by side."
        actions={
          <div className="flex gap-2">
            <Button
              variant={mode === "player" ? "primary" : "secondary"}
              size="sm"
              icon={<User className="h-4 w-4" aria-hidden="true" />}
              onClick={() => switchMode("player")}
            >
              Players
            </Button>
            <Button
              variant={mode === "team" ? "primary" : "secondary"}
              size="sm"
              icon={<Shield className="h-4 w-4" aria-hidden="true" />}
              onClick={() => switchMode("team")}
            >
              Teams
            </Button>
          </div>
        }
      />

      {!hasBothSides && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ComparePicker mode={mode} label={labelA ?? "Side A"} onSelect={(r) => selectSide("a", r)} />
            <ComparePicker mode={mode} label={labelB ?? "Side B"} onSelect={(r) => selectSide("b", r)} />
          </div>
          <EmptyState
            icon={<GitCompareArrows className="h-6 w-6" aria-hidden="true" />}
            title="Pick two to compare"
            description="Search and select a match on both sides above to see a head-to-head comparison."
          />
        </>
      )}

      {hasBothSides && activeQuery.isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {hasBothSides && activeQuery.isError && (
        <ErrorState
          description="We couldn't load this comparison. One of the selections may be unavailable."
          onRetry={() => activeQuery.refetch()}
        />
      )}

      {hasBothSides && mode === "player" && playerComparison.data && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-lg font-semibold text-text">
              {playerComparison.data.a.name}
            </p>
            <GitCompareArrows className="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="min-w-0 flex-1 truncate text-right text-lg font-semibold text-text">
              {playerComparison.data.b.name}
            </p>
          </div>

          {playerComparison.data.metrics.length === 0 ? (
            <EmptyState
              icon={<GitCompareArrows className="h-6 w-6" aria-hidden="true" />}
              title="Not enough shared statistics"
              description="These two players don't have any statistics ESPN reports in common (e.g. different positions), so a meaningful comparison isn't available."
            />
          ) : (
            <Card className="flex flex-col gap-4 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {playerComparison.data.metricsLabel}
              </p>
              {playerComparison.data.metrics.map((metric) => (
                <ComparisonBar
                  key={metric.label}
                  label={metric.label}
                  valueA={metric.a}
                  valueB={metric.b}
                  unit={metric.unit ? ` ${metric.unit}` : undefined}
                />
              ))}
            </Card>
          )}
        </div>
      )}

      {hasBothSides && mode === "team" && teamComparison.data && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <TeamBadge team={teamComparison.data.a} size="md" />
              <p className="truncate text-lg font-semibold text-text">{teamComparison.data.a.name}</p>
            </div>
            <GitCompareArrows className="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <p className="truncate text-right text-lg font-semibold text-text">
                {teamComparison.data.b.name}
              </p>
              <TeamBadge team={teamComparison.data.b} size="md" />
            </div>
          </div>
          <Card className="flex flex-col gap-4 p-5">
            <ComparisonBar
              label="Roster Size"
              valueA={teamComparison.data.rosterSizeA}
              valueB={teamComparison.data.rosterSizeB}
            />
          </Card>
        </div>
      )}

      {hasBothSides && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => {
            setSideA(undefined);
            setSideB(undefined);
            setLabelA(undefined);
            setLabelB(undefined);
          }}
        >
          Compare something else
        </Button>
      )}

    </div>
  );
}
