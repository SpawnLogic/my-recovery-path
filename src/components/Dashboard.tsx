import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Award, CalendarClock, History, Loader2, LogOut, RotateCcw } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { loadStreak, resetStreak } from "@/lib/streak-db";
import {
  breakdown,
  dayProgress,
  elapsedSeconds,
  formatDuration,
  formatLocalDateTime,
  milestoneLabel,
  motivationFor,
  secondsUntilNextDay,
  type StreakRecord,
} from "@/lib/streak";
import { StatCard } from "@/components/StatCard";
import { StreakRing } from "@/components/StreakRing";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const CONFIRM_WORD = "RESET";

export function Dashboard({ user }: { user: User }) {
  const username =
    (user.user_metadata?.["username"] as string | undefined) ??
    user.email?.split("@")[0] ??
    "friend";

  const [record, setRecord] = useState<StreakRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecord(await loadStreak(user.id, username));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your streak.");
    } finally {
      setLoading(false);
    }
  }, [user.id, username]);

  useEffect(() => {
    void fetchRecord();
  }, [fetchRecord]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") setNow(Date.now());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function handleReset() {
    if (!record || confirmText.trim().toUpperCase() !== CONFIRM_WORD) return;
    setResetting(true);
    setError(null);
    try {
      setRecord(await resetStreak(record));
      setDialogOpen(false);
      setConfirmText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the reset.");
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </main>
    );
  }

  if (!record) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-destructive">{error ?? "Your streak could not be loaded."}</p>
        <Button onClick={() => void fetchRecord()}>Try again</Button>
        <Button variant="ghost" onClick={() => void handleSignOut()}>
          Sign out
        </Button>
      </main>
    );
  }

  const total = elapsedSeconds(record.streak_started_at, now);
  const { days, hours, minutes, seconds } = breakdown(total);
  const progress = dayProgress(total);
  const remaining = secondsUntilNextDay(total);
  const currentIsBest = total >= record.longest_streak_seconds && total > 0;
  const bestSeconds = Math.max(record.longest_streak_seconds, total);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 pb-10 pt-8 sm:max-w-2xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">NoFap Center</p>
          <h1 className="text-lg font-semibold">Hello, {username}</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void handleSignOut()}
          aria-label="Sign out"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </header>

      <section className="rounded-3xl border border-border bg-card px-5 py-7 shadow-lg">
        <p className="mb-4 text-center text-sm text-muted-foreground">Current streak</p>
        <StreakRing
          progress={progress}
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm font-medium">
            {milestoneLabel(total)} · {Math.round(progress * 100)}% to the next 24 hours
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.floor(remaining / 3600)}h {Math.floor((remaining % 3600) / 60)}m left to complete
            this day
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Longest streak"
          value={bestSeconds >= 60 ? formatDuration(bestSeconds) : "Just started"}
          hint={currentIsBest ? "This is your best run yet" : undefined}
          icon={<Award className="size-3.5" aria-hidden />}
        />
        <StatCard
          label="Previous streak"
          value={
            record.last_streak_seconds > 0 ? formatDuration(record.last_streak_seconds) : "None yet"
          }
          hint={record.last_streak_seconds > 0 ? "Last completed run" : "This is your first run"}
          icon={<History className="size-3.5" aria-hidden />}
        />
        <StatCard
          label="Started"
          value={formatLocalDateTime(record.streak_started_at)}
          hint="Shown in your local time"
          icon={<CalendarClock className="size-3.5" aria-hidden />}
        />
      </section>

      <section className="rounded-2xl border border-border bg-secondary/40 p-5">
        <h2 className="text-sm font-medium">Keep going</h2>
        <p className="mt-2 text-sm text-muted-foreground">{motivationFor(total)}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Your only goal right now is to reach {milestoneLabel(total + 86400)}.
        </p>
      </section>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <footer className="mt-auto pt-4">
        <AlertDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setConfirmText("");
          }}
        >
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="mx-auto flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Record a reset
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your streak?</AlertDialogTitle>
              <AlertDialogDescription>
                This ends your current run of {formatDuration(total)} and starts a new one from now.
                Your longest streak stays recorded. A setback is data, not a verdict.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-xs text-muted-foreground">
                Type {CONFIRM_WORD} to confirm
              </label>
              <Input
                id="confirm"
                value={confirmText}
                autoComplete="off"
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_WORD}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my streak</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmText.trim().toUpperCase() !== CONFIRM_WORD || resetting}
                onClick={(event) => {
                  event.preventDefault();
                  void handleReset();
                }}
              >
                {resetting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Confirm reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </footer>
    </main>
  );
}
