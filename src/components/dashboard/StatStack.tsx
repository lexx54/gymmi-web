import { Droplets, Flame, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type StatItem = {
  labelKey: string;
  value: string;
  unitKey: string;
  icon: LucideIcon;
};

const STATS: StatItem[] = [
  { labelKey: 'dashboard.calories', value: '1,842', unitKey: 'dashboard.kcal', icon: Flame },
  { labelKey: 'dashboard.activeTime', value: '124', unitKey: 'dashboard.mins', icon: Timer },
  { labelKey: 'dashboard.hydration', value: '2.8', unitKey: 'dashboard.liters', icon: Droplets },
];

/**
 * Renders the right-column stat cards.
 */
export function StatStack() {
  const { t } = useTranslation();

  return (
    <Stack>
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.labelKey}>
            <IconWrap>
              <Icon size={16} />
            </IconWrap>
            <Label>{t(stat.labelKey)}</Label>
            <ValueRow>
              <Value>{stat.value}</Value>
              <Unit>{t(stat.unitKey)}</Unit>
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
