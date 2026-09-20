export type BillingCadence = 'monthly' | 'annual';

export interface PricingFeature {
  textKey: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: 'free' | 'plus' | 'pro';
  badgeKey?: string;
  monthlyPrice: number;
  annualPrice: number;
  disabled?: boolean;
  ctaKey: string;
  features: PricingFeature[];
}

export const PRICING_DATA: {
  trainer: PricingPlan[];
  client: PricingPlan[];
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
      monthlyPrice: 19,
      annualPrice: 15,
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
      badgeKey: 'landing.pricing.comingSoonBadge',
      monthlyPrice: 49,
      annualPrice: 39,
      disabled: true,
      ctaKey: 'landing.pricing.joinWaitlist',
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
      monthlyPrice: 7,
      annualPrice: 5.5,
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
      badgeKey: 'landing.pricing.comingSoonBadge',
      monthlyPrice: 15,
      annualPrice: 12,
      disabled: true,
      ctaKey: 'landing.pricing.joinWaitlist',
      features: [
        { textKey: 'landing.pricing.client.pro.f1', included: true, highlight: true },
        { textKey: 'landing.pricing.client.pro.f2', included: true, highlight: true },
        { textKey: 'landing.pricing.client.pro.f3', included: true, highlight: true },
        { textKey: 'landing.pricing.client.pro.f4', included: true },
        { textKey: 'landing.pricing.client.pro.f5', included: true },
      ],
    },
  ],
};
