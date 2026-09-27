import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import * as authContext from '../../context/AuthContext';
import * as gymsApi from '../../services/api/gyms';
import * as analyticsApi from '../../services/api/analytics';
import * as dashboardApi from '../../services/api/dashboard';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, { initialEntries: ['/dashboard'] }, children),
    );
}

describe('DashboardLayout (Gym Role)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'gym-owner-1',
        email: 'owner@ironhq.com',
        username: 'IronHQ',
        role: { id: 'r-gym', name: 'Gym' },
      } as any,
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    vi.spyOn(analyticsApi, 'fetchMyAnalytics').mockResolvedValue({} as any);
    vi.spyOn(dashboardApi, 'fetchTrainerDashboard').mockResolvedValue({} as any);
  });

  it('renders "Trial ending in 30 days" and "1 / 100 Members" for a newly created gym', async () => {
    vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
      id: 'g-1',
      name: 'IronHQ',
      tier: 'trial',
      activeMembersCount: 1,
      capacity: 100,
      memberCapacity: 100,
      coachesCount: 0,
      routinesCount: 0,
      trialDaysRemaining: 30,
      daysRemainingInTrial: 30,
      isTrialActive: true,
    } as any);

    render(<DashboardLayout />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('gym-trial-banner')).toBeInTheDocument();
    });

    expect(screen.getByText(/Trial ending in 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 100 Members/i)).toBeInTheDocument();
    expect(screen.getByTestId('gym-create-routine-btn')).toBeInTheDocument();
    expect(screen.getByTestId('gym-upgrade-btn')).toBeInTheDocument();
  });

  it('renders "Trial expired" when trialDaysRemaining is 0 or isTrialActive is false', async () => {
    vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
      id: 'g-1',
      name: 'IronHQ',
      tier: 'trial',
      activeMembersCount: 1,
      capacity: 100,
      memberCapacity: 100,
      coachesCount: 0,
      routinesCount: 0,
      trialDaysRemaining: 0,
      daysRemainingInTrial: 0,
      isTrialActive: false,
    } as any);

    render(<DashboardLayout />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('gym-trial-banner')).toBeInTheDocument();
    });

    expect(screen.getByText(/Trial expired/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 100 Members/i)).toBeInTheDocument();
  });

  it('renders active plan badge and hides upgrade button when gym is on a paid tier', async () => {
    vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
      id: 'g-1',
      name: 'IronHQ',
      tier: 'plus',
      activeMembersCount: 25,
      capacity: 100,
      memberCapacity: 100,
      coachesCount: 2,
      routinesCount: 4,
      trialDaysRemaining: null,
      isTrialActive: false,
    } as any);

    render(<DashboardLayout />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('gym-trial-banner')).toBeInTheDocument();
    });

    expect(screen.getByText(/PLUS Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/25 \/ 100 Members/i)).toBeInTheDocument();
    expect(screen.queryByTestId('gym-upgrade-btn')).not.toBeInTheDocument();
  });
});
