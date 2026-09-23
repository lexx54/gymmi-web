import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { MuscleLoad, MuscleSegment } from '../../services/api/analytics';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

interface MuscleLoadCardProps {
  data?: MuscleLoad;
  isLoading?: boolean;
}

const DEFAULT_SEGMENTS: MuscleSegment[] = [
  { id: 'lower', labelKey: 'analytics.lowerBody', sets: 0, percent: 0, color: '#ef233c' },
  { id: 'upper', labelKey: 'analytics.upperBody', sets: 0, percent: 0, color: '#f5a7ad' },
  { id: 'arms', labelKey: 'analytics.arms', sets: 0, percent: 0, color: '#5e6787' },
  { id: 'core', labelKey: 'analytics.core', sets: 0, percent: 0, color: '#3d4463' },
];

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type SegmentSlice = MuscleSegment & { dash: number; offset: number };

function computeSlices(segments: MuscleSegment[]): SegmentSlice[] {
  let cursor = 0;
  return segments.map((segment) => {
    const dash = (segment.percent / 100) * CIRCUMFERENCE;
    const slice: SegmentSlice = { ...segment, dash, offset: cursor };
    cursor += dash;
    return slice;
  });
}

export function MuscleLoadCard({ data, isLoading }: MuscleLoadCardProps) {
  const { t } = useTranslation();
  const segments = data?.distribution && data.distribution.length > 0 ? data.distribution : DEFAULT_SEGMENTS;
  const totalSets = data?.totalSets ?? 0;
  const slices = computeSlices(segments);

  return (
    <AnalyticsCard>
      <Eyebrow>{t('analytics.bodyComposition')}</Eyebrow>
      <CardTitle>{t('analytics.muscleLoad')}</CardTitle>

      <DonutWrap>
        <DonutSvg viewBox="0 0 200 200" role="img" aria-label={t('analytics.muscleLoadDistribution')}>
          <circle cx="100" cy="100" r={RADIUS} stroke="#23284a" strokeWidth="20" fill="none" />
          {totalSets > 0 &&
            slices.map((slice) => (
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
          <CenterValue>{isLoading ? '...' : totalSets}</CenterValue>
          <CenterLabel>{t('analytics.sets')}</CenterLabel>
        </DonutCenter>
      </DonutWrap>

      <Legend>
        {segments.map((segment) => (
          <LegendItem key={segment.id}>
            <LegendDot style={{ background: segment.color }} />
            <LegendLabel>{t(segment.labelKey, segment.id)}</LegendLabel>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
`;

const CenterValue = styled.p`
  margin: 0;
  color: #f5f6ff;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const CenterLabel = styled.p`
  margin: 0.35rem 0 0;
  color: #8e94b4;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
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
