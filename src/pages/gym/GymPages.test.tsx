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
        },
        {
          id: 'routine-2',
          name: 'Mobility & Core',
          description: 'Active recovery routine',
          difficulty: 'BEGINNER',
          daysOfWeek: [3],
          routineExercises: [],
        },
      ]);
      vi.spyOn(gymsApi, 'fetchMyGym').mockResolvedValue({
        gym: { id: 'g-1', name: 'IronHQ', tier: 'Plus', capacity: 100, trialDaysRemaining: 20 },
        activeMembersCount: 15,
        capacity: 100,
        coachesCount: 2,
        routinesCount: 2,
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
      const mockCoaches: gymsApi.GymCoach[] = [
        {
          id: 'coach-rel-1',
          gymId: 'g-1',
          trainerId: 'trainer-1',
          status: 'PENDING',
          canPublishRoutines: false,
          createdAt: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
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
  });

  describe('GymMembersPage', () => {
    it('renders capacity usage and members list with search filtering', async () => {
      const mockMembers: gymsApi.GymMember[] = [
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
        gym: { id: 'g-1', name: 'IronHQ', tier: 'Plus', capacity: 100, trialDaysRemaining: 15 },
        activeMembersCount: 2,
        capacity: 100,
        coachesCount: 1,
        routinesCount: 5,
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
  });
});
