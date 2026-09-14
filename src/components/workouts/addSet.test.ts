import { describe, expect, it } from 'vitest';
import { isInSupersetAddGroup } from './addSet';

describe('isInSupersetAddGroup', () => {
  const red = { id: 'a', supersetColor: '#ff535a' };
  const redPartner = { id: 'b', supersetColor: '#ff535a' };
  const blue = { id: 'c', supersetColor: '#55c2ff' };
  const solo = { id: 'd', supersetColor: null };

  it('always includes the source exercise', () => {
    expect(isInSupersetAddGroup(solo, solo)).toBe(true);
    expect(isInSupersetAddGroup(red, red)).toBe(true);
  });

  it('includes partners that share the source superset color', () => {
    expect(isInSupersetAddGroup(redPartner, red)).toBe(true);
  });

  it('excludes other colors and ungrouped exercises', () => {
    expect(isInSupersetAddGroup(blue, red)).toBe(false);
    expect(isInSupersetAddGroup(solo, red)).toBe(false);
    expect(isInSupersetAddGroup(red, solo)).toBe(false);
  });
});
