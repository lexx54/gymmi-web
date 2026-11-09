import type { GymTier } from '../types/gym';

export type BillingCadence = 'monthly' | 'annual';

export interface PricingFeature {
  textKey: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: 'free' | 'plus' | 'pro' | 'maximum';
  badgeKey?: string;
  monthlyPrice: number;
  annualPrice: number;
  disabled?: boolean;
  ctaKey: string;
  features: PricingFeature[];
}

/** Mirrors gymmi-api `GYM_LIMITS`; trial gyms get Plus limits. */
export const GYM_PLAN_LIMITS: Record<
  GymTier,
  { members: number; catalogRoutines: number; customExercises: number }
> = {
  trial: { members: 100, catalogRoutines: 3, customExercises: 5 },
  plus: { members: 100, catalogRoutines: 3, customExercises: 5 },
  pro: { members: 300, catalogRoutines: 10, customExercises: 10 },
  maximum: { members: 500, catalogRoutines: 20, customExercises: 20 },
};

export const NEXT_GYM_TIER: Record<GymTier, GymTier | null> = {
  trial: 'pro',
  plus: 'pro',
  pro: 'maximum',
  maximum: null,
};

export const PRICING_DATA: {
  trainer: PricingPlan[];
  client: PricingPlan[];
  gym: PricingPlan[];
} = {
  trainer: [
    {
      id: 'free',
      monthlyPrice: 0,
      annualPrice: 0,
      ctaKey: 'landing.pricing.startFree',
      features: [
        { textKey: 'landing.pricing.trainer.free.f1', included: true },
        { textKey: 'landing.pricing.trainer.free.f2', included: true },
        { textKey: 'landing.pricing.trainer.free.f3', included: true },
        { textKey: 'landing.pricing.trainer.free.f4', included: false },
        { textKey: 'landing.pricing.trainer.free.f5', included: false },
        { textKey: 'landing.pricing.trainer.free.f6', included: false },
      ],
    },
    {
      id: 'plus',
      badgeKey: 'landing.pricing.popularBadge',
      monthlyPrice: 2.99,
      annualPrice: 2.39,
      ctaKey: 'landing.pricing.upgradePlus',
      features: [
        { textKey: 'landing.pricing.trainer.plus.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.plus.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.plus.f3', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.plus.f4', included: true },
        { textKey: 'landing.pricing.trainer.plus.f5', included: true },
        { textKey: 'landing.pricing.trainer.plus.f6', included: false },
      ],
    },
    {
      id: 'pro',
      monthlyPrice: 5.99,
      annualPrice: 4.79,
      ctaKey: 'landing.pricing.choosePlan',
      features: [
        { textKey: 'landing.pricing.trainer.pro.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.pro.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.pro.f3', included: true, highlight: true },
        { textKey: 'landing.pricing.trainer.pro.f4', included: true },
        { textKey: 'landing.pricing.trainer.pro.f5', included: true },
        { textKey: 'landing.pricing.trainer.pro.f6', included: true },
      ],
    },
  ],
  client: [
    {
      id: 'free',
      monthlyPrice: 0,
      annualPrice: 0,
      ctaKey: 'landing.pricing.startFree',
      features: [
        { textKey: 'landing.pricing.client.free.f1', included: true },
        { textKey: 'landing.pricing.client.free.f2', included: true },
        { textKey: 'landing.pricing.client.free.f3', included: true },
        { textKey: 'landing.pricing.client.free.f4', included: false },
        { textKey: 'landing.pricing.client.free.f5', included: false },
      ],
    },
    {
      id: 'plus',
      badgeKey: 'landing.pricing.popularBadge',
      monthlyPrice: 1.99,
      annualPrice: 1.59,
      ctaKey: 'landing.pricing.upgradePlus',
      features: [
        { textKey: 'landing.pricing.client.plus.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.client.plus.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.client.plus.f3', included: true },
        { textKey: 'landing.pricing.client.plus.f4', included: true },
        { textKey: 'landing.pricing.client.plus.f5', included: true },
      ],
    },
    {
      id: 'pro',
      monthlyPrice: 2.99,
      annualPrice: 2.39,
      ctaKey: 'landing.pricing.choosePlan',
      features: [
        { textKey: 'landing.pricing.client.pro.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.client.pro.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.client.pro.f3', included: true },
        { textKey: 'landing.pricing.client.pro.f4', included: true, highlight: true },
      ],
    },
  ],
  gym: [
    {
      id: 'plus',
      badgeKey: 'landing.pricing.trialBadge',
      monthlyPrice: 25,
      annualPrice: 20,
      ctaKey: 'landing.pricing.startTrial',
      features: [
        { textKey: 'landing.pricing.gym.plus.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.gym.plus.f2', included: true },
        { textKey: 'landing.pricing.gym.plus.f3', included: true },
        { textKey: 'landing.pricing.gym.plus.f4', included: true },
        { textKey: 'landing.pricing.gym.plus.f5', included: true },
        { textKey: 'landing.pricing.gym.plus.f6', included: true, highlight: true },
      ],
    },
    {
      id: 'pro',
      badgeKey: 'landing.pricing.popularBadge',
      monthlyPrice: 50,
      annualPrice: 40,
      ctaKey: 'landing.pricing.choosePlan',
      features: [
        { textKey: 'landing.pricing.gym.pro.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.gym.pro.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.gym.pro.f3', included: true },
        { textKey: 'landing.pricing.gym.pro.f4', included: true },
        { textKey: 'landing.pricing.gym.pro.f5', included: true },
        { textKey: 'landing.pricing.gym.pro.f6', included: true },
        { textKey: 'landing.pricing.gym.pro.f7', included: true },
      ],
    },
    {
      id: 'maximum',
      monthlyPrice: 100,
      annualPrice: 80,
      ctaKey: 'landing.pricing.choosePlan',
      features: [
        { textKey: 'landing.pricing.gym.maximum.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.gym.maximum.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.gym.maximum.f3', included: true },
        { textKey: 'landing.pricing.gym.maximum.f4', included: true },
        { textKey: 'landing.pricing.gym.maximum.f5', included: true },
        { textKey: 'landing.pricing.gym.maximum.f6', included: true },
        { textKey: 'landing.pricing.gym.maximum.f7', included: true },
      ],
    },
  ],
};
