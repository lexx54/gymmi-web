import type { PaymentMethod } from './payments';
import type { OverviewPlan, OverviewRole } from './adminOverview';

export const ANALYTICS_RANGES = ['7d', '30d', '90d', '12m'] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];
export type AnalyticsBucket = 'day' | 'week' | 'month';

/** Value for the selected window and for the equal-length window before it. */
export interface PeriodMetric {
  current: number;
  previous: number;
}

export interface AmountBreakdown<K extends string> {
  key: K;
  amountUsd: number;
  count: number;
}

export interface GrowthPoint {
  date: string;
  Client: number;
  Trainer: number;
  Gym: number;
  totalUsers: number;
}

export interface RetentionCohort {
  week: string;
  size: number;
  /** Share (0–1) active in week N after signup; index 0 is the signup week. */
  rates: number[];
}

/** Response of `GET /admin/analytics`. */
export interface AdminAnalytics {
  generatedAt: string;
  range: AnalyticsRange;
  bucket: AnalyticsBucket;
  growth: {
    signups: PeriodMetric;
    signupsByRole: Record<OverviewRole, PeriodMetric>;
    totalUsers: number;
    series: GrowthPoint[];
    lapsed: PeriodMetric;
    gymTrials: { started: number; converted: number };
  };
  revenue: {
    totalUsd: PeriodMetric;
    approvedCount: PeriodMetric;
    rejectedCount: number;
    payingUsers: number;
    arpuUsd: number;
    avgReviewHours: number | null;
    series: Array<{ date: string; amountUsd: number; count: number }>;
    byPlan: AmountBreakdown<OverviewPlan>[];
    byMethod: AmountBreakdown<PaymentMethod>[];
    byRole: AmountBreakdown<OverviewRole>[];
  };
  engagement: {
    workouts: PeriodMetric;
    activeUsers: PeriodMetric;
    avgSessionMinutes: number | null;
    series: Array<{ date: string; workouts: number; activeUsers: number }>;
    contracts: { active: number; pending: number; created: PeriodMetric };
    retention: RetentionCohort[];
  };
  content: {
    routines: PeriodMetric;
    articles: PeriodMetric;
    reports: PeriodMetric;
    openReports: number;
    avgResolutionHours: number | null;
    reportsByReason: Array<{ reason: string; count: number }>;
    series: Array<{ date: string; routines: number; articles: number; reports: number }>;
  };
  exchangeRate: { rate: number; validFor: string } | null;
}
