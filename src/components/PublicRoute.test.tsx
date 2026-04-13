import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';

const mockUseAuth = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PublicRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('renders child routes when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login form</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login form')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login form</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });
});
