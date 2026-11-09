import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

    // Default tab: web Routine Builder replica (Mon–Sun tabs, add from library)
    expect(screen.getByText(/Weekly Routine Builder/i)).toBeInTheDocument();
    const builder = screen.getByTestId('routine-builder-mockup');
    await user.click(within(builder).getByRole('button', { name: 'Wed' }));
    expect(within(builder).getByText(/1\. Barbell Back Squat/)).toBeInTheDocument();
    await user.click(within(builder).getByRole('button', { name: /Leg Press/ }));
    expect(within(builder).getByText(/3\. Leg Press/)).toBeInTheDocument();

    // Muscle map: picking an exercise repaints the real body map
    await user.click(screen.getByRole('tab', { name: /muscle map/i }));
    expect(screen.getByText(/See Every Muscle an Exercise Works/i)).toBeInTheDocument();
    const bodyMap = screen.getByTestId('body-map-mockup');
    await user.click(within(bodyMap).getByRole('button', { name: 'Barbell Back Squat' }));
    expect(bodyMap.querySelector('[data-muscle="Quads"]')).toHaveAttribute('data-tier', 'primary');

    // Active Workout: log a custom set, then the rest-complete alert
    await user.click(screen.getByRole('tab', { name: /active workout/i }));
    expect(screen.getByText(/Log Every Set on Your Phone/i)).toBeInTheDocument();
    const logSet = screen.getByTestId('log-set-mockup');
    await user.click(within(logSet).getAllByRole('button', { name: 'Log Set' }).at(-1)!);
    expect(within(logSet).getByText('Rest Complete!')).toBeInTheDocument();

    // Coaching: request → accept → assign → weekly copy
    await user.click(screen.getByRole('tab', { name: /coaching pipeline/i }));
    const flow = screen.getByTestId('coaching-flow-mockup');
    await user.click(within(flow).getByRole('button', { name: 'Accept' }));
    await user.click(within(flow).getByRole('button', { name: 'Two weeks' }));
    await user.click(within(flow).getByRole('button', { name: 'Confirm' }));
    expect(within(flow).getByText('Current assignment')).toBeInTheDocument();
    expect(within(flow).getByText('Week 2')).toBeInTheDocument();
    expect(within(flow).queryByText('Week 3')).not.toBeInTheDocument();

    // Strength Leaderboards
    const leaderboardTab = screen.getByRole('tab', { name: /strength leaderboard/i });
    await user.click(leaderboardTab);
    expect(screen.getByText(/Automated Strength Tiers & Leaderboards/i)).toBeInTheDocument();
    expect(screen.getByText('Cohort Leaderboard Live Preview')).toBeInTheDocument();
    expect(screen.getByText('Your Standing')).toBeInTheDocument();
    expect(screen.getAllByText('Alex Sterling')[0]).toBeInTheDocument();

    // Switch lift to Barbell Back Squat
    const squatBtn = screen.getByRole('button', { name: 'Barbell Back Squat' });
    await user.click(squatBtn);
    expect(screen.getAllByText('David Kim')[0]).toBeInTheDocument();

    // Facility Console: coaches page replica with publishing toggles
    const facilityTab = screen.getByRole('tab', { name: /facility console/i });
    await user.click(facilityTab);
    expect(screen.getByText(/Gym Facility & Studio Management/i)).toBeInTheDocument();
    const coaches = screen.getByTestId('gym-coaches-mockup');
    expect(within(coaches).getByText('2 of 3 catalog workouts used')).toBeInTheDocument();
    const toggle = within(coaches).getByRole('switch', { name: /Mike Torres/ });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('renders product-accurate hero and audience mockups', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Hero: mobile Active Workout replica — double-tap logs the active set and starts rest
    const session = screen.getByTestId('hero-active-session');
    expect(within(session).getByText('Set 3 of 4 in progress')).toBeInTheDocument();
    await user.dblClick(within(session).getByRole('button', { name: /double-tap/i }));
    expect(within(session).getByText('Set 4 of 4 in progress')).toBeInTheDocument();
    expect(within(session).getByRole('button', { name: 'Skip Rest' })).toBeInTheDocument();

    // Coach row: Clients page replica with the real 15-seat Plus limit
    const clients = screen.getByTestId('clients-page-mockup');
    expect(within(clients).getByText('Free includes 2 accepted clients. Plus includes up to 15.')).toBeInTheDocument();
    await user.click(within(clients).getByRole('button', { name: 'Accept' }));
    expect(within(clients).getByText('3 of 15 accepted client seats used')).toBeInTheDocument();

    // Athlete row: mobile Home replica
    expect(within(screen.getByTestId('mobile-home-mockup')).getByText('2 of 3 workouts completed')).toBeInTheDocument();

    // Gym row: Members page replica
    const members = screen.getByTestId('gym-members-mockup');
    expect(within(members).getByText('74 / 100 Members (74%)')).toBeInTheDocument();
    await user.click(within(members).getByRole('button', { name: 'Approve' }));
    expect(within(members).getByText('75 / 100 Members (75%)')).toBeInTheDocument();
  });

  it('renders pricing plans with every paid plan purchasable, including Athlete Pro', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Section title
    expect(screen.getByText(/Plans That Scale With You/i)).toBeInTheDocument();

    // Default trainer plans and prices
    expect(screen.getByText('Free Coach')).toBeInTheDocument();
    expect(screen.getByText('Coach Plus')).toBeInTheDocument();
    expect(screen.getByText('Coach Pro')).toBeInTheDocument();
    expect(screen.getByText('2.99')).toBeInTheDocument();
    expect(screen.getByText('5.99')).toBeInTheDocument();

    // Coach Pro is purchasable
    expect(screen.queryByRole('button', { name: /coming soon/i })).not.toBeInTheDocument();

    // Switch to Client / Athlete tab
    const clientTab = screen.getByRole('tab', { name: /for athletes & clients/i });
    await user.click(clientTab);

    expect(screen.getByText('Solo Athlete')).toBeInTheDocument();
    expect(screen.getByText('Athlete Plus')).toBeInTheDocument();
    expect(screen.getByText('Athlete Pro')).toBeInTheDocument();
    expect(screen.getByText('1.99')).toBeInTheDocument();
    expect(screen.getByText('2.99')).toBeInTheDocument();

    // Athlete Pro is on sale now, with its real limits
    expect(screen.queryByRole('button', { name: /coming soon/i })).not.toBeInTheDocument();
    expect(screen.getByText('Up to 10 owned solo routines')).toBeInTheDocument();
    expect(screen.getByText('Up to 10 private custom exercises')).toBeInTheDocument();

    // Switch to Gym Facilities tab
    const gymTab = screen.getByRole('tab', { name: /for gym facilities/i });
    await user.click(gymTab);

    expect(screen.getByText('Gym Plus')).toBeInTheDocument();
    expect(screen.getByText('Gym Pro')).toBeInTheDocument();
    expect(screen.getByText('Gym Maximum')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('30-Day Free Trial')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start 30-day free trial/i })).toBeInTheDocument();
  });

  it('switches billing frequency from monthly to annual and shows savings', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Check monthly Coach Plus price
    expect(screen.getByText('2.99')).toBeInTheDocument();

    // Click Annual
    const annualBtn = screen.getByRole('button', { name: /annual/i });
    await user.click(annualBtn);

    expect(screen.getAllByText(/billed annually/i).length).toBeGreaterThan(0);
    // Coach Plus annual discounted price ($2.39)
    expect(screen.getByText('2.39')).toBeInTheDocument();

    // Switch to Gym tab on Annual
    const gymTab = screen.getByRole('tab', { name: /for gym facilities/i });
    await user.click(gymTab);

    // Gym annual prices ($20, $40, $80)
    const pricing = document.getElementById('pricing')!;
    expect(within(pricing).getByText('20')).toBeInTheDocument();
    expect(within(pricing).getByText('40')).toBeInTheDocument();
    expect(within(pricing).getByText('80')).toBeInTheDocument();
  });

  it('renders gym facility section in audience deep dive and faq', async () => {
    const user = userEvent.setup();
    render(<LandingPage />, { wrapper: createWrapper() });

    // Audience deep dive for gym
    expect(screen.getAllByText(/For Gym Facilities/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Empower Your Facility. Unify Coaches & Members./i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register your facility/i })).toHaveAttribute('href', '/signup');
    expect(screen.getByTestId('gym-members-mockup')).toHaveTextContent('Gym Members Roster');

    // FAQ accordion for gym
    const gymFaq = screen.getByText(/How does Gymmi work for gym facilities and studios\?/i);
    expect(gymFaq).toBeInTheDocument();
    await user.click(gymFaq);
    expect(screen.getByText(/Gym facilities receive a dedicated management web console/i)).toBeInTheDocument();
  });

  it('links to the Terms of Service page from the footer', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
  });

  it('links to the Privacy Policy page from the footer', () => {
    render(<LandingPage />, { wrapper: createWrapper() });

    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
  });
});
