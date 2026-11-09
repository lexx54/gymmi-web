import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Layers, Activity, UserCheck, Dumbbell, Check, Sparkles, Trophy, Building2 } from 'lucide-react';
import { RoutineBuilderMockup } from './mockups/RoutineBuilderMockup';
import { BodyMapMockup } from './mockups/BodyMapMockup';
import { LogSetMockup } from './mockups/LogSetMockup';
import { CoachingFlowMockup } from './mockups/CoachingFlowMockup';
import { GymCoachesMockup } from './mockups/GymCoachesMockup';

type FeatureTab = 'routine' | 'bodymap' | 'active' | 'trainer' | 'classifications' | 'facility';

export const FeaturesShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FeatureTab>('routine');

  // Interactive Classifications sub-state
  const [selectedLift, setSelectedLift] = useState<'bench' | 'squat' | 'deadlift' | 'ohp'>('bench');
  const [selectedTf, setSelectedTf] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  /** The viewer's own row, shown in the "Your Standing" card like the real leaderboard. */
  const yourStanding = {
    bench: { rank: 4, tier: 'Gold', tierColor: '#f59e0b', peak: 100, set: '95 kg × 2' },
    squat: { rank: 4, tier: 'Gold', tierColor: '#f59e0b', peak: 140, set: '130 kg × 3' },
    deadlift: { rank: 5, tier: 'Gold', tierColor: '#f59e0b', peak: 175, set: '165 kg × 2' },
    ohp: { rank: 4, tier: 'Silver', tierColor: '#94a3b8', peak: 62, set: '55 kg × 4' },
  };
  const tierLabel = (tier: string) => t(`classifications.${tier.toLowerCase()}`);

  const classificationsData = {
    bench: {
      name: 'Bench Press',
      distribution: [
        { name: 'Diamond', count: 1, color: '#00f2fe' },
        { name: 'Platinum', count: 2, color: '#c471ed' },
        { name: 'Gold', count: 3, color: '#f59e0b' },
        { name: 'Silver', count: 1, color: '#94a3b8' },
      ],
      total: 7,
      podium: [
        { rank: 1, medal: '🥇', name: 'Alex Sterling', tier: 'Diamond', tierColor: '#00f2fe', peak: 145, set: '140 kg × 2' },
        { rank: 2, medal: '🥈', name: 'Sarah Miller', tier: 'Platinum', tierColor: '#c471ed', peak: 125, set: '120 kg × 2' },
        { rank: 3, medal: '🥉', name: 'Mike Torres', tier: 'Gold', tierColor: '#f59e0b', peak: 105, set: '100 kg × 2' },
      ],
    },
    squat: {
      name: 'Barbell Back Squat',
      distribution: [
        { name: 'Diamond', count: 2, color: '#00f2fe' },
        { name: 'Platinum', count: 1, color: '#c471ed' },
        { name: 'Gold', count: 3, color: '#f59e0b' },
        { name: 'Silver', count: 1, color: '#94a3b8' },
      ],
      total: 7,
      podium: [
        { rank: 1, medal: '🥇', name: 'David Kim', tier: 'Diamond', tierColor: '#00f2fe', peak: 210, set: '200 kg × 2' },
        { rank: 2, medal: '🥈', name: 'Alex Sterling', tier: 'Platinum', tierColor: '#c471ed', peak: 185, set: '175 kg × 2' },
        { rank: 3, medal: '🥉', name: 'Sarah Miller', tier: 'Gold', tierColor: '#f59e0b', peak: 145, set: '135 kg × 3' },
      ],
    },
    deadlift: {
      name: 'Deadlift',
      distribution: [
        { name: 'Diamond', count: 2, color: '#00f2fe' },
        { name: 'Platinum', count: 2, color: '#c471ed' },
        { name: 'Gold', count: 2, color: '#f59e0b' },
        { name: 'Silver', count: 1, color: '#94a3b8' },
      ],
      total: 7,
      podium: [
        { rank: 1, medal: '🥇', name: 'David Kim', tier: 'Diamond', tierColor: '#00f2fe', peak: 250, set: '240 kg × 2' },
        { rank: 2, medal: '🥈', name: 'Mike Torres', tier: 'Platinum', tierColor: '#c471ed', peak: 215, set: '200 kg × 3' },
        { rank: 3, medal: '🥉', name: 'Alex Sterling', tier: 'Platinum', tierColor: '#c471ed', peak: 210, set: '200 kg × 2' },
      ],
    },
    ohp: {
      name: 'Overhead Press',
      distribution: [
        { name: 'Diamond', count: 1, color: '#00f2fe' },
        { name: 'Platinum', count: 1, color: '#c471ed' },
        { name: 'Gold', count: 3, color: '#f59e0b' },
        { name: 'Silver', count: 2, color: '#94a3b8' },
      ],
      total: 7,
      podium: [
        { rank: 1, medal: '🥇', name: 'Alex Sterling', tier: 'Diamond', tierColor: '#00f2fe', peak: 102, set: '95 kg × 3' },
        { rank: 2, medal: '🥈', name: 'Mike Torres', tier: 'Platinum', tierColor: '#c471ed', peak: 88, set: '80 kg × 4' },
        { rank: 3, medal: '🥉', name: 'Sarah Miller', tier: 'Gold', tierColor: '#f59e0b', peak: 72, set: '65 kg × 4' },
      ],
    },
  };

  return (
    <SectionWrapper id="features">
      <SectionInner>
        {/* Header */}
        <HeaderGroup>
          <SectionBadge>
            <Sparkles size={14} color="#ef233c" />
            <span>{t('landing.features.tag')}</span>
          </SectionBadge>
          <SectionTitle>{t('landing.features.title')}</SectionTitle>
          <SectionSubtitle>{t('landing.features.subtitle')}</SectionSubtitle>
        </HeaderGroup>

        {/* Tab Switcher */}
        <TabNavigation role="tablist">
          <TabButton
            role="tab"
            aria-selected={activeTab === 'routine'}
            $active={activeTab === 'routine'}
            onClick={() => setActiveTab('routine')}
          >
            <Layers size={18} />
            <span>{t('landing.features.tabRoutine')}</span>
          </TabButton>

          <TabButton
            role="tab"
            aria-selected={activeTab === 'bodymap'}
            $active={activeTab === 'bodymap'}
            onClick={() => setActiveTab('bodymap')}
          >
            <Dumbbell size={18} />
            <span>{t('landing.features.tabBodyMap')}</span>
          </TabButton>

          <TabButton
            role="tab"
            aria-selected={activeTab === 'active'}
            $active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          >
            <Activity size={18} />
            <span>{t('landing.features.tabActive')}</span>
          </TabButton>

          <TabButton
            role="tab"
            aria-selected={activeTab === 'trainer'}
            $active={activeTab === 'trainer'}
            onClick={() => setActiveTab('trainer')}
          >
            <UserCheck size={18} />
            <span>{t('landing.features.tabTrainer')}</span>
          </TabButton>

          <TabButton
            role="tab"
            aria-selected={activeTab === 'classifications'}
            $active={activeTab === 'classifications'}
            onClick={() => setActiveTab('classifications')}
          >
            <Trophy size={18} />
            <span>{t('landing.features.tabClassifications')}</span>
          </TabButton>

          <TabButton
            role="tab"
            aria-selected={activeTab === 'facility'}
            $active={activeTab === 'facility'}
            onClick={() => setActiveTab('facility')}
          >
            <Building2 size={18} />
            <span>{t('landing.features.tabFacility')}</span>
          </TabButton>
        </TabNavigation>

        {/* Tab Showcase Card */}
        <ShowcaseCard>
          {/* Left Column: Description & Highlights */}
          <CardInfoSection>
            {activeTab === 'routine' && (
              <>
                <CardBadge>{t('landing.features.tabRoutine')}</CardBadge>
                <CardHeading>{t('landing.features.routineTitle')}</CardHeading>
                <CardDescription>{t('landing.features.routineDesc')}</CardDescription>
                <BulletList>
                  <Bullets keys={['routineF1', 'routineF2', 'routineF3']} />
                </BulletList>
              </>
            )}

            {activeTab === 'bodymap' && (
              <>
                <CardBadge>{t('landing.features.tabBodyMap')}</CardBadge>
                <CardHeading>{t('landing.features.bodyMapTitle')}</CardHeading>
                <CardDescription>{t('landing.features.bodyMapDesc')}</CardDescription>
                <BulletList>
                  <Bullets keys={['bodyMapF1', 'bodyMapF2', 'bodyMapF3']} />
                </BulletList>
              </>
            )}

            {activeTab === 'active' && (
              <>
                <CardBadge>{t('landing.features.tabActive')}</CardBadge>
                <CardHeading>{t('landing.features.activeTitle')}</CardHeading>
                <CardDescription>{t('landing.features.activeDesc')}</CardDescription>
                <BulletList>
                  <Bullets keys={['activeF1', 'activeF2', 'activeF3']} />
                </BulletList>
              </>
            )}

            {activeTab === 'trainer' && (
              <>
                <CardBadge>{t('landing.features.tabTrainer')}</CardBadge>
                <CardHeading>{t('landing.features.trainerTitle')}</CardHeading>
                <CardDescription>{t('landing.features.trainerDesc')}</CardDescription>
                <BulletList>
                  <Bullets keys={['trainerF1', 'trainerF2', 'trainerF3']} />
                </BulletList>
              </>
            )}

            {activeTab === 'classifications' && (
              <>
                <CardBadge>{t('landing.features.tabClassifications')}</CardBadge>
                <CardHeading>{t('landing.features.classificationsTitle')}</CardHeading>
                <CardDescription>{t('landing.features.classificationsDesc')}</CardDescription>
                <BulletList>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>{t('landing.features.classificationsF1')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>{t('landing.features.classificationsF2')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>{t('landing.features.classificationsF3')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>{t('landing.features.classificationsF4')}</span>
                  </BulletItem>
                </BulletList>
              </>
            )}

            {activeTab === 'facility' && (
              <>
                <CardBadge>{t('landing.features.tabFacility')}</CardBadge>
                <CardHeading>{t('landing.features.facilityTitle')}</CardHeading>
                <CardDescription>{t('landing.features.facilityDesc')}</CardDescription>
                <BulletList>
                  <BulletItem>
                    <Check size={16} color="#a855f7" />
                    <span>{t('landing.features.facilityF1')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#a855f7" />
                    <span>{t('landing.features.facilityF2')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#a855f7" />
                    <span>{t('landing.features.facilityF3')}</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#a855f7" />
                    <span>{t('landing.features.facilityF4')}</span>
                  </BulletItem>
                </BulletList>
              </>
            )}
          </CardInfoSection>

          {/* Right Column: Live Interactive Widget */}
          <CardPreviewSection>
            {activeTab === 'routine' && <RoutineBuilderMockup />}
            {activeTab === 'bodymap' && <BodyMapMockup />}
            {activeTab === 'active' && <LogSetMockup />}
            {activeTab === 'trainer' && <CoachingFlowMockup />}

            {activeTab === 'classifications' && (
              <WidgetBox>
                <WidgetHeader>
                  <WidgetTitle>{t('landing.features.classificationsWidgetTitle')}</WidgetTitle>
                  <WidgetTag>{t('landing.features.classificationsWidgetTag')}</WidgetTag>
                </WidgetHeader>

                {/* Timeframe Selection Pills */}
                <LeaderboardTimeframeRow>
                  {(['weekly', 'monthly', 'allTime'] as const).map((tf) => (
                    <TimeframePill
                      key={tf}
                      type="button"
                      $active={selectedTf === tf}
                      onClick={() => setSelectedTf(tf)}
                    >
                      {tf === 'weekly'
                        ? t('classifications.timeframe.weekly')
                        : tf === 'monthly'
                        ? t('classifications.timeframe.monthly')
                        : t('classifications.timeframe.allTime')}
                    </TimeframePill>
                  ))}
                </LeaderboardTimeframeRow>

                {/* Core Lift Pills */}
                <LiftSelectorGrid>
                  {(['bench', 'squat', 'deadlift', 'ohp'] as const).map((lift) => (
                    <LiftButton
                      key={lift}
                      type="button"
                      $selected={selectedLift === lift}
                      onClick={() => setSelectedLift(lift)}
                    >
                      {classificationsData[lift].name}
                    </LiftButton>
                  ))}
                </LiftSelectorGrid>

                <StandingCard>
                  <StandingLabel>{t('landing.mock.yourStanding')}</StandingLabel>
                  <StandingRow>
                    <StandingRank>#{yourStanding[selectedLift].rank}</StandingRank>
                    <TierPillBadge $color={yourStanding[selectedLift].tierColor}>
                      {tierLabel(yourStanding[selectedLift].tier)}
                    </TierPillBadge>
                    <StandingStat>
                      <small>{t('landing.mock.peak1rm')}</small>
                      <strong>{yourStanding[selectedLift].peak} kg</strong>
                    </StandingStat>
                    <StandingStat>
                      <small>{t('landing.mock.bestSet')}</small>
                      <strong>{yourStanding[selectedLift].set}</strong>
                    </StandingStat>
                  </StandingRow>
                </StandingCard>

                {/* Tier Distribution Bar */}
                <TierBarContainer>
                  <TierBarTrack>
                    {classificationsData[selectedLift].distribution.map((tier) => (
                      <TierBarSegment
                        key={tier.name}
                        $flex={tier.count / classificationsData[selectedLift].total}
                        $color={tier.color}
                      />
                    ))}
                  </TierBarTrack>
                  <TierLegendRow>
                    {classificationsData[selectedLift].distribution.map((tier) => (
                      <TierLegendItem key={tier.name}>
                        <TierLegendDot $color={tier.color} />
                        <span>
                          {tierLabel(tier.name)} ({tier.count})
                        </span>
                      </TierLegendItem>
                    ))}
                  </TierLegendRow>
                </TierBarContainer>

                {/* Ranked Athletes List */}
                <LeaderboardPodiumList>
                  {classificationsData[selectedLift].podium.map((athlete) => (
                    <PodiumRow key={athlete.rank}>
                      <PodiumMedal>{athlete.medal}</PodiumMedal>
                      <PodiumAthleteInfo>
                        <AthleteNameText>{athlete.name}</AthleteNameText>
                        <TierPillBadge $color={athlete.tierColor}>
                          {tierLabel(athlete.tier)}
                        </TierPillBadge>
                      </PodiumAthleteInfo>
                      <PodiumMetrics>
                        <Peak1RmText>{athlete.peak} kg</Peak1RmText>
                        <BestSetDetail>{athlete.set}</BestSetDetail>
                      </PodiumMetrics>
                    </PodiumRow>
                  ))}
                </LeaderboardPodiumList>
              </WidgetBox>
            )}

            {activeTab === 'facility' && <GymCoachesMockup />}
          </CardPreviewSection>
        </ShowcaseCard>
      </SectionInner>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  padding: 6rem 1.5rem;
  background: #0f172a;
  position: relative;
`;

const SectionInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const HeaderGroup = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
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
  max-width: 650px;
  line-height: 1.6;
`;

const TabNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)' : 'rgba(30, 41, 59, 0.6)'};
  border: 1px solid
    ${({ $active }) => ($active ? '#ef233c' : 'rgba(255, 255, 255, 0.08)')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#94a3b8')};
  box-shadow: ${({ $active }) => ($active ? '0 8px 20px -4px rgba(239, 35, 60, 0.4)' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: ${({ $active }) =>
      $active ? 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)' : 'rgba(30, 41, 59, 0.9)'};
  }
`;

const ShowcaseCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const CardInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CardBadge = styled.span`
  color: #ef233c;
  font-size: 0.8125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardHeading = styled.h3`
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
`;

const CardDescription = styled.p`
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.7;
`;

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const BulletItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.9375rem;
  line-height: 1.5;
`;

const CardPreviewSection = styled.div`
  display: flex;
  justify-content: center;
`;

const WidgetBox = styled.div`
  width: 100%;
  max-width: 440px;
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.875rem;
`;

const WidgetTitle = styled.h4`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
`;

const WidgetTag = styled.span`
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
`;

const LeaderboardTimeframeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TimeframePill = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${({ $active }) => ($active ? '#ef233c' : '#334155')};
  background: ${({ $active }) => ($active ? 'rgba(239, 35, 60, 0.15)' : '#1e293b')};
  color: ${({ $active }) => ($active ? '#fca5a5' : '#94a3b8')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    border-color: #ef233c;
  }
`;

const LiftSelectorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
`;

const LiftButton = styled.button<{ $selected?: boolean }>`
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${({ $selected }) => ($selected ? '#ef233c' : '#334155')};
  background: ${({ $selected }) => ($selected ? '#ef233c' : '#1e293b')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#94a3b8')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    border-color: #ef233c;
  }
`;

const TierBarContainer = styled.div`
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  margin-bottom: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TierBarTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  display: flex;
  overflow: hidden;
  background: #1e293b;
`;

const TierBarSegment = styled.div<{ $flex: number; $color: string }>`
  flex: ${({ $flex }) => $flex};
  background: ${({ $color }) => $color};
  height: 100%;
`;

const TierLegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const TierLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 600;
`;

const TierLegendDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LeaderboardPodiumList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PodiumRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  gap: 0.75rem;
`;

const PodiumMedal = styled.span`
  font-size: 1.15rem;
  line-height: 1;
`;

const PodiumAthleteInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AthleteNameText = styled.span`
  color: #f1f5f9;
  font-size: 0.8rem;
  font-weight: 700;
`;

const TierPillBadge = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}20`};
  border: 1px solid ${({ $color }) => `${$color}50`};
`;

const PodiumMetrics = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Peak1RmText = styled.span`
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 800;
`;

const BestSetDetail = styled.span`
  color: #94a3b8;
  font-size: 0.65rem;
`;


/** Renders translated feature bullets from `landing.features.*`. */
function Bullets({ keys }: { keys: string[] }) {
  const { t } = useTranslation();
  return (
    <>
      {keys.map((key) => (
        <BulletItem key={key}>
          <Check size={16} color="#ef233c" />
          <span>{t(`landing.features.${key}`)}</span>
        </BulletItem>
      ))}
    </>
  );
}

const StandingCard = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  background: rgba(239, 35, 60, 0.08);
  border: 1px solid rgba(239, 35, 60, 0.35);
`;

const StandingLabel = styled.div`
  margin-bottom: 0.45rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fca5a5;
`;

const StandingRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem 0.9rem;
`;

const StandingRank = styled.span`
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
`;

const StandingStat = styled.span`
  display: flex;
  flex-direction: column;
  small {
    font-size: 0.6rem;
    color: #94a3b8;
  }
  strong {
    font-size: 0.8rem;
    color: #ffffff;
  }
`;
