import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Check,
  X,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import {
  PRICING_DATA,
  type BillingCadence,
} from '../../constants/pricing.constants';

export const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState<'trainer' | 'client'>('trainer');
  const [cadence, setCadence] = useState<BillingCadence>('monthly');

  const plans = PRICING_DATA[role];

  return (
    <PricingWrapper id="pricing">
      <PricingInner>
        {/* Section Header */}
        <HeaderGroup>
          <SectionBadge>
            <Sparkles size={14} color="#ef233c" />
            <span>{t('landing.pricing.tag')}</span>
          </SectionBadge>
          <SectionTitle>{t('landing.pricing.title')}</SectionTitle>
          <SectionSubtitle>{t('landing.pricing.subtitle')}</SectionSubtitle>
        </HeaderGroup>

        {/* Controls: Role Switcher & Billing Frequency */}
        <ControlsContainer>
          {/* Role Switcher */}
          <RoleSwitcher role="tablist">
            <RoleTabButton
              type="button"
              role="tab"
              aria-selected={role === 'trainer'}
              $active={role === 'trainer'}
              onClick={() => setRole('trainer')}
            >
              {t('landing.pricing.tabTrainer')}
            </RoleTabButton>
            <RoleTabButton
              type="button"
              role="tab"
              aria-selected={role === 'client'}
              $active={role === 'client'}
              onClick={() => setRole('client')}
            >
              {t('landing.pricing.tabClient')}
            </RoleTabButton>
          </RoleSwitcher>

          {/* Billing Cadence Toggle */}
          <CadenceToggleWrapper>
            <CadenceButton
              type="button"
              $active={cadence === 'monthly'}
              onClick={() => setCadence('monthly')}
            >
              {t('landing.pricing.monthly')}
            </CadenceButton>
            <CadenceButton
              type="button"
              $active={cadence === 'annual'}
              onClick={() => setCadence('annual')}
            >
              <span>{t('landing.pricing.annual')}</span>
              <DiscountBadge>{t('landing.pricing.save20')}</DiscountBadge>
            </CadenceButton>
          </CadenceToggleWrapper>
        </ControlsContainer>

        {/* Pricing Cards Grid */}
        <CardsGrid>
          {plans.map((plan) => {
            const isPlus = plan.id === 'plus';
            const isPro = plan.id === 'pro';
            const price = cadence === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <PlanCard
                key={plan.id}
                $isPlus={isPlus}
                $isPro={isPro}
              >
                {/* Badges */}
                {isPlus && (
                  <PopularBadge>
                    <Sparkles size={13} />
                    <span>{t('landing.pricing.popularBadge')}</span>
                  </PopularBadge>
                )}
                {isPro && (
                  <ComingSoonBadge>
                    <Lock size={13} />
                    <span>{t('landing.pricing.comingSoonBadge')}</span>
                  </ComingSoonBadge>
                )}

                {/* Plan Header */}
                <PlanHeader>
                  <PlanTitle>{t(`landing.pricing.${role}.${plan.id}.title`)}</PlanTitle>
                  <PlanDesc>{t(`landing.pricing.${role}.${plan.id}.desc`)}</PlanDesc>
                </PlanHeader>

                {/* Price Display */}
                <PriceBlock>
                  <PriceRow>
                    <CurrencySymbol>$</CurrencySymbol>
                    <PriceAmount>{price}</PriceAmount>
                    <PricePeriod>{t('landing.pricing.perMonth')}</PricePeriod>
                  </PriceRow>
                  {cadence === 'annual' && plan.monthlyPrice > 0 && (
                    <BilledNote>{t('landing.pricing.billedAnnually')}</BilledNote>
                  )}
                </PriceBlock>

                {/* Features List */}
                <FeaturesList>
                  {plan.features.map((feat, idx) => (
                    <FeatureItem key={idx} $included={feat.included}>
                      {feat.included ? (
                        <CheckIconWrapper $isPlus={isPlus}>
                          <Check size={16} />
                        </CheckIconWrapper>
                      ) : (
                        <CrossIconWrapper>
                          <X size={15} />
                        </CrossIconWrapper>
                      )}
                      <FeatureText $highlight={feat.highlight} $included={feat.included}>
                        {t(feat.textKey)}
                      </FeatureText>
                    </FeatureItem>
                  ))}
                </FeaturesList>

                {/* CTA Button */}
                <CTAContainer>
                  {isPro ? (
                    <DisabledCTAButton disabled aria-disabled="true">
                      <Lock size={16} />
                      <span>{t('landing.pricing.comingSoonBadge')}</span>
                    </DisabledCTAButton>
                  ) : (
                    <ActiveCTAButton
                      type="button"
                      $isPlus={isPlus}
                      onClick={() => navigate('/signup')}
                    >
                      <span>{t(plan.ctaKey)}</span>
                    </ActiveCTAButton>
                  )}
                </CTAContainer>
              </PlanCard>
            );
          })}
        </CardsGrid>

        {/* Notice Disclaimer */}
        <DisclaimerBanner>
          <Info size={18} color="#94a3b8" />
          <span>{t('landing.pricing.disclaimer')}</span>
        </DisclaimerBanner>
      </PricingInner>
    </PricingWrapper>
  );
};

const PricingWrapper = styled.section`
  padding: 6rem 1.5rem;
  background: #0f172a;
  position: relative;
`;

const PricingInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const HeaderGroup = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.3);
  border-radius: 9999px;
  color: #fca5a5;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 620px;
  line-height: 1.6;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const RoleSwitcher = styled.div`
  display: inline-flex;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.3rem;
  border-radius: 0.75rem;
`;

const RoleTabButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)' : 'transparent'};
  border: none;
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const CadenceToggleWrapper = styled.div`
  display: inline-flex;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.3rem;
  border-radius: 0.75rem;
`;

const CadenceButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#334155' : 'transparent')};
  border: none;
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const DiscountBadge = styled.span`
  background: rgba(34, 197, 94, 0.18);
  color: #4ade80;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 0.375rem;
  letter-spacing: 0.02em;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
  }
`;

const PlanCard = styled.div<{ $isPlus: boolean; $isPro: boolean }>`
  position: relative;
  background: ${({ $isPlus }) =>
    $isPlus ? 'rgba(30, 41, 59, 0.85)' : 'rgba(30, 41, 59, 0.5)'};
  border: 2px solid
    ${({ $isPlus, $isPro }) =>
      $isPlus ? '#ef233c' : $isPro ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 2.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isPlus }) =>
    $isPlus
      ? '0 20px 40px -10px rgba(239, 35, 60, 0.3), 0 0 25px rgba(239, 35, 60, 0.1)'
      : '0 15px 30px rgba(0, 0, 0, 0.3)'};
  transform: ${({ $isPlus }) => ($isPlus ? 'scale(1.03)' : 'none')};
  transition: all 0.3s ease;
  opacity: ${({ $isPro }) => ($isPro ? 0.85 : 1)};

  @media (max-width: 1023px) {
    transform: none;
  }

  &:hover {
    transform: ${({ $isPlus }) => ($isPlus ? 'scale(1.05)' : 'translateY(-4px)')};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 12px rgba(239, 35, 60, 0.4);
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #334155;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const PlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const PlanTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 800;
`;

const PlanDesc = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 2.6rem;
`;

const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

const CurrencySymbol = styled.span`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
`;

const PriceAmount = styled.span`
  color: #ffffff;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const PricePeriod = styled.span`
  color: #94a3b8;
  font-size: 0.9375rem;
  font-weight: 500;
`;

const BilledNote = styled.span`
  color: #4ade80;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.div<{ $included: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  opacity: ${({ $included }) => ($included ? 1 : 0.45)};
`;

const CheckIconWrapper = styled.div<{ $isPlus: boolean }>`
  color: ${({ $isPlus }) => ($isPlus ? '#ef233c' : '#38bdf8')};
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
`;

const CrossIconWrapper = styled.div`
  color: #64748b;
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
`;

const FeatureText = styled.span<{ $highlight?: boolean; $included: boolean }>`
  color: ${({ $highlight, $included }) =>
    !$included ? '#64748b' : $highlight ? '#ffffff' : '#cbd5e1'};
  font-size: 0.875rem;
  font-weight: ${({ $highlight }) => ($highlight ? 700 : 500)};
  line-height: 1.4;
`;

const CTAContainer = styled.div`
  margin-top: auto;
`;

const ActiveCTAButton = styled.button<{ $isPlus: boolean }>`
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  background: ${({ $isPlus }) =>
    $isPlus
      ? 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)'
      : 'rgba(255, 255, 255, 0.08)'};
  color: #ffffff;
  box-shadow: ${({ $isPlus }) =>
    $isPlus ? '0 8px 20px -4px rgba(239, 35, 60, 0.45)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isPlus }) =>
      $isPlus ? 'linear-gradient(135deg, #f87171 0%, #ef233c 100%)' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }
`;

const DisabledCTAButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.75rem;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: not-allowed;
`;

const DisclaimerBanner = styled.div`
  margin-top: 3.5rem;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.875rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
`;
