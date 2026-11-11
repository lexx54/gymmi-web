import type { PaymentMethod } from '../types/payments';

/** Higher rank = bigger plan; mirrors the API's PLAN_RANK. */
export const PLAN_RANK: Record<string, number> = { plus: 1, pro: 2, maximum: 3 };

/** Methods paid in Bolívares at the BCV rate. */
export const VES_METHODS: PaymentMethod[] = ['pago_movil', 'bank_transfer'];

export const isVesMethod = (method: PaymentMethod | undefined | null): boolean =>
  Boolean(method && VES_METHODS.includes(method));

/** True when `planId` is smaller than the plan the user currently has active. */
export function isBelowActivePlan(planId: string, activePlanId: string | null): boolean {
  if (!activePlanId) return false;
  return (PLAN_RANK[planId] ?? 0) < (PLAN_RANK[activePlanId] ?? 0);
}

/** Bolívar amount at the given BCV rate, rounded to cents (same as the API). */
export function toVes(amountUsd: number, rate: number): number {
  return Math.round(amountUsd * rate * 100) / 100;
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const ves = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rateFormat = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

export const formatUsd = (amount: number): string => usd.format(amount);
export const formatVes = (amount: number): string => `Bs. ${ves.format(amount)}`;
export const formatRate = (rate: number): string => rateFormat.format(rate);

/** "plus" → "Plus" */
export const planLabel = (plan: string): string =>
  plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase() : '';

/** Caracas calendar date (UTC−4, no DST) as YYYY-MM-DD; matches the API. */
export const caracasToday = (now: Date = new Date()): string =>
  new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString().slice(0, 10);

/**
 * Accepts "481.25", "481,25" and BCV-style "1.234,56". Returns null if not a
 * positive number.
 */
export const parseRateInput = (text: string): number | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed;
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : null;
};

/**
 * While a paid plan is active, renewing or changing plans opens only in its
 * last this-many days. Mirrors RENEWAL_WINDOW_DAYS in the API.
 */
export const RENEWAL_WINDOW_DAYS = 5;

export const DAY_MS = 24 * 60 * 60 * 1000;
