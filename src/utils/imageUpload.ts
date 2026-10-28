import axios from 'axios';
import { getPresignedUrlApi } from '../services/api/auth';

export const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<Blob> {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.82 } = options;

  // In test environments or SSR where canvas/Image is absent, return original file
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof Image === 'undefined' ||
    !document.createElement
  ) {
    return file;
  }

  return new Promise((resolve, reject) => {
    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      // If createObjectURL fails (e.g., in some test environments), return file
      resolve(file);
      return;
    }

    const img = new Image();

    img.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      let { width, height } = img;
      if (!width || !height) {
        resolve(file);
        return;
      }

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      try {
        ctx.drawImage(img, 0, 0, width, height);
      } catch {
        resolve(file);
        return;
      }

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      if (typeof canvas.toBlob !== 'function') {
        resolve(file);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        mimeType,
        quality,
      );
    };

    img.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
}

export type UploadImagePurpose =
  | 'avatar'
  | 'trainer-logo'
  | 'gym-cover'
  | 'gym-logo'
  | 'article-cover'
  | 'payment-receipt'
  | 'exercise-image';

export const R2_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export async function uploadImageDirectly(
  file: File,
  purpose: UploadImagePurpose,
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('INVALID_FILE_TYPE');
  }

  const compressedBlob = await compressImage(file);

  if (compressedBlob.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('FILE_TOO_LARGE');
  }

  return putImageBlob(compressedBlob, file.type, purpose);
}

type UploadFileType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic' | 'image/heif';

/**
 * Requests a presigned URL for `purpose` and PUTs the blob to storage.
 * Returns the public URL of the stored object.
 */
async function putImageBlob(
  blob: Blob,
  fallbackType: string,
  purpose: UploadImagePurpose,
): Promise<string> {
  const rawType = blob.type || fallbackType;
  const fileType = (rawType === 'image/jpg' ? 'image/jpeg' : rawType) as UploadFileType;

  const { presignedUrl, publicUrl } = await getPresignedUrlApi({
    fileType,
    purpose,
  });

  await axios.put(presignedUrl, blob, {
    headers: {
      'Content-Type': fileType,
      'Cache-Control': R2_CACHE_CONTROL,
    },
  });

  return publicUrl;
}

export const MAX_EXERCISE_IMAGES = 3;
export const EXERCISE_IMAGE_MAX_BYTES = 1024 * 1024; // 1MB

/** Longest-edge sizes tried in order until the encoded image fits. */
const OPTIMIZE_DIMENSIONS = [1600, 1280, 1024, 800];
/** Encoder qualities tried at each size before shrinking further. */
const OPTIMIZE_QUALITIES = [0.82, 0.7, 0.6];

function loadImage(file: File): Promise<HTMLImageElement | null> {
  return new Promise((resolve, reject) => {
    let objectUrl: string;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };
    img.src = objectUrl;
  });
}

function encodeImage(
  img: HTMLImageElement,
  maxDimension: number,
  mimeType: 'image/webp' | 'image/jpeg',
  quality: number,
): Promise<Blob | null> {
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof canvas.toBlob !== 'function') {
    return Promise.resolve(null);
  }
  if (mimeType === 'image/jpeg') {
    // JPEG has no alpha channel; keep transparent areas from turning black.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

/**
 * Re-encodes an image as WebP (JPEG where the browser cannot encode WebP),
 * stepping down quality and then dimensions until it fits in `maxBytes`.
 * Re-encoding also strips EXIF metadata such as GPS location. Returns the
 * smallest encoding found, or the original file when the browser cannot
 * decode/encode it.
 */
export async function optimizeImage(file: File, maxBytes: number): Promise<Blob> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return file;
  }

  const img = await loadImage(file);
  if (!img || !img.width || !img.height) {
    return file;
  }

  let mimeType: 'image/webp' | 'image/jpeg' = 'image/webp';
  let smallest: Blob | null = null;

  for (const dimension of OPTIMIZE_DIMENSIONS) {
    for (const quality of OPTIMIZE_QUALITIES) {
      let blob = await encodeImage(img, dimension, mimeType, quality);
      if (blob && mimeType === 'image/webp' && blob.type !== 'image/webp') {
        // Browsers without a WebP encoder silently fall back to PNG.
        mimeType = 'image/jpeg';
        blob = await encodeImage(img, dimension, mimeType, quality);
      }
      if (!blob) {
        return smallest ?? file;
      }
      if (!smallest || blob.size < smallest.size) {
        smallest = blob;
      }
      if (blob.size <= maxBytes) {
        return blob;
      }
    }
  }

  return smallest ?? file;
}

/**
 * Optimizes an exercise photo to at most 1MB and uploads it.
 * Throws `INVALID_FILE_TYPE` or `FILE_TOO_LARGE` for rejected files.
 */
export async function uploadExerciseImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('INVALID_FILE_TYPE');
  }

  const optimized = await optimizeImage(file, EXERCISE_IMAGE_MAX_BYTES);

  if (optimized.size > EXERCISE_IMAGE_MAX_BYTES) {
    throw new Error('FILE_TOO_LARGE');
  }

  return putImageBlob(optimized, file.type, 'exercise-image');
}
