import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import SignupPage from './SignupPage';

const mockMutate = vi.fn();
const mockNavigate = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockUploadImageDirectly = vi.fn();

vi.mock('../utils/imageUpload', () => ({
  uploadImageDirectly: (...args: unknown[]) => mockUploadImageDirectly(...args),
}));

vi.mock('../hooks/useAuthApi', () => ({
  useSignup: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function createWrapper(initialEntries = ['/signup']) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, { initialEntries }, children),
    );
}

beforeEach(() => {
  mockMutate.mockReset();
  mockNavigate.mockReset();
  mockToastSuccess.mockReset();
  mockToastError.mockReset();
  mockUploadImageDirectly.mockReset();
});

describe('SignupPage Multi-Step Flow', () => {
  it('renders Step 1 with credentials and role selection cards', () => {
    render(<SignupPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('signup-step-1')).toBeInTheDocument();
    expect(screen.getByTestId('role-client')).toBeInTheDocument();
    expect(screen.getByTestId('role-trainer')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-username')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();
    expect(screen.getByTestId('step1-next')).toBeInTheDocument();
  });

  it('shows validation errors when proceeding with invalid Step 1 credentials', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Click continue with empty inputs
    await user.click(screen.getByTestId('step1-next'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    // Still on step 1
    expect(screen.getByTestId('signup-step-1')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-step-2')).not.toBeInTheDocument();
  });

  it('shows password mismatch error on Step 1', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByTestId('input-email'), 'athlete@test.com');
    await user.type(screen.getByTestId('input-username'), 'athlete1');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'different123');

    await user.click(screen.getByTestId('step1-next'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('signup-step-2')).not.toBeInTheDocument();
  });

  it('allows Client to advance Step 1 -> Step 2 -> Confirmation, and submit successfully', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Step 1: Client credentials
    await user.type(screen.getByTestId('input-email'), 'client@test.com');
    await user.type(screen.getByTestId('input-username'), 'clientuser');
    await user.type(screen.getByTestId('input-password'), 'securepassword');
    await user.type(screen.getByTestId('input-confirmPassword'), 'securepassword');
    await user.click(screen.getByTestId('step1-next'));

    // Step 2: Physical Profile
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('input-age'), '26');
    await user.click(screen.getByTestId('gender-male'));
    await user.type(screen.getByTestId('input-height'), '182');
    await user.type(screen.getByTestId('input-weight'), '78');
    await user.click(screen.getByTestId('goal-buildMuscle'));

    await user.click(screen.getByTestId('step2-next'));

    // Confirmation Step for Client (total 3 steps, step 3 is confirmation)
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();
    });

    // Check summary card information
    expect(screen.getByText('clientuser')).toBeInTheDocument();
    expect(screen.getByText('client@test.com')).toBeInTheDocument();
    expect(screen.getByText('26 yrs')).toBeInTheDocument();
    expect(screen.getByText('182 cm')).toBeInTheDocument();
    expect(screen.getByText('78 kg')).toBeInTheDocument();

    // Confirm & Create Account
    await user.click(screen.getByTestId('confirm-signup-btn'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'client@test.com',
          username: 'clientuser',
          password: 'securepassword',
          role: 'Client',
          profile: {
            age: 26,
            gender: 'male',
            height: 182,
            weight: 78,
            goal: 'Build Muscle',
          },
        },
        expect.any(Object),
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Account created successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('allows Trainer to advance Step 1 -> Step 2 -> Step 3 (Coaching) -> Step 4 (Confirmation)', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Step 1: Select Trainer role and fill credentials
    await user.click(screen.getByTestId('role-trainer'));
    await user.type(screen.getByTestId('input-email'), 'trainer@test.com');
    await user.type(screen.getByTestId('input-username'), 'protrainer');
    await user.type(screen.getByTestId('input-password'), 'trainerpass12');
    await user.type(screen.getByTestId('input-confirmPassword'), 'trainerpass12');
    await user.click(screen.getByTestId('step1-next'));

    // Step 2: Physical Profile
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('input-age'), '31');
    await user.click(screen.getByTestId('gender-female'));
    await user.type(screen.getByTestId('input-height'), '165');
    await user.type(screen.getByTestId('input-weight'), '60');
    expect(screen.queryByTestId('input-custom-goal')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('step2-next'));

    // Step 3: Coaching Profile
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-3-trainer')).toBeInTheDocument();
    });
    await user.type(
      screen.getByTestId('input-description'),
      'Certified strength and conditioning coach with 8 years of elite training experience.',
    );
    await user.type(screen.getByTestId('input-monthlyPrice'), '140');
    await user.click(screen.getByTestId('tag-Hypertrophy'));
    await user.type(screen.getByTestId('input-gym'), 'Metro Fitness{enter}');

    await user.click(screen.getByTestId('step3-next'));

    // Confirmation Step (Step 4 for Trainer)
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();
    });

    expect(screen.getByText('protrainer')).toBeInTheDocument();
    expect(screen.getByText('$140 USD / mo')).toBeInTheDocument();
    expect(screen.getByText('Hypertrophy')).toBeInTheDocument();
    expect(screen.getByText('Metro Fitness')).toBeInTheDocument();

    // Submit
    await user.click(screen.getByTestId('confirm-signup-btn'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'trainer@test.com',
          username: 'protrainer',
          password: 'trainerpass12',
          role: 'Trainer',
          profile: {
            age: 31,
            gender: 'female',
            height: 165,
            weight: 60,
          },
          trainerProfile: {
            description: 'Certified strength and conditioning coach with 8 years of elite training experience.',
            monthlyPrice: 140,
            specializations: ['Hypertrophy'],
            gyms: ['Metro Fitness'],
          },
        },
        expect.any(Object),
      );
    });
  });

  it('allows user to navigate back and edit sections from the confirmation screen', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Step 1
    await user.type(screen.getByTestId('input-email'), 'edituser@test.com');
    await user.type(screen.getByTestId('input-username'), 'edituser');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'password123');
    await user.click(screen.getByTestId('step1-next'));

    // Step 2
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('input-age'), '25');
    await user.click(screen.getByTestId('gender-male'));
    await user.type(screen.getByTestId('input-height'), '175');
    await user.type(screen.getByTestId('input-weight'), '70');
    await user.click(screen.getByTestId('goal-buildMuscle'));
    await user.click(screen.getByTestId('step2-next'));

    // Confirmation
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();
    });

    // Click edit on Account section (returns to step 1)
    await user.click(screen.getByTestId('edit-step-1'));
    expect(screen.getByTestId('signup-step-1')).toBeInTheDocument();

    // Advance back to confirmation
    await user.click(screen.getByTestId('step1-next'));
    expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    await user.click(screen.getByTestId('step2-next'));
    expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();

    // Click edit on Physical Profile section (returns to step 2)
    await user.click(screen.getByTestId('edit-step-2'));
    expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
  });

  it('shows error toast when signup mutation fails', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'Email already registered' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Step 1
    await user.type(screen.getByTestId('input-email'), 'taken@test.com');
    await user.type(screen.getByTestId('input-username'), 'takenuser');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'password123');
    await user.click(screen.getByTestId('step1-next'));

    // Step 2
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('input-age'), '25');
    await user.click(screen.getByTestId('gender-other'));
    await user.type(screen.getByTestId('input-height'), '170');
    await user.type(screen.getByTestId('input-weight'), '65');
    await user.click(screen.getByTestId('goal-buildMuscle'));
    await user.click(screen.getByTestId('step2-next'));

    // Confirmation
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('confirm-signup-btn'));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Email already registered');
    });
  });

  it('renders profile photo uploader and displays trainer logo uploader only when role is Trainer', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('avatar-picker-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('trainer-logo-field')).not.toBeInTheDocument();

    // Toggle to Trainer
    await user.click(screen.getByTestId('role-trainer'));
    expect(screen.getByTestId('trainer-logo-field')).toBeInTheDocument();

    // Toggle back to Client
    await user.click(screen.getByTestId('role-client'));
    expect(screen.queryByTestId('trainer-logo-field')).not.toBeInTheDocument();
  });

  it('handles profile photo selection, direct upload, preview rendering, and removal', async () => {
    mockUploadImageDirectly.mockResolvedValueOnce('https://cdn.example.com/avatars/user123.jpg');
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    const avatarInput = screen.getByTestId('input-avatar');
    const file = new File(['dummy-avatar'], 'avatar.png', { type: 'image/png' });

    await user.upload(avatarInput, file);

    await waitFor(() => {
      expect(mockUploadImageDirectly).toHaveBeenCalledWith(file, 'avatar');
    });

    await waitFor(() => {
      const preview = screen.getByTestId('avatar-preview-img');
      expect(preview).toHaveAttribute('src', 'https://cdn.example.com/avatars/user123.jpg');
    });

    // Remove photo
    const removeBtn = screen.getByTestId('remove-avatar');
    await user.click(removeBtn);

    expect(screen.queryByTestId('avatar-preview-img')).not.toBeInTheDocument();
  });

  it('submits signup payload with avatarUrl and logoUrl and displays previews on confirmation card', async () => {
    mockUploadImageDirectly
      .mockResolvedValueOnce('https://cdn.example.com/avatars/my-avatar.jpg')
      .mockResolvedValueOnce('https://cdn.example.com/logos/my-logo.png');

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    // Step 1: Switch to Trainer
    await user.click(screen.getByTestId('role-trainer'));

    // Upload avatar
    const avatarInput = screen.getByTestId('input-avatar');
    const avatarFile = new File(['avatar-content'], 'avatar.jpg', { type: 'image/jpeg' });
    await user.upload(avatarInput, avatarFile);

    // Upload logo
    const logoInput = screen.getByTestId('input-logo');
    const logoFile = new File(['logo-content'], 'logo.png', { type: 'image/png' });
    await user.upload(logoInput, logoFile);

    await waitFor(() => {
      expect(screen.getByTestId('avatar-preview-img')).toBeInTheDocument();
      expect(screen.getByTestId('logo-preview-img')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('input-email'), 'phototrainer@test.com');
    await user.type(screen.getByTestId('input-username'), 'phototrainer');
    await user.type(screen.getByTestId('input-password'), 'password123');
    await user.type(screen.getByTestId('input-confirmPassword'), 'password123');
    await user.click(screen.getByTestId('step1-next'));

    // Step 2
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-2')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('input-age'), '30');
    await user.click(screen.getByTestId('gender-male'));
    await user.type(screen.getByTestId('input-height'), '180');
    await user.type(screen.getByTestId('input-weight'), '85');
    await user.click(screen.getByTestId('step2-next'));

    // Step 3 (Trainer Coaching)
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-3-trainer')).toBeInTheDocument();
    });
    await user.type(screen.getByTestId('input-description'), 'Top notch personal trainer with certified background.');
    await user.type(screen.getByTestId('input-monthlyPrice'), '120');
    await user.click(screen.getByTestId('tag-Hypertrophy'));
    await user.click(screen.getByTestId('step3-next'));

    // Confirmation Step
    await waitFor(() => {
      expect(screen.getByTestId('signup-step-confirmation')).toBeInTheDocument();
    });

    // Verify previews in confirmation cards
    expect(screen.getByTestId('summary-avatar-img')).toHaveAttribute('src', 'https://cdn.example.com/avatars/my-avatar.jpg');
    expect(screen.getByTestId('summary-logo-img')).toHaveAttribute('src', 'https://cdn.example.com/logos/my-logo.png');

    // Submit
    await user.click(screen.getByTestId('confirm-signup-btn'));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'phototrainer@test.com',
        username: 'phototrainer',
        role: 'Trainer',
        avatarUrl: 'https://cdn.example.com/avatars/my-avatar.jpg',
        trainerProfile: expect.objectContaining({
          logoUrl: 'https://cdn.example.com/logos/my-logo.png',
        }),
      }),
      expect.any(Object),
    );
  });
});
