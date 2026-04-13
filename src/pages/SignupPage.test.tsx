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
});

describe('SignupPage', () => {
  it('renders all form fields and the submit button', () => {
    render(<SignupPage />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('email@mail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••••••').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows email format error', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'not-an-email');
    await user.type(screen.getByPlaceholderText('username'), 'abc');
    await user.type(screen.getAllByPlaceholderText('••••••••••••')[0], 'password12');
    await user.type(screen.getByPlaceholderText('confirm password'), 'password12');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows password mismatch error', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'a@b.com');
    await user.type(screen.getByPlaceholderText('username'), 'user');
    await user.type(screen.getAllByPlaceholderText('••••••••••••')[0], 'password12');
    await user.type(screen.getByPlaceholderText('confirm password'), 'password13');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls useSignup mutate on valid submission', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'new@user.com');
    await user.type(screen.getByPlaceholderText('username'), 'newuser');
    await user.type(screen.getAllByPlaceholderText('••••••••••••')[0], 'password12');
    await user.type(screen.getByPlaceholderText('confirm password'), 'password12');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'new@user.com', username: 'newuser', password: 'password12' },
        expect.any(Object),
      );
    });
  });

  it('shows success toast and navigates to /login on success', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'new@user.com');
    await user.type(screen.getByPlaceholderText('username'), 'newuser');
    await user.type(screen.getAllByPlaceholderText('••••••••••••')[0], 'password12');
    await user.type(screen.getByPlaceholderText('confirm password'), 'password12');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Account created successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error toast on mutation failure', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'Email already taken' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'taken@b.com');
    await user.type(screen.getByPlaceholderText('username'), 'user');
    await user.type(screen.getAllByPlaceholderText('••••••••••••')[0], 'password12');
    await user.type(screen.getByPlaceholderText('confirm password'), 'password12');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Email already taken');
    });
  });
});
