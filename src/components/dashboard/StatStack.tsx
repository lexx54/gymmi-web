import { Droplets, Flame, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styled from 'styled-components';

type StatItem = {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
};

const STATS: StatItem[] = [
  { label: 'Calories', value: '1,842', unit: 'KCAL', icon: Flame },
  { label: 'Active Time', value: '124', unit: 'MINS', icon: Timer },
  { label: 'Hydration', value: '2.8', unit: 'LITERS', icon: Droplets },
];

/**
 * Renders the right-column stat cards.
 */
export function StatStack() {
  return (
    <Stack>
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <IconWrap>
              <Icon size={16} />
            </IconWrap>
            <Label>{stat.label}</Label>
            <ValueRow>
              <Value>{stat.value}</Value>
              <Unit>{stat.unit}</Unit>
            </ValueRow>
          </Card>
        );
      })}
    </Stack>
  );
}

const Stack = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.article`
  border-radius: 1.45rem;
  border: 1px solid rgba(126, 136, 175, 0.2);
  background: linear-gradient(180deg, #181d36 0%, #12152d 100%);
  padding: 1rem 1.1rem 1.15rem;
  min-height: 10.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IconWrap = styled.div`
  color: #f5b9bf;
`;

const Label = styled.p`
  margin: 0;
  color: #d4d8ee;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.65rem;
  font-weight: 700;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
`;

const Value = styled.p`
  margin: 0;
  color: #f5f6ff;
  font-size: 2.65rem;
  font-weight: 760;
  line-height: 1;
`;

const Unit = styled.span`
  color: #c7cce6;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.92rem;
  font-weight: 700;
`;
