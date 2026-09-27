import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import ClassificationsPage from './ClassificationsPage';
import * as authContext from '../../context/AuthContext';
import * as classificationsApi from '../../services/api/classifications';
import * as gymsApi from '../../services/api/gyms';
import type { ClassificationsData } from '../../types/classifications';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children),
    );
  };
}

const mockClassificationsData: ClassificationsData = {
  cohortType: 'gym',
  cohortId: 'gym-1',
  cohortName: 'Metroflex Iron',
  timeframe: 'weekly',
  exercise: {
    id: 'core-bench',
    name: 'Bench Press',
    category: 'CHEST',
    isCore: true,
  },
  availableExercises: [
    { id: 'core-squat', name: 'Barbell Back Squat', category: 'LEGS', isCore: true },
    { id: 'core-bench', name: 'Bench Press', category: 'CHEST', isCore: true },
    { id: 'core-deadlift', name: 'Deadlift', category: 'BACK', isCore: true },
    { id: 'core-ohp', name: 'Overhead Press', category: 'SHOULDERS', isCore: true },
    { id: 'ex-incline', name: 'Incline Dumbbell Press', category: 'CHEST', isCore: false },
  ],
  tierDistribution: {
    diamond: 1,
    platinum: 1,
    gold: 1,
    silver: 0,
    bronze: 0,
    unranked: 1,
    total: 4,
  },
  rankings: [
    {
      rank: 1,
      user: {
        id: 'user-1',
        username: 'alex',
        email: 'alex@example.com',
        avatarUrl: null,
      },
      tier: 'Diamond',
      bestWeightKg: 140,
      bestReps: 2,
      estimated1RmKg: 149.33,
      achievedAt: '2026-09-20T10:00:00Z',
    },
    {
      rank: 2,
      user: {
        id: 'user-2',
        username: 'sarah',
        email: 'sarah@example.com',
        avatarUrl: null,
      },
      tier: 'Platinum',
      bestWeightKg: 120,
      bestReps: 2,
      estimated1RmKg: 128,
      achievedAt: '2026-09-21T10:00:00Z',
    },
    {
      rank: 3,
      user: {
        id: 'user-3',
        username: 'mike',
        email: 'mike@example.com',
        avatarUrl: null,
      },
      tier: 'Gold',
      bestWeightKg: 100,
      bestReps: 2,
      estimated1RmKg: 106.67,
      achievedAt: '2026-09-22T10:00:00Z',
    },
    {
      rank: null,
      user: {
        id: 'user-4',
        username: 'inactive_user',
        email: 'inactive@example.com',
        avatarUrl: null,
      },
      tier: 'Unranked',
      bestWeightKg: null,
      bestReps: null,
      estimated1RmKg: null,
      achievedAt: null,
    },
  ],
};

describe('ClassificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'gym-user-1',
        email: 'gym@example.com',
        username: 'IronHQ',
        role: { id: 'gym-role', name: 'Gym' },
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
    } as any);

    vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
      gym: {
        id: 'gym-1',
        name: 'Metroflex Iron',
        description: 'Elite training facility',
        address: '123 Iron St',
        userId: 'gym-user-1',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      coaches: [],
      members: [],
    });

    vi.spyOn(classificationsApi, 'fetchClassifications').mockResolvedValue(mockClassificationsData);
  });

  it('renders leaderboard page with cohort info and classifications table', async () => {
    render(createElement(ClassificationsPage), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Metroflex Iron')).toBeDefined();
    });

    // Check core lift buttons
    expect(screen.getByText('Bench Press')).toBeDefined();
    expect(screen.getByText('Barbell Back Squat')).toBeDefined();
    expect(screen.getByText('Deadlift')).toBeDefined();
    expect(screen.getByText('Overhead Press')).toBeDefined();

    // Check leaderboard users
    expect(screen.getByText('alex')).toBeDefined();
    expect(screen.getByText('sarah')).toBeDefined();
    expect(screen.getByText('mike')).toBeDefined();
    expect(screen.getByText('inactive_user')).toBeDefined();

    // Check tier badges
    expect(screen.getAllByText('Diamond').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Platinum').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gold').length).toBeGreaterThan(0);
  });

  it('allows switching timeframe to monthly or all-time', async () => {
    render(createElement(ClassificationsPage), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Metroflex Iron')).toBeDefined();
    });

    const monthlyButton = screen.getByTestId('timeframe-monthly');
    fireEvent.click(monthlyButton);

    await waitFor(() => {
      expect(classificationsApi.fetchClassifications).toHaveBeenCalledWith(
        expect.objectContaining({
          timeframe: 'monthly',
        }),
      );
    });
  });

  it('allows switching exercise via exercise select dropdown', async () => {
    render(createElement(ClassificationsPage), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Barbell Back Squat')).toBeDefined();
    });

    const exerciseSelect = screen.getByTestId('exercise-select');
    fireEvent.change(exerciseSelect, { target: { value: 'core-squat' } });

    await waitFor(() => {
      expect(classificationsApi.fetchClassifications).toHaveBeenCalledWith(
        expect.objectContaining({
          exerciseId: 'core-squat',
        }),
      );
    });
  });

  it('renders properly for a Trainer role', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'trainer-1',
        email: 'coach@example.com',
        username: 'CoachDan',
        role: { id: 'trainer-role', name: 'Trainer' },
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
    } as any);

    vi.spyOn(classificationsApi, 'fetchClassifications').mockResolvedValue({
      ...mockClassificationsData,
      cohortType: 'trainer',
      cohortId: 'trainer-1',
      cohortName: 'CoachDan Squad',
    });

    render(createElement(ClassificationsPage), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('CoachDan Squad')).toBeDefined();
    });

    expect(classificationsApi.fetchClassifications).toHaveBeenCalledWith(
      expect.objectContaining({
        cohortType: 'trainer',
        cohortId: 'trainer-1',
      }),
    );
  });
});
