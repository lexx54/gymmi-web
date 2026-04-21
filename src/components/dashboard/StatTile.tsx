import type { AccentTone, StatTileProps } from '../../types/dashboard';

const accentClasses: Record<AccentTone, { icon: string; chipBg: string; value: string }> = {
  primary: {
    icon: 'text-primary',
    chipBg: 'bg-primary/15',
    value: 'text-primary',
  },
  tertiary: {
    icon: 'text-tertiary',
    chipBg: 'bg-tertiary/15',
    value: 'text-tertiary',
  },
  secondary: {
    icon: 'text-secondary',
    chipBg: 'bg-secondary/15',
    value: 'text-secondary',
  },
};

/**
 * Single metric tile shown in the dashboard right column.
 * Pairs an accented icon chip with an uppercase label and a
 * `display`/`label-sm` numeric pair per DESIGN.md hierarchy rules.
 */
export function StatTile({ icon: Icon, label, value, unit, accent }: StatTileProps) {
  const tone = accentClasses[accent];

  return (
    <article className="relative rounded-3xl bg-surface-container p-5 sm:p-6 ring-1 ring-outline-variant/15">
      <div className="flex items-start justify-between mb-6">
        <div
          className={`size-10 rounded-2xl flex items-center justify-center ${tone.chipBg}`}
          aria-hidden
        >
          <Icon className={`size-5 ${tone.icon}`} strokeWidth={2.25} />
        </div>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`font-headline font-extrabold tracking-tighter text-4xl sm:text-5xl leading-none ${tone.value}`}
        >
          {value}
        </span>
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
          {unit}
        </span>
      </div>
    </article>
  );
}
