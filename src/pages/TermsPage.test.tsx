import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import i18n from 'i18next';
import { TermsPage } from './TermsPage';
import { LEGAL_CONFIG } from '../constants/legal.constants';

const renderTerms = () =>
  render(
    <MemoryRouter initialEntries={['/terms']}>
      <TermsPage />
    </MemoryRouter>,
  );

describe('TermsPage', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders the title, last updated date, and every section in the table of contents', () => {
    renderTerms();

    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.getByText(/Last updated: October 21, 2026/)).toBeInTheDocument();

    const toc = screen.getByLabelText('Contents', { selector: 'nav' });
    const tocLinks = within(toc).getAllByRole('link', { hidden: true });
    expect(tocLinks).toHaveLength(20);
    expect(tocLinks[0]).toHaveAttribute('href', '#acceptance');
  });

  it('includes store-required clauses with interpolated legal values', () => {
    renderTerms();

    expect(screen.getByRole('heading', { name: /Health and fitness disclaimer/ })).toBeInTheDocument();
    expect(screen.getByText(/zero tolerance for objectionable content/i)).toBeInTheDocument();
    expect(screen.getByText(/third-party beneficiaries of these Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 14 years old/)).toBeInTheDocument();
    expect(screen.getByText(/the Bolivarian Republic of Venezuela/)).toBeInTheDocument();
    expect(screen.queryByText(/\{\{/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: LEGAL_CONFIG.contactEmail })).toHaveAttribute(
      'href',
      `mailto:${LEGAL_CONFIG.contactEmail}`,
    );
  });

  it('switches the terms to Spanish', async () => {
    const user = userEvent.setup();
    renderTerms();

    await user.click(screen.getByRole('button', { name: /EN/ }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Términos de Servicio' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/la República Bolivariana de Venezuela/)).toBeInTheDocument();
  });
});
