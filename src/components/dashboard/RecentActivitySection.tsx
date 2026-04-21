import type { Activity } from '../../types/dashboard';
import ActivityCard from './ActivityCard';

export interface RecentActivitySectionProps {
  activities: Activity[];
  viewHistoryHref?: string;
}

/**
 * "Recent Activity" section: editorial header row plus a responsive grid of
 * activity cards. Uses significant whitespace between the heading and the
 * "View History" link per DESIGN.md section 6 (intentional asymmetry).
 */
export default function RecentActivitySection({
  activities,
  viewHistoryHref = '#',
}: RecentActivitySectionProps) {
  return (
    <div className="lg:col-span-12 mt-4">
      <div className="flex justify-between items-end mb-8">
        <h4 className="text-2xl font-bold font-headline tracking-tight uppercase text-on-surface">
          Recent Activity
        </h4>
        <a
          className="text-primary text-xs font-bold tracking-widest hover:underline uppercase"
          href={viewHistoryHref}
        >
          View History
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((a) => (
          <ActivityCard
            key={a.id}
            when={a.when}
            title={a.title}
            meta={a.meta}
            image={a.image}
            href={a.href}
          />
        ))}
      </div>
    </div>
  );
}
