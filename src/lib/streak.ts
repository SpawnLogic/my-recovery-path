export type StreakRecord = {
  user_id: string;
  username: string | null;
  streak_started_at: string;
  longest_streak_seconds: number;
  last_streak_seconds: number;
  updated_at: string;
};

export const DAY_SECONDS = 86400;

export function elapsedSeconds(startedAt: string, now: number = Date.now()): number {
  const start = new Date(startedAt).getTime();
  return Math.max(0, Math.floor((now - start) / 1000));
}

export function breakdown(totalSeconds: number) {
  const days = Math.floor(totalSeconds / DAY_SECONDS);
  const hours = Math.floor((totalSeconds % DAY_SECONDS) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

/** Progress (0-1) toward completing the current 24 hour block. */
export function dayProgress(totalSeconds: number): number {
  return (totalSeconds % DAY_SECONDS) / DAY_SECONDS;
}

export function secondsUntilNextDay(totalSeconds: number): number {
  return DAY_SECONDS - (totalSeconds % DAY_SECONDS);
}

export function formatDuration(totalSeconds: number): string {
  const { days, hours, minutes } = breakdown(totalSeconds);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatLocalDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const MESSAGES = [
  "The first hours are the hardest. You are already through them.",
  "One decision at a time. This one counts.",
  "Steady beats intense. Keep the pace.",
  "Discipline is remembering what you actually want.",
  "Nothing to prove today. Just don't break the line.",
  "Rest, water, movement. Then the urge passes.",
  "You are building something quietly. Let it grow.",
];

export function motivationFor(totalSeconds: number): string {
  const index = Math.floor(totalSeconds / 3600) % MESSAGES.length;
  return MESSAGES[index] ?? MESSAGES[0]!;
}

export function milestoneLabel(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / DAY_SECONDS);
  return `Day ${days + 1}`;
}
