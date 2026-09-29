import { useState } from 'react';
import { CreditCard, Sparkles, Shield, ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CardSurface, SectionTitle, SectionLabel } from './SettingsShell';
import type { FullUserProfile } from '../../types/auth';

interface SubscriptionSettingsCardProps {
  userProfile?: FullUserProfile | null;
}

export function SubscriptionSettingsCard({
  userProfile,
}: SubscriptionSettingsCardProps) {
  const { t } = useTranslation();
  const [now] = useState(() => Date.now());

  const hasPaid = Boolean(userProfile?.hasPaid);
  const paidUntil = userProfile?.paidUntil
    ? new Date(userProfile.paidUntil)
    : null;

  const daysRemaining = paidUntil
    ? Math.max(
        0,
        Math.ceil((paidUntil.getTime() - now) / (24 * 60 * 60 * 1000)),
      )
    : null;

  return (
    <Wrapper data-testid="subscription-settings-card">
      <SectionTitle>
        <CreditCard size={18} color="#ef233c" />
        <span>{t('billing.settingsTitle', 'Subscription & Tier')}</span>
      </SectionTitle>

      <StatusContainer>
        <TierInfo>
          <SectionLabel>{t('billing.activePlan', 'ACTIVE PLAN')}</SectionLabel>
          <TierRow>
            <TierPill $plus={hasPaid}>
              {hasPaid ? (
                <>
                  <Sparkles size={14} />
                  <span>{t('billing.plusBadge', 'PLUS TIER')}</span>
                </>
              ) : (
                <>
                  <Shield size={14} />
                  <span>{t('billing.freeBadge', 'FREE TIER')}</span>
                </>
              )}
            </TierPill>

            {hasPaid && daysRemaining !== null && (
              <DaysPill>
                <Clock size={12} />
                <span>
                  {t('billing.daysRemaining', {
                    count: daysRemaining,
                    defaultValue: '{{count}} days left',
                  })}
                </span>
              </DaysPill>
            )}
          </TierRow>

          <DetailText>
            {hasPaid
              ? paidUntil
                ? t('billing.validUntilDetail', {
                    date: paidUntil.toLocaleDateString(),
                    defaultValue: 'Valid until {{date}}',
                  })
                : t('billing.lifetimeDetail', 'Lifetime access / Facility managed')
              : t(
                  'billing.upgradePrompt',
                  'Upgrade to Plus to unlock unlimited templates and clients.',
                )}
          </DetailText>
        </TierInfo>

        <ManageButton to="/billing">
          <span>{t('billing.manageBilling', 'Manage Billing')}</span>
          <ArrowRight size={15} />
        </ManageButton>
      </StatusContainer>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const TierInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const TierRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TierPill = styled.div<{ $plus: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  color: ${({ $plus }) => ($plus ? '#34d399' : '#cbd5e1')};
  background: ${({ $plus }) =>
    $plus ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.06)'};
  border: 1px solid
    ${({ $plus }) => ($plus ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.1)')};
`;

const DaysPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

const DetailText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: #94a3b8;
`;

const ManageButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.65rem;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.4);
  color: #ff535a;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #ef233c;
    color: #ffffff;
  }
`;
