import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { VolumeTrends } from '../../services/api/analytics';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

interface VolumeTrendsCardProps {
  data?: VolumeTrends;
  isLoading?: boolean;
}

const WEEK_LABELS = [1, 2, 3, 4] as const;

function generatePath(weeks: { volumeKg: number }[]): { path: string; area: string } {
  const points = weeks.map((w, index) => ({
    x: 75 + index * 250,
    vol: w.volumeKg,
  }));

  const maxVol = Math.max(...points.map((p) => p.vol), 1);
  const coords = points.map((p) => ({
    x: p.x,
    y: Math.round(180 - (p.vol / maxVol) * 140),
  }));

  if (coords.length < 4) {
    const flat = 'M 0 180 L 900 180';
    return { path: flat, area: `${flat} L 900 210 L 0 210 Z` };
  }

  // Smooth cubic bezier through coords
  const p0 = coords[0];
  const p1 = coords[1];
  const p2 = coords[2];
  const p3 = coords[3];

  const path = `M 0 ${p0.y} C ${p0.x / 2} ${p0.y}, ${p0.x - 40} ${p0.y}, ${p0.x} ${p0.y} S ${p1.x - 80} ${p1.y}, ${p1.x} ${p1.y} S ${p2.x - 80} ${p2.y}, ${p2.x} ${p2.y} S ${p3.x - 80} ${p3.y}, ${p3.x} ${p3.y} L 900 ${p3.y}`;
  const area = `${path} L 900 210 L 0 210 Z`;

  return { path, area };
}

export function VolumeTrendsCard({ data, isLoading }: VolumeTrendsCardProps) {
  const { t } = useTranslation();

  const total = data?.totalVolumeKg ?? 0;
  const delta = data?.deltaPercent ?? 0;
  const deltaFormatted = delta > 0 ? `+${delta}%` : `${delta}%`;
  const weeks = data?.weeks || [];

  const { path, area } = useMemo(() => {
    return generatePath(weeks);
  }, [weeks]);

  const peak = data?.peakSession;

  return (
    <AnalyticsCard>
      <HeaderRow>
        <div>
          <Eyebrow>{t('analytics.workoutIntensity')}</Eyebrow>
          <CardTitle>{t('analytics.volumeTrends')}</CardTitle>
        </div>
        <TotalsWrap>
          <TotalValue>
            {isLoading ? '...' : total.toLocaleString()} <TotalUnit>{t('analytics.kg')}</TotalUnit>
          </TotalValue>
          <Delta $positive={delta >= 0}>
            {deltaFormatted} {t('analytics.vsLastMonth', 'vs previous period')}
          </Delta>
        </TotalsWrap>
      </HeaderRow>

      <ChartWrap>
        <ChartSvg viewBox="0 0 900 220" preserveAspectRatio="none" role="img" aria-label={t('analytics.volumeTrend')}>
          <defs>
            <linearGradient id="volumeAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef233c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef233c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#volumeAreaGradient)" />
          <path d={path} fill="none" stroke="#ef233c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </ChartSvg>
        {peak && peak.volumeKg > 0 ? (
          <Marker>
            <MarkerDate>{peak.date}</MarkerDate>
            <MarkerValue>{peak.volumeKg.toLocaleString()} {t('analytics.kg')}</MarkerValue>
          </Marker>
        ) : null}
      </ChartWrap>

      <WeekLabels>
        {WEEK_LABELS.map((label) => (
          <WeekLabel key={label}>{t('analytics.week', { number: label })}</WeekLabel>
        ))}
      </WeekLabels>
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

const Delta = styled.p<{ $positive: boolean }>`
  margin: 0.2rem 0 0;
  color: ${({ $positive }) => ($positive ? '#55c2ff' : '#f28b98')};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  font-weight: 700;
`;

const ChartWrap = styled.div`
  position: relative;
  margin-top: 1.5rem;
  height: 13.5rem;
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const Marker = styled.div`
  position: absolute;
  left: 54%;
  top: 14%;
  background: #181c38;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.55rem;
  padding: 0.5rem 0.75rem;
  min-width: 5.75rem;
  text-align: left;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
`;

const MarkerDate = styled.p`
  margin: 0;
  color: #9aa0bf;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const MarkerValue = styled.p`
  margin: 0.2rem 0 0;
  color: #f6f7ff;
  font-size: 0.95rem;
  font-weight: 700;
`;

const WeekLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 0.75rem;
  color: #8b90ae;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.68rem;
  font-weight: 600;
`;

const WeekLabel = styled.span`
  &:last-child {
    text-align: right;
  }
`;
