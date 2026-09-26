import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileHeroCard } from './ProfileHeroCard';
import type { FullUserProfile } from '../../types/auth';

vi.mock('../../hooks/useUserProfile', () => ({
  useUpdateUserProfile: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const mockAthlete: FullUserProfile = {
  id: 'u-1',
  email: 'athlete@gymmi.com',
  username: 'AlexVolt',
  hasPaid: false,
  role: { id: 'r-1', name: 'Client' },
  avatarUrl: 'https://cdn.example.com/alex-avatar.png',
  profile: {
    id: 'p-1',
    age: 26,
    gender: 'male',
    height: 180,
    weight: 78,
    goal: 'Build Muscle',
  },
};

const mockTrainer: FullUserProfile = {
  id: 'u-2',
  email: 'trainer@gymmi.com',
  username: 'CoachMike',
  hasPaid: true,
  role: { id: 'r-2', name: 'Trainer' },
  avatarUrl: 'https://cdn.example.com/mike-avatar.png',
  trainerProfile: {
    id: 'tp-1',
    description: 'Expert strength and hypertrophy coach.',
    monthlyPrice: 150,
    specializations: ['Strength', 'Hypertrophy'],
    gyms: ['Gold Gym'],
    logoUrl: 'https://cdn.example.com/mike-logo.png',
  },
};

describe('ProfileHeroCard', () => {
  it('renders display name and bio text', () => {
    render(<ProfileHeroCard userProfile={mockAthlete} />);

    expect(screen.getByText('AlexVolt')).toBeInTheDocument();
    expect(screen.getAllByText(/Build Muscle/).length).toBeGreaterThan(0);
  });

  it('does NOT render 48 BPM RHR (verified removal)', () => {
    render(<ProfileHeroCard userProfile={mockAthlete} />);

    expect(screen.queryByText(/48 BPM RHR/i)).not.toBeInTheDocument();
  });

  it('renders profile avatar for client', () => {
    render(<ProfileHeroCard userProfile={mockAthlete} />);

    const avatarImg = screen.getByTestId('profile-avatar-img');
    expect(avatarImg).toHaveAttribute('src', 'https://cdn.example.com/alex-avatar.png');
    expect(screen.queryByTestId('trainer-logo-img')).not.toBeInTheDocument();
  });

  it('renders both profile avatar and trainer logo for trainer', () => {
    render(<ProfileHeroCard userProfile={mockTrainer} />);

    const avatarImg = screen.getByTestId('profile-avatar-img');
    expect(avatarImg).toHaveAttribute('src', 'https://cdn.example.com/mike-avatar.png');

    const logoImg = screen.getByTestId('trainer-logo-img');
    expect(logoImg).toHaveAttribute('src', 'https://cdn.example.com/mike-logo.png');
  });

  it('opens and closes public profile modal when clicking view public profile', async () => {
    const user = userEvent.setup();
    render(<ProfileHeroCard userProfile={mockTrainer} />);

    expect(screen.queryByTestId('public-profile-modal')).not.toBeInTheDocument();

    const viewButton = screen.getByTestId('view-public-profile-btn');
    await user.click(viewButton);

    const modal = screen.getByTestId('public-profile-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Expert strength and hypertrophy coach.')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-public-profile-modal');
    await user.click(closeButton);

    expect(screen.queryByTestId('public-profile-modal')).not.toBeInTheDocument();
  });
});
