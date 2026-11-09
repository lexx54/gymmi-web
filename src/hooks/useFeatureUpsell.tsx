import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusUpsellModal } from '../components/entitlements/PlusUpsellModal';
import type { ApiErrorDetails } from '../services/api/errors';
import type { EntitlementCapabilities } from '../types/rbac';
import { hasEntitlementCapability, useEntitlements } from './usePermissions';

/** Pro-only perks: the capability that unlocks each one and its upsell copy. */
const FEATURES = {
  pdfExport: {
    capability: 'canExportPdf',
    message: 'entitlements.pdfExport',
    gymMessage: 'entitlements.gymPdfExport',
  },
  branding: {
    capability: 'canBrand',
    message: 'entitlements.branding',
    gymMessage: 'entitlements.gymBranding',
  },
} as const satisfies Record<string, { capability: keyof EntitlementCapabilities; message: string; gymMessage: string }>;

export type ProFeature = keyof typeof FEATURES;

/**
 * Checks a Pro-only perk and owns its upsell: `allowed` reflects the plan,
 * `requireFeature()` opens the Pro (or Gym) upsell when it's missing, and
 * `showUpsell(details?)` opens it for a server PLAN_LIMIT.
 */
export function useFeatureUpsell(feature: ProFeature): {
  allowed: boolean;
  requireFeature: () => boolean;
  showUpsell: (details?: ApiErrorDetails) => void;
  upsellModal: ReactNode;
} {
  const { t } = useTranslation();
  const { data: entitlements, plan } = useEntitlements();
  const [upsell, setUpsell] = useState<ApiErrorDetails | null>(null);
  const config = FEATURES[feature];
  const allowed = hasEntitlementCapability(entitlements?.capabilities, config.capability);

  const showUpsell = (details?: ApiErrorDetails) => {
    const base: ApiErrorDetails = entitlements?.gymTier
      ? {
          code: 'PLAN_LIMIT',
          resource: feature,
          scope: 'gym',
          plan: entitlements.gymTier,
          message: t(config.gymMessage),
        }
      : { code: 'PLAN_LIMIT', resource: feature, plan, message: t(config.message) };
    setUpsell({ ...base, ...details });
  };

  const requireFeature = () => {
    if (allowed) return true;
    showUpsell();
    return false;
  };

  const upsellModal = (
    <PlusUpsellModal isOpen={Boolean(upsell)} details={upsell ?? undefined} onClose={() => setUpsell(null)} />
  );

  return { allowed, requireFeature, showUpsell, upsellModal };
}
