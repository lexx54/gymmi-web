import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  uploadImageDirectly,
  uploadExerciseImage,
  optimizeImage,
  R2_CACHE_CONTROL,
  EXERCISE_IMAGE_MAX_BYTES,
} from './imageUpload';
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

  it('accepts image/heic and image/heif types', async () => {
    const heicFile = new File(['dummy'], 'photo.heic', { type: 'image/heic' });
    vi.mocked(authApi.getPresignedUrlApi).mockResolvedValue({
      presignedUrl: 'https://r2.cloudflarestorage.com/upload/avatars/123.heic',
      publicUrl: 'https://cdn.gymmi.com/avatars/123.heic',
      key: 'avatars/123.heic',
    });
    vi.mocked(axios.put).mockResolvedValue({ status: 200 } as any);

    const url = await uploadImageDirectly(heicFile, 'avatar');
    expect(url).toBe('https://cdn.gymmi.com/avatars/123.heic');
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

describe('exercise image optimization', () => {
  const OriginalImage = globalThis.Image;
  const encodeCalls: Array<{ type: string; quality: number; width: number }> = [];

  /** Stubs canvas encoding so blob size comes from `sizeFor`. */
  function stubEncoder(
    sizeFor: (type: string, quality: number, width: number) => number,
    supportsWebp = true,
  ) {
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (
      this: HTMLCanvasElement,
      cb: BlobCallback,
      type?: string,
      quality?: number,
    ) {
      const outType = type === 'image/webp' && !supportsWebp ? 'image/png' : (type ?? 'image/png');
      encodeCalls.push({ type: outType, quality: quality ?? 1, width: this.width });
      cb(new Blob([new Uint8Array(sizeFor(outType, quality ?? 1, this.width))], { type: outType }));
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    encodeCalls.length = 0;
    globalThis.Image = class {
      width = 4000;
      height = 3000;
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onload(), 0);
      }
    } as any;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
    } as any);
  });

  afterEach(() => {
    globalThis.Image = OriginalImage;
  });

  it('re-encodes as WebP capped at 1600px on the longest edge', async () => {
    stubEncoder(() => 200_000);
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });

    const blob = await optimizeImage(file, EXERCISE_IMAGE_MAX_BYTES);

    expect(blob.type).toBe('image/webp');
    expect(encodeCalls).toEqual([{ type: 'image/webp', quality: 0.82, width: 1600 }]);
  });

  it('falls back to JPEG when the browser cannot encode WebP', async () => {
    stubEncoder(() => 200_000, false);
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    const blob = await optimizeImage(file, EXERCISE_IMAGE_MAX_BYTES);

    expect(blob.type).toBe('image/jpeg');
  });

  it('lowers quality, then dimensions, until the image fits', async () => {
    stubEncoder((_type, quality, width) => (width <= 1280 && quality <= 0.7 ? 900_000 : 1_500_000));
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });

    const blob = await optimizeImage(file, EXERCISE_IMAGE_MAX_BYTES);

    expect(blob.size).toBe(900_000);
    expect(encodeCalls.map(({ width, quality }) => [width, quality])).toEqual([
      [1600, 0.82],
      [1600, 0.7],
      [1600, 0.6],
      [1280, 0.82],
      [1280, 0.7],
    ]);
  });

  it('uploads optimized exercise photos with the exercise-image purpose', async () => {
    stubEncoder(() => 300_000);
    vi.mocked(authApi.getPresignedUrlApi).mockResolvedValue({
      presignedUrl: 'https://r2.cloudflarestorage.com/upload/exercise-images/1.webp',
      publicUrl: 'https://cdn.gymmi.com/exercise-images/1.webp',
      key: 'exercise-images/1.webp',
    });
    vi.mocked(axios.put).mockResolvedValue({ status: 200 });

    const url = await uploadExerciseImage(new File(['x'], 'bench.jpg', { type: 'image/jpeg' }));

    expect(authApi.getPresignedUrlApi).toHaveBeenCalledWith({
      fileType: 'image/webp',
      purpose: 'exercise-image',
    });
    expect(url).toBe('https://cdn.gymmi.com/exercise-images/1.webp');
  });

  it('rejects photos that stay over 1MB after optimizing', async () => {
    stubEncoder(() => EXERCISE_IMAGE_MAX_BYTES + 1);

    await expect(
      uploadExerciseImage(new File(['x'], 'huge.jpg', { type: 'image/jpeg' })),
    ).rejects.toThrow('FILE_TOO_LARGE');
    expect(authApi.getPresignedUrlApi).not.toHaveBeenCalled();
  });

  it('rejects non-image files', async () => {
    await expect(
      uploadExerciseImage(new File(['x'], 'notes.txt', { type: 'text/plain' })),
    ).rejects.toThrow('INVALID_FILE_TYPE');
  });
});
