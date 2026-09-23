import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { WeeklyProgressCard } from './WeeklyProgressCard';
import * as authContext from '../../context/AuthContext';
import * as analyticsApi from '../../services/api/analytics';

const mockAnalytics: analyticsApi.AnalyticsResponse = {
  volumeTrends: {
    totalVolumeKg: 8500,
    deltaPercent: 15,
    weeks: [
      { weekNumber: 1, weekStartDate: '2026-09-01', volumeKg: 2000 },
      { weekNumber: 2, weekStartDate: '2026-09-08', volumeKg: 2000 },
      { weekNumber: 3, weekStartDate: '2026-09-15', volumeKg: 2000 },
      { weekNumber: 4, weekStartDate: '2026-09-22', volumeKg: 2500 },
    ],
    dailyVolume: [
      { weekday: 0, date: '2026-09-21', volumeKg: 1000 },
      { weekday: 1, date: '2026-09-22', volumeKg: 0 },
      { weekday: 2, date: '2026-09-23', volumeKg: 1500 },
      { weekday: 3, date: '2026-09-24', volumeKg: 0 },
      { weekday: 4, date: '2026-09-25', volumeKg: 0 },
      { weekday: 5, date: '2026-09-26', volumeKg: 0 },
      { weekday: 6, date: '2026-09-27', volumeKg: 0 },
    ],
    peakSession: { date: '2026-09-23', volumeKg: 1500 },
  },
  muscleLoad: {
    totalSets: 20,
    distribution: [],
  },
  consistency: {
    streak: 3,
    completionPercent: 75,
    totalWorkouts: 6,
    grid: [],
  },
  personalRecords: [],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('WeeklyProgressCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'client-1',
        email: 'client@example.com',
        username: 'Alex',
        role: { id: 'client-role', name: 'Client' },
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
    } as any);
  });

  it('renders all 7 day bars and goal completion percentage', async () => {
    vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockResolvedValue(mockAnalytics);

    render(<WeeklyProgressCard />, { wrapper: createWrapper() });

    const card = screen.getByTestId('weekly-progress-card');
    expect(card).toBeInTheDocument();

    const goalPercent = screen.getByTestId('goal-percent');
    await waitFor(() => {
      expect(goalPercent).toHaveTextContent('75%');
    });

    // Check that each weekday bar exists (0 to 6)
    for (let i = 0; i < 7; i += 1) {
      expect(screen.getByTestId(`bar-${i}`)).toBeInTheDocument();
    }

    // Check volume label for Wednesday (weekday 2 with 1500 kg)
    const wedBar = screen.getByTestId('bar-2');
    expect(wedBar).toHaveTextContent('1.5k');
  });

  it('shows loading state when fetching analytics', () => {
    vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockReturnValue(new Promise(() => {}));

    render(<WeeklyProgressCard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('goal-percent')).toHaveTextContent('...');
  });
});
