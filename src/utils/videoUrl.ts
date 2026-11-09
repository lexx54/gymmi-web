/** Mirrors `MAX_EXERCISE_VIDEO_URL` in the API exercise entity. */
export const MAX_EXERCISE_VIDEO_URL = 500;

/**
 * Returns the trimmed URL when it is an absolute http(s) link with a real
 * host (same rule as the API), otherwise `null`. Use it before rendering any
 * stored link as an `href` so `javascript:` and similar schemes never reach the DOM.
 */
export function toSafeVideoUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length > MAX_EXERCISE_VIDEO_URL) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.')) return null;
    return trimmed;
  } catch {
    return null;
  }
}
