import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

const mockInstance: any = vi.fn();
mockInstance.interceptors = {
  request: { use: vi.fn() },
  response: { use: vi.fn() },
};

const mockAxiosPost = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockInstance),
    post: mockAxiosPost,
  },
}));

vi.mock('../storage/tokenStorage', () => ({
  getTokens: vi.fn(),
  saveTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

const { default: axios } = await import('axios');
const { getTokens, saveTokens, clearTokens } = await import(
  '../storage/tokenStorage'
);

await import('./client');

const requestInterceptor =
  mockInstance.interceptors.request.use.mock.calls[0][0];
const responseSuccess =
  mockInstance.interceptors.response.use.mock.calls[0][0];
const responseError =
  mockInstance.interceptors.response.use.mock.calls[0][1];

beforeEach(() => {
  (getTokens as Mock).mockReset();
  (saveTokens as Mock).mockReset();
  (clearTokens as Mock).mockReset();
  mockAxiosPost.mockReset();
  mockInstance.mockReset();
});

describe('API Client - creation', () => {
  it('should create axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000',
      headers: { 'Content-Type': 'application/json', 'X-Client-Id': 'web' },
    });
  });

  it('should register request and response interceptors', () => {
    expect(mockInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(mockInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
  });
});

describe('API Client - request interceptor', () => {
  it('should add Authorization header when access token exists', () => {
    (getTokens as Mock).mockReturnValue({
      accessToken: 'my-token',
      refreshToken: null,
    });
    const config: any = { headers: {} };

    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBe('Bearer my-token');
  });

  it('should not add Authorization header when no access token', () => {
    (getTokens as Mock).mockReturnValue({
      accessToken: null,
      refreshToken: null,
    });
    const config: any = { headers: {} };

    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('API Client - response interceptor', () => {
  it('should pass through successful responses', () => {
    const response = { status: 200, data: { ok: true } };
    expect(responseSuccess(response)).toEqual(response);
  });

  it('should reject non-401 errors without attempting refresh', async () => {
    const error = { config: { url: '/users' }, response: { status: 500 } };

    await expect(responseError(error)).rejects.toEqual(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it('should reject 401 errors on auth endpoints without refreshing', async () => {
    const error = {
      config: { url: '/auth/login', headers: {} },
      response: { status: 401 },
    };

    await expect(responseError(error)).rejects.toEqual(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it('should reject 401 errors that have already been retried', async () => {
    const error = {
      config: { url: '/users', _retry: true, headers: {} },
      response: { status: 401 },
    };

    await expect(responseError(error)).rejects.toEqual(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it('should refresh token and retry the original request on 401', async () => {
    (getTokens as Mock).mockReturnValue({
      accessToken: 'old-at',
      refreshToken: 'old-rt',
    });
    mockAxiosPost.mockResolvedValue({
      data: { accessToken: 'new-at', refreshToken: 'new-rt' },
    });
    mockInstance.mockResolvedValue({ data: { retried: true } });

    const error = {
      config: { url: '/users', headers: {} },
      response: { status: 401 },
    };

    const result = await responseError(error);

    expect(mockAxiosPost).toHaveBeenCalledWith(
      'http://localhost:3000/auth/refresh',
      { refreshToken: 'old-rt' },
    );
    expect(saveTokens).toHaveBeenCalledWith('new-at', 'new-rt');
    expect(error.config.headers.Authorization).toBe('Bearer new-at');
    expect(result).toEqual({ data: { retried: true } });
  });

  it('should clear tokens and reject when refresh fails', async () => {
    (getTokens as Mock).mockReturnValue({
      accessToken: 'old-at',
      refreshToken: 'old-rt',
    });
    const refreshError = new Error('refresh failed');
    mockAxiosPost.mockRejectedValue(refreshError);

    const error = {
      config: { url: '/users', headers: {} },
      response: { status: 401 },
    };

    await expect(responseError(error)).rejects.toEqual(refreshError);
    expect(clearTokens).toHaveBeenCalled();
  });

  it('should clear tokens and reject when no refresh token exists', async () => {
    (getTokens as Mock).mockReturnValue({
      accessToken: null,
      refreshToken: null,
    });

    const error = {
      config: { url: '/users', headers: {} },
      response: { status: 401 },
    };

    await expect(responseError(error)).rejects.toThrow('No refresh token');
    expect(clearTokens).toHaveBeenCalled();
  });
});
