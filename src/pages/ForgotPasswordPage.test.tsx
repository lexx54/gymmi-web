import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import ForgotPasswordPage from './ForgotPasswordPage';
import { resolveResetErrorKey } from '../utils/passwordReset';

type MutateOptions = { onSuccess?: () => void; onError?: (err: unknown) => void };

const mockRequestCode = vi.fn();
const mockResetPassword = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuthApi', () => ({
  useForgotPassword: () => ({ mutate: mockRequestCode, isPending: false }),
  useResetPassword: () => ({ mutate: mockResetPassword, isPending: false }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function wrapper({ children }: { children: ReactNode }) {
  return createElement(MemoryRouter, { initialEntries: ['/forgot-password'] }, children);
}

async function requestCodeFor(email: string) {
  mockRequestCode.mockImplementation((_params, opts: MutateOptions) => opts.onSuccess?.());
  const user = userEvent.setup();
  render(<ForgotPasswordPage />, { wrapper });
  await user.type(screen.getByLabelText('Email'), email);
  await user.click(screen.getByRole('button', { name: 'Send code' }));
  await screen.findByLabelText('6-digit code');
  return user;
}

beforeEach(() => {
  mockRequestCode.mockReset();
  mockResetPassword.mockReset();
  mockToastError.mockReset();
  mockToastSuccess.mockReset();
  mockNavigate.mockReset();
});

describe('ForgotPasswordPage', () => {
  it('validates the email before requesting a code', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />, { wrapper });

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Send code' }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(mockRequestCode).not.toHaveBeenCalled();
  });

  it('requests a code and moves to the code step', async () => {
    await requestCodeFor('ana@example.com');

    expect(mockRequestCode).toHaveBeenCalledWith({ email: 'ana@example.com' }, expect.any(Object));
    expect(screen.getByText(/ana@example\.com/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resend code in 60s/ })).toBeDisabled();
  });

  it('keeps only digits in the code field', async () => {
    const user = await requestCodeFor('ana@example.com');
    const code = screen.getByLabelText('6-digit code');

    await user.type(code, '12a3-45678');

    expect(code).toHaveValue('123456');
  });

  it('rejects mismatched passwords without calling the API', async () => {
    const user = await requestCodeFor('ana@example.com');

    await user.type(screen.getByLabelText('6-digit code'), '123456');
    await user.type(screen.getByLabelText('New password'), 'new-password-1');
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password-2');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('resets the password and returns to login', async () => {
    const user = await requestCodeFor('ana@example.com');
    mockResetPassword.mockImplementation((_params, opts: MutateOptions) => opts.onSuccess?.());

    await user.type(screen.getByLabelText('6-digit code'), '123456');
    await user.type(screen.getByLabelText('New password'), 'new-password-1');
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password-1');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith(
        { email: 'ana@example.com', code: '123456', newPassword: 'new-password-1' },
        expect.any(Object),
      ),
    );
    expect(mockToastSuccess).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('shows a clear message for an invalid code', async () => {
    const user = await requestCodeFor('ana@example.com');
    mockResetPassword.mockImplementation((_params, opts: MutateOptions) =>
      opts.onError?.({ response: { status: 400 } }),
    );

    await user.type(screen.getByLabelText('6-digit code'), '000000');
    await user.type(screen.getByLabelText('New password'), 'new-password-1');
    await user.type(screen.getByLabelText('Confirm new password'), 'new-password-1');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));

    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        'That code is invalid or expired. Check it or request a new one.',
      ),
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('can go back to the email step', async () => {
    const user = await requestCodeFor('ana@example.com');

    await user.click(screen.getByRole('button', { name: 'Use a different email' }));

    expect(screen.getByRole('button', { name: 'Send code' })).toBeInTheDocument();
  });
});

describe('resolveResetErrorKey', () => {
  it.each([
    [{ response: { status: 400 } }, 'auth.forgot.invalidCode'],
    [{ response: { status: 429 } }, 'auth.forgot.tooManyAttempts'],
    [{ response: { status: 500 } }, 'auth.forgot.failed'],
    [new Error('network'), 'auth.forgot.failed'],
  ])('maps %o to %s', (error, key) => {
    expect(resolveResetErrorKey(error)).toBe(key);
  });
});
