import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlusUpsellModal } from './PlusUpsellModal';

describe('PlusUpsellModal', () => {
  it('renders API limit details and closes accessibly', () => {
    const onClose = vi.fn();
    const { asFragment } = render(
      <PlusUpsellModal
        isOpen
        details={{
          code: 'PLAN_LIMIT',
          resource: 'templates',
          message: 'Free includes two routines.',
          limit: 2,
          usage: 2,
        }}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Unlock more with Plus');
    expect(screen.getByText('Free includes two routines.')).toBeInTheDocument();
    expect(screen.getByText('2 of 2 used')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(asFragment()).toMatchSnapshot();
  });
});
