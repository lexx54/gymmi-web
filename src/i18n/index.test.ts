import { describe, it, expect, afterEach } from 'vitest';
import { DEFAULT_LANGUAGE, getStoredLanguage, LANGUAGE_STORAGE_KEY } from './index';

afterEach(() => {
  localStorage.removeItem(LANGUAGE_STORAGE_KEY);
});

describe('getStoredLanguage', () => {
  it('defaults to Spanish when nothing is saved', () => {
    expect(DEFAULT_LANGUAGE).toBe('es');
    expect(getStoredLanguage()).toBe('es');
  });

  it('ignores invalid saved values', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
    expect(getStoredLanguage()).toBe('es');
  });

  it('uses the saved choice', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    expect(getStoredLanguage()).toBe('en');
  });
});
