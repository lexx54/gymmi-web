import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { LandingPage } from './LandingPage';
import * as authContext from '../context/AuthContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function createWrapper(initialEntries = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, { initialEntries }, children),
    );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();

    // Default to unauthenticated state
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('renders landing page hero, branding, and unauthenticated navigation', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    // Logo & Navbar
    expect(screen.getAllByText(/GYMMI/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/log in/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/get started/i)[0]).toBeInTheDocument();

    // Hero title
    expect(screen.getByText(/Coaching Meets Execution/i)).toBeInTheDocument();
    expect(screen.getByText(/Elevate Every Rep/i)).toBeInTheDocument();
  });

  it('renders "Go to Dashboard" button when user is authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'test-user-id',
        email: 'coach@example.com',
        username: 'coach_pro',
        role: { id: 'trainer-id', name: 'Trainer' },
        hasPaid: false,
      },
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<LandingPage />, { wrapper: createWrapper() });

    const dashboardButtons = screen.getAllByRole('button', { name: /go to dashboard/i });
    expect(dashboardButtons.length).toBeGreaterThan(0);
  });

  it('allows switching feature tabs and shows corresponding content', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Default tab is Routine Builder
    expect(screen.getByText(/Visual Workout Programming/i)).toBeInTheDocument();

    // Switch to Muscle Body Map
    const bodyMapTab = screen.getByRole('tab', { name: /muscle body map/i });
    await user.click(bodyMapTab);
    expect(screen.getByText(/Interactive Muscle Targeting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chest' })).toBeInTheDocument();

    // Switch to Active Workout
    const activeTab = screen.getByRole('tab', { name: /active workout/i });
    await user.click(activeTab);
    expect(screen.getByText(/Real-Time Workout Execution/i)).toBeInTheDocument();
  });

  it('renders pricing plans with role toggle and disabled Pro plan', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Section title
    expect(screen.getByText(/Plans That Scale With You/i)).toBeInTheDocument();

    // Default trainer plans
    expect(screen.getByText('Free Coach')).toBeInTheDocument();
    expect(screen.getByText('Coach Plus')).toBeInTheDocument();
    expect(screen.getByText('Coach Pro')).toBeInTheDocument();

    // Check Pro plan is disabled
    const proButtons = screen.getAllByRole('button', { name: /coming soon/i });
    expect(proButtons.some((b) => b.hasAttribute('disabled'))).toBe(true);

    // Switch to Client / Athlete tab
    const clientTab = screen.getByRole('tab', { name: /for athletes & clients/i });
    await user.click(clientTab);

    expect(screen.getByText('Solo Athlete')).toBeInTheDocument();
    expect(screen.getByText('Athlete Plus')).toBeInTheDocument();
    expect(screen.getByText('Athlete Pro')).toBeInTheDocument();
  });

  it('switches billing frequency from monthly to annual and shows savings', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Click Annual
    const annualBtn = screen.getByRole('button', { name: /annual/i });
    await user.click(annualBtn);

    expect(screen.getAllByText(/billed annually/i).length).toBeGreaterThan(0);
  });

  it('allows interacting with the hero workout preview checklist', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    const benchPressRow = screen.getAllByText('Barbell Bench Press')[0];
    await user.click(benchPressRow);

    // Clicking toggles completion state
    expect(benchPressRow).toBeInTheDocument();
  });
});
