import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import GymCatalogPage from './GymCatalogPage';
import GymCoachesPage from './GymCoachesPage';
import GymMembersPage from './GymMembersPage';
import * as authContext from '../../context/AuthContext';
import * as gymsApi from '../../services/api/gyms';
import * as workoutsApi from '../../services/api/workouts';
import type { GymCoach, GymMember } from '../../types/gym';

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

describe('Gym Pages', () => {
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
  });

  describe('GymCatalogPage', () => {
    it('renders facility routines list and allows filtering by search', async () => {
      vi.spyOn(workoutsApi, 'fetchWorkouts').mockResolvedValue([
        {
          id: 'routine-1',
          name: 'Heavy Push Day',
          description: 'Chest, shoulders, triceps hypertrophy',
          difficulty: 'ADVANCED',
          daysOfWeek: [1, 4],
          routineExercises: [],
          createdById: 'u-1',
          days: [],
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: 'routine-2',
          name: 'Mobility & Core',
          description: 'Active recovery routine',
          difficulty: 'BEGINNER',
          daysOfWeek: [3],
          routineExercises: [],
          createdById: 'u-1',
          days: [],
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: {
          id: 'g-1',
          userId: 'u-gym',
          name: 'IronHQ',
          tier: 'plus',
          memberCapacity: 100,
          trialEndsAt: '2026-12-31',
          isActive: true,
        },
        activeMembersCount: 15,
        capacity: 100,
        coachesCount: 2,
        routinesCount: 2,
        trialDaysRemaining: 20,
        isTrialActive: false,
      });

      render(<GymCatalogPage />, { wrapper: createWrapper() });

      expect(await screen.findByText('Heavy Push Day')).toBeInTheDocument();
      expect(screen.getByText('Mobility & Core')).toBeInTheDocument();

      // Search filter
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'Push' } });

      expect(screen.getByText('Heavy Push Day')).toBeInTheDocument();
      expect(screen.queryByText('Mobility & Core')).not.toBeInTheDocument();
    });
  });

  describe('GymCoachesPage', () => {
    it('renders pending coach approvals and approved coaches with toggle permissions', async () => {
      const mockCoaches: GymCoach[] = [
        {
          id: 'coach-rel-1',
          gymId: 'g-1',
          trainerId: 'trainer-1',
          status: 'PENDING',
          canPublishRoutines: false,
          affiliatedAt: new Date().toISOString(),
          trainer: {
            id: 'trainer-1',
            username: 'CoachMike',
            email: 'mike@example.com',
          },
        },
        {
          id: 'coach-rel-2',
          gymId: 'g-1',
          trainerId: 'trainer-2',
          status: 'APPROVED',
          canPublishRoutines: true,
          affiliatedAt: new Date().toISOString(),
          trainer: {
            id: 'trainer-2',
            username: 'CoachSarah',
            email: 'sarah@example.com',
          },
        },
      ];

      vi.spyOn(gymsApi, 'fetchMyGymCoaches').mockResolvedValue(mockCoaches);
      const approveSpy = vi.spyOn(gymsApi, 'approveGymCoach').mockResolvedValue({} as any);

      render(<GymCoachesPage />, { wrapper: createWrapper() });

      expect(await screen.findByText('CoachMike')).toBeInTheDocument();
      expect(screen.getByText('CoachSarah')).toBeInTheDocument();

      // Click approve for CoachMike
      const approveBtn = screen.getByTestId('approve-coach-coach-rel-1');
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(approveSpy).toHaveBeenCalledWith('coach-rel-1');
      });
    });

    it('renders coaches with top-level flat properties, bio, monthly rate, and fallbacks', async () => {
      const mockCoaches: GymCoach[] = [
        {
          id: 'coach-flat-1',
          gymId: 'g-1',
          trainerId: 'trainer-flat',
          status: 'PENDING',
          canPublishRoutines: false,
          affiliatedAt: new Date().toISOString(),
          username: 'FlatCoachDave',
          email: 'dave@example.com',
          description: 'Specialist in functional hypertrophy',
          monthlyPrice: 75,
          specializations: ['HYPERTROPHY', 'STRENGTH'],
        },
      ];

      vi.spyOn(gymsApi, 'fetchMyGymCoaches').mockResolvedValue(mockCoaches);

      render(<GymCoachesPage />, { wrapper: createWrapper() });

      expect(await screen.findByText('FlatCoachDave')).toBeInTheDocument();
      expect(screen.getByText('dave@example.com')).toBeInTheDocument();
      expect(screen.getByText('Specialist in functional hypertrophy')).toBeInTheDocument();
      expect(screen.getByText('$75 / mo')).toBeInTheDocument();
    });
  });

  describe('GymMembersPage', () => {
    it('renders capacity usage and members list with search filtering', async () => {
      const mockMembers: GymMember[] = [
        {
          id: 'member-1',
          gymId: 'g-1',
          clientId: 'client-1',
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          client: {
            id: 'client-1',
            username: 'AthleteJohn',
            email: 'john@example.com',
          },
        },
        {
          id: 'member-2',
          gymId: 'g-1',
          clientId: 'client-2',
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          client: {
            id: 'client-2',
            username: 'AthleteLisa',
            email: 'lisa@example.com',
          },
        },
      ];

      vi.spyOn(gymsApi, 'fetchMyGymMembers').mockResolvedValue(mockMembers);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: {
          id: 'g-1',
          userId: 'u-gym',
          name: 'IronHQ',
          tier: 'plus',
          memberCapacity: 100,
          trialEndsAt: '2026-12-31',
          isActive: true,
        },
        activeMembersCount: 2,
        capacity: 100,
        coachesCount: 1,
        routinesCount: 5,
        trialDaysRemaining: 15,
        isTrialActive: false,
      });

      render(<GymMembersPage />, { wrapper: createWrapper() });

      expect(await screen.findByTestId('gym-capacity-card')).toBeInTheDocument();
      expect(await screen.findByText('AthleteJohn')).toBeInTheDocument();
      expect(screen.getByText('AthleteLisa')).toBeInTheDocument();

      // Search filter
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'john' } });

      expect(screen.getByText('AthleteJohn')).toBeInTheDocument();
      expect(screen.queryByText('AthleteLisa')).not.toBeInTheDocument();
    });

    it('renders pending member requests and allows approving or rejecting them', async () => {
      const mockMembers: GymMember[] = [];
      const mockPending: GymMember[] = [
        {
          id: 'pending-1',
          gymId: 'g-1',
          clientId: 'client-pending-1',
          status: 'PENDING',
          joinedAt: new Date().toISOString(),
          client: {
            id: 'client-pending-1',
            username: 'PendingPaul',
            email: 'paul@example.com',
          },
        },
      ];

      vi.spyOn(gymsApi, 'fetchMyGymMembers').mockResolvedValue(mockMembers);
      vi.spyOn(gymsApi, 'fetchMyPendingMembers').mockResolvedValue(mockPending);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: {
          id: 'g-1',
          userId: 'u-gym',
          name: 'IronHQ',
          tier: 'plus',
          memberCapacity: 100,
          trialEndsAt: '2026-12-31',
          isActive: true,
          joinCode: 'IRON1234',
        },
        activeMembersCount: 0,
        capacity: 100,
        coachesCount: 1,
        routinesCount: 5,
        trialDaysRemaining: 15,
        isTrialActive: false,
      });

      const approveSpy = vi.spyOn(gymsApi, 'approveGymMember').mockResolvedValue({
        success: true,
        status: 'ACTIVE',
      });
      const rejectSpy = vi.spyOn(gymsApi, 'rejectGymMember').mockResolvedValue({
        success: true,
        status: 'REJECTED',
      });

      render(<GymMembersPage />, { wrapper: createWrapper() });

      expect(await screen.findByTestId('pending-members-section')).toBeInTheDocument();
      expect(screen.getByText('PendingPaul')).toBeInTheDocument();
      expect(screen.getByText('paul@example.com')).toBeInTheDocument();

      // Click Approve
      const approveBtn = screen.getByTestId('approve-member-pending-1');
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(approveSpy).toHaveBeenCalledWith('pending-1');
      });

      // Click Reject
      const rejectBtn = screen.getByTestId('reject-member-pending-1');
      fireEvent.click(rejectBtn);

      await waitFor(() => {
        expect(rejectSpy).toHaveBeenCalledWith('pending-1');
      });
    });

    it('opens facility QR and join code modal and copies join code', async () => {
      vi.spyOn(gymsApi, 'fetchMyGymMembers').mockResolvedValue([]);
      vi.spyOn(gymsApi, 'fetchMyPendingMembers').mockResolvedValue([]);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: {
          id: 'g-1',
          userId: 'u-gym',
          name: 'IronHQ',
          tier: 'plus',
          memberCapacity: 100,
          trialEndsAt: '2026-12-31',
          isActive: true,
          joinCode: 'IRON-JOIN-99',
        },
        activeMembersCount: 0,
        capacity: 100,
        coachesCount: 1,
        routinesCount: 5,
        trialDaysRemaining: 15,
        isTrialActive: false,
      });

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<GymMembersPage />, { wrapper: createWrapper() });

      const qrBtn = await screen.findByTestId('facility-qr-btn');
      fireEvent.click(qrBtn);

      expect(await screen.findByTestId('facility-qr-modal')).toBeInTheDocument();
      expect(screen.getByText('IRON-JOIN-99')).toBeInTheDocument();

      const copyBtn = screen.getByTestId('copy-join-code-btn');
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalledWith('IRON-JOIN-99');
      });
    });

    it('renders members with flat properties, goal badge, and fallback avatar', async () => {
      const mockFlatMembers: GymMember[] = [
        {
          id: 'member-flat-1',
          gymId: 'g-1',
          clientId: 'client-flat-1',
          status: 'ACTIVE',
          joinedAt: new Date().toISOString(),
          username: 'FlatAthleteBob',
          email: 'bob@example.com',
          goal: 'Build Muscle',
        },
      ];

      vi.spyOn(gymsApi, 'fetchMyGymMembers').mockResolvedValue(mockFlatMembers);
      vi.spyOn(gymsApi, 'fetchMyPendingMembers').mockResolvedValue([]);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: {
          id: 'g-1',
          userId: 'u-gym',
          name: 'IronHQ',
          tier: 'plus',
          memberCapacity: 100,
          trialEndsAt: '2026-12-31',
          isActive: true,
        },
        activeMembersCount: 1,
        capacity: 100,
        coachesCount: 1,
        routinesCount: 5,
        trialDaysRemaining: 15,
        isTrialActive: false,
      });

      render(<GymMembersPage />, { wrapper: createWrapper() });

      expect(await screen.findByText('FlatAthleteBob')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('Build Muscle')).toBeInTheDocument();
      expect(screen.getByText(/Joined/i)).toBeInTheDocument();

      // Test search filter on flat properties
      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'bob' } });
      expect(screen.getByText('FlatAthleteBob')).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      expect(screen.queryByText('FlatAthleteBob')).not.toBeInTheDocument();
    });
  });
});

