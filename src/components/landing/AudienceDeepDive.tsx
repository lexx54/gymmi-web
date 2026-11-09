import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Users,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Building2,
} from 'lucide-react';
import {
  ClientsPageMockup,
  GymMembersMockup,
  MobileHomeMockup,
} from './mockups/AudienceMockups';

export const AudienceDeepDive: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DeepDiveWrapper id="ecosystem">
      <DeepDiveInner>
        {/* Row 1: For Coaches */}
        <AudienceRow>
          <AudienceTextColumn>
            <RoleBadge $role="coach">
              <Users size={15} />
              <span>{t('landing.audience.coachTag')}</span>
            </RoleBadge>

            <AudienceTitle>{t('landing.audience.coachTitle')}</AudienceTitle>
            <AudienceDescription>{t('landing.audience.coachDesc')}</AudienceDescription>

            <BenefitList>
              <BenefitItem>
                <CheckCircle2 size={18} color="#ef233c" />
                <span>{t('landing.audience.coachF1')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#ef233c" />
                <span>{t('landing.audience.coachF2')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#ef233c" />
                <span>{t('landing.audience.coachF3')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#ef233c" />
                <span>{t('landing.audience.coachF4')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#ef233c" />
                <span>{t('landing.audience.coachF5')}</span>
              </BenefitItem>
            </BenefitList>

            <CTALink to="/signup">
              <span>{t('landing.audience.coachCta')}</span>
              <ArrowRight size={16} />
            </CTALink>
          </AudienceTextColumn>

          <AudienceVisualColumn>
            <ClientsPageMockup />
          </AudienceVisualColumn>
        </AudienceRow>

        {/* Row 2: For Athletes / Clients */}
        <AudienceRow $reverse>
          <AudienceTextColumn>
            <RoleBadge $role="client">
              <Smartphone size={15} />
              <span>{t('landing.audience.clientTag')}</span>
            </RoleBadge>

            <AudienceTitle>{t('landing.audience.clientTitle')}</AudienceTitle>
            <AudienceDescription>{t('landing.audience.clientDesc')}</AudienceDescription>

            <BenefitList>
              <BenefitItem>
                <CheckCircle2 size={18} color="#38bdf8" />
                <span>{t('landing.audience.clientF1')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#38bdf8" />
                <span>{t('landing.audience.clientF2')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#38bdf8" />
                <span>{t('landing.audience.clientF3')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#38bdf8" />
                <span>{t('landing.audience.clientF4')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#38bdf8" />
                <span>{t('landing.audience.clientF5')}</span>
              </BenefitItem>
            </BenefitList>

            <CTALink to="/signup" $client>
              <span>{t('landing.audience.clientCta')}</span>
              <ArrowRight size={16} />
            </CTALink>
          </AudienceTextColumn>

          <AudienceVisualColumn>
            <MobileHomeMockup />
          </AudienceVisualColumn>
        </AudienceRow>

        {/* Row 3: For Gyms & Fitness Facilities */}
        <AudienceRow>
          <AudienceTextColumn>
            <RoleBadge $role="gym">
              <Building2 size={15} />
              <span>{t('landing.audience.gymTag')}</span>
            </RoleBadge>

            <AudienceTitle>{t('landing.audience.gymTitle')}</AudienceTitle>
            <AudienceDescription>{t('landing.audience.gymDesc')}</AudienceDescription>

            <BenefitList>
              <BenefitItem>
                <CheckCircle2 size={18} color="#a855f7" />
                <span>{t('landing.audience.gymF1')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#a855f7" />
                <span>{t('landing.audience.gymF2')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#a855f7" />
                <span>{t('landing.audience.gymF3')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#a855f7" />
                <span>{t('landing.audience.gymF4')}</span>
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={18} color="#a855f7" />
                <span>{t('landing.audience.gymF5')}</span>
              </BenefitItem>
            </BenefitList>

            <CTALink to="/signup" $gym>
              <span>{t('landing.audience.gymCta')}</span>
              <ArrowRight size={16} />
            </CTALink>
          </AudienceTextColumn>

          <AudienceVisualColumn>
            <GymMembersMockup />
          </AudienceVisualColumn>
        </AudienceRow>
      </DeepDiveInner>
    </DeepDiveWrapper>
  );
};

const DeepDiveWrapper = styled.section`
  padding: 6rem 1.5rem;
  background: #0b1120;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const DeepDiveInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6rem;
`;

const AudienceRow = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $reverse }) => ($reverse ? '1fr 1fr' : '1fr 1fr')};
    ${({ $reverse }) =>
      $reverse &&
      `
      & > div:first-child {
        order: 2;
      }
      & > div:last-child {
        order: 1;
      }
    `}
  }
`;

const AudienceTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RoleBadge = styled.div<{ $role: 'coach' | 'client' | 'gym' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  background: ${({ $role }) =>
    $role === 'coach'
      ? 'rgba(239, 35, 60, 0.12)'
      : $role === 'client'
      ? 'rgba(56, 189, 248, 0.12)'
      : 'rgba(168, 85, 247, 0.12)'};
  border: 1px solid
    ${({ $role }) =>
      $role === 'coach'
        ? 'rgba(239, 35, 60, 0.3)'
        : $role === 'client'
        ? 'rgba(56, 189, 248, 0.3)'
        : 'rgba(168, 85, 247, 0.3)'};
  border-radius: 9999px;
  color: ${({ $role }) =>
    $role === 'coach' ? '#fca5a5' : $role === 'client' ? '#7dd3fc' : '#d8b4fe'};
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;
`;

const AudienceTitle = styled.h3`
  font-size: clamp(1.85rem, 3vw, 2.35rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
`;

const AudienceDescription = styled.p`
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.7;
`;

const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CTALink = styled(Link)<{ $client?: boolean; $gym?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ $client, $gym }) =>
    $client
      ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
      : $gym
      ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
      : 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)'};
  color: #ffffff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.75rem 1.4rem;
  border-radius: 0.625rem;
  width: fit-content;
  box-shadow: 0 4px 14px
    ${({ $client, $gym }) =>
      $client
        ? 'rgba(2, 132, 199, 0.35)'
        : $gym
        ? 'rgba(147, 51, 234, 0.35)'
        : 'rgba(239, 35, 60, 0.35)'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AudienceVisualColumn = styled.div`
  display: flex;
  justify-content: center;
`;

