import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FacilityProfileCard } from './FacilityProfileCard';

const mutate = vi.fn();
const useEntitlements = vi.fn();
const gym = {
  id: 'gym-1',
  userId: 'u',
  name: 'Iron Yard',
  description: 'Downtown',
  city: 'Caracas',
  address: '',
  websiteUrl: null,
  phoneNumber: '',
  logoUrl: null,
  coverUrl: null,
  brandColor: null,
  tier: 'pro',
};

vi.mock('../../hooks/useGyms', () => ({
  useMyGym: () => ({ data: { gym } }),
  useUpdateMyGym: () => ({ mutate, isPending: false }),
}));
vi.mock('../../hooks/usePermissions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../hooks/usePermissions')>()),
  useEntitlements: () => useEntitlements(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const renderCard = () =>
  render(
    <MemoryRouter>
      <FacilityProfileCard />
    </MemoryRouter>,
  );

describe('FacilityProfileCard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lets any gym edit its profile without touching the brand color', () => {
    useEntitlements.mockReturnValue({ data: { gymTier: 'pro', capabilities: { canBrand: false } }, plan: 'free' });
    renderCard();

    expect(screen.getByDisplayValue('Iron Yard')).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('Downtown'), { target: { value: 'Downtown, open 24/7' } });
    fireEvent.click(screen.getByTestId('save-facility-profile'));

    const payload = mutate.mock.calls[0][0];
    expect(payload).toMatchObject({ name: 'Iron Yard', description: 'Downtown, open 24/7' });
    expect(payload).not.toHaveProperty('brandColor');
  });

  it('points a Gym Pro at Gym Maximum to unlock the brand color', () => {
    useEntitlements.mockReturnValue({ data: { gymTier: 'pro', capabilities: { canBrand: false } }, plan: 'free' });
    renderCard();

    expect(screen.getByRole('radio', { name: '#0b3d91' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Unlock with Gym Maximum' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Upgrade your gym plan');
    expect(within(dialog).getByText('Gym Maximum')).toBeInTheDocument();
    expect(within(dialog).getByText('Your logo and color on member routines and PDFs')).toBeInTheDocument();
  });

  it('saves the brand color on Gym Maximum and previews it for members', () => {
    useEntitlements.mockReturnValue({ data: { gymTier: 'maximum', capabilities: { canBrand: true } }, plan: 'free' });
    renderCard();

    fireEvent.click(screen.getByRole('radio', { name: '#ffd60a' }));
    expect(screen.getByTestId('brand-band')).toHaveStyle({ backgroundColor: '#ffd60a', color: '#111111' });
    fireEvent.click(screen.getByTestId('save-facility-profile'));
    expect(mutate.mock.calls[0][0]).toMatchObject({ brandColor: '#ffd60a' });
  });
});
