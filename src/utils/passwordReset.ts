import type { AxiosError } from 'axios';

/** Matches the API's per-account resend cooldown. */
export const RESEND_COOLDOWN_SECONDS = 60;

/** Maps a password-reset failure to a user-facing message key. */
export const resolveResetErrorKey = (error: unknown): string => {
  const status = (error as AxiosError)?.response?.status;
  if (status === 400) return 'auth.forgot.invalidCode';
  if (status === 429) return 'auth.forgot.tooManyAttempts';
  return 'auth.forgot.failed';
};
