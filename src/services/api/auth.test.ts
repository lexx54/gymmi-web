import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loginApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi,
  getPresignedUrlApi,
} from './auth';
import apiClient from './client';

vi.mock('./client', () => ({
  default: { post: vi.fn() },
}));

const mockPost = apiClient.post as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockPost.mockReset();
});

describe('loginApi', () => {
  it('should POST to /auth/login and return auth response', async () => {
    const response = {
      accessToken: 'at',
      refreshToken: 'rt',
      user: {
        id: '1',
        email: 'a@b.com',
        username: 'user',
        hasPaid: false,
        role: { id: 'r1', name: 'Client' },
      },
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await loginApi({ identifier: 'a@b.com', password: 'pass' });

    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      identifier: 'a@b.com',
      password: 'pass',
    });
    expect(result).toEqual(response);
  });

  it('should propagate errors', async () => {
    mockPost.mockRejectedValue(new Error('Network Error'));

    await expect(
      loginApi({ identifier: 'a@b.com', password: 'pass' }),
    ).rejects.toThrow('Network Error');
  });
});

describe('signupApi', () => {
  it('should POST to /auth/signup and return auth response', async () => {
    const response = {
      accessToken: 'at',
      refreshToken: 'rt',
      user: {
        id: '1',
        email: 'a@b.com',
        username: 'newuser',
        hasPaid: false,
        role: { id: 'r1', name: 'Client' },
      },
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await signupApi({
      email: 'a@b.com',
      username: 'newuser',
      password: 'pass123',
      role: 'Client',
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
      email: 'a@b.com',
      username: 'newuser',
      password: 'pass123',
      role: 'Client',
    });
    expect(result).toEqual(response);
  });
});

describe('forgotPasswordApi', () => {
  it('should POST to /auth/forgot-password and return message', async () => {
    const response = { message: 'If the email exists, a reset code has been sent' };
    mockPost.mockResolvedValue({ data: response });

    const result = await forgotPasswordApi({ email: 'a@b.com' });

    expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'a@b.com',
    });
    expect(result).toEqual(response);
  });
});

describe('resetPasswordApi', () => {
  it('should POST to /auth/reset-password and return message', async () => {
    const response = { message: 'Password has been reset successfully' };
    mockPost.mockResolvedValue({ data: response });

    const result = await resetPasswordApi({
      email: 'a@b.com',
      code: '123456',
      newPassword: 'newpass',
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', {
      email: 'a@b.com',
      code: '123456',
      newPassword: 'newpass',
    });
    expect(result).toEqual(response);
  });
});

describe('logoutApi', () => {
  it('should POST to /auth/logout', async () => {
    mockPost.mockResolvedValue({ data: undefined });

    await logoutApi();

    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });

  it('should propagate errors', async () => {
    mockPost.mockRejectedValue(new Error('Network Error'));

    await expect(logoutApi()).rejects.toThrow('Network Error');
  });
});

describe('getPresignedUrlApi', () => {
  it('should POST to /auth/presigned-url with purpose and fileType', async () => {
    const response = {
      presignedUrl: 'https://r2.cloudflarestorage.com/upload',
      publicUrl: 'https://cdn.gymmi.com/article-covers/xyz.jpg',
      key: 'article-covers/xyz.jpg',
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await getPresignedUrlApi({
      fileType: 'image/jpeg',
      purpose: 'article-cover',
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/presigned-url', {
      fileType: 'image/jpeg',
      purpose: 'article-cover',
    });
    expect(result).toEqual(response);
  });
});
