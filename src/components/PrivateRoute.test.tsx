import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

const mockUseAuth = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PrivateRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/child']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/child" element={<div>Protected content</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders child routes when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/child']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/child" element={<div>Protected content</div>} />
          </Route>
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('shows loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(
      <MemoryRouter initialEntries={['/child']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/child" element={<div>Protected content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
