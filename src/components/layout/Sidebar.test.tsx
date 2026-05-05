import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const mockSignOut = vi.fn().mockResolvedValue(undefined);
const mockNavigate = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sidebar', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    mockNavigate.mockClear();
  });

  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar username="testuser" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workouts')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders truncated uppercased username', () => {
    render(
      <MemoryRouter>
        <Sidebar username="alexander" />
      </MemoryRouter>,
    );

    expect(screen.getByText('ALEXAN')).toBeInTheDocument();
  });

  it('calls signOut and navigates to /login when Sign Out is clicked', async () => {
    render(
      <MemoryRouter>
        <Sidebar username="testuser" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Sign Out'));

    await vi.waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
