import { describe, expect, it } from 'vitest';
import { getActivationTier } from './exerciseBodyMapUtils';

const activations = {
  primary: 'Quads',
  secondary: 'Glutes',
  stabilizers: 'Calves',
};

describe('getActivationTier', () => {
  it('maps canonical catalog names to their activation hierarchy', () => {
    expect(getActivationTier('Quads', activations)).toBe('primary');
    expect(getActivationTier('Glutes', activations)).toBe('secondary');
    expect(getActivationTier('Calves', activations)).toBe('stabilizers');
    expect(getActivationTier('Chest', activations)).toBeUndefined();
  });

  it('matches canonical names independently of display casing and whitespace', () => {
    expect(getActivationTier('  quads ', activations)).toBe('primary');
  });

  it('uses primary before secondary and stabilizers for duplicate values', () => {
    expect(
      getActivationTier('Quads', {
        primary: 'Quads',
        secondary: 'Quads',
        stabilizers: 'Quads',
      }),
    ).toBe('primary');
  });
});
