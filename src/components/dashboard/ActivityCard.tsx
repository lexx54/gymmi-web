import { ChevronRight } from 'lucide-react';
import type { Activity } from '../../types/dashboard';

type ActivityCardProps = Omit<Activity, 'id'>;

/**
 * Compact card representing a single recent workout/activity.
 * Left thumbnail + stacked label/title/meta + trailing chevron.
 */
export function ActivityCard({ when, title, meta, image }: ActivityCardProps) {
  return (
    <button
      type="button"
      className="group flex items-center gap-4 rounded-2xl bg-surface-container p-4 text-left w-full ring-1 ring-outline-variant/15 hover:bg-surface-container-high transition-colors"
    >
      <div className="size-14 shrink-0 rounded-full overflow-hidden bg-surface-container-highest">
        <img alt="" src={image} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70">
          {when}
        </p>
        <p className="font-headline font-bold text-on-surface tracking-tight truncate">
          {title}
        </p>
        <p className="font-body text-xs text-on-surface-variant/70 truncate">{meta}</p>
      </div>
      <ChevronRight
        className="size-5 text-on-surface-variant/60 group-hover:text-primary transition-colors shrink-0"
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}
