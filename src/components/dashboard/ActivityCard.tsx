import { ChevronRight } from 'lucide-react';
import type { Activity } from '../../types/dashboard';

export type ActivityCardProps = Omit<Activity, 'id'>;

/**
 * A single "Recent Activity" row rendered as a nested double-rounded card to
 * imply depth via tonal layering (DESIGN.md section 4). When `href` is
 * provided the card becomes an anchor; otherwise it renders as a plain div.
 */
export default function ActivityCard({ when, title, meta, image, href }: ActivityCardProps) {
  const inner = (
    <div className="bg-surface-container-high rounded-[2.2rem] p-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-3xl overflow-hidden shrink-0">
        <img
          alt=""
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
          src={image}
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs font-bold text-primary mb-0.5">{when}</p>
        <h5 className="font-bold font-headline text-lg text-on-surface">{title}</h5>
        <p className="text-xs text-on-surface-variant">{meta}</p>
      </div>
      <ChevronRight
        className="size-6 shrink-0 text-on-surface-variant/30"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );

  const wrapperClass = 'bg-surface-container-low p-1 rounded-[2.5rem] block';

  if (href) {
    return (
      <a className={wrapperClass} href={href}>
        {inner}
      </a>
    );
  }

  return <div className={wrapperClass}>{inner}</div>;
}
