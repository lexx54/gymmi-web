import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const mockLoginApi = vi.fn();
const mockLogoutApi = vi.fn();
const mockSignupApi = vi.fn();
const mockSaveTokens = vi.fn();
const mockGetTokens = vi.fn();
const mockClearTokens = vi.fn();

vi.mock('../services/api/auth', () => ({
  loginApi: (...args: unknown[]) => mockLoginApi(...args),
  logoutApi: (...args: unknown[]) => mockLogoutApi(...args),
  signupApi: (...args: unknown[]) => mockSignupApi(...args),
}));

vi.mock('../services/storage/tokenStorage', () => ({
  saveTokens: (...args: unknown[]) => mockSaveTokens(...args),
  getTokens: () => mockGetTokens(),
  clearTokens: () => mockClearTokens(),
}));

function createWrapper() {
  return ({ children }: { children: ReactNode }) =>
    createElement(AuthProvider, null, children);
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

beforeEach(() => {
  mockLoginApi.mockReset();
  mockLogoutApi.mockReset();
  mockSignupApi.mockReset();
  mockSaveTokens.mockReset();
  mockGetTokens.mockReset();
  mockClearTokens.mockReset();
});

describe('AuthContext', () => {
  it('initially loads with isLoading true, then resolves', async () => {
    mockGetTokens.mockReturnValue({ accessToken: null, refreshToken: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('when no token exists, user is null and isAuthenticated is false', async () => {
    mockGetTokens.mockReturnValue({ accessToken: null, refreshToken: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('when valid JWT token exists, decodes and sets user', async () => {
    const token = makeJwt({ sub: '42', email: 'a@b.com', username: 'volt', roleId: 'r1', roleName: 'Client' });
    mockGetTokens.mockReturnValue({ accessToken: token, refreshToken: 'rt' });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual({
      id: '42',
      email: 'a@b.com',
      username: 'volt',
      role: { id: 'r1', name: 'Client' },
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signIn calls loginApi, saves tokens, and updates user', async () => {
    mockGetTokens.mockReturnValue({ accessToken: null, refreshToken: null });
    mockLoginApi.mockResolvedValue({
      accessToken: 'at',
      refreshToken: 'rt',
      user: { id: '1', email: 'a@b.com', username: 'user1' },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn('a@b.com', 'pass');
    });

    expect(mockLoginApi).toHaveBeenCalledWith({
      identifier: 'a@b.com',
      password: 'pass',
    });
    expect(mockSaveTokens).toHaveBeenCalledWith('at', 'rt');
    expect(result.current.user).toEqual({
      id: '1',
      email: 'a@b.com',
      username: 'user1',
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('signOut clears tokens and sets user to null', async () => {
    const token = makeJwt({ sub: '42', email: 'a@b.com', username: 'volt' });
    mockGetTokens.mockReturnValue({ accessToken: token, refreshToken: 'rt' });
    mockLogoutApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockLogoutApi).toHaveBeenCalled();
    expect(mockClearTokens).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
