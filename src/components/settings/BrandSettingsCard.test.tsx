import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandSettingsCard } from './BrandSettingsCard';
import type { FullUserProfile } from '../../types/auth';

const mutate = vi.fn();
const useEntitlements = vi.fn();

vi.mock('../../hooks/useUserProfile', () => ({
  useUpdateUserProfile: () => ({ mutate, isPending: false }),
}));
vi.mock('../../hooks/usePermissions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../hooks/usePermissions')>()),
  useEntitlements: () => useEntitlements(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const profile = (brand: { brandName?: string | null; brandColor?: string | null } = {}) =>
  ({
    username: 'coachalex',
    trainerProfile: {
      id: 'tp',
      description: 'Strength coach',
      monthlyPrice: 40,
      specializations: [],
      gyms: [],
      logoUrl: null,
      brandName: null,
      brandColor: null,
      ...brand,
    },
  }) as unknown as FullUserProfile;

const renderCard = (userProfile: FullUserProfile) =>
  render(
    <MemoryRouter>
      <BrandSettingsCard userProfile={userProfile} />
    </MemoryRouter>,
  );

describe('BrandSettingsCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('locks the fields for a Plus coach and opens the Coach Pro upsell', () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canBrand: false } }, plan: 'plus' });
    renderCard(profile());

    expect(screen.getByPlaceholderText('e.g. Iron Coaching')).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Unlock with Coach Pro' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Unlock more with Pro');
    expect(within(dialog).getByText('Custom branding is included with Coach Pro.')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('previews and saves the brand for a Pro coach', () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canBrand: true } }, plan: 'pro' });
    renderCard(profile());

    // Defaults: username and Gymmi red.
    expect(screen.getByTestId('brand-band')).toHaveTextContent('Coached by coachalex');

    fireEvent.change(screen.getByPlaceholderText('e.g. Iron Coaching'), { target: { value: '  Iron Coaching ' } });
    fireEvent.click(screen.getByRole('radio', { name: '#0b3d91' }));
    expect(screen.getByTestId('brand-band')).toHaveTextContent('Coached by Iron Coaching');
    expect(screen.getByTestId('brand-band')).toHaveStyle({ backgroundColor: '#0b3d91' });

    fireEvent.click(screen.getByRole('button', { name: 'Save brand' }));
    expect(mutate).toHaveBeenCalledWith(
      { trainerProfile: { brandName: 'Iron Coaching', brandColor: '#0b3d91' } },
      expect.any(Object),
    );
  });

  it('saves the default color as "not customized"', () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canBrand: true } }, plan: 'pro' });
    renderCard(profile({ brandName: 'Iron Coaching', brandColor: '#0b3d91' }));

    fireEvent.click(screen.getByRole('button', { name: 'Reset to default' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save brand' }));
    expect(mutate).toHaveBeenCalledWith(
      { trainerProfile: { brandName: null, brandColor: null } },
      expect.any(Object),
    );
  });

  it('rejects a one-letter brand name', () => {
    useEntitlements.mockReturnValue({ data: { capabilities: { canBrand: true } }, plan: 'pro' });
    renderCard(profile());

    fireEvent.change(screen.getByPlaceholderText('e.g. Iron Coaching'), { target: { value: 'X' } });
    expect(screen.getByText('Use 2 to 60 characters.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save brand' })).toBeDisabled();
  });
});
