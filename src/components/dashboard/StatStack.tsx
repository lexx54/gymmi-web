import { Dumbbell, Flame, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useMyAnalytics } from '../../hooks/useAnalytics';

/**
 * Renders the right-column stat cards (Weekly Volume, Active Time, Daily Streak).
 */
export function StatStack() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isClient = user?.role?.name === 'Client';
  const { data: analytics, isLoading } = useMyAnalytics(isClient);

  // Weekly workout volume for current week (sum of dailyVolume or 4th week)
  const weeklyVolume = analytics?.volumeTrends?.dailyVolume?.length
    ? analytics.volumeTrends.dailyVolume.reduce((acc, d) => acc + d.volumeKg, 0)
    : (analytics?.volumeTrends?.weeks?.[3]?.volumeKg ?? 0);

  // Active time for the current week (weekIndex: 4 across Monday-Sunday)
  const currentWeekActiveMinutes = analytics?.consistency?.grid
    ? analytics.consistency.grid.reduce((sum, row) => sum + (row[4]?.durationMinutes ?? 0), 0)
    : 0;

  // Consecutive day streak
  const streak = analytics?.consistency?.streak ?? 0;

  const stats = [
    {
      id: 'volume',
      label: t('dashboard.weeklyVolume'),
      value: isLoading && !analytics ? '...' : weeklyVolume.toLocaleString(),
      unit: t('dashboard.kg'),
      icon: Dumbbell,
      iconColor: '#ff8a93',
    },
    {
      id: 'activeTime',
      label: t('dashboard.activeTime'),
      value: isLoading && !analytics ? '...' : String(currentWeekActiveMinutes),
      unit: t('dashboard.mins'),
      icon: Timer,
      iconColor: '#f7c873',
    },
    {
      id: 'streak',
      label: t('dashboard.dailyStreak'),
      value: isLoading && !analytics ? '...' : String(streak),
      unit: t('dashboard.days'),
      icon: Flame,
      iconColor: '#ef233c',
    },
  ];

  return (
    <Stack>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} data-testid={`stat-${stat.id}`}>
            <IconWrap $color={stat.iconColor}>
              <Icon size={18} />
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

const IconWrap = styled.div<{ $color?: string }>`
  color: ${({ $color }) => $color ?? '#f5b9bf'};
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
