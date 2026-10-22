import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import i18n from 'i18next';
import { PrivacyPage } from './PrivacyPage';
import { LEGAL_CONFIG } from '../constants/legal.constants';

const renderPrivacy = () =>
  render(
    <MemoryRouter initialEntries={['/privacy']}>
      <PrivacyPage />
    </MemoryRouter>,
  );

describe('PrivacyPage', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders the title, last updated date, and every section in the table of contents', () => {
    renderPrivacy();

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(/Last updated: October 21, 2026/)).toBeInTheDocument();

    // The table of contents is display:none below 960px (jsdom's width), which
    // removes it from the accessibility tree, so find it by its label instead.
    const toc = screen.getByLabelText('Contents', { selector: 'nav' });
    const tocLinks = within(toc).getAllByRole('link', { hidden: true });
    expect(tocLinks).toHaveLength(15);
    expect(tocLinks[0]).toHaveAttribute('href', '#intro');
  });

  it('includes store-required disclosures with interpolated legal values', () => {
    renderPrivacy();

    expect(screen.getByRole('heading', { name: /Data we collect/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Deleting your account/ })).toBeInTheDocument();
    expect(screen.getByText(/Cloudflare R2, which stores the images you upload/)).toBeInTheDocument();
    expect(screen.getByText(/We do not send your personal data to Gemini/)).toBeInTheDocument();
    expect(screen.getByText(/We do not sell your personal data/)).toBeInTheDocument();
    expect(screen.getByText(/at least 14 years old/)).toBeInTheDocument();
    expect(screen.queryByText(/\{\{/)).not.toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(LEGAL_CONFIG.contactEmail)).length).toBeGreaterThan(1);
    expect(screen.getByRole('link', { name: LEGAL_CONFIG.contactEmail })).toHaveAttribute(
      'href',
      `mailto:${LEGAL_CONFIG.contactEmail}`,
    );
  });

  it('switches the policy to Spanish', async () => {
    const user = userEvent.setup();
    renderPrivacy();

    await user.click(screen.getByRole('button', { name: /EN/ }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Política de Privacidad' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Eliminar tu cuenta/ })).toBeInTheDocument();
    expect(screen.getByText(/la República Bolivariana de Venezuela/)).toBeInTheDocument();
  });
});
