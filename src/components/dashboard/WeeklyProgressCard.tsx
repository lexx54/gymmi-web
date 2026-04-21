import type { ChartBar } from '../../types/dashboard';
import { WeeklyBarChart } from './WeeklyBarChart';

interface WeeklyProgressCardProps {
  /** Small overline shown above the title, e.g. "Weekly Progress". */
  subtitle: string;
  /** Bold uppercase title, e.g. "VOLUME TRAINING". */
  title: string;
  /** Goal completion percentage (0-100). */
  percent: number;
  /** Seven-day bar chart data. */
  bars: ChartBar[];
  /** Optional ghost background image overlaid at low opacity. */
  bgImageUrl?: string;
}

/**
 * Hero card on the dashboard. Combines an editorial title block with
 * a large goal callout and the weekly bar chart. Background image
 * sits behind the content at ~10% opacity to provide texture without
 * hurting legibility.
 */
export function WeeklyProgressCard({
  subtitle,
  title,
  percent,
  bars,
  bgImageUrl,
}: WeeklyProgressCardProps) {
  return (
    <section className="relative lg:col-span-8 overflow-hidden rounded-3xl bg-surface-container-low p-6 sm:p-8 lg:p-10">
      {bgImageUrl !== undefined ? (
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-cover pointer-events-none"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
      ) : null}

      <div className="relative flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="font-label text-[11px] uppercase tracking-[0.25em] text-on-surface-variant/70 mb-2">
            {subtitle}
          </p>
          <h3 className="font-headline font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <p className="font-headline font-extrabold italic text-primary text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-none">
            {percent}%
          </p>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70 mt-2">
            Goal Reached
          </p>
        </div>
      </div>

      <div className="relative">
        <WeeklyBarChart bars={bars} />
      </div>
    </section>
  );
}
