import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import LoginPage, { resolveLoginErrorMessage } from './LoginPage';

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
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText('Email or username is required')).toBeInTheDocument();
    });
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows email format error', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'bad');
    await user.type(screen.getByPlaceholderText('Password'), 'secret1');
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
    await user.type(screen.getByPlaceholderText('Password'), 'secret12');
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
    await user.type(screen.getByPlaceholderText('Password'), 'secret12');
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
    await user.type(screen.getByPlaceholderText('Password'), 'wrong12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('shows userNotFound error toast when user does not exist', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'No account found with this email or username' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'unknown@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('No account found with this email or username.');
    });
  });

  it('shows incorrectPassword error toast when password is wrong', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'Incorrect password. Please verify and try again' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Incorrect password. Please verify and try again.');
    });
  });

  it('shows accountInactive error toast when account is deactivated', async () => {
    mockMutate.mockImplementation((_vars, opts) => {
      opts?.onError?.({
        response: { data: { message: 'Your account is deactivated. Please contact support' } },
        message: 'Request failed',
      });
    });

    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('email@mail.com'), 'user@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Your account is deactivated. Please contact support.');
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
    await user.type(screen.getByPlaceholderText('Password'), 'secret12');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Too many attempts/i)).toBeInTheDocument();
    });
    expect(mockToastError).not.toHaveBeenCalled();
  });
});

describe('resolveLoginErrorMessage (web)', () => {
  const t = (k: string) => k;

  it('resolves userNotFound for English and Spanish server messages', () => {
    expect(resolveLoginErrorMessage('No account found with this email or username', t)).toBe('auth.userNotFound');
    expect(resolveLoginErrorMessage('No se encontró ninguna cuenta con este correo o usuario', t)).toBe('auth.userNotFound');
  });

  it('resolves incorrectPassword for English and Spanish server messages', () => {
    expect(resolveLoginErrorMessage('Incorrect password. Please verify and try again', t)).toBe('auth.incorrectPassword');
    expect(resolveLoginErrorMessage('Contraseña incorrecta. Por favor verifícala e inténtalo de nuevo', t)).toBe('auth.incorrectPassword');
  });

  it('resolves accountInactive for deactivated server messages', () => {
    expect(resolveLoginErrorMessage('Your account is deactivated. Please contact support', t)).toBe('auth.accountInactive');
    expect(resolveLoginErrorMessage('Tu cuenta está desactivada. Por favor contacta al soporte', t)).toBe('auth.accountInactive');
  });

  it('returns raw message if unknown and default fallback if undefined', () => {
    expect(resolveLoginErrorMessage('Some other error', t)).toBe('Some other error');
    expect(resolveLoginErrorMessage(undefined, t)).toBe('auth.loginFailed');
  });
});
