import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'athlete@test.com', username: 'testuser' },
    signOut: vi.fn(),
  }),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(10);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays greeting with username', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/GOOD MORNING, TESTUSER/i)).toBeInTheDocument();
  });

  it('shows peak zone headline', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('PEAK ZONE')).toBeInTheDocument();
  });
});
