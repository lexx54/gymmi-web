import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ConsistencyHeatmap } from '../../services/api/analytics';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

interface ConsistencyHeatmapCardProps {
  data?: ConsistencyHeatmap;
  isLoading?: boolean;
}

const INTENSITY_COLORS = ['#2a2f4d', '#3a405f', '#614c5c', '#ae5565', '#ef233c'] as const;

export function ConsistencyHeatmapCard({ data, isLoading }: ConsistencyHeatmapCardProps) {
  const { t } = useTranslation();

  const grid = data?.grid && data.grid.length > 0 ? data.grid : Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => ({
      weekday: 0,
      weekIndex: 0,
      date: '',
      durationMinutes: 0,
      intensityLevel: 0 as const,
    })),
  );

  const streak = data?.streak ?? 0;
  const completion = data?.completionPercent ?? 0;
  const workouts = data?.totalWorkouts ?? 0;

  const summary = [
    { value: isLoading ? '...' : String(streak), labelKey: 'analytics.dayStreak' },
    { value: isLoading ? '...' : `${completion}%`, labelKey: 'analytics.completion' },
    { value: isLoading ? '...' : String(workouts), labelKey: 'analytics.workouts' },
  ];

  return (
    <AnalyticsCard>
      <HeaderRow>
        <div>
          <Eyebrow>{t('analytics.commitmentTracking')}</Eyebrow>
          <CardTitle>{t('analytics.consistencyHeatmap')}</CardTitle>
        </div>
        <Legend>
          <LegendLabel>{t('analytics.less')}</LegendLabel>
          {INTENSITY_COLORS.map((color) => (
            <LegendCell key={color} style={{ background: color }} />
          ))}
          <LegendLabel>{t('analytics.more')}</LegendLabel>
        </Legend>
      </HeaderRow>

      <Grid>
        {/* We have 5 week columns. Each column has 7 days. */}
        {Array.from({ length: 5 }).map((_, colIndex) => (
          <Column key={colIndex}>
            {grid.map((row, rowIndex) => {
              const cell = row[colIndex] || { intensityLevel: 0, date: '', durationMinutes: 0 };
              const color = INTENSITY_COLORS[cell.intensityLevel] || INTENSITY_COLORS[0];
              const tooltip = cell.date ? `${cell.date}: ${cell.durationMinutes}m` : undefined;
              return <Cell key={rowIndex} style={{ background: color }} title={tooltip} />;
            })}
          </Column>
        ))}
      </Grid>

      <SummaryRow>
        {summary.map((item) => (
          <SummaryItem key={item.labelKey}>
            <SummaryValue>{item.value}</SummaryValue>
            <SummaryLabel>{t(item.labelKey)}</SummaryLabel>
          </SummaryItem>
        ))}
      </SummaryRow>
    </AnalyticsCard>
  );
}

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const LegendLabel = styled.span`
  color: #9096b6;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.66rem;
  font-weight: 600;
`;

const LegendCell = styled.span`
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 0.2rem;
`;

const Grid = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.85rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Cell = styled.span`
  height: 1.65rem;
  border-radius: 0.35rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryValue = styled.p`
  margin: 0;
  color: #f5f6ff;
  font-size: 1.85rem;
  font-weight: 700;
`;

const SummaryLabel = styled.p`
  margin: 0.25rem 0 0;
  color: #8e94b4;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.65rem;
  font-weight: 600;
`;
