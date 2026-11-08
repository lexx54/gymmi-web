import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AdminOverview } from './AdminOverview';
import * as adminApi from '../../services/api/admin';
import type { AdminOverview as AdminOverviewData } from '../../types/adminOverview';

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

vi.mock('../../services/api/admin', () => ({
  fetchAdminOverview: vi.fn(),
}));

const generatedAt = '2026-11-08T12:00:00.000Z';

const overview: AdminOverviewData = {
  generatedAt,
  attention: {
    pendingPayments: { count: 7, totalUsd: 142, oldestWaitingHours: 75 },
    expiringPlans: { count: 12, remindedCount: 4 },
    gymTrialsEnding: { count: 3 },
    openReports: { count: 2 },
  },
  accounts: {
    total: 1284,
    newLast30Days: 86,
    byRole: {
      Client: { total: 1102, newLast30Days: 71 },
      Trainer: { total: 164, newLast30Days: 12 },
      Gym: { total: 18, newLast30Days: 3 },
    },
    gymsOnTrial: 5,
  },
  signups: Array.from({ length: 30 }, (_, i) => ({
    date: `2026-10-${String(i + 1).padStart(2, '0')}`,
    Client: i % 3,
    Trainer: i % 2,
    Gym: 0,
  })),
  revenue: {
    monthUsd: 1436,
    previousMonthUsd: 1217,
    approvedCount: 41,
    rejectedCount: 5,
    byMethod: [
      { method: 'pago_movil', amountUsd: 890, count: 25 },
      { method: 'zelle', amountUsd: 546, count: 16 },
    ],
  },
  expiringPlans: [
    {
      userId: 'u1',
      username: 'mariafit',
      role: 'Trainer',
      plan: 'pro',
      paidUntil: '2026-11-09T10:00:00.000Z',
    },
    {
      userId: 'u2',
      username: 'jperez',
      role: 'Client',
      plan: 'plus',
      paidUntil: '2026-11-12T10:00:00.000Z',
    },
  ],
  planMix: {
    payingUsers: 212,
    totalUsers: 1284,
    byPlan: { plus: 138, pro: 58, maximum: 16 },
    lapsedLast30Days: 9,
    inDowngradeGrace: 2,
  },
  activity: {
    workoutsLogged: 2317,
    activeUsers: 431,
    activeContracts: 96,
    pendingContracts: 11,
    articlesPublished: 6,
    routinesCreated: 23,
  },
  recentActivity: [
    {
      type: 'payment_submitted',
      at: '2026-11-08T11:48:00.000Z',
      actor: 'coach.ana',
      role: 'Trainer',
      plan: 'plus',
      billingCycle: 'monthly',
      method: 'pago_movil',
      amountUsd: 15,
      reason: null,
      targetType: null,
    },
    {
      type: 'report',
      at: '2026-11-07T09:00:00.000Z',
      actor: 'luisa.m',
      role: null,
      plan: null,
      billingCycle: null,
      method: null,
      amountUsd: null,
      reason: 'SPAM',
      targetType: 'ARTICLE',
    },
  ],
  exchangeRate: { rate: 48.27, validFor: '2026-11-08' },
};

function renderOverview() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return render(<AdminOverview username="codelexx" />, { wrapper });
}

describe('AdminOverview', () => {
  beforeEach(() => {
    vi.mocked(adminApi.fetchAdminOverview).mockResolvedValue(overview);
    navigate.mockReset();
  });

  it('shows attention items, account totals and revenue', async () => {
    renderOverview();

    const payments = await screen.findByTestId('attention-payments');
    expect(payments).toHaveTextContent('7');
    expect(payments).toHaveTextContent('Oldest waiting 3 days');
    expect(payments).toHaveTextContent('$142.00');
    expect(screen.getByTestId('attention-expiring')).toHaveTextContent('12');
    expect(screen.getByTestId('attention-trials')).toHaveTextContent('3');
    expect(screen.getByTestId('attention-reports')).toHaveTextContent('2');

    expect(screen.getByTestId('kpi-total')).toHaveTextContent('1,284');
    expect(screen.getByTestId('kpi-gym')).toHaveTextContent('5 on trial');

    const revenue = screen.getByTestId('revenue-card');
    expect(revenue).toHaveTextContent('$1,436.00');
    expect(revenue).toHaveTextContent('+18%');
    expect(revenue).toHaveTextContent('Pago Móvil');

    expect(screen.getByTestId('bcv-rate')).toHaveTextContent('48.27');
    expect(screen.getByTestId('signups-chart')).toBeInTheDocument();
  });

  it('lists expiring plans, plan mix, activity and the feed', async () => {
    renderOverview();

    const expiring = await screen.findByTestId('expiring-list');
    expect(expiring).toHaveTextContent('mariafit');
    expect(expiring).toHaveTextContent('Tomorrow');
    expect(expiring).toHaveTextContent('4 days');

    expect(screen.getByTestId('plan-mix')).toHaveTextContent('Maximum 16');
    expect(screen.getByTestId('platform-activity')).toHaveTextContent('2,317');

    const feed = screen.getByTestId('recent-activity');
    expect(feed).toHaveTextContent('coach.ana submitted a $15.00 Pago Móvil payment');
    expect(feed).toHaveTextContent('luisa.m reported an article · Spam or advertising');
  });

  it('opens the related admin page from an attention card', async () => {
    renderOverview();

    fireEvent.click(await screen.findByTestId('attention-payments'));
    expect(navigate).toHaveBeenCalledWith('/admin/payments');
    fireEvent.click(screen.getByTestId('attention-reports'));
    expect(navigate).toHaveBeenCalledWith('/admin/reports');
  });

  it('shows a retry message when the overview fails to load', async () => {
    vi.mocked(adminApi.fetchAdminOverview).mockRejectedValue(new Error('boom'));
    renderOverview();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't load the platform overview.",
    );
  });
});
