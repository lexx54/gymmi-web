import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import AnalyticsPage from './AnalyticsPage';
import * as authContext from '../context/AuthContext';
import * as analyticsApi from '../services/api/analytics';
import * as contractsApi from '../services/api/contracts';

const mockAnalytics: analyticsApi.AnalyticsResponse = {
  volumeTrends: {
    totalVolumeKg: 14500,
    deltaPercent: 12.5,
    weeks: [
      { weekNumber: 1, weekStartDate: '2026-09-01', volumeKg: 3000 },
      { weekNumber: 2, weekStartDate: '2026-09-08', volumeKg: 3500 },
      { weekNumber: 3, weekStartDate: '2026-09-15', volumeKg: 4000 },
      { weekNumber: 4, weekStartDate: '2026-09-22', volumeKg: 4000 },
    ],
    dailyVolume: [],
    peakSession: { date: '2026-09-20', volumeKg: 2100 },
  },
  muscleLoad: {
    totalSets: 45,
    distribution: [
      { id: 'lower', labelKey: 'analytics.lowerBody', sets: 20, percent: 44, color: '#ef233c' },
      { id: 'upper', labelKey: 'analytics.upperBody', sets: 15, percent: 33, color: '#f5a7ad' },
      { id: 'arms', labelKey: 'analytics.arms', sets: 5, percent: 11, color: '#5e6787' },
      { id: 'core', labelKey: 'analytics.core', sets: 5, percent: 11, color: '#3d4463' },
    ],
  },
  consistency: {
    streak: 12,
    completionPercent: 88,
    totalWorkouts: 16,
    grid: Array.from({ length: 7 }, (_, d) =>
      Array.from({ length: 5 }, (_, w) => ({
        weekday: d,
        weekIndex: w,
        date: '2026-09-20',
        durationMinutes: 45,
        intensityLevel: 2 as const,
      })),
    ),
  },
  personalRecords: [
    {
      exerciseId: 'ex-1',
      exerciseName: 'Barbell Deadlift',
      date: '2026-09-18',
      weightKg: 210,
      reps: 3,
      status: 'ALL-TIME BEST',
    },
    {
      exerciseId: 'ex-2',
      exerciseName: 'Incline Bench Press',
      date: '2026-09-21',
      weightKg: 105,
      reps: 5,
      status: 'NEW PR',
    },
  ],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, { initialEntries: ['/analytics'] }, children),
    );
}

describe('AnalyticsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'client-1',
        email: 'alex@gymmi.local',
        username: 'Alex',
        role: { id: 'r-1', name: 'Client' },
      } as any,
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockResolvedValue(mockAnalytics);
    vi.spyOn(analyticsApi, 'fetchClientAnalytics').mockResolvedValue(mockAnalytics);
    vi.spyOn(contractsApi, 'fetchContractClients').mockResolvedValue([]);
  });

  it('renders all 4 analytics sections with live data for authenticated client', async () => {
    render(<AnalyticsPage />, { wrapper: createWrapper() });

    // Volume Trends
    await waitFor(() => {
      expect(screen.getByText(/14,500/)).toBeInTheDocument();
    });
    expect(screen.getByText(/\+12.5%/)).toBeInTheDocument();

    // Muscle Load
    expect(screen.getByText('45')).toBeInTheDocument(); // 45 sets
    expect(screen.getByText('44%')).toBeInTheDocument();

    // Consistency Heatmap
    expect(screen.getByText('12')).toBeInTheDocument(); // streak
    expect(screen.getByText('88%')).toBeInTheDocument(); // completion
    expect(screen.getByText('16')).toBeInTheDocument(); // workouts

    // Personal Records
    expect(screen.getByText('Barbell Deadlift')).toBeInTheDocument();
    expect(screen.getByText('210')).toBeInTheDocument();
    expect(screen.getByText('ALL-TIME BEST')).toBeInTheDocument();
    expect(screen.getByText('Incline Bench Press')).toBeInTheDocument();
    expect(screen.getByText('NEW PR')).toBeInTheDocument();
  });

  it('allows a trainer to view client selector and switch to a client', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'trainer-1',
        email: 'coach@gymmi.local',
        username: 'CoachDan',
        role: { id: 'r-2', name: 'Trainer' },
      } as any,
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    const mockClients = [
      {
        client: { id: 'client-99', username: 'SarahConnor', email: 'sarah@gymmi.local' },
        contracts: [],
        assignments: [],
        sessions: [],
      },
    ];

    vi.spyOn(contractsApi, 'fetchContractClients').mockResolvedValue(mockClients as any);

    render(<AnalyticsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText(/Select Client/i)).toBeInTheDocument();
    });

    const select = screen.getByLabelText(/Select Client/i);
    expect(select).toBeInTheDocument();

    await userEvent.selectOptions(select, 'client-99');

    await waitFor(() => {
      expect(analyticsApi.fetchClientAnalytics).toHaveBeenCalledWith('client-99');
    });
  });

  it('renders muscle load bar chart with specific breakdown and exercise counts', async () => {
    const customAnalytics: analyticsApi.AnalyticsResponse = {
      ...mockAnalytics,
      muscleLoad: {
        totalSets: 30,
        distribution: [
          { id: 'chest', labelKey: 'analytics.chest', sets: 12, exercisesCount: 3, percent: 40, color: '#ef233c' },
          { id: 'back', labelKey: 'analytics.back', sets: 9, exercisesCount: 2, percent: 30, color: '#3b82f6' },
          { id: 'legs', labelKey: 'analytics.legs', sets: 6, exercisesCount: 2, percent: 20, color: '#10b981' },
          { id: 'shoulders', labelKey: 'analytics.shoulders', sets: 3, exercisesCount: 1, percent: 10, color: '#f59e0b' },
          { id: 'arms', labelKey: 'analytics.arms', sets: 0, exercisesCount: 0, percent: 0, color: '#8b5cf6' },
          { id: 'core', labelKey: 'analytics.core', sets: 0, exercisesCount: 0, percent: 0, color: '#06b6d4' },
        ],
      },
    };
    vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockResolvedValue(customAnalytics);

    render(<AnalyticsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('3 exercises')).toBeInTheDocument();
    });
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Legs')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
