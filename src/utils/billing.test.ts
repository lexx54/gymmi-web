import { describe, it, expect } from 'vitest';
import { formatVes, isBelowActivePlan, isVesMethod, planLabel, toVes } from './billing';

describe('billing utils', () => {
  it('converts USD to Bolívares like the API', () => {
    expect(toVes(2.99, 889.2553)).toBe(2658.87);
  });

  it('formats Bolívares with Venezuelan separators', () => {
    expect(formatVes(25503.84)).toBe('Bs. 25.503,84');
  });

  it('tells smaller plans apart from the active one', () => {
    expect(isBelowActivePlan('plus', 'pro')).toBe(true);
    expect(isBelowActivePlan('pro', 'pro')).toBe(false);
    expect(isBelowActivePlan('maximum', 'pro')).toBe(false);
    expect(isBelowActivePlan('plus', null)).toBe(false);
  });

  it('knows which methods are paid in Bolívares', () => {
    expect(isVesMethod('pago_movil')).toBe(true);
    expect(isVesMethod('bank_transfer')).toBe(true);
    expect(isVesMethod('zelle')).toBe(false);
  });

  it('labels plans', () => {
    expect(planLabel('maximum')).toBe('Maximum');
  });
});
