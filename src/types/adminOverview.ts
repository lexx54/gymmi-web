import type { PaymentMethod } from './payments';

export type OverviewRole = 'Client' | 'Trainer' | 'Gym';
export type OverviewPlan = 'plus' | 'pro' | 'maximum';

export type RecentActivityType =
  | 'signup'
  | 'gym_created'
  | 'payment_submitted'
  | 'payment_approved'
  | 'payment_rejected'
  | 'report';

export interface RecentActivityItem {
  type: RecentActivityType;
  at: string;
  actor: string | null;
  role: string | null;
  plan: string | null;
  billingCycle: string | null;
  method: string | null;
  amountUsd: number | null;
  reason: string | null;
  targetType: string | null;
}

export interface ExpiringPlan {
  userId: string;
  username: string;
  role: OverviewRole;
  plan: OverviewPlan;
  paidUntil: string;
}

export interface SignupDay {
  date: string;
  Client: number;
  Trainer: number;
  Gym: number;
}

/** Response of `GET /admin/overview`. */
export interface AdminOverview {
  generatedAt: string;
  attention: {
    pendingPayments: { count: number; totalUsd: number; oldestWaitingHours: number | null };
    expiringPlans: { count: number; remindedCount: number };
    gymTrialsEnding: { count: number };
    openReports: { count: number };
  };
  accounts: {
    total: number;
    newLast30Days: number;
    byRole: Record<OverviewRole, { total: number; newLast30Days: number }>;
    gymsOnTrial: number;
  };
  signups: SignupDay[];
  revenue: {
    monthUsd: number;
    previousMonthUsd: number;
    approvedCount: number;
    rejectedCount: number;
    byMethod: Array<{ method: PaymentMethod; amountUsd: number; count: number }>;
  };
  expiringPlans: ExpiringPlan[];
  planMix: {
    payingUsers: number;
    totalUsers: number;
    byPlan: Record<OverviewPlan, number>;
    lapsedLast30Days: number;
    inDowngradeGrace: number;
  };
  activity: {
    workoutsLogged: number;
    activeUsers: number;
    activeContracts: number;
    pendingContracts: number;
    articlesPublished: number;
    routinesCreated: number;
  };
  recentActivity: RecentActivityItem[];
  exchangeRate: { rate: number; validFor: string } | null;
}
