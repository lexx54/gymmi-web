import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { CoachingProfileCard } from './CoachingProfileCard';
import type { FullUserProfile } from '../../types/auth';

const mockMutate = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

const mockDbGyms = [
  { id: 'gym-1', name: 'Iron Paradise', city: 'Miami' },
  { id: 'gym-2', name: 'Gold Gym', city: 'Venice' },
];

vi.mock('../../hooks/useGyms', () => ({
  usePublicGyms: () => ({
    data: mockDbGyms,
    isLoading: false,
  }),
}));

vi.mock('../../hooks/useUserProfile', () => ({
  useUpdateUserProfile: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockTrainerProfileData: FullUserProfile = {
  id: 'u-trainer',
  email: 'trainer@gymmi.com',
  username: 'coach_pro',
  hasPaid: true,
  role: { id: 'r-2', name: 'Trainer' },
  profile: {
    id: 'p-1',
    age: 32,
    gender: 'female',
    height: 165,
    weight: 60,
    goal: 'Endurance',
  },
  trainerProfile: {
    id: 'tp-1',
    description: 'Certified NASM elite personal trainer with 10 years experience.',
    monthlyPrice: 150,
    specializations: ['Hypertrophy', 'HIIT & Cardio'],
    gyms: ['Metro Fitness'],
  },
};

beforeEach(() => {
  mockMutate.mockReset();
  mockToastSuccess.mockReset();
  mockToastError.mockReset();
});

describe('CoachingProfileCard', () => {
  it('renders trainer credentials in view mode', () => {
    render(<CoachingProfileCard userProfile={mockTrainerProfileData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('coaching-profile-card')).toBeInTheDocument();
    expect(screen.getByText('$150 USD / mo')).toBeInTheDocument();
    expect(screen.getByText('Hypertrophy')).toBeInTheDocument();
    expect(screen.getByText('HIIT & Cardio')).toBeInTheDocument();
    expect(screen.getByText('Metro Fitness')).toBeInTheDocument();
    expect(
      screen.getByText('Certified NASM elite personal trainer with 10 years experience.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('edit-coaching-profile-btn')).toBeInTheDocument();
  });

  it('switches to edit mode, edits monthly price and description, and saves', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<CoachingProfileCard userProfile={mockTrainerProfileData} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByTestId('edit-coaching-profile-btn'));

    const priceInput = screen.getByTestId('edit-input-monthlyPrice');
    await user.clear(priceInput);
    await user.type(priceInput, '180');

    const descInput = screen.getByTestId('edit-input-description');
    await user.clear(descInput);
    await user.type(
      descInput,
      'Updated coaching description with elite conditioning and nutrition focus.',
    );

    await user.click(screen.getByTestId('save-coaching-profile-btn'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          trainerProfile: {
            monthlyPrice: 180,
            description:
              'Updated coaching description with elite conditioning and nutrition focus.',
            specializations: ['Hypertrophy', 'HIIT & Cardio'],
          },
        },
        expect.any(Object),
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Profile updated successfully!');
    });
  });

  it('cancels edit mode without saving changes', async () => {
    const user = userEvent.setup();
    render(<CoachingProfileCard userProfile={mockTrainerProfileData} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByTestId('edit-coaching-profile-btn'));
    expect(screen.getByTestId('save-coaching-profile-btn')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByTestId('edit-coaching-profile-btn')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('displays formally affiliated gyms in view mode and does not allow informal gym editing in edit mode', async () => {
    const user = userEvent.setup();
    render(<CoachingProfileCard userProfile={mockTrainerProfileData} />, {
      wrapper: createWrapper(),
    });

    // View mode displays affiliated gyms
    expect(screen.getByText('Metro Fitness')).toBeInTheDocument();

    await user.click(screen.getByTestId('edit-coaching-profile-btn'));

    // Edit mode should NOT have manual or select gym inputs because affiliations are formal
    expect(screen.queryByTestId('select-db-gym')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-input-gym')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-gym-btn')).not.toBeInTheDocument();
  });
});

