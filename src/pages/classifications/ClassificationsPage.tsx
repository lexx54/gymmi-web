import {
  ChevronDown,
  Dumbbell,
  Sparkles,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useMyGym } from '../../hooks/useGyms';
import { useClassifications } from '../../hooks/useClassifications';
import type { StrengthTier } from '../../types/classifications';

export default function ClassificationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isGym = user?.role?.name === 'Gym';
  const { data: gymData } = useMyGym(isGym);

  const cohortType = isGym ? 'gym' : 'trainer';
  const cohortId = isGym ? gymData?.gym?.id || '' : user?.id || '';

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>(
    'weekly',
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(
    undefined,
  );

  const { data, isLoading, isError } = useClassifications(
    {
      cohortType,
      cohortId,
      timeframe,
      exerciseId: selectedExerciseId,
    },
    Boolean(cohortId),
  );

  const coreExercises = useMemo(
    () => data?.availableExercises.filter((e) => e.isCore) || [],
    [data?.availableExercises],
  );

  const otherExercises = useMemo(
    () => data?.availableExercises.filter((e) => !e.isCore) || [],
    [data?.availableExercises],
  );

  const currentExerciseId = data?.exercise?.id || selectedExerciseId;

  const getTierColor = (tier: StrengthTier) => {
    switch (tier) {
      case 'Diamond':
        return '#38bdf8';
      case 'Platinum':
        return '#a5b4fc';
      case 'Gold':
        return '#facc15';
      case 'Silver':
        return '#94a3b8';
      case 'Bronze':
        return '#f97316';
      default:
        return '#475569';
    }
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === 1) return <RankPodium $color="#facc15">🥇 1</RankPodium>;
    if (rank === 2) return <RankPodium $color="#94a3b8">🥈 2</RankPodium>;
    if (rank === 3) return <RankPodium $color="#d97706">🥉 3</RankPodium>;
    if (rank !== null) return <RankNumber>#{rank}</RankNumber>;
    return <RankNumber style={{ opacity: 0.4 }}>—</RankNumber>;
  };

  return (
    <PageShell>
      <Sidebar username={user?.username ?? 'Coach'} />
      <Main>
        <TopBar title={t('classifications.title')} />

        {/* Timeframe selector & Cohort indicator */}
        <ControlsRow>
          <TimeframeGroup data-testid="timeframe-selector">
            <TimeframeBtn
              type="button"
              $active={timeframe === 'weekly'}
              onClick={() => setTimeframe('weekly')}
              data-testid="timeframe-weekly"
            >
              {t('classifications.timeframe.weekly')}
            </TimeframeBtn>
            <TimeframeBtn
              type="button"
              $active={timeframe === 'monthly'}
              onClick={() => setTimeframe('monthly')}
              data-testid="timeframe-monthly"
            >
              {t('classifications.timeframe.monthly')}
            </TimeframeBtn>
            <TimeframeBtn
              type="button"
              $active={timeframe === 'all-time'}
              onClick={() => setTimeframe('all-time')}
              data-testid="timeframe-all-time"
            >
              {t('classifications.timeframe.allTime')}
            </TimeframeBtn>
          </TimeframeGroup>

          {data?.cohortName ? (
            <CohortBadge data-testid="cohort-badge">
              <Users size={15} color="#ef233c" />
              <span>{data.cohortName}</span>
            </CohortBadge>
          ) : null}
        </ControlsRow>

        {/* Exercise Selector Dropdown */}
        <ExerciseBar data-testid="exercise-selector-bar">
          <SelectWrapper>
            <Dumbbell
              size={16}
              color="#ef233c"
              style={{ position: 'absolute', left: 14, pointerEvents: 'none', zIndex: 1 }}
            />
            <SelectInput
              value={currentExerciseId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedExerciseId(e.target.value);
                }
              }}
              data-testid="exercise-select"
              aria-label={t('classifications.selectExercise')}
            >
              <option value="" disabled>
                {t('classifications.selectExercise')}
              </option>
              {coreExercises.length > 0 && otherExercises.length > 0 ? (
                <>
                  <optgroup label={t('classifications.coreLifts')}>
                    {coreExercises.map((ex) => (
                      <option key={ex.id} value={ex.id} data-testid={`exercise-option-${ex.id}`}>
                        {ex.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={t('classifications.otherLifts')}>
                    {otherExercises.map((ex) => (
                      <option key={ex.id} value={ex.id} data-testid={`exercise-option-${ex.id}`}>
                        {ex.name}
                      </option>
                    ))}
                  </optgroup>
                </>
              ) : (
                data?.availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id} data-testid={`exercise-option-${ex.id}`}>
                    {ex.name}
                  </option>
                ))
              )}
            </SelectInput>
            <ChevronDown
              size={16}
              style={{ position: 'absolute', right: 14, pointerEvents: 'none', color: '#9ca3af' }}
            />
          </SelectWrapper>
        </ExerciseBar>

        {isLoading ? (
          <StateMessage>{t('common.loading')}</StateMessage>
        ) : isError ? (
          <StateMessage style={{ color: '#ef233c' }}>{t('common.error')}</StateMessage>
        ) : data ? (
          <>
            {/* Tier Distribution Progress Bar */}
            <DistributionCard data-testid="tier-distribution-card">
              <DistributionHeader>
                <DistributionTitle>
                  <Sparkles size={16} color="#facc15" />
                  <span>{t('classifications.tierDistribution')}</span>
                </DistributionTitle>
                <TotalAthletes>
                  <strong>{data.tierDistribution.total}</strong> {t('nav.clients')}
                </TotalAthletes>
              </DistributionHeader>

              <ProgressBarWrapper>
                {data.tierDistribution.total > 0 ? (
                  <>
                    <ProgressSegment
                      $color="#38bdf8"
                      $percent={(data.tierDistribution.diamond / data.tierDistribution.total) * 100}
                      title={`Diamond: ${data.tierDistribution.diamond}`}
                    />
                    <ProgressSegment
                      $color="#a5b4fc"
                      $percent={(data.tierDistribution.platinum / data.tierDistribution.total) * 100}
                      title={`Platinum: ${data.tierDistribution.platinum}`}
                    />
                    <ProgressSegment
                      $color="#facc15"
                      $percent={(data.tierDistribution.gold / data.tierDistribution.total) * 100}
                      title={`Gold: ${data.tierDistribution.gold}`}
                    />
                    <ProgressSegment
                      $color="#94a3b8"
                      $percent={(data.tierDistribution.silver / data.tierDistribution.total) * 100}
                      title={`Silver: ${data.tierDistribution.silver}`}
                    />
                    <ProgressSegment
                      $color="#f97316"
                      $percent={(data.tierDistribution.bronze / data.tierDistribution.total) * 100}
                      title={`Bronze: ${data.tierDistribution.bronze}`}
                    />
                    <ProgressSegment
                      $color="#334155"
                      $percent={(data.tierDistribution.unranked / data.tierDistribution.total) * 100}
                      title={`Unranked: ${data.tierDistribution.unranked}`}
                    />
                  </>
                ) : (
                  <ProgressSegment $color="#334155" $percent={100} />
                )}
              </ProgressBarWrapper>

              <LegendGrid>
                <LegendItem>
                  <LegendDot $color="#38bdf8" />
                  <LegendLabel>{t('classifications.diamond')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.diamond}</LegendCount>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color="#a5b4fc" />
                  <LegendLabel>{t('classifications.platinum')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.platinum}</LegendCount>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color="#facc15" />
                  <LegendLabel>{t('classifications.gold')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.gold}</LegendCount>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color="#94a3b8" />
                  <LegendLabel>{t('classifications.silver')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.silver}</LegendCount>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color="#f97316" />
                  <LegendLabel>{t('classifications.bronze')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.bronze}</LegendCount>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color="#334155" />
                  <LegendLabel>{t('classifications.unranked')}</LegendLabel>
                  <LegendCount>{data.tierDistribution.unranked}</LegendCount>
                </LegendItem>
              </LegendGrid>
            </DistributionCard>

            {/* Rankings Table */}
            <TableCard data-testid="classifications-table-card">
              <TableHead>
                <div>{t('classifications.rank')}</div>
                <div>{t('classifications.athlete')}</div>
                <div>{t('classifications.tier')}</div>
                <div>{t('classifications.bestLift')}</div>
                <div>{t('classifications.estimated1Rm')}</div>
                <div>{t('classifications.date')}</div>
              </TableHead>

              {data.rankings.length === 0 ? (
                <EmptyRow>{t('classifications.noData')}</EmptyRow>
              ) : (
                data.rankings.map((entry) => (
                  <TableRow
                    key={entry.user.id}
                    data-testid={`ranking-row-${entry.user.id}`}
                    $isTop3={entry.rank !== null && entry.rank <= 3}
                  >
                    <CellRank>{getRankBadge(entry.rank)}</CellRank>
                    <CellAthlete>
                      {entry.user.avatarUrl ? (
                        <AthleteAvatar src={entry.user.avatarUrl} alt={entry.user.username} />
                      ) : (
                        <AthleteAvatarFallback>
                          {entry.user.username.slice(0, 2).toUpperCase()}
                        </AthleteAvatarFallback>
                      )}
                      <div>
                        <AthleteName>{entry.user.username}</AthleteName>
                        <AthleteEmail>{entry.user.email}</AthleteEmail>
                      </div>
                    </CellAthlete>
                    <CellTier>
                      <TierBadge $color={getTierColor(entry.tier)} data-testid={`tier-badge-${entry.user.id}`}>
                        {entry.tier}
                      </TierBadge>
                    </CellTier>
                    <CellLift>
                      {entry.bestWeightKg !== null && entry.bestReps !== null ? (
                        <span>
                          <strong>{entry.bestWeightKg}</strong> kg × {entry.bestReps}
                        </span>
                      ) : (
                        <MutedDash>—</MutedDash>
                      )}
                    </CellLift>
                    <Cell1RM>
                      {entry.estimated1RmKg !== null ? (
                        <OneRmPill>{entry.estimated1RmKg} kg</OneRmPill>
                      ) : (
                        <MutedDash>—</MutedDash>
                      )}
                    </Cell1RM>
                    <CellDate>{entry.achievedAt || <MutedDash>—</MutedDash>}</CellDate>
                  </TableRow>
                ))
              )}
            </TableCard>
          </>
        ) : null}
      </Main>
    </PageShell>
  );
}

/* Styled Components */

const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

const Main = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2.5rem;
  position: relative;
  overflow-y: auto;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;



const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TimeframeGroup = styled.div`
  display: flex;
  align-items: center;
  background: #181b2a;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #23273e;
`;

const TimeframeBtn = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  border-radius: 9px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#ef233c' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#9ca3af')};
  transition: all 0.15s ease;

  &:hover {
    color: #fff;
  }
`;

const CohortBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #181b2a;
  border: 1px solid #23273e;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #e2e8f0;
`;

const ExerciseBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 440px;
`;

const SelectInput = styled.select`
  width: 100%;
  appearance: none;
  background: #181b2a;
  color: #fff;
  border: 1px solid #23273e;
  border-radius: 12px;
  padding: 12px 42px 12px 42px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: #3b4263;
  }

  &:focus {
    border-color: #ef233c;
    box-shadow: 0 0 0 2px rgba(239, 35, 60, 0.25);
  }

  option,
  optgroup {
    background: #181b2a;
    color: #fff;
    font-weight: 600;
  }

  optgroup {
    color: #ef233c;
    font-weight: 700;
  }
`;

const DistributionCard = styled.div`
  background: #181b2a;
  border: 1px solid #23273e;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const DistributionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const DistributionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
`;

const TotalAthletes = styled.div`
  font-size: 13px;
  color: #9ca3af;
  strong {
    color: #fff;
  }
`;

const ProgressBarWrapper = styled.div`
  height: 12px;
  border-radius: 999px;
  background: #23273e;
  overflow: hidden;
  display: flex;
  margin-bottom: 16px;
`;

const ProgressSegment = styled.div<{ $color: string; $percent: number }>`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: ${(p) => p.$color};
  transition: width 0.3s ease;
`;

const LegendGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;

const LegendLabel = styled.span`
  color: #94a3b8;
  font-weight: 600;
`;

const LegendCount = styled.span`
  color: #fff;
  font-weight: 800;
`;

const TableCard = styled.div`
  background: #181b2a;
  border: 1px solid #23273e;
  border-radius: 16px;
  overflow: hidden;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 80px 1.5fr 1fr 1fr 1fr 1fr;
  padding: 16px 24px;
  background: #141724;
  border-bottom: 1px solid #23273e;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9ca3af;
`;

const TableRow = styled.div<{ $isTop3: boolean }>`
  display: grid;
  grid-template-columns: 80px 1.5fr 1fr 1fr 1fr 1fr;
  padding: 16px 24px;
  align-items: center;
  border-bottom: 1px solid #1f2337;
  background: ${(p) => (p.$isTop3 ? 'rgba(239, 35, 60, 0.03)' : 'transparent')};
  transition: background 0.15s ease;

  &:hover {
    background: #1e2235;
  }
`;

const CellRank = styled.div`
  display: flex;
  align-items: center;
`;

const RankPodium = styled.span<{ $color: string }>`
  font-size: 14px;
  font-weight: 800;
  color: ${(p) => p.$color};
`;

const RankNumber = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
`;

const CellAthlete = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AthleteAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #23273e;
`;

const AthleteAvatarFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #23273e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #ef233c;
`;

const AthleteName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
`;

const AthleteEmail = styled.div`
  font-size: 11px;
  color: #94a3b8;
`;

const CellTier = styled.div`
  display: flex;
  align-items: center;
`;

const TierBadge = styled.div<{ $color: string }>`
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid ${(p) => p.$color};
  color: ${(p) => p.$color};
  background: ${(p) => `${p.$color}15`};
`;

const CellLift = styled.div`
  font-size: 13px;
  color: #cbd5e1;
  strong {
    color: #fff;
    font-size: 14px;
  }
`;

const Cell1RM = styled.div`
  display: flex;
  align-items: center;
`;

const OneRmPill = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #ef233c;
`;

const CellDate = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const MutedDash = styled.span`
  color: #475569;
`;

const StateMessage = styled.p`
  padding: 48px;
  text-align: center;
  font-size: 15px;
  color: #9ca3af;
`;

const EmptyRow = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
`;
