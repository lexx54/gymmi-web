import '@testing-library/jest-dom/vitest';
import i18n from './i18n';

// The app defaults to Spanish; unit tests assert the English copy.
void i18n.changeLanguage('en');
