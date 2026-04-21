import type { ChartBar } from '../../types/dashboard';

interface WeeklyBarChartProps {
  /** Ordered list of seven bars, one per weekday. */
  bars: ChartBar[];
}

/**
 * Seven-column bar chart used inside the Weekly Progress card.
 * Inactive bars sit on the recessed `surface-container-highest` track;
 * the active bar is filled with the primary gradient and rounded caps.
 */
export function WeeklyBarChart({ bars }: WeeklyBarChartProps) {
  return (
    <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-48 sm:h-56">
      {bars.map((bar) => {
        const isActive = bar.active === true;
        return (
          <div
            key={bar.day}
            className="flex flex-col items-center gap-3 h-full justify-end group"
          >
            <div
              className={
                isActive
                  ? 'w-full rounded-t-2xl bg-gradient-to-t from-primary-container to-primary transition-all duration-500 group-hover:brightness-110'
                  : 'w-full rounded-t-2xl bg-surface-container-highest/80 transition-all duration-500'
              }
              style={{ height: `${Math.min(100, Math.max(0, bar.heightPct))}%` }}
              aria-hidden
            />
            <span
              className={`font-label text-[10px] sm:text-xs uppercase tracking-[0.15em] ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant/60'
              }`}
            >
              {bar.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
