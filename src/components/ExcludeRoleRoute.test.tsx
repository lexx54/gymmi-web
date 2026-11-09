import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExcludeRoleRoute } from './RoleRoute';

let mockRole: string | undefined;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockRole ? { role: { name: mockRole } } : null }),
}));

function renderAt() {
  return render(
    <MemoryRouter initialEntries={['/billing']}>
      <Routes>
        <Route
          path="/billing"
          element={
            <ExcludeRoleRoute role="Admin" redirectTo="/admin/payments">
              <p>billing page</p>
            </ExcludeRoleRoute>
          }
        />
        <Route path="/admin/payments" element={<p>payments page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ExcludeRoleRoute', () => {
  beforeEach(() => {
    mockRole = undefined;
  });

  it('sends admins to the redirect target', () => {
    mockRole = 'Admin';
    renderAt();
    expect(screen.getByText('payments page')).toBeInTheDocument();
    expect(screen.queryByText('billing page')).not.toBeInTheDocument();
  });

  it('renders the page for other roles', () => {
    mockRole = 'Client';
    renderAt();
    expect(screen.getByText('billing page')).toBeInTheDocument();
  });
});
