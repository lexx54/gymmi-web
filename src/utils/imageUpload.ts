import axios from 'axios';
import { getPresignedUrlApi } from '../services/api/auth';

export const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
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

export async function uploadImageDirectly(
  file: File,
  purpose: 'avatar' | 'trainer-logo',
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('INVALID_FILE_TYPE');
  }

  const compressedBlob = await compressImage(file);

  if (compressedBlob.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('FILE_TOO_LARGE');
  }

  const fileType = (compressedBlob.type || file.type) as
    | 'image/jpeg'
    | 'image/png'
    | 'image/webp';

  const { presignedUrl, publicUrl } = await getPresignedUrlApi({
    fileType,
    purpose,
  });

  await axios.put(presignedUrl, compressedBlob, {
    headers: {
      'Content-Type': fileType,
    },
  });

  return publicUrl;
}
