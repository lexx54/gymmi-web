import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import SettingsPage from './SettingsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockUseUserProfile = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      hasPaid: false,
      role: { id: 'r1', name: 'Client' },
    },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../hooks/useUserProfile', () => ({
  useUserProfile: () => mockUseUserProfile(),
  useUpdateUserProfile: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    NavLink: ({ children, to }: { children: ReactNode; to: string }) =>
      createElement('a', { href: to }, children),
  };
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(MemoryRouter, null, children),
      ),
  });
}

describe('SettingsPage', () => {
  it('renders Settings title and PhysicalProfileCard for a Client user (hiding CoachingProfileCard)', () => {
    mockUseUserProfile.mockReturnValue({
      data: {
        id: '1',
        email: 'client@gymmi.com',
        username: 'client_user',
        role: { id: 'r-1', name: 'Client' },
        hasPaid: false,
        profile: {
          id: 'p-1',
          age: 25,
          gender: 'male',
          height: 175,
          weight: 70,
          goal: 'Build Muscle',
        },
        trainerProfile: null,
      },
      isLoading: false,
    });

    renderWithProviders(<SettingsPage />);

    expect(screen.getByText('Settings & Profile')).toBeInTheDocument();
    expect(screen.getByTestId('physical-profile-card')).toBeInTheDocument();
    expect(screen.queryByTestId('coaching-profile-card')).not.toBeInTheDocument();
  });

  it('renders CoachingProfileCard when user is a Personal Trainer', () => {
    mockUseUserProfile.mockReturnValue({
      data: {
        id: '2',
        email: 'trainer@gymmi.com',
        username: 'trainer_pro',
        role: { id: 'r-2', name: 'Trainer' },
        hasPaid: true,
        profile: {
          id: 'p-2',
          age: 30,
          gender: 'female',
          height: 165,
          weight: 58,
          goal: 'Endurance',
        },
        trainerProfile: {
          id: 'tp-2',
          description: 'Certified trainer with high experience.',
          monthlyPrice: 120,
          specializations: ['Hypertrophy'],
          gyms: ['City Gym'],
        },
      },
      isLoading: false,
    });

    renderWithProviders(<SettingsPage />);

    expect(screen.getByTestId('physical-profile-card')).toBeInTheDocument();
    expect(screen.getByTestId('coaching-profile-card')).toBeInTheDocument();
  });
});
