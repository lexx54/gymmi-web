import { describe, it, expect, beforeEach } from 'vitest';
import {
  hasSeenUserTour,
  markUserTourSeen,
  resetUserTour,
  TOUR_SEEN_KEY_PREFIX,
} from './tourStorage';

describe('tourStorage (web)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when userId is not provided', () => {
    expect(hasSeenUserTour(undefined)).toBe(false);
    expect(hasSeenUserTour(null)).toBe(false);
    expect(hasSeenUserTour('')).toBe(false);
  });

  it('returns false initially for an unseen user', () => {
    expect(hasSeenUserTour('user-123')).toBe(false);
  });

  it('marks tour as seen for specific user', () => {
    markUserTourSeen('user-123');
    expect(hasSeenUserTour('user-123')).toBe(true);
    expect(localStorage.getItem(`${TOUR_SEEN_KEY_PREFIX}user-123`)).toBe('true');
    // Ensure another user is not marked
    expect(hasSeenUserTour('user-456')).toBe(false);
  });

  it('resets tour seen state for a specific user', () => {
    markUserTourSeen('user-123');
    expect(hasSeenUserTour('user-123')).toBe(true);
    resetUserTour('user-123');
    expect(hasSeenUserTour('user-123')).toBe(false);
  });

  it('handles null safely in mark and reset', () => {
    expect(() => markUserTourSeen(null)).not.toThrow();
    expect(() => resetUserTour(null)).not.toThrow();
  });
});
