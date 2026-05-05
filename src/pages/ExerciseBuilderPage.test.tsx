import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import ExerciseBuilderPage from './ExerciseBuilderPage';

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

vi.mock('../hooks/useListData', () => ({
  useListData: () => ({
    data: [{ id: '1', name: 'Dumbbells', type: 'free_weight' }],
    isLoading: false,
    isError: false,
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

describe('ExerciseBuilderPage', () => {
  it('should render "Workout Builder" header text', () => {
    renderWithRouter(<ExerciseBuilderPage />);

    expect(screen.getByText('Workout Builder')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<ExerciseBuilderPage />);

    expect(container).toBeTruthy();
  });
});
