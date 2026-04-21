import type { LucideIcon } from 'lucide-react';

/**
 * Describes a single bar in the weekly training volume chart.
 */
export interface ChartBar {
  /** Short day label shown under the bar (e.g. "MON"). */
  day: string;
  /** Bar height expressed as a percentage of the chart area (0-100). */
  heightPct: number;
  /** Hover-state bar height (0-100). Defaults to `heightPct` when omitted. */
  hoverHeightPct?: number;
  /** When true, the bar renders with the primary gradient accent. */
  active?: boolean;
}

/**
 * A recent activity entry shown in the "Recent Activity" grid.
 */
export interface Activity {
  id: string;
  /** Relative-time label (e.g. "YESTERDAY", "2 DAYS AGO"). */
  when: string;
  title: string;
  /** Subtitle metadata (e.g. "5.2 km • 28:14"). */
  meta: string;
  /** URL of the thumbnail image. */
  image: string;
  /** Optional destination; when provided, the card renders as a link. */
  href?: string;
}

/**
 * Accent color tokens available for a stat tile.
 * Maps to Material theme tokens defined in tailwind.config.js.
 */
export type StatAccent = 'primary' | 'tertiary' | 'secondary';

/**
 * Props for a single stat tile in the dashboard side column.
 */
export interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  accent: StatAccent;
}
