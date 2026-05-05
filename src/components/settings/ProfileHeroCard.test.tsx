import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileHeroCard } from './ProfileHeroCard';

describe('ProfileHeroCard', () => {
  it('renders display name', () => {
    render(<ProfileHeroCard />);

    expect(screen.getByText('Alex "Volt" Sterling')).toBeInTheDocument();
  });

  it('renders bio text', () => {
    render(<ProfileHeroCard />);

    expect(
      screen.getByText(/Performance-driven endurance athlete/),
    ).toBeInTheDocument();
  });

  it('renders heart stat', () => {
    render(<ProfileHeroCard />);

    expect(screen.getByText('48 BPM RHR')).toBeInTheDocument();
  });

  it('renders view profile button', () => {
    render(<ProfileHeroCard />);

    expect(
      screen.getByRole('button', { name: /VIEW PUBLIC PROFILE/i }),
    ).toBeInTheDocument();
  });
});
