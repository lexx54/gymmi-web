import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { uploadImageDirectly, R2_CACHE_CONTROL } from './imageUpload';
import * as authApi from '../services/api/auth';

const mockInstance: any = vi.fn();
mockInstance.interceptors = {
  request: { use: vi.fn() },
  response: { use: vi.fn() },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockInstance),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('../services/api/auth', () => ({
  getPresignedUrlApi: vi.fn(),
}));

describe('imageUpload utils', () => {
  const OriginalImage = globalThis.Image;

  beforeEach(() => {
    vi.clearAllMocks();

    // Stub Image & Canvas to simulate fast browser image compression in Vitest
    globalThis.Image = class {
      width = 500;
      height = 500;
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onload(), 0);
      }
    } as any;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as any);

    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      (cb: any) => {
        cb(new Blob(['compressed'], { type: 'image/jpeg' }));
      },
    );
  });

  afterEach(() => {
    globalThis.Image = OriginalImage;
  });

  it('rejects invalid file types', async () => {
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    await expect(uploadImageDirectly(file, 'avatar')).rejects.toThrow(
      'INVALID_FILE_TYPE',
    );
  });

  it('uploads valid image directly with Cache-Control header and correct purpose', async () => {
    const file = new File(['image-bytes'], 'gym-cover.jpg', {
      type: 'image/jpeg',
    });

    vi.mocked(authApi.getPresignedUrlApi).mockResolvedValue({
      presignedUrl: 'https://r2.cloudflarestorage.com/upload/gym-covers/123.jpg',
      publicUrl: 'https://cdn.gymmi.com/gym-covers/123.jpg',
      key: 'gym-covers/123.jpg',
    });

    vi.mocked(axios.put).mockResolvedValue({ status: 200 });

    const publicUrl = await uploadImageDirectly(file, 'gym-cover');

    expect(authApi.getPresignedUrlApi).toHaveBeenCalledWith({
      fileType: 'image/jpeg',
      purpose: 'gym-cover',
    });

    expect(axios.put).toHaveBeenCalledWith(
      'https://r2.cloudflarestorage.com/upload/gym-covers/123.jpg',
      expect.anything(),
      {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': R2_CACHE_CONTROL,
        },
      },
    );

    expect(publicUrl).toBe('https://cdn.gymmi.com/gym-covers/123.jpg');
  });

  it('supports article-cover and gym-logo without workaround mapping', async () => {
    const file = new File(['image-bytes'], 'article.png', {
      type: 'image/png',
    });

    vi.mocked(authApi.getPresignedUrlApi).mockResolvedValue({
      presignedUrl:
        'https://r2.cloudflarestorage.com/upload/article-covers/art.png',
      publicUrl: 'https://cdn.gymmi.com/article-covers/art.png',
      key: 'article-covers/art.png',
    });

    vi.mocked(axios.put).mockResolvedValue({ status: 200 });

    const publicUrl = await uploadImageDirectly(file, 'article-cover');

    expect(authApi.getPresignedUrlApi).toHaveBeenCalledWith({
      fileType: 'image/jpeg', // toBlob produces image/jpeg
      purpose: 'article-cover',
    });

    expect(publicUrl).toBe('https://cdn.gymmi.com/article-covers/art.png');
  });
});
