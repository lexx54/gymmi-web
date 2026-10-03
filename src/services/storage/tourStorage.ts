export const TOUR_SEEN_KEY_PREFIX = '@gymmi:tour_seen_';

/**
 * Checks whether the user has already viewed the web onboarding tour.
 */
export function hasSeenUserTour(userId?: string | null): boolean {
  if (!userId) return false;
  try {
    return localStorage.getItem(`${TOUR_SEEN_KEY_PREFIX}${userId}`) === 'true';
  } catch {
    return false;
  }
}

/**
 * Marks the tour as completed for the specified user.
 */
export function markUserTourSeen(userId?: string | null): void {
  if (!userId) return;
  try {
    localStorage.setItem(`${TOUR_SEEN_KEY_PREFIX}${userId}`, 'true');
  } catch {
    // Non-fatal if localStorage is restricted
  }
}

/**
 * Resets the tour state for the specified user (e.g. from Settings).
 */
export function resetUserTour(userId?: string | null): void {
  if (!userId) return;
  try {
    localStorage.removeItem(`${TOUR_SEEN_KEY_PREFIX}${userId}`);
  } catch {
    // Non-fatal
  }
}
