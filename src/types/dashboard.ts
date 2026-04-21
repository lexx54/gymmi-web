import type { LucideIcon } from 'lucide-react';

/**
 * Accent tone used by stat tiles to drive icon and value coloring.
 * Maps to Tailwind tokens defined in `tailwind.config.js`.
 */
export type AccentTone = 'primary' | 'secondary' | 'tertiary';

/**
 * A single column in the weekly volume bar chart.
 */
export interface ChartBar {
  /** Day label rendered beneath the bar, e.g. "MON". */
  day: string;
  /** Resting bar height as a percentage of the chart's vertical space (0-100). */
  heightPct: number;
  /** Optional alternate height used while the bar is hovered (0-100). */
  hoverHeightPct?: number;
  /** When true, the bar is rendered with the primary gradient highlight. */
  active?: boolean;
}

/**
 * Props for an individual stat tile in the dashboard right column.
 */
export interface StatTileProps {
  /** Lucide icon component shown in the icon chip. */
  icon: LucideIcon;
  /** Uppercase label, e.g. "CALORIES". */
  label: string;
  /** Big display value, e.g. "1,842". */
  value: string;
  /** Small unit suffix paired with the value, e.g. "KCAL". */
  unit: string;
  /** Color scheme for the icon and value. */
  accent: AccentTone;
}

/**
 * Recent workout/activity entry rendered in the bottom strip.
 */
export interface Activity {
  /** Stable identifier used as React key. */
  id: string;
  /** Relative time label, e.g. "YESTERDAY", "2 DAYS AGO". */
  when: string;
  /** Title of the activity, e.g. "Urban Trail Run". */
  title: string;
  /** Compact metadata line, e.g. "5.2 km • 28:14". */
  meta: string;
  /** Thumbnail image URL. */
  image: string;
}
