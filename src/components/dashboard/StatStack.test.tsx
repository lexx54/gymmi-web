import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { StatStack } from './StatStack';
import * as authContext from '../../context/AuthContext';
import * as analyticsApi from '../../services/api/analytics';
import * as dashboardApi from '../../services/api/dashboard';

const mockAnalytics: analyticsApi.AnalyticsResponse = {
  volumeTrends: {
    totalVolumeKg: 10000,
    deltaPercent: 10,
    weeks: [
      { weekNumber: 1, weekStartDate: '2026-09-01', volumeKg: 2000 },
      { weekNumber: 2, weekStartDate: '2026-09-08', volumeKg: 2500 },
      { weekNumber: 3, weekStartDate: '2026-09-15', volumeKg: 2500 },
      { weekNumber: 4, weekStartDate: '2026-09-22', volumeKg: 3000 },
    ],
    dailyVolume: [
      { weekday: 0, date: '2026-09-21', volumeKg: 1000 },
      { weekday: 1, date: '2026-09-22', volumeKg: 0 },
      { weekday: 2, date: '2026-09-23', volumeKg: 1500 },
      { weekday: 3, date: '2026-09-24', volumeKg: 0 },
      { weekday: 4, date: '2026-09-25', volumeKg: 500 },
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
    streak: 5,
    completionPercent: 80,
    totalWorkouts: 8,
    grid: Array.from({ length: 7 }, (_, d) =>
      Array.from({ length: 5 }, (_, w) => ({
        weekday: d,
        weekIndex: w,
        date: '2026-09-23',
        durationMinutes: w === 4 && (d === 0 || d === 2) ? 60 : 0, // 120 mins current week
        intensityLevel: (w === 4 && (d === 0 || d === 2) ? 3 : 0) as 0 | 1 | 2 | 3 | 4,
      })),
    ),
  },
  personalRecords: [],
};

const mockTrainerData: dashboardApi.TrainerDashboardResponse = {
  clientActivity: {
    totalClients: 3,
    activeClientsThisWeek: 2,
    activeRatePercent: 67,
    daily: [],
  },
  metrics: {
    totalClients: 3,
    availableWorkouts: 7,
  },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('StatStack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('as Client', () => {
    beforeEach(() => {
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

    it('renders Weekly Volume, Active Time, and Daily Streak with live data', async () => {
      vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockResolvedValue(mockAnalytics);

      render(<StatStack />, { wrapper: createWrapper() });

      // Weekly Volume: sum of dailyVolume = 1000 + 1500 + 500 = 3,000
      const volumeCard = screen.getByTestId('stat-volume');
      await waitFor(() => {
        expect(volumeCard).toHaveTextContent('3,000');
      });
      expect(volumeCard).toHaveTextContent('KG');

      // Active Time: 60 + 60 = 120 mins
      const activeTimeCard = screen.getByTestId('stat-activeTime');
      await waitFor(() => {
        expect(activeTimeCard).toHaveTextContent('120');
      });
      expect(activeTimeCard).toHaveTextContent('MIN');

      // Daily Streak: 5 days
      const streakCard = screen.getByTestId('stat-streak');
      await waitFor(() => {
        expect(streakCard).toHaveTextContent('5');
      });
    });

    it('shows loading placeholder when analytics are fetching', () => {
      vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockReturnValue(new Promise(() => {}));

      render(<StatStack />, { wrapper: createWrapper() });

      expect(screen.getByTestId('stat-volume')).toHaveTextContent('...');
      expect(screen.getByTestId('stat-activeTime')).toHaveTextContent('...');
      expect(screen.getByTestId('stat-streak')).toHaveTextContent('...');
    });
  });

  describe('as Trainer', () => {
    beforeEach(() => {
      vi.spyOn(authContext, 'useAuth').mockReturnValue({
        user: {
          id: 'trainer-1',
          email: 'trainer@example.com',
          username: 'Coach Loco',
          role: { id: 'trainer-role', name: 'Trainer' },
        },
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        signup: vi.fn(),
      } as any);
    });

    it('renders Total Clients, Available Workouts, and Coming Soon cards', async () => {
      vi.spyOn(dashboardApi, 'fetchTrainerDashboard').mockResolvedValue(mockTrainerData);

      render(<StatStack />, { wrapper: createWrapper() });

      // Total Clients
      const clientsCard = screen.getByTestId('stat-clients');
      await waitFor(() => {
        expect(clientsCard).toHaveTextContent('3');
      });
      expect(clientsCard).toHaveTextContent(/total clients/i);

      // Available Workouts
      const workoutsCard = screen.getByTestId('stat-workouts');
      await waitFor(() => {
        expect(workoutsCard).toHaveTextContent('7');
      });
      expect(workoutsCard).toHaveTextContent(/available workouts/i);

      // Placeholder / Coming soon
      const placeholderCard = screen.getByTestId('stat-placeholder');
      expect(placeholderCard).toHaveTextContent(/coming soon/i);
      expect(placeholderCard).toHaveTextContent('—');
    });
  });
});
