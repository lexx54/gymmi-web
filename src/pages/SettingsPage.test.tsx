import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import SettingsPage from './SettingsPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@test.com', username: 'testuser' },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
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

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(MemoryRouter, null, children),
  });
}

describe('SettingsPage', () => {
  it('should render the page title "Settings & Profile"', () => {
    renderWithRouter(<SettingsPage />);

    expect(screen.getByText('Settings & Profile')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<SettingsPage />);

    expect(container).toBeTruthy();
  });
});
