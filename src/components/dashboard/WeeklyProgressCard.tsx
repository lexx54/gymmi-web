import type { CSSProperties } from 'react';
import type { ChartBar } from '../../types/dashboard';

export interface WeeklyProgressCardProps {
  /** Overline label rendered above the title (e.g. "Weekly Progress"). */
  subtitle: string;
  /** Main card title (e.g. "VOLUME TRAINING"). */
  title: string;
  /** Completion percentage shown as the large italic accent number. */
  percent: number;
  /** Exactly 7 bars describing the weekly training volume. */
  bars: ChartBar[];
  /** Optional decorative background image rendered at low opacity. */
  bgImageUrl?: string;
}

type CSSWithVars = CSSProperties & Record<'--h' | '--hover-h', string>;

/**
 * Large bento card showing the weekly training volume chart with a subtle
 * background image overlay. Applies the "Editorial Kinetic" shadow defined
 * in index.css (`.editorial-shadow`).
 */
export default function WeeklyProgressCard({
  subtitle,
  title,
  percent,
  bars,
  bgImageUrl,
}: WeeklyProgressCardProps) {
  return (
    <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden editorial-shadow group">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-primary font-label font-bold tracking-widest text-xs mb-1 uppercase">
              {subtitle}
            </p>
            <h3 className="text-3xl font-bold font-headline text-on-surface">{title}</h3>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black italic font-headline text-primary">
              {percent}%
            </span>
            <p className="text-[10px] font-label text-on-surface-variant font-bold tracking-widest">
              GOAL REACHED
            </p>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {bars.map((bar, index) => {
            const style: CSSWithVars = {
              '--h': `${bar.heightPct}%`,
              '--hover-h': `${bar.hoverHeightPct ?? bar.heightPct}%`,
            };
            const base =
              'w-full rounded-t-xl transition-all duration-700 h-[var(--h)] group-hover:h-[var(--hover-h)]';
            const variant = bar.active
              ? 'bg-gradient-to-t from-primary-container to-primary shadow-[0_0_20px_rgba(255,83,90,0.3)]'
              : 'bg-surface-container-highest';
            return (
              <div
                key={`${bar.day}-${index}`}
                className={`${base} ${variant}`}
                style={style}
                aria-hidden
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant font-label tracking-widest px-1">
          {bars.map((bar, index) => (
            <span
              key={`label-${bar.day}-${index}`}
              className={bar.active ? 'text-primary' : undefined}
            >
              {bar.day}
            </span>
          ))}
        </div>
      </div>
      {bgImageUrl ? (
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 grayscale pointer-events-none">
          <img alt="" className="w-full h-full object-cover" src={bgImageUrl} />
        </div>
      ) : null}
    </div>
  );
}
