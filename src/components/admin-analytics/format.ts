import type { AnalyticsBucket, PeriodMetric } from '../../types/adminAnalytics';

export const ANALYTICS_TABS = ['growth', 'revenue', 'engagement', 'content'] as const;
export type AnalyticsTab = (typeof ANALYTICS_TABS)[number];

/** Percent change vs the previous window; `null` when there is nothing to compare against. */
export function percentChange({ current, previous }: PeriodMetric): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Rounds up to a "nice" axis maximum whose quarter ticks are round numbers. */
export function niceMax(value: number): number {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value / 4));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * step * 4 >= value) return m * step * 4;
  }
  return value;
}

/** Bucket start date as a short axis label for the bucket size. */
export function bucketLabel(iso: string, bucket: AnalyticsBucket, locale: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return bucket === 'month'
    ? date.toLocaleDateString(locale, { month: 'short', year: '2-digit' })
    : date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}
