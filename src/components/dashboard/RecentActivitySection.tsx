import type { Activity } from '../../types/dashboard';
import { ActivityCard } from './ActivityCard';

interface RecentActivitySectionProps {
  /** Recent activities to render. Typically capped at 3. */
  activities: Activity[];
}

/**
 * Bottom strip of the dashboard. Demonstrates the "intentional asymmetry"
 * rule from DESIGN.md by anchoring the section title left and pushing
 * the secondary "VIEW HISTORY" link to the far right with breathing room.
 */
export function RecentActivitySection({ activities }: RecentActivitySectionProps) {
  return (
    <section className="col-span-12 mt-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight uppercase">
          Recent Activity
        </h3>
        <button
          type="button"
          className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/70 hover:text-primary transition-colors"
        >
          View History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            when={activity.when}
            title={activity.title}
            meta={activity.meta}
            image={activity.image}
          />
        ))}
      </div>
    </section>
  );
}
