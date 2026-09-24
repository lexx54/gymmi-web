import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { PhysicalProfileCard } from './PhysicalProfileCard';
import type { FullUserProfile } from '../../types/auth';

const mockMutate = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

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

const mockProfileData: FullUserProfile = {
  id: 'u-1',
  email: 'athlete@gymmi.com',
  username: 'athlete_one',
  hasPaid: false,
  role: { id: 'r-1', name: 'Client' },
  profile: {
    id: 'p-1',
    age: 27,
    gender: 'male',
    height: 180,
    weight: 75,
    goal: 'Build Muscle',
  },
  trainerProfile: null,
};

beforeEach(() => {
  mockMutate.mockReset();
  mockToastSuccess.mockReset();
  mockToastError.mockReset();
});

describe('PhysicalProfileCard', () => {
  it('renders view mode with physical metrics correctly', () => {
    render(<PhysicalProfileCard userProfile={mockProfileData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('physical-profile-card')).toBeInTheDocument();
    expect(screen.getByText('27 yrs')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('180 cm')).toBeInTheDocument();
    expect(screen.getByText('75 kg')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByTestId('edit-physical-profile-btn')).toBeInTheDocument();
  });

  it('toggles unit display between CM and FT in view mode', async () => {
    const user = userEvent.setup();
    render(<PhysicalProfileCard userProfile={mockProfileData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('180 cm')).toBeInTheDocument();

    // Click FT toggle
    const ftBtn = screen.getByRole('button', { name: 'FT' });
    await user.click(ftBtn);

    expect(screen.getByText('5.9 ft')).toBeInTheDocument();
  });

  it('switches to edit mode, modifies values, and saves changes', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<PhysicalProfileCard userProfile={mockProfileData} />, {
      wrapper: createWrapper(),
    });

    // Enter edit mode
    await user.click(screen.getByTestId('edit-physical-profile-btn'));

    expect(screen.getByTestId('save-physical-profile-btn')).toBeInTheDocument();

    // Change weight
    const weightInput = screen.getByTestId('edit-input-weight');
    await user.clear(weightInput);
    await user.type(weightInput, '80');

    // Change goal to Lose Fat
    await user.click(screen.getByTestId('edit-goal-loseFat'));

    // Save
    await user.click(screen.getByTestId('save-physical-profile-btn'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          profile: {
            age: 27,
            gender: 'male',
            height: 180,
            weight: 80,
            goal: 'Lose Fat',
          },
        },
        expect.any(Object),
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Profile updated successfully!');
    });
  });

  it('cancels edit mode without saving', async () => {
    const user = userEvent.setup();
    render(<PhysicalProfileCard userProfile={mockProfileData} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByTestId('edit-physical-profile-btn'));
    expect(screen.getByTestId('save-physical-profile-btn')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByTestId('edit-physical-profile-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('save-physical-profile-btn')).not.toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
