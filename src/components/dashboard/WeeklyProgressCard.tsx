import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useMyAnalytics } from '../../hooks/useAnalytics';
import { useTrainerDashboard } from '../../hooks/useTrainerDashboard';

const WEEKDAYS = [
  { index: 0, dayKey: 'dates.mon' },
  { index: 1, dayKey: 'dates.tue' },
  { index: 2, dayKey: 'dates.wed' },
  { index: 3, dayKey: 'dates.thu' },
  { index: 4, dayKey: 'dates.fri' },
  { index: 5, dayKey: 'dates.sat' },
  { index: 6, dayKey: 'dates.sun' },
];

/**
 * Displays weekly workout progress:
 * - For Clients: Mon–Sun daily volume bars with peak scaling and goal reached %.
 * - For Trainers: Mon–Sun client activity bars (unique clients trained) scaled against total contracted clients, with active rate %.
 */
export function WeeklyProgressCard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isTrainer = user?.role?.name === 'Trainer';
  const isClient = user?.role?.name === 'Client';

  const { data: analytics, isLoading: isClientLoading } = useMyAnalytics(isClient);
  const { data: trainerData, isLoading: isTrainerLoading } = useTrainerDashboard(isTrainer);

  // Current weekday (0=Mon, ..., 6=Sun)
  const jsDay = new Date().getDay();
  const currentWeekday = jsDay === 0 ? 6 : jsDay - 1;

  // Header stats & titles
  const title = isTrainer ? t('dashboard.clientActivity') : t('dashboard.volumeTraining');
  const percentCaption = isTrainer ? t('dashboard.activeRate') : t('dashboard.goalReached');

  let percentValue = '0%';
  if (isTrainer) {
    percentValue =
      isTrainerLoading && !trainerData
        ? '...'
        : `${trainerData?.clientActivity?.activeRatePercent ?? 0}%`;
  } else {
    const completionPercent = analytics?.consistency?.completionPercent ?? 0;
    percentValue = isClientLoading && !analytics ? '...' : `${completionPercent}%`;
  }

  // Client daily volume calculations
  const dailyVolume = analytics?.volumeTrends?.dailyVolume ?? [];
  const maxVolume = Math.max(1, ...dailyVolume.map((d) => d.volumeKg));

  // Trainer client activity calculations
  const totalClients = trainerData?.clientActivity?.totalClients ?? 0;
  const trainerDaily = trainerData?.clientActivity?.daily ?? [];

  return (
    <Card data-testid="weekly-progress-card">
      <HeaderRow>
        <div>
          <Eyebrow>{t('dashboard.weeklyProgress')}</Eyebrow>
          <Title>{title}</Title>
        </div>
        <PercentWrap>
          <Percent data-testid="goal-percent">{percentValue}</Percent>
          <PercentCaption>{percentCaption}</PercentCaption>
        </PercentWrap>
      </HeaderRow>

      <BarsWrap>
        {WEEKDAYS.map((day) => {
          let height = 12;
          let hasData = false;
          let barTitle = '';
          let barDisplayValue = '';

          if (isTrainer) {
            const entry = trainerDaily.find((v) => v.weekday === day.index);
            const activeClients = entry?.activeClients ?? 0;
            hasData = activeClients > 0;
            height = hasData
              ? Math.max(18, Math.round((activeClients / Math.max(1, totalClients)) * 92))
              : 12;
            barTitle = `${t(day.dayKey)}: ${activeClients} ${t('dashboard.clients')}`;
            barDisplayValue = hasData ? String(activeClients) : '';
          } else {
            const entry = dailyVolume.find((v) => v.weekday === day.index);
            const volume = entry?.volumeKg ?? 0;
            hasData = volume > 0;
            height = hasData
              ? Math.max(18, Math.round((volume / maxVolume) * 92))
              : 12;
            barTitle = `${t(day.dayKey)}: ${volume.toLocaleString()} kg`;
            barDisplayValue = hasData
              ? volume >= 1000
                ? `${(volume / 1000).toFixed(1)}k`
                : String(volume)
              : '';
          }

          const isActive = day.index === currentWeekday;

          return (
            <BarItem key={day.dayKey}>
              <BarTrack>
                <Bar
                  $height={height}
                  $active={isActive}
                  $hasVolume={hasData}
                  title={barTitle}
                  data-testid={`bar-${day.index}`}
                >
                  {hasData && <BarVolume>{barDisplayValue}</BarVolume>}
                </Bar>
              </BarTrack>
              <DayLabel $active={isActive}>{t(day.dayKey)}</DayLabel>
            </BarItem>
          );
        })}
      </BarsWrap>
    </Card>
  );
}

const Card = styled.section`
  border-radius: 1.9rem;
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(124, 132, 170, 0.14);
  padding: 1.55rem 1.6rem 1.45rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.35rem;
  color: #c5cbe9;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 600;
`;

const Title = styled.h3`
  margin: 0;
  color: #f2f3fe;
  font-size: 2.7rem;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  font-weight: 750;
`;

const PercentWrap = styled.div`
  text-align: right;
  margin-top: 0.2rem;
`;

const Percent = styled.p`
  margin: 0;
  color: #f9aab1;
  font-size: 2.75rem;
  font-style: italic;
  font-weight: 800;
`;

const PercentCaption = styled.p`
  margin: 0.2rem 0 0;
  color: #f6c5ca;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.68rem;
  font-weight: 600;
`;

const BarsWrap = styled.div`
  margin-top: 1.2rem;
  height: 18.75rem;
  border-radius: 1.35rem;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: stretch;
  gap: 0.8rem;
  padding: 2.2rem 0.8rem 0.9rem;
  background: linear-gradient(180deg, rgba(18, 21, 41, 0.4) 0%, rgba(13, 17, 33, 0.75) 100%);
`;

const BarItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 0.75rem;
`;

const BarTrack = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Bar = styled.div<{ $height: number; $active: boolean; $hasVolume: boolean }>`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  min-height: 1.5rem;
  border-radius: 0.75rem 0.75rem 0.4rem 0.4rem;
  background: ${({ $active, $hasVolume }) =>
    $hasVolume
      ? 'linear-gradient(180deg, #ff8a93 0%, #ef233c 95%)'
      : $active
        ? 'linear-gradient(180deg, rgba(239, 35, 60, 0.35) 0%, rgba(239, 35, 60, 0.15) 100%)'
        : 'linear-gradient(180deg, #2b3046 0%, #1f2334 100%)'};
  border: ${({ $active, $hasVolume }) =>
    $active && !$hasVolume ? '1px dashed rgba(239, 35, 60, 0.6)' : 'none'};
  box-shadow: ${({ $hasVolume, $active }) =>
    $hasVolume
      ? '0 0 16px rgba(239, 35, 60, 0.35)'
      : $active
        ? '0 0 8px rgba(239, 35, 60, 0.2)'
        : 'none'};
  transition: height 0.3s ease;
  position: relative;
`;

const BarVolume = styled.span`
  position: absolute;
  top: -1.35rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  font-weight: 700;
  color: #cfd3ec;
  white-space: nowrap;
`;

const DayLabel = styled.span<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#ffffff' : '#8e94b4')};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: ${({ $active }) => ($active ? '700' : '600')};
`;
