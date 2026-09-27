import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { MuscleLoad, MuscleSegment } from '../../services/api/analytics';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

interface MuscleLoadCardProps {
  data?: MuscleLoad;
  isLoading?: boolean;
}

const DEFAULT_SEGMENTS: MuscleSegment[] = [
  { id: 'chest', labelKey: 'analytics.chest', sets: 0, exercisesCount: 0, percent: 0, color: '#ef233c' },
  { id: 'back', labelKey: 'analytics.back', sets: 0, exercisesCount: 0, percent: 0, color: '#3b82f6' },
  { id: 'legs', labelKey: 'analytics.legs', sets: 0, exercisesCount: 0, percent: 0, color: '#10b981' },
  { id: 'shoulders', labelKey: 'analytics.shoulders', sets: 0, exercisesCount: 0, percent: 0, color: '#f59e0b' },
  { id: 'arms', labelKey: 'analytics.arms', sets: 0, exercisesCount: 0, percent: 0, color: '#8b5cf6' },
  { id: 'core', labelKey: 'analytics.core', sets: 0, exercisesCount: 0, percent: 0, color: '#06b6d4' },
];

export function MuscleLoadCard({ data, isLoading }: MuscleLoadCardProps) {
  const { t } = useTranslation();
  const segments = data?.distribution && data.distribution.length > 0 ? data.distribution : DEFAULT_SEGMENTS;
  const totalSets = data?.totalSets ?? 0;

  return (
    <AnalyticsCard>
      <HeaderRow>
        <div>
          <Eyebrow>{t('analytics.bodyComposition')}</Eyebrow>
          <CardTitle>{t('analytics.muscleLoad')}</CardTitle>
        </div>
        <TotalsWrap>
          <TotalValue>
            {isLoading ? '...' : totalSets} <TotalUnit>{t('analytics.sets')}</TotalUnit>
          </TotalValue>
        </TotalsWrap>
      </HeaderRow>

      <BarsGrid role="region" aria-label={t('analytics.muscleLoadDistribution')}>
        {segments.map((segment) => {
          const count = segment.exercisesCount ?? 0;
          return (
            <BarItem key={segment.id}>
              <BarHeader>
                <MuscleLabelGroup>
                  <ColorDot $color={segment.color} />
                  <MuscleName>{t(segment.labelKey, segment.id)}</MuscleName>
                  <ExerciseBadge>
                    {t('analytics.exerciseCount', {
                      count,
                      defaultValue: `${count} ${count === 1 ? 'exercise' : 'exercises'}`,
                    })}
                  </ExerciseBadge>
                </MuscleLabelGroup>
                <StatsGroup>
                  <SetsCount>
                    {segment.sets} {t('analytics.sets').toLowerCase()}
                  </SetsCount>
                  <PercentValue>{segment.percent}%</PercentValue>
                </StatsGroup>
              </BarHeader>
              <Track>
                <Fill $color={segment.color} $percent={segment.percent} />
              </Track>
            </BarItem>
          );
        })}
      </BarsGrid>
    </AnalyticsCard>
  );
}

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const TotalsWrap = styled.div`
  text-align: right;
`;

const TotalValue = styled.p`
  margin: 0;
  color: #f6f7ff;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const TotalUnit = styled.span`
  color: #bdc2e1;
  font-size: 0.95rem;
  margin-left: 0.25rem;
  font-weight: 600;
`;

const BarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 2.5rem;
  margin-top: 1.5rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 1.15rem;
  }
`;

const BarItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const MuscleLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const ColorDot = styled.span<{ $color: string }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const MuscleName = styled.span`
  color: #f5f6ff;
  font-size: 0.92rem;
  font-weight: 700;
`;

const ExerciseBadge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a4a9c6;
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.2;
`;

const StatsGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
`;

const SetsCount = styled.span`
  color: #8e94b4;
  font-size: 0.84rem;
  font-weight: 600;
`;

const PercentValue = styled.span`
  color: #f5f6ff;
  font-size: 0.84rem;
  font-weight: 700;
`;

const Track = styled.div`
  width: 100%;
  height: 0.55rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.55rem;
`;

const Fill = styled.div<{ $color: string; $percent: number }>`
  height: 100%;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
  width: ${({ $percent }) => ($percent > 0 ? `${Math.max(2, $percent)}%` : '0%')};
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;
