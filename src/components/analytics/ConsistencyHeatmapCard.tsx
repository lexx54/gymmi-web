import styled from 'styled-components';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

const INTENSITY_COLORS = ['#2a2f4d', '#3a405f', '#614c5c', '#ae5565', '#ef233c'] as const;

type IntensityLevel = 0 | 1 | 2 | 3 | 4;

const HEATMAP: IntensityLevel[][] = [
  [4, 4, 3, 0, 4],
  [2, 3, 1, 2, 0],
  [3, 1, 2, 2, 3],
  [2, 0, 4, 3, 1],
  [0, 3, 2, 1, 4],
  [4, 4, 3, 3, 2],
  [1, 0, 4, 2, 4],
];

const SUMMARY = [
  { value: '18', label: 'Day Streak' },
  { value: '94%', label: 'Completion' },
  { value: '28', label: 'Workouts' },
];

/**
 * Shows training consistency over a 5-week window and summary metrics.
 */
export function ConsistencyHeatmapCard() {
  return (
    <AnalyticsCard>
      <HeaderRow>
        <div>
          <Eyebrow>Commitment Tracking</Eyebrow>
          <CardTitle>Consistency Heatmap</CardTitle>
        </div>
        <Legend>
          <LegendLabel>Less</LegendLabel>
          {INTENSITY_COLORS.map((color) => (
            <LegendCell key={color} style={{ background: color }} />
          ))}
          <LegendLabel>More</LegendLabel>
        </Legend>
      </HeaderRow>

      <Grid>
        {HEATMAP.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((level, cellIndex) => (
              <Cell key={cellIndex} style={{ background: INTENSITY_COLORS[level] }} />
            ))}
          </Row>
        ))}
      </Grid>

      <SummaryRow>
        {SUMMARY.map((item) => (
          <SummaryItem key={item.label}>
            <SummaryValue>{item.value}</SummaryValue>
            <SummaryLabel>{item.label}</SummaryLabel>
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

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Cell = styled.span`
  height: 1.65rem;
  border-radius: 0.35rem;
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
