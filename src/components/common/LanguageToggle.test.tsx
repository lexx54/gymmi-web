import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { LANGUAGE_STORAGE_KEY } from '../../i18n';
import { LanguageToggle } from './LanguageToggle';

afterEach(async () => {
  await i18n.changeLanguage('en');
  localStorage.removeItem(LANGUAGE_STORAGE_KEY);
});

describe('LanguageToggle', () => {
  it('shows the active language and switches to Spanish', async () => {
    const user = userEvent.setup();
    render(<LanguageToggle />);

    const button = screen.getByRole('button', { name: 'Change language to Spanish' });
    expect(button).toHaveTextContent('EN');

    await user.click(button);

    expect(i18n.language).toBe('es');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(
      await screen.findByRole('button', { name: 'Cambiar idioma a Inglés' }),
    ).toHaveTextContent('ES');
  });

  it('switches back to English', async () => {
    await i18n.changeLanguage('es');
    const user = userEvent.setup();
    render(<LanguageToggle />);

    await user.click(screen.getByRole('button', { name: 'Cambiar idioma a Inglés' }));

    expect(i18n.language).toBe('en');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });
});
