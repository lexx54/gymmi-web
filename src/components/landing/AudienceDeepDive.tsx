import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Users,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Layers,
} from 'lucide-react';

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
              <span>Join as a Coach</span>
              <ArrowRight size={16} />
            </CTALink>
          </AudienceTextColumn>

          <AudienceVisualColumn>
            <VisualCard $accent="#ef233c">
              <VisualHeader>
                <ShieldCheck size={18} color="#ef233c" />
                <VisualHeaderText>Coach Roster Management</VisualHeaderText>
              </VisualHeader>
              <ClientRosterList>
                <ClientRow>
                  <ClientAvatar>JD</ClientAvatar>
                  <ClientMeta>
                    <ClientName>John Doe</ClientName>
                    <ClientPlan>Upper Body • 4 Weeks Left</ClientPlan>
                  </ClientMeta>
                  <ClientStatusBadge $active>ACTIVE</ClientStatusBadge>
                </ClientRow>
                <ClientRow>
                  <ClientAvatar>SM</ClientAvatar>
                  <ClientMeta>
                    <ClientName>Sarah Miller</ClientName>
                    <ClientPlan>Strength Block • 6 Weeks Left</ClientPlan>
                  </ClientMeta>
                  <ClientStatusBadge $active>ACTIVE</ClientStatusBadge>
                </ClientRow>
                <ClientRow>
                  <ClientAvatar>AR</ClientAvatar>
                  <ClientMeta>
                    <ClientName>Alex Rivera</ClientName>
                    <ClientPlan>Contract Requested</ClientPlan>
                  </ClientMeta>
                  <ClientStatusBadge>PENDING</ClientStatusBadge>
                </ClientRow>
              </ClientRosterList>
              <VisualCardNote>
                Plus coaches manage up to 8 clients with automated assignment forking.
              </VisualCardNote>
            </VisualCard>
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
              <span>Train as an Athlete</span>
              <ArrowRight size={16} />
            </CTALink>
          </AudienceTextColumn>

          <AudienceVisualColumn>
            <VisualCard $accent="#38bdf8">
              <VisualHeader>
                <Zap size={18} color="#38bdf8" />
                <VisualHeaderText>Mobile Active Execution</VisualHeaderText>
              </VisualHeader>
              <MobilePhoneMockup>
                <MockupScreen>
                  <MockupTopBar>
                    <span>Upper Body Power</span>
                    <MockupTimer>24:12</MockupTimer>
                  </MockupTopBar>
                  <MockupExerciseCard>
                    <MockupExName>Barbell Bench Press</MockupExName>
                    <MockupExSpecs>Set 3 • 100 kg × 8 reps</MockupExSpecs>
                    <MockupInputRow>
                      <MockupInputBadge>RPE 8.5</MockupInputBadge>
                      <MockupCompleteBtn>✓ Complete Set</MockupCompleteBtn>
                    </MockupInputRow>
                  </MockupExerciseCard>
                </MockupScreen>
              </MobilePhoneMockup>
              <VisualCardNote>
                Seamless real-time synchronization between web routines and mobile workouts.
              </VisualCardNote>
            </VisualCard>
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
            <VisualCard $accent="#a855f7">
              <VisualHeader>
                <Building2 size={18} color="#a855f7" />
                <VisualHeaderText>Facility Management Console</VisualHeaderText>
              </VisualHeader>

              {/* Member Capacity Progress */}
              <CapacityContainer>
                <CapacityMetaRow>
                  <CapacityTitle>Active Member Capacity</CapacityTitle>
                  <CapacityPercentText>74 / 100 (74%)</CapacityPercentText>
                </CapacityMetaRow>
                <CapacityTrack>
                  <CapacityFill $percent={74} />
                </CapacityTrack>
              </CapacityContainer>

              {/* Coach Staff Approvals */}
              <ClientRosterList>
                <ClientRow>
                  <ClientAvatar style={{ background: '#581c87', color: '#e9d5ff' }}>AS</ClientAvatar>
                  <ClientMeta>
                    <ClientName>Alex Sterling</ClientName>
                    <ClientPlan>Head Trainer • 6 Active Clients</ClientPlan>
                  </ClientMeta>
                  <CoachPermBadge $published>CAN PUBLISH</CoachPermBadge>
                </ClientRow>
                <ClientRow>
                  <ClientAvatar style={{ background: '#3b0764', color: '#d8b4fe' }}>SM</ClientAvatar>
                  <ClientMeta>
                    <ClientName>Sarah Miller</ClientName>
                    <ClientPlan>Strength Coach • 4 Active Clients</ClientPlan>
                  </ClientMeta>
                  <CoachPermBadge>AFFILIATED</CoachPermBadge>
                </ClientRow>
              </ClientRosterList>

              {/* Curated Catalog Strip */}
              <CatalogSummaryBadge>
                <Layers size={15} color="#c084fc" />
                <span>12 Curated Routines Published to Members</span>
              </CatalogSummaryBadge>

              <VisualCardNote>
                Gym Plus includes a 30-day free trial with up to 100 members and full catalog controls.
              </VisualCardNote>
            </VisualCard>
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

const CapacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  background: rgba(168, 85, 247, 0.06);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 0.75rem;
`;

const CapacityMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CapacityTitle = styled.span`
  color: #e9d5ff;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const CapacityPercentText = styled.span`
  color: #c084fc;
  font-size: 0.8125rem;
  font-weight: 800;
`;

const CapacityTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
`;

const CapacityFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: linear-gradient(90deg, #9333ea, #c084fc);
  border-radius: 9999px;
`;

const CoachPermBadge = styled.span<{ $published?: boolean }>`
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  background: ${({ $published }) =>
    $published ? 'rgba(168, 85, 247, 0.2)' : 'rgba(148, 163, 184, 0.15)'};
  color: ${({ $published }) => ($published ? '#d8b4fe' : '#94a3b8')};
  border: 1px solid
    ${({ $published }) =>
      $published ? 'rgba(168, 85, 247, 0.35)' : 'rgba(148, 163, 184, 0.25)'};
`;

const CatalogSummaryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.875rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.625rem;
  color: #cbd5e1;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const AudienceVisualColumn = styled.div`
  display: flex;
  justify-content: center;
`;

const VisualCard = styled.div<{ $accent: string }>`
  width: 100%;
  max-width: 460px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const VisualHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.875rem;
`;

const VisualHeaderText = styled.span`
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 700;
`;

const ClientRosterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ClientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 0.875rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
`;

const ClientAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #334155;
  color: #f1f5f9;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClientMeta = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ClientName = styled.span`
  color: #f1f5f9;
  font-size: 0.875rem;
  font-weight: 700;
`;

const ClientPlan = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

const ClientStatusBadge = styled.span<{ $active?: boolean }>`
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  background: ${({ $active }) =>
    $active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)'};
  color: ${({ $active }) => ($active ? '#4ade80' : '#facc15')};
`;

const MobilePhoneMockup = styled.div`
  background: #0b1120;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.25rem;
  padding: 1rem;
`;

const MockupScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const MockupTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #f1f5f9;
  font-size: 0.8125rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
`;

const MockupTimer = styled.span`
  color: #38bdf8;
  font-variant-numeric: tabular-nums;
`;

const MockupExerciseCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MockupExName = styled.span`
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
`;

const MockupExSpecs = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
`;

const MockupInputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
`;

const MockupInputBadge = styled.span`
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
`;

const MockupCompleteBtn = styled.span`
  background: #0284c7;
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
`;

const VisualCardNote = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.4;
  text-align: center;
`;
