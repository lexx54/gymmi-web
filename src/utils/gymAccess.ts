import { toast } from 'sonner';
import type { TFunction } from 'i18next';
import { getApiErrorMessage, isPaymentRequiredError } from '../services/api/errors';

/**
 * Shows an API error as a toast. When it's the "gym trial ended" 402, adds a
 * "Choose a plan" action that opens billing.
 */
export function toastGymActionError(
  error: unknown,
  t: TFunction,
  navigate: (path: string) => void,
): void {
  const message = getApiErrorMessage(error, t('common.error'));
  if (isPaymentRequiredError(error)) {
    toast.error(message, {
      action: { label: t('gym.choosePlan', 'Choose a plan'), onClick: () => navigate('/billing') },
    });
    return;
  }
  toast.error(message);
}

/** Toast shown before calling the API when we already know access is paused. */
export function toastGymAccessPaused(t: TFunction, navigate: (path: string) => void): void {
  toast.error(
    t('gym.accessPaused', 'Trial ended — choose a plan to keep adding members, routines and articles'),
    { action: { label: t('gym.choosePlan', 'Choose a plan'), onClick: () => navigate('/billing') } },
  );
}
