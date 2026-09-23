import { ArrowUp, Minus, TrendingUp, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { PersonalRecord, PersonalRecordStatus } from '../../services/api/analytics';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

interface PersonalRecordsCardProps {
  records?: PersonalRecord[];
  isLoading?: boolean;
}

function getStatusIcon(status: PersonalRecordStatus) {
  switch (status) {
    case 'ALL-TIME BEST':
      return TrendingUp;
    case 'NEW PR':
      return ArrowUp;
    default:
      return Minus;
  }
}

export function PersonalRecordsCard({ records = [], isLoading }: PersonalRecordsCardProps) {
  const { t } = useTranslation();

  return (
    <AnalyticsCard>
      <Eyebrow>{t('analytics.hallOfFame')}</Eyebrow>
      <CardTitle>{t('analytics.personalRecords')}</CardTitle>

      {records.length > 0 ? (
        <>
          <HeaderRow>
            <HeaderCell>{t('analytics.exercise')}</HeaderCell>
            <HeaderCell>{t('analytics.lastPrDate')}</HeaderCell>
            <HeaderCell>{t('analytics.weight')}</HeaderCell>
            <HeaderCell>{t('analytics.status')}</HeaderCell>
          </HeaderRow>

          <List>
            {records.map((record) => {
              const Icon = getStatusIcon(record.status);
              return (
                <Row key={record.exerciseId}>
                  <ExerciseCell>
                    <IconWrap>
                      <Icon size={16} />
                    </IconWrap>
                    <ExerciseName>{record.exerciseName}</ExerciseName>
                  </ExerciseCell>
                  <DateCell>{record.date}</DateCell>
                  <WeightCell>
                    {record.weightKg} <WeightUnit>{t('analytics.kg')}</WeightUnit>
                  </WeightCell>
                  <StatusCell>
                    <StatusBadge $status={record.status}>
                      <StatusDot />
                      {record.status === 'ALL-TIME BEST'
                        ? t('analytics.allTimeBest', 'ALL-TIME BEST')
                        : record.status === 'NEW PR'
                          ? t('analytics.newPr', 'NEW PR')
                          : t('analytics.steady', 'STEADY')}
                    </StatusBadge>
                  </StatusCell>
                </Row>
              );
            })}
          </List>
        </>
      ) : (
        <EmptyState>
          <Trophy size={32} color="#5e6787" />
          <EmptyText>
            {isLoading ? t('common.loading', 'Loading...') : t('analytics.noPrs', 'No personal records logged yet')}
          </EmptyText>
        </EmptyState>
      )}
    </AnalyticsCard>
  );
}

const GRID = 'minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)';

const HeaderRow = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: ${GRID};
  gap: 1rem;
  padding: 0 0 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const HeaderCell = styled.span`
  color: #8e94b4;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.65rem;
  font-weight: 600;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 1rem;
  align-items: center;
  padding: 1.1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }
`;

const ExerciseCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

const IconWrap = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  background: rgba(239, 35, 60, 0.18);
  color: #f7a2ac;
  display: grid;
  place-items: center;
`;

const ExerciseName = styled.span`
  color: #f5f6ff;
  font-weight: 700;
  font-size: 0.95rem;
`;

const DateCell = styled.span`
  color: #c3c7e1;
  font-size: 0.9rem;
`;

const WeightCell = styled.span`
  color: #f5f6ff;
  font-weight: 700;
  font-size: 1rem;
`;

const WeightUnit = styled.span`
  color: #9096b6;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.1rem;
`;

const StatusCell = styled.span``;

const StatusBadge = styled.span<{ $status: PersonalRecordStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: ${({ $status }) =>
    $status === 'ALL-TIME BEST'
      ? 'rgba(239, 35, 60, 0.22)'
      : $status === 'NEW PR'
        ? 'rgba(85, 194, 255, 0.22)'
        : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $status }) =>
    $status === 'ALL-TIME BEST'
      ? '#ff8994'
      : $status === 'NEW PR'
        ? '#55c2ff'
        : '#bdc2e1'};
`;

const StatusDot = styled.span`
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 9999px;
  background: currentColor;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  gap: 0.75rem;
`;

const EmptyText = styled.p`
  margin: 0;
  color: #8e94b4;
  font-size: 0.9rem;
`;
