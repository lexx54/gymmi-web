import { BarChart3 } from 'lucide-react';
import styled from 'styled-components';
import { CardSurface, SectionTitle } from './SettingsShell';

interface ZoneData {
  label: string;
  value: string;
  percent: number;
}

const zones: ZoneData[] = [
  { label: 'ZONE 5', value: '178+', percent: 100 },
  { label: 'ZONE 4', value: '162', percent: 78 },
  { label: 'ZONE 3', value: '145', percent: 58 },
];

/**
 * Training metrics section with unit system toggle and heart rate zones.
 */
export function TrainingMetricsCard() {
  return (
    <Wrapper>
      <SectionTitle>
        <BarChart3 size={18} color="#ffb3b1" /> Training Metrics
      </SectionTitle>

      <MetricSection>
        <MetricRow>
          <MetricLabel>
            <MetricName>Unit System</MetricName>
            <MetricSub>Metric (km, kg, celsius)</MetricSub>
          </MetricLabel>
          <ToggleGroup>
            <ToggleButton $active>METRIC</ToggleButton>
            <ToggleButton $active={false}>IMPERIAL</ToggleButton>
          </ToggleGroup>
        </MetricRow>
      </MetricSection>

      <ZonesSection>
        <ZonesHeader>
          <ZonesTitle>Heart Rate Zones</ZonesTitle>
          <CalcAuto>CALCULATE AUTO</CalcAuto>
        </ZonesHeader>
        {zones.map((zone) => (
          <ZoneRow key={zone.label}>
            <ZoneLabel>{zone.label}</ZoneLabel>
            <ZoneBarTrack>
              <ZoneBarFill style={{ width: `${zone.percent}%` }} />
            </ZoneBarTrack>
            <ZoneValue>{zone.value}</ZoneValue>
          </ZoneRow>
        ))}
      </ZonesSection>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const MetricSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MetricRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const MetricLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const MetricName = styled.span`
  color: #f5f6ff;
  font-size: 0.95rem;
  font-weight: 600;
`;

const MetricSub = styled.span`
  color: #9096b6;
  font-size: 0.72rem;
`;

const ToggleGroup = styled.div`
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
  background: ${({ $active }) => ($active ? '#313349' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f5f6ff' : '#9096b6')};
`;

const ZonesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ZonesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ZonesTitle = styled.span`
  color: #f5f6ff;
  font-size: 0.95rem;
  font-weight: 600;
`;

const CalcAuto = styled.button`
  border: none;
  background: transparent;
  color: #9096b6;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: #ffb3b1;
  }
`;

const ZoneRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ZoneLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  min-width: 3.5rem;
`;

const ZoneBarTrack = styled.div`
  flex: 1;
  height: 0.55rem;
  border-radius: 9999px;
  background: rgba(255, 179, 177, 0.12);
`;

const ZoneBarFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #ffb3b1, #ef233c);
`;

const ZoneValue = styled.span`
  color: #f5f6ff;
  font-size: 0.78rem;
  font-weight: 600;
  min-width: 2.5rem;
  text-align: right;
`;
