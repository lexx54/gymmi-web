import { Dumbbell, Flame, Sparkles, Timer, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useMyAnalytics } from '../../hooks/useAnalytics';
import { useTrainerDashboard } from '../../hooks/useTrainerDashboard';

/**
 * Renders the right-column stat cards:
 * - For Clients: Weekly Volume, Active Time, Daily Streak.
 * - For Trainers: Total Clients, Available Workouts, and Coming Soon.
 */
export function StatStack() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isTrainer = user?.role?.name === 'Trainer';
  const isClient = user?.role?.name === 'Client';

  const { data: analytics, isLoading: isClientLoading } = useMyAnalytics(isClient);
  const { data: trainerData, isLoading: isTrainerLoading } = useTrainerDashboard(isTrainer);

  // Client calculations
  const weeklyVolume = analytics?.volumeTrends?.dailyVolume?.length
    ? analytics.volumeTrends.dailyVolume.reduce((acc, d) => acc + d.volumeKg, 0)
    : (analytics?.volumeTrends?.weeks?.[3]?.volumeKg ?? 0);

  const currentWeekActiveMinutes = analytics?.consistency?.grid
    ? analytics.consistency.grid.reduce((sum, row) => sum + (row[4]?.durationMinutes ?? 0), 0)
    : 0;

  const streak = analytics?.consistency?.streak ?? 0;

  const stats = isTrainer
    ? [
        {
          id: 'clients',
          label: t('dashboard.totalClients'),
          value:
            isTrainerLoading && !trainerData
              ? '...'
              : String(trainerData?.metrics?.totalClients ?? 0),
          unit: t('dashboard.clients'),
          icon: Users,
          iconColor: '#ff8a93',
        },
        {
          id: 'workouts',
          label: t('dashboard.availableWorkouts'),
          value:
            isTrainerLoading && !trainerData
              ? '...'
              : String(trainerData?.metrics?.availableWorkouts ?? 0),
          unit: t('dashboard.workouts'),
          icon: Dumbbell,
          iconColor: '#f7c873',
        },
        {
          id: 'placeholder',
          label: t('dashboard.comingSoon'),
          value: '—',
          unit: '',
          icon: Sparkles,
          iconColor: '#7c84aa',
        },
      ]
    : [
        {
          id: 'volume',
          label: t('dashboard.weeklyVolume'),
          value: isClientLoading && !analytics ? '...' : weeklyVolume.toLocaleString(),
          unit: t('dashboard.kg'),
          icon: Dumbbell,
          iconColor: '#ff8a93',
        },
        {
          id: 'activeTime',
          label: t('dashboard.activeTime'),
          value: isClientLoading && !analytics ? '...' : String(currentWeekActiveMinutes),
          unit: t('dashboard.mins'),
          icon: Timer,
          iconColor: '#f7c873',
        },
        {
          id: 'streak',
          label: t('dashboard.dailyStreak'),
          value: isClientLoading && !analytics ? '...' : String(streak),
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
            <CardHeader>
              <IconWrap $color={stat.iconColor}>
                <Icon size={18} />
              </IconWrap>
              <Label>{stat.label}</Label>
            </CardHeader>
            <ValueRow>
              <Value>{stat.value}</Value>
              {stat.unit ? <Unit>{stat.unit}</Unit> : null}
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
  gap: 0.85rem;
`;

const Card = styled.article`
  border-radius: 1.35rem;
  border: 1px solid rgba(126, 136, 175, 0.18);
  background: linear-gradient(180deg, #181d36 0%, #12152d 100%);
  padding: 0.95rem 1.15rem 1rem;
  min-height: 5.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const IconWrap = styled.div<{ $color?: string }>`
  color: ${({ $color }) => $color ?? '#f5b9bf'};
  display: flex;
  align-items: center;
`;

const Label = styled.p`
  margin: 0;
  color: #d4d8ee;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.65rem;
  font-weight: 700;
  text-align: right;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
`;

const Value = styled.p`
  margin: 0;
  color: #f5f6ff;
  font-size: 2.35rem;
  font-weight: 760;
  line-height: 1;
`;

const Unit = styled.span`
  color: #c7cce6;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.88rem;
  font-weight: 700;
`;
