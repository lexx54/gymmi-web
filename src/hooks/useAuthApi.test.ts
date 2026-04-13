import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useLogin, useSignup, useForgotPassword, useResetPassword } from './useAuthApi';

const mockSignIn = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

const mockSignupApi = vi.fn();
const mockForgotPasswordApi = vi.fn();
const mockResetPasswordApi = vi.fn();

vi.mock('../services/api/auth', () => ({
  signupApi: (...args: unknown[]) => mockSignupApi(...args),
  forgotPasswordApi: (...args: unknown[]) => mockForgotPasswordApi(...args),
  resetPasswordApi: (...args: unknown[]) => mockResetPasswordApi(...args),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  mockSignIn.mockReset();
  mockSignupApi.mockReset();
  mockForgotPasswordApi.mockReset();
  mockResetPasswordApi.mockReset();
});

describe('useLogin', () => {
  it('should call signIn and report success', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ identifier: 'a@b.com', password: 'pass' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSignIn).toHaveBeenCalledWith('a@b.com', 'pass');
  });

  it('should report error when signIn fails', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ identifier: 'a@b.com', password: 'wrong' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Invalid credentials');
  });
});

describe('useSignup', () => {
  it('should call signupApi and report success', async () => {
    mockSignupApi.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'b',
      user: { id: '1', email: 'a@b.com', username: 'user' },
    });

    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'a@b.com',
      username: 'user',
      password: 'pass123',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSignupApi).toHaveBeenCalledWith({
      email: 'a@b.com',
      username: 'user',
      password: 'pass123',
    });
  });

  it('should report error when signupApi fails', async () => {
    mockSignupApi.mockRejectedValue(new Error('Email taken'));

    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'a@b.com',
      username: 'user',
      password: 'pass',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Email taken');
  });
});

describe('useForgotPassword', () => {
  it('should call forgotPasswordApi and return data on success', async () => {
    const response = { message: 'If the email exists, a reset code has been sent' };
    mockForgotPasswordApi.mockResolvedValue(response);

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'a@b.com' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(response);
    expect(mockForgotPasswordApi).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('should report error on failure', async () => {
    mockForgotPasswordApi.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'a@b.com' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Server error');
  });
});

describe('useResetPassword', () => {
  it('should call resetPasswordApi and return data on success', async () => {
    const response = { message: 'Password has been reset successfully' };
    mockResetPasswordApi.mockResolvedValue(response);

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'a@b.com',
      code: '123456',
      newPassword: 'newpass',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(response);
    expect(mockResetPasswordApi).toHaveBeenCalledWith({
      email: 'a@b.com',
      code: '123456',
      newPassword: 'newpass',
    });
  });

  it('should report error on failure', async () => {
    mockResetPasswordApi.mockRejectedValue(new Error('Invalid code'));

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'a@b.com',
      code: '000000',
      newPassword: 'pass',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Invalid code');
  });
});
