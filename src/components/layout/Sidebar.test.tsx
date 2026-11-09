import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const mockSignOut = vi.fn().mockResolvedValue(undefined);
const mockNavigate = vi.fn();
let mockUser: { role: { name: string } } | undefined;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signOut: mockSignOut, user: mockUser }),
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
    mockUser = undefined;
  });

  it('shows Billing & Plans to non-admin users', () => {
    mockUser = { role: { name: 'Client' } };
    render(
      <MemoryRouter>
        <Sidebar username="testuser" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Billing & Plans').closest('a')).toHaveAttribute('href', '/billing');
    expect(screen.queryByText('Payments')).not.toBeInTheDocument();
  });

  it('puts Payments in the Billing slot for admins, once', () => {
    mockUser = { role: { name: 'Admin' } };
    render(
      <MemoryRouter>
        <Sidebar username="testuser" />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Billing & Plans')).not.toBeInTheDocument();
    const payments = screen.getAllByText('Payments').map((el) => el.closest('a'));
    expect(payments).toHaveLength(1);
    expect(payments[0]).toHaveAttribute('href', '/admin/payments');
    expect(screen.getByText('Reports')).toBeInTheDocument();
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

    fireEvent.click(screen.getByText(/sign out/i));

    await vi.waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
