import type { StatAccent, StatTileProps } from '../../types/dashboard';

const ACCENT_CLASSES: Record<StatAccent, { border: string; icon: string }> = {
  primary: { border: 'border-primary', icon: 'text-primary' },
  tertiary: { border: 'border-tertiary', icon: 'text-tertiary' },
  secondary: { border: 'border-secondary', icon: 'text-secondary' },
};

/**
 * Compact metric card used in the dashboard side column. The `accent` prop
 * drives both the bottom-edge stripe (a single-edge accent, not a container
 * border — DESIGN.md compliant) and the icon tint.
 */
export default function StatTile({ icon: Icon, label, value, unit, accent }: StatTileProps) {
  const { border, icon } = ACCENT_CLASSES[accent];
  return (
    <div
      className={`bg-surface-container rounded-[2rem] p-6 flex flex-col justify-between border-b-4 ${border}`}
    >
      <div className="flex justify-between items-center">
        <Icon className={`size-7 ${icon}`} strokeWidth={2} aria-hidden />
        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant font-label">
          {label}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-4xl font-black font-headline text-on-surface">{value}</span>
        <span className="text-sm font-bold text-on-surface-variant ml-1">{unit}</span>
      </div>
    </div>
  );
}
