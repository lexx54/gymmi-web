import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AdminAnalytics } from './AdminAnalytics';
import { niceMax, percentChange } from './format';
import * as adminApi from '../../services/api/admin';
import type { AdminAnalytics as AdminAnalyticsData } from '../../types/adminAnalytics';

vi.mock('../../services/api/admin', () => ({
  fetchAdminAnalytics: vi.fn(),
}));

const days = (n: number) =>
  Array.from({ length: n }, (_, i) => `2026-10-${String(i + 10).padStart(2, '0')}`);

const analytics: AdminAnalyticsData = {
  generatedAt: '2026-11-08T12:00:00.000Z',
  range: '30d',
  bucket: 'day',
  growth: {
    signups: { current: 86, previous: 70 },
    signupsByRole: {
      Client: { current: 71, previous: 60 },
      Trainer: { current: 12, previous: 10 },
      Gym: { current: 3, previous: 0 },
    },
    totalUsers: 1284,
    series: days(10).map((date, i) => ({ date, Client: i, Trainer: 1, Gym: 0, totalUsers: 1200 + i })),
    lapsed: { current: 9, previous: 6 },
    gymTrials: { started: 4, converted: 1 },
  },
  revenue: {
    totalUsd: { current: 1436, previous: 1217 },
    approvedCount: { current: 41, previous: 38 },
    rejectedCount: 5,
    payingUsers: 40,
    arpuUsd: 35.9,
    avgReviewHours: 30,
    series: days(10).map((date, i) => ({ date, amountUsd: i * 10, count: i })),
    byPlan: [{ key: 'pro', amountUsd: 900, count: 20 }],
    byMethod: [{ key: 'pago_movil', amountUsd: 890, count: 25 }],
    byRole: [{ key: 'Trainer', amountUsd: 700, count: 18 }],
  },
  engagement: {
    workouts: { current: 2317, previous: 2000 },
    activeUsers: { current: 431, previous: 431 },
    avgSessionMinutes: 52,
    series: days(10).map((date, i) => ({ date, workouts: i * 3, activeUsers: i })),
    contracts: { active: 96, pending: 11, created: { current: 14, previous: 0 } },
    retention: [
      { week: '2026-10-26', size: 20, rates: [0.6, 0.45] },
      { week: '2026-11-02', size: 8, rates: [0.25] },
    ],
  },
  content: {
    routines: { current: 23, previous: 20 },
    articles: { current: 6, previous: 3 },
    reports: { current: 4, previous: 2 },
    openReports: 2,
    avgResolutionHours: 5.5,
    reportsByReason: [{ reason: 'SPAM', count: 3 }],
    series: days(10).map((date) => ({ date, routines: 1, articles: 0, reports: 0 })),
  },
  exchangeRate: { rate: 48.27, validFor: '2026-11-08' },
};

function renderAnalytics(path = '/analytics') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return render(<AdminAnalytics />, { wrapper });
}

describe('percentChange', () => {
  it('returns null without a previous value and rounds otherwise', () => {
    expect(percentChange({ current: 5, previous: 0 })).toBeNull();
    expect(percentChange({ current: 86, previous: 70 })).toBe(23);
    expect(percentChange({ current: 5, previous: 10 })).toBe(-50);
  });
});

describe('niceMax', () => {
  it('rounds up to a value with round quarter ticks', () => {
    expect(niceMax(0)).toBe(4);
    expect(niceMax(7)).toBe(8);
    expect(niceMax(37)).toBe(40);
    expect(niceMax(1436)).toBe(2000);
  });
});

describe('AdminAnalytics', () => {
  beforeEach(() => {
    vi.mocked(adminApi.fetchAdminAnalytics).mockReset();
    vi.mocked(adminApi.fetchAdminAnalytics).mockResolvedValue(analytics);
  });

  it('opens on Growth for 30 days with changes vs the previous period', async () => {
    renderAnalytics();

    const signups = await screen.findByTestId('kpi-signups');
    expect(signups).toHaveTextContent('86');
    expect(signups).toHaveTextContent('+23%');
    expect(screen.getByTestId('kpi-total-users')).toHaveTextContent('1,284');
    expect(screen.getByTestId('kpi-trial-conversion')).toHaveTextContent('25%');
    expect(screen.getByTestId('growth-signups-chart')).toBeInTheDocument();
    expect(adminApi.fetchAdminAnalytics).toHaveBeenCalledWith('30d');
    expect(screen.getByRole('tab', { name: 'Growth' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches tabs and shows revenue, engagement and content', async () => {
    renderAnalytics();
    await screen.findByTestId('kpi-signups');

    fireEvent.click(screen.getByRole('tab', { name: 'Revenue' }));
    expect(screen.getByTestId('kpi-revenue')).toHaveTextContent('$1,436.00');
    expect(screen.getByTestId('kpi-revenue')).toHaveTextContent('VES');
    expect(screen.getByTestId('kpi-review-time')).toHaveTextContent('1.3 days');
    expect(screen.getByTestId('revenue-by-method')).toHaveTextContent('Pago Móvil');

    fireEvent.click(screen.getByRole('tab', { name: 'Engagement' }));
    expect(screen.getByTestId('kpi-workouts')).toHaveTextContent('2,317');
    expect(screen.getByTestId('kpi-contracts')).toHaveTextContent('New');
    expect(screen.getByTestId('retention')).toHaveTextContent('60%');

    fireEvent.click(screen.getByRole('tab', { name: 'Content' }));
    expect(screen.getByTestId('kpi-reports')).toHaveTextContent('+100%');
    expect(screen.getByTestId('reports-by-reason')).toHaveTextContent('Spam or advertising');
  });

  it('reads tab and range from the URL and refetches when the range changes', async () => {
    renderAnalytics('/analytics?tab=revenue&range=12m');

    await screen.findByTestId('kpi-revenue');
    expect(adminApi.fetchAdminAnalytics).toHaveBeenCalledWith('12m');

    fireEvent.click(screen.getByRole('button', { name: '7D' }));
    await waitFor(() => expect(adminApi.fetchAdminAnalytics).toHaveBeenCalledWith('7d'));
    expect(screen.getByRole('button', { name: '7D' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows a retry message when analytics fail to load', async () => {
    vi.mocked(adminApi.fetchAdminAnalytics).mockRejectedValue(new Error('boom'));
    renderAnalytics();

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load platform analytics.");
  });
});
