import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GYM_PLAN_LIMITS, NEXT_GYM_TIER } from '../../constants/pricing.constants';
import type { ApiErrorDetails } from '../../services/api/errors';
import type { GymTier } from '../../types/gym';
import type { EntitlementResource } from '../../types/rbac';
import { Modal } from '../common/Modal';

type PlusUpsellModalProps = {
  isOpen: boolean;
  details?: ApiErrorDetails;
  resource?: EntitlementResource;
  message?: string;
  onClose: () => void;
};

/** Displays a billing-free Plus explanation for a plan-limited action. */
export function PlusUpsellModal({
  isOpen,
  details,
  resource,
  message,
  onClose,
}: PlusUpsellModalProps) {
  const { t } = useTranslation();
  const target = details?.resource ?? resource;
  const isGym = details?.scope === 'gym';
  // A Plus user hitting a limit can only go up to Pro; PDF export is a Pro-only perk.
  const isPdfExport = target === 'pdfExport';
  const isPlus = !isGym && (details?.plan === 'plus' || isPdfExport);
  const nextGymTier = isGym ? NEXT_GYM_TIER[details?.plan as GymTier] ?? null : null;
  const nextGymLimits = nextGymTier ? GYM_PLAN_LIMITS[nextGymTier] : null;
  const title = isGym
    ? 'entitlements.gymUpsellTitle'
    : isPlus
      ? 'entitlements.upsellProTitle'
      : 'entitlements.upsellTitle';

  return (
    <Modal
      isOpen={isOpen}
      title={t(title)}
      description={message ?? (typeof details?.message === 'string' ? details.message : undefined)}
      onClose={onClose}
    >
      <Content>
        {isGym ? (
          nextGymTier && nextGymLimits ? (
            <>
              <PlanLabel>
                <Sparkles size={16} aria-hidden />
                {t(`landing.pricing.gym.${nextGymTier}.title`)}
              </PlanLabel>
              <Benefits>
                {isPdfExport ? <li><Check size={16} aria-hidden />{t('entitlements.gymBenefits.pdf')}</li> : null}
                <li><Check size={16} aria-hidden />{t('entitlements.gymBenefits.members', { count: nextGymLimits.members })}</li>
                <li><Check size={16} aria-hidden />{t('entitlements.gymBenefits.catalog', { count: nextGymLimits.catalogRoutines })}</li>
                <li><Check size={16} aria-hidden />{t('entitlements.gymBenefits.exercises', { count: nextGymLimits.customExercises })}</li>
              </Benefits>
            </>
          ) : null
        ) : (
          <>
            <PlanLabel>
              <Sparkles size={16} aria-hidden />
              {t(isPlus ? 'entitlements.pro' : 'entitlements.plus')}
            </PlanLabel>
            <Benefits>
              {(isPdfExport
                ? ['benefitsPro.pdf']
                : isPlus
                ? ['benefitsPro.seats', 'benefitsPro.templates', 'benefitsPro.exercises']
                : ['benefits.templates', 'benefits.exercises', 'benefits.sharing']
              ).map((key) => (
                <li key={key}><Check size={16} aria-hidden />{t(`entitlements.${key}`)}</li>
              ))}
            </Benefits>
          </>
        )}
        {target && typeof details?.limit === 'number' ? (
          <Usage>
            {t('entitlements.usage', {
              usage: details.usage ?? details.limit,
              limit: details.limit,
            })}
          </Usage>
        ) : null}
        <Actions>
          {nextGymTier ? (
            <PlansLink to="/billing" onClick={onClose}>{t('entitlements.seeGymPlans')}</PlansLink>
          ) : null}
          <CloseButton type="button" onClick={onClose}>{t('common.close')}</CloseButton>
        </Actions>
      </Content>
    </Modal>
  );
}

const Content = styled.div`display: grid; gap: 1rem; margin-top: 1.5rem;`;
const PlanLabel = styled.p`display: flex; align-items: center; gap: .5rem; margin: 0; color: #ffb3b1; font-weight: 900;`;
const Benefits = styled.ul`display: grid; gap: .7rem; margin: 0; padding: 0; list-style: none; color: #e0e0fc; li { display: flex; align-items: center; gap: .55rem; } svg { color: #7ee7a8; }`;
const Usage = styled.p`margin: 0; color: #e7bdbb; font-size: .85rem;`;
const Actions = styled.div`display: flex; justify-content: flex-end; gap: .6rem;`;
const PlansLink = styled(Link)`border-radius: 999px; padding: .75rem 1.2rem; background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%); color: #fff; font-weight: 800; text-decoration: none;`;
const CloseButton = styled.button`border: 0; border-radius: 999px; padding: .75rem 1.2rem; background: #313349; color: #fff; font-weight: 800; cursor: pointer;`;
