import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandBand } from './BrandBand';

describe('BrandBand', () => {
  it('shows "Coached by" with the brand colors for a coach', () => {
    render(
      <BrandBand
        brand={{ kind: 'trainer', name: 'Iron Coaching', logoUrl: null, color: '#0b3d91', textColor: '#ffffff' }}
      />,
    );
    const band = screen.getByTestId('brand-band');
    expect(band).toHaveTextContent('Coached by Iron Coaching');
    expect(band).toHaveStyle({ backgroundColor: '#0b3d91', color: '#ffffff' });
    expect(band).toHaveTextContent('I');
  });

  it('labels gym routines with the gym name and shows the logo', () => {
    const { container } = render(
      <BrandBand
        variant="chip"
        brand={{ kind: 'gym', name: 'Iron Yard', logoUrl: 'https://cdn/logo.png', color: '#ffd60a', textColor: '#111111' }}
      />,
    );
    expect(screen.getByTestId('brand-band')).toHaveTextContent('Iron Yard routine');
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://cdn/logo.png');
  });
});
