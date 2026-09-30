import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import TrainersPage from './TrainersPage';
import * as authContext from '../context/AuthContext';
import * as gymsApi from '../services/api/gyms';
import * as contractsApi from '../services/api/contracts';
import * as permissionsApi from '../services/api/permissions';
import type { GymMembershipItem, PublicGymItem } from '../types/gym';

function createWrapper(initialEntries = ['/trainers']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(
        MemoryRouter,
        { initialEntries },
        createElement(Routes, null, createElement(Route, { path: '/trainers', element: children })),
      ),
    );
  };
}

describe('TrainersPage and ClientGymsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'client-user-1',
        email: 'athlete@example.com',
        username: 'AthleteSam',
        role: { id: 'client-role', name: 'Client' },
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
    } as any);

    vi.spyOn(permissionsApi, 'fetchMyPermissions').mockResolvedValue({
      role: 'Client',
      permissions: [],
      plan: 'free',
      hasPaid: false,
      entitlements: {
        isCoveredClient: false,
        isInGracePeriod: false,
        canViewDashboard: true,
      },
    } as any);

    vi.spyOn(contractsApi, 'fetchContractTrainers').mockResolvedValue([
      {
        id: 't-1',
        username: 'TrainerDan',
        email: 'dan@example.com',
        avatarUrl: null,
        trainerProfile: {
          monthlyPrice: 60,
          description: 'Strength Coach',
          specializations: ['STRENGTH'],
          logoUrl: null,
          gyms: [],
        },
      },
    ]);

    vi.spyOn(contractsApi, 'fetchMyContracts').mockResolvedValue([]);
    vi.spyOn(gymsApi, 'fetchMyMemberships').mockResolvedValue([]);
    vi.spyOn(gymsApi, 'fetchPublicGyms').mockResolvedValue([]);
  });

  it('renders Trainers tab by default and allows switching to Gyms tab', async () => {
    render(<TrainersPage />, { wrapper: createWrapper() });

    // Trainers tab should be rendered and active
    expect(await screen.findByTestId('trainers-tab')).toBeInTheDocument();
    expect(screen.getByTestId('gyms-tab')).toBeInTheDocument();
    expect(await screen.findByText('TrainerDan')).toBeInTheDocument();

    // Switch to Gyms tab
    fireEvent.click(screen.getByTestId('gyms-tab'));

    expect(await screen.findByTestId('client-gyms-section')).toBeInTheDocument();
    expect(screen.getByTestId('no-gym-joined-card')).toBeInTheDocument();
  });

  it('displays active gym card with leave gym button when member has active gym', async () => {
    const mockActiveGym: GymMembershipItem = {
      id: 'member-active-1',
      gymId: 'gym-active-1',
      status: 'ACTIVE',
      name: 'MetroFlex Gym',
      city: 'Downtown',
      address: '100 Main St',
      joinedAt: new Date().toISOString(),
      amenities: ['Showers', 'Free Weights'],
    };

    vi.spyOn(gymsApi, 'fetchMyMemberships').mockResolvedValue([mockActiveGym]);
    const leaveSpy = vi.spyOn(gymsApi, 'leaveGym').mockResolvedValue(undefined as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<TrainersPage />, { wrapper: createWrapper(['/trainers?tab=gyms']) });

    expect(await screen.findByTestId('active-gym-card')).toBeInTheDocument();
    expect(screen.getByText('MetroFlex Gym')).toBeInTheDocument();
    expect(screen.getByText('Downtown')).toBeInTheDocument();

    // Click Leave Gym
    const leaveBtn = screen.getByTestId('leave-gym-btn');
    fireEvent.click(leaveBtn);

    await waitFor(() => {
      expect(leaveSpy).toHaveBeenCalledWith('gym-active-1');
    });
  });

  it('displays pending gym banner with cancel request button when member has pending request', async () => {
    const mockPendingGym: GymMembershipItem = {
      id: 'member-pending-1',
      gymId: 'gym-pending-1',
      status: 'PENDING',
      name: 'Gold Coast Fitness',
      joinedAt: new Date().toISOString(),
    };

    vi.spyOn(gymsApi, 'fetchMyMemberships').mockResolvedValue([mockPendingGym]);
    const cancelSpy = vi.spyOn(gymsApi, 'cancelGymMembershipRequest').mockResolvedValue(undefined as any);

    render(<TrainersPage />, { wrapper: createWrapper(['/trainers?tab=gyms']) });

    expect(await screen.findByTestId('pending-gym-banner')).toBeInTheDocument();
    expect(screen.getByText('Gold Coast Fitness')).toBeInTheDocument();

    // Click Cancel Request
    const cancelBtn = screen.getByTestId('cancel-gym-request-btn');
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(cancelSpy).toHaveBeenCalledWith('gym-pending-1');
    });
  });

  it('auto-switches to gyms tab and pre-fills join code when code is in URL search params', async () => {
    const joinByCodeSpy = vi.spyOn(gymsApi, 'joinGymByCode').mockResolvedValue({
      success: true,
      gymId: 'g-code-1',
      status: 'ACTIVE',
      gym: {
        id: 'g-code-1',
        name: 'Express Gym',
      },
    });

    render(<TrainersPage />, { wrapper: createWrapper(['/trainers?code=EXPRESS99']) });

    // Should automatically be on Gyms tab
    expect(await screen.findByTestId('client-gyms-section')).toBeInTheDocument();
    const input = screen.getByTestId('join-code-input') as HTMLInputElement;
    expect(input.value).toBe('EXPRESS99');

    // Submit join by code
    const submitBtn = screen.getByTestId('join-code-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(joinByCodeSpy).toHaveBeenCalledWith('EXPRESS99');
    });
  });

  it('allows requesting membership for a gym in the explore directory', async () => {
    const publicGyms: PublicGymItem[] = [
      {
        id: 'gym-public-1',
        userId: 'u-gym-1',
        name: 'Alpha Gym',
        city: 'North Side',
        tier: 'plus',
        memberCapacity: 200,
        trialEndsAt: '2026-12-31',
        isActive: true,
        memberCount: 45,
      },
    ];

    vi.spyOn(gymsApi, 'fetchPublicGyms').mockResolvedValue(publicGyms);
    const requestSpy = vi.spyOn(gymsApi, 'requestGymMembership').mockResolvedValue({
      id: 'm-new-req',
      gymId: 'gym-public-1',
      clientId: 'client-user-1',
      status: 'PENDING',
      joinedAt: new Date().toISOString(),
    });

    render(<TrainersPage />, { wrapper: createWrapper(['/trainers?tab=gyms']) });

    expect(await screen.findByTestId('gym-card-gym-public-1')).toBeInTheDocument();
    expect(screen.getByText('Alpha Gym')).toBeInTheDocument();

    const reqBtn = screen.getByTestId('request-gym-gym-public-1');
    fireEvent.click(reqBtn);

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith('gym-public-1');
    });
  });
});
