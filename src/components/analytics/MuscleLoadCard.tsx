import styled from 'styled-components';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

type Segment = {
  id: string;
  label: string;
  percent: number;
  color: string;
};

const SEGMENTS: Segment[] = [
  { id: 'legs', label: 'Legs (Lower Body)', percent: 45, color: '#ef233c' },
  { id: 'push', label: 'Push (Chest/Shoulders)', percent: 30, color: '#f5a7ad' },
  { id: 'core', label: 'Core & Stability', percent: 15, color: '#5e6787' },
  { id: 'other', label: 'Other', percent: 10, color: '#3d4463' },
];

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type SegmentSlice = Segment & { dash: number; offset: number };

function computeSlices(segments: Segment[]): SegmentSlice[] {
  let cursor = 0;
  return segments.map((segment) => {
    const dash = (segment.percent / 100) * CIRCUMFERENCE;
    const slice: SegmentSlice = { ...segment, dash, offset: cursor };
    cursor += dash;
    return slice;
  });
}

/**
 * Shows training load distribution across muscle groups.
 */
export function MuscleLoadCard() {
  const slices = computeSlices(SEGMENTS);

  return (
    <AnalyticsCard>
      <Eyebrow>Body Composition</Eyebrow>
      <CardTitle>Muscle Load</CardTitle>

      <DonutWrap>
        <DonutSvg viewBox="0 0 200 200" role="img" aria-label="Muscle load distribution">
          <circle cx="100" cy="100" r={RADIUS} stroke="#23284a" strokeWidth="20" fill="none" />
          {slices.map((slice) => (
            <circle
              key={slice.id}
              cx="100"
              cy="100"
              r={RADIUS}
              stroke={slice.color}
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${slice.dash} ${CIRCUMFERENCE - slice.dash}`}
              strokeDashoffset={-slice.offset}
              transform="rotate(-90 100 100)"
              strokeLinecap="butt"
            />
          ))}
        </DonutSvg>
        <DonutCenter>
          <CenterValue>84</CenterValue>
          <CenterLabel>Sets</CenterLabel>
        </DonutCenter>
      </DonutWrap>

      <Legend>
        {SEGMENTS.map((segment) => (
          <LegendItem key={segment.id}>
            <LegendDot style={{ background: segment.color }} />
            <LegendLabel>{segment.label}</LegendLabel>
            <LegendValue>{segment.percent}%</LegendValue>
          </LegendItem>
        ))}
      </Legend>
    </AnalyticsCard>
  );
}

const DonutWrap = styled.div`
  margin-top: 1.25rem;
  position: relative;
  display: grid;
  place-items: center;
`;

const DonutSvg = styled.svg`
  width: 12.5rem;
  height: 12.5rem;
`;

const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
`;

const CenterValue = styled.p`
  margin: 0;
  color: #f5f6ff;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
`;

const CenterLabel = styled.p`
  margin: 0.25rem 0 0;
  color: #8e94b4;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.65rem;
  font-weight: 600;
`;

const Legend = styled.ul`
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LegendItem = styled.li`
  display: grid;
  grid-template-columns: 0.5rem 1fr auto;
  align-items: center;
  gap: 0.65rem;
`;

const LegendDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
`;

const LegendLabel = styled.span`
  color: #cfd3ec;
  font-size: 0.82rem;
`;

const LegendValue = styled.span`
  color: #f5f6ff;
  font-size: 0.82rem;
  font-weight: 700;
`;
