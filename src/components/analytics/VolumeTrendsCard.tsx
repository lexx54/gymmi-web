import styled from 'styled-components';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'] as const;

const TREND_PATH = 'M0 170 C 80 160, 140 90, 210 95 S 330 175, 400 175 S 520 55, 620 45 S 760 150, 860 120 L 900 110';
const TREND_AREA = `${TREND_PATH} L 900 210 L 0 210 Z`;

/**
 * Displays the weekly workout intensity trend line with the total volume.
 */
export function VolumeTrendsCard() {
  return (
    <AnalyticsCard>
      <HeaderRow>
        <div>
          <Eyebrow>Workout Intensity</Eyebrow>
          <CardTitle>Volume Trends</CardTitle>
        </div>
        <TotalsWrap>
          <TotalValue>
            142,500 <TotalUnit>KG</TotalUnit>
          </TotalValue>
          <Delta>+12.4% VS LAST MONTH</Delta>
        </TotalsWrap>
      </HeaderRow>

      <ChartWrap>
        <ChartSvg viewBox="0 0 900 220" preserveAspectRatio="none" role="img" aria-label="Volume trend">
          <defs>
            <linearGradient id="volumeAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef233c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef233c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={TREND_AREA} fill="url(#volumeAreaGradient)" />
          <path d={TREND_PATH} fill="none" stroke="#ef233c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </ChartSvg>
        <Marker>
          <MarkerDate>Oct 24</MarkerDate>
          <MarkerValue>4,820 KG</MarkerValue>
        </Marker>
      </ChartWrap>

      <WeekLabels>
        {WEEK_LABELS.map((label) => (
          <WeekLabel key={label}>{label}</WeekLabel>
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

const Delta = styled.p`
  margin: 0.2rem 0 0;
  color: #f28b98;
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
