type StreakRingProps = {
  progress: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function StreakRing({ progress, days, hours, minutes, seconds }: StreakRingProps) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
      <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-6xl font-semibold leading-none">{days}</span>
        <span className="mt-1 text-sm text-muted-foreground">{days === 1 ? "day" : "days"}</span>
        <span className="tabular mt-3 text-sm text-muted-foreground">
          {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m{" "}
          {String(seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
}
