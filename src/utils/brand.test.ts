import { describe, expect, it } from 'vitest';
import { isBrandColor, readableTextColor } from './brand';

describe('brand utils', () => {
  it('validates #RRGGBB colors', () => {
    expect(isBrandColor('#0b3d91')).toBe(true);
    expect(isBrandColor('#0B3D91')).toBe(true);
    expect(isBrandColor('0b3d91')).toBe(false);
    expect(isBrandColor('#fff')).toBe(false);
  });

  it('matches the API: white on strong colors, dark on light ones', () => {
    expect(readableTextColor('#ef233c')).toBe('#ffffff');
    expect(readableTextColor('#0b3d91')).toBe('#ffffff');
    expect(readableTextColor('#ffd60a')).toBe('#111111');
    expect(readableTextColor('#e5e7eb')).toBe('#111111');
  });
});
