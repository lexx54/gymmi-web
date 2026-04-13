import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import LoginPage from './LoginPage';

const mockMutate = vi.fn();
const mockToastError = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuthApi', () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
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

function createWrapper(initialEntries = ['/login']) {
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
  mockToastError.mockReset();
  mockNavigate.mockReset();
});

describe('LoginPage', () => {
  it('renders email and password fields and submit button', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('email@mail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows email format error', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'bad');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'secret1');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls useLogin mutate with correct values on valid form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'secret12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { identifier: 'user@test.com', password: 'secret12' },
        expect.any(Object),
      );
    });
  });

  it('navigates to dashboard on successful login', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onSuccess?.();
    });

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'secret12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast from mutation', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'Invalid credentials' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'wrong12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('displays lockout message on 429 error', async () => {
    mockMutate.mockImplementation(
      (
        _vars: unknown,
        opts?: { onError?: (e: { response?: { status?: number } }) => void },
      ) => {
        opts?.onError?.({ response: { status: 429 } });
      },
    );

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'secret12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Too many attempts/i)).toBeInTheDocument();
    });
    expect(mockToastError).not.toHaveBeenCalled();
  });
});
