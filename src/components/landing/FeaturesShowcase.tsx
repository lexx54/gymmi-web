import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Layers,
  Activity,
  UserCheck,
  Dumbbell,
  Check,
  ChevronRight,
  Flame,
  Sparkles,
} from 'lucide-react';

type FeatureTab = 'routine' | 'bodymap' | 'active' | 'trainer';

export const FeaturesShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FeatureTab>('routine');

  // Interactive Muscle Map sub-state
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Chest');

  const muscleExercises: Record<string, { en: string; es: string; equip: string }[]> = {
    Chest: [
      { en: 'Barbell Bench Press', es: 'Press de Banca con Barra', equip: 'Barbell' },
      { en: 'Incline Dumbbell Press', es: 'Press Inclinado con Mancuernas', equip: 'Dumbbells' },
      { en: 'Cable Chest Fly', es: 'Aperturas en Polea', equip: 'Cable' },
    ],
    Back: [
      { en: 'Barbell Bent-Over Row', es: 'Remo con Barra Inclinado', equip: 'Barbell' },
      { en: 'Lat Pulldown', es: 'Jalón al Pecho', equip: 'Cable' },
      { en: 'Single-Arm Dumbbell Row', es: 'Remo con Mancuerna a una Mano', equip: 'Dumbbell' },
    ],
    Legs: [
      { en: 'Barbell Back Squat', es: 'Sentadilla Trasera con Barra', equip: 'Barbell' },
      { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano', equip: 'Barbell' },
      { en: 'Leg Press', es: 'Prensa de Piernas', equip: 'Machine' },
    ],
    Shoulders: [
      { en: 'Overhead Barbell Press', es: 'Press Militar con Barra', equip: 'Barbell' },
      { en: 'Dumbbell Lateral Raise', es: 'Elevaciones Laterales con Mancuernas', equip: 'Dumbbells' },
      { en: 'Face Pull', es: 'Face Pull en Polea', equip: 'Cable' },
    ],
    Core: [
      { en: 'Hanging Leg Raise', es: 'Elevaciones de Piernas Colgado', equip: 'Bodyweight' },
      { en: 'Cable Woodchopper', es: 'Leñador en Polea', equip: 'Cable' },
      { en: 'Plank with Reach', es: 'Plancha con Alcance', equip: 'Bodyweight' },
    ],
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
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Multi-day periodization (Day 1 Push, Day 2 Pull, Day 3 Legs)</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Configurable supersets, rest clocks, rep intervals, and RPE</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Single-click assignment forking to client rosters</span>
                  </BulletItem>
                </BulletList>
              </>
            )}

            {activeTab === 'bodymap' && (
              <>
                <CardBadge>{t('landing.features.tabBodyMap')}</CardBadge>
                <CardHeading>{t('landing.features.bodyMapTitle')}</CardHeading>
                <CardDescription>{t('landing.features.bodyMapDesc')}</CardDescription>
                <BulletList>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Anatomical visual targeting for anterior and posterior muscle groups</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Instant filtering by primary and secondary targets</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Integrated equipment tags (Barbells, Dumbbells, Cables, Machines)</span>
                  </BulletItem>
                </BulletList>
              </>
            )}

            {activeTab === 'active' && (
              <>
                <CardBadge>{t('landing.features.tabActive')}</CardBadge>
                <CardHeading>{t('landing.features.activeTitle')}</CardHeading>
                <CardDescription>{t('landing.features.activeDesc')}</CardDescription>
                <BulletList>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Live rest timer counts down between heavy working sets</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Log weight (kg/lbs), completed reps, and perceived RPE</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Auto-calculates weekly volume including partial and completed sessions</span>
                  </BulletItem>
                </BulletList>
              </>
            )}

            {activeTab === 'trainer' && (
              <>
                <CardBadge>{t('landing.features.tabTrainer')}</CardBadge>
                <CardHeading>{t('landing.features.trainerTitle')}</CardHeading>
                <CardDescription>{t('landing.features.trainerDesc')}</CardDescription>
                <BulletList>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Verified coaching contracts (Request → Accept → Covered Client)</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Covered clients receive curated plans directly on mobile</span>
                  </BulletItem>
                  <BulletItem>
                    <Check size={16} color="#ef233c" />
                    <span>Automated assignment forks protect master routine templates</span>
                  </BulletItem>
                </BulletList>
              </>
            )}
          </CardInfoSection>

          {/* Right Column: Live Interactive Widget */}
          <CardPreviewSection>
            {activeTab === 'routine' && (
              <WidgetBox>
                <WidgetHeader>
                  <WidgetTitle>Routine Builder Preview</WidgetTitle>
                  <WidgetTag>4-Day Hypertrophy</WidgetTag>
                </WidgetHeader>
                <RoutineBlockList>
                  <RoutineDayItem $active>
                    <DayTag>DAY 1</DayTag>
                    <DayDetails>
                      <DayName>Heavy Push (Chest & Shoulders)</DayName>
                      <DayExercisesCount>5 Exercises • 18 Sets • ~55m</DayExercisesCount>
                    </DayDetails>
                    <ChevronRight size={16} color="#ef233c" />
                  </RoutineDayItem>
                  <RoutineDayItem>
                    <DayTag>DAY 2</DayTag>
                    <DayDetails>
                      <DayName>Back & Biceps Pull</DayName>
                      <DayExercisesCount>5 Exercises • 17 Sets • ~50m</DayExercisesCount>
                    </DayDetails>
                    <ChevronRight size={16} color="#64748b" />
                  </RoutineDayItem>
                  <RoutineDayItem>
                    <DayTag>DAY 3</DayTag>
                    <DayDetails>
                      <DayName>Legs & Core Power</DayName>
                      <DayExercisesCount>6 Exercises • 20 Sets • ~60m</DayExercisesCount>
                    </DayDetails>
                    <ChevronRight size={16} color="#64748b" />
                  </RoutineDayItem>
                </RoutineBlockList>
              </WidgetBox>
            )}

            {activeTab === 'bodymap' && (
              <WidgetBox>
                <WidgetHeader>
                  <WidgetTitle>Interactive Muscle Selector</WidgetTitle>
                  <WidgetTag>Select Target</WidgetTag>
                </WidgetHeader>

                {/* Muscle Pill Selector */}
                <MuscleSelectorGrid>
                  {['Chest', 'Back', 'Legs', 'Shoulders', 'Core'].map((muscle) => (
                    <MuscleButton
                      key={muscle}
                      type="button"
                      $selected={selectedMuscle === muscle}
                      onClick={() => setSelectedMuscle(muscle)}
                    >
                      {muscle}
                    </MuscleButton>
                  ))}
                </MuscleSelectorGrid>

                {/* Filtered Exercises */}
                <FilteredList>
                  {(muscleExercises[selectedMuscle] || []).map((item, idx) => (
                    <FilteredItem key={idx}>
                      <MuscleIconWrapper>
                        <Flame size={15} color="#ef233c" />
                      </MuscleIconWrapper>
                      <FilteredInfo>
                        <FilteredName>{item.en}</FilteredName>
                        <FilteredSub>{item.equip}</FilteredSub>
                      </FilteredInfo>
                    </FilteredItem>
                  ))}
                </FilteredList>
              </WidgetBox>
            )}

            {activeTab === 'active' && (
              <WidgetBox>
                <WidgetHeader>
                  <WidgetTitle>Active Workout Simulator</WidgetTitle>
                  <WidgetTag>Set 3 of 4</WidgetTag>
                </WidgetHeader>

                <ActiveSetBox>
                  <SetStatsRow>
                    <SetStat>
                      <SetStatLabel>WEIGHT</SetStatLabel>
                      <SetStatVal>100 kg</SetStatVal>
                    </SetStat>
                    <SetStat>
                      <SetStatLabel>REPS</SetStatLabel>
                      <SetStatVal>8</SetStatVal>
                    </SetStat>
                    <SetStat>
                      <SetStatLabel>TARGET RPE</SetStatLabel>
                      <SetStatVal>8.5</SetStatVal>
                    </SetStat>
                  </SetStatsRow>

                  <RestTimerBanner>
                    <span>Rest Interval:</span>
                    <strong>01:30</strong>
                  </RestTimerBanner>
                </ActiveSetBox>
              </WidgetBox>
            )}

            {activeTab === 'trainer' && (
              <WidgetBox>
                <WidgetHeader>
                  <WidgetTitle>Coaching Contract State</WidgetTitle>
                  <WidgetTag>Contract Active</WidgetTag>
                </WidgetHeader>

                <PipelineTimeline>
                  <TimelineStep $done>
                    <TimelineDot $done>1</TimelineDot>
                    <TimelineContent>
                      <TimelineTitle>Client Invitation Sent</TimelineTitle>
                      <TimelineDesc>Trainer proposes 8-week block</TimelineDesc>
                    </TimelineContent>
                  </TimelineStep>
                  <TimelineStep $done>
                    <TimelineDot $done>2</TimelineDot>
                    <TimelineContent>
                      <TimelineTitle>Contract Accepted</TimelineTitle>
                      <TimelineDesc>Client enters Covered Client status</TimelineDesc>
                    </TimelineContent>
                  </TimelineStep>
                  <TimelineStep $active>
                    <TimelineDot $active>3</TimelineDot>
                    <TimelineContent>
                      <TimelineTitle>Programs Delivered Live</TimelineTitle>
                      <TimelineDesc>Routines automatically sync to client mobile app</TimelineDesc>
                    </TimelineContent>
                  </TimelineStep>
                </PipelineTimeline>
              </WidgetBox>
            )}
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

const RoutineBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RoutineDayItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  border-radius: 0.75rem;
  background: ${({ $active }) =>
    $active ? 'rgba(239, 35, 60, 0.08)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid
    ${({ $active }) => ($active ? 'rgba(239, 35, 60, 0.3)' : 'rgba(255, 255, 255, 0.05)')};
`;

const DayTag = styled.span`
  background: #ef233c;
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.2rem 0.45rem;
  border-radius: 0.375rem;
`;

const DayDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DayName = styled.span`
  color: #f1f5f9;
  font-size: 0.875rem;
  font-weight: 700;
`;

const DayExercisesCount = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

const MuscleSelectorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MuscleButton = styled.button<{ $selected: boolean }>`
  background: ${({ $selected }) =>
    $selected ? '#ef233c' : 'rgba(255, 255, 255, 0.06)'};
  border: 1px solid
    ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(255, 255, 255, 0.1)')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#94a3b8')};
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.4rem 0.85rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    border-color: #ef233c;
  }
`;

const FilteredList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const FilteredItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.625rem;
`;

const MuscleIconWrapper = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  background: rgba(239, 35, 60, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilteredInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilteredName = styled.span`
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 700;
`;

const FilteredSub = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

const ActiveSetBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SetStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  text-align: center;
`;

const SetStat = styled.div`
  background: rgba(255, 255, 255, 0.04);
  padding: 0.875rem 0.5rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const SetStatLabel = styled.span`
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 700;
  display: block;
`;

const SetStatVal = styled.span`
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 800;
  margin-top: 0.25rem;
  display: block;
`;

const RestTimerBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.25);
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  color: #fca5a5;
  font-size: 0.875rem;

  strong {
    color: #ffffff;
    font-size: 1.1rem;
    font-variant-numeric: tabular-nums;
  }
`;

const PipelineTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimelineStep = styled.div<{ $done?: boolean; $active?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  opacity: ${({ $done, $active }) => ($done || $active ? 1 : 0.4)};
`;

const TimelineDot = styled.div<{ $done?: boolean; $active?: boolean }>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: ${({ $done, $active }) => ($done || $active ? '#ef233c' : '#334155')};
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineTitle = styled.span`
  color: #f1f5f9;
  font-size: 0.875rem;
  font-weight: 700;
`;

const TimelineDesc = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

