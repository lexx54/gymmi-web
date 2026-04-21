import { ArrowUp, Minus, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styled from 'styled-components';
import { AnalyticsCard, CardTitle, Eyebrow } from './AnalyticsShell';

type Status = 'ELITE' | 'ADVANCED';

type RecordRow = {
  id: string;
  exercise: string;
  date: string;
  weight: string;
  status: Status;
  icon: LucideIcon;
};

const RECORDS: RecordRow[] = [
  { id: 'squat', exercise: 'Back Squat', date: 'Oct 12, 2024', weight: '185.0', status: 'ELITE', icon: TrendingUp },
  { id: 'bench', exercise: 'Bench Press', date: 'Sep 28, 2024', weight: '120.0', status: 'ADVANCED', icon: Minus },
  { id: 'deadlift', exercise: 'Deadlift', date: 'Nov 02, 2024', weight: '220.0', status: 'ELITE', icon: ArrowUp },
];

/**
 * Lists the athlete's personal records in a compact table-like layout.
 */
export function PersonalRecordsCard() {
  return (
    <AnalyticsCard>
      <Eyebrow>Hall of Fame</Eyebrow>
      <CardTitle>Personal Records</CardTitle>

      <HeaderRow>
        <HeaderCell>Exercise</HeaderCell>
        <HeaderCell>Last PR Date</HeaderCell>
        <HeaderCell>Weight</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </HeaderRow>

      <List>
        {RECORDS.map((record) => {
          const Icon = record.icon;
          return (
            <Row key={record.id}>
              <ExerciseCell>
                <IconWrap>
                  <Icon size={16} />
                </IconWrap>
                <ExerciseName>{record.exercise}</ExerciseName>
              </ExerciseCell>
              <DateCell>{record.date}</DateCell>
              <WeightCell>
                {record.weight} <WeightUnit>KG</WeightUnit>
              </WeightCell>
              <StatusCell>
                <StatusBadge $status={record.status}>
                  <StatusDot />
                  {record.status}
                </StatusBadge>
              </StatusCell>
            </Row>
          );
        })}
      </List>
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

const StatusBadge = styled.span<{ $status: Status }>`
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
    $status === 'ELITE' ? 'rgba(239, 35, 60, 0.22)' : 'rgba(239, 35, 60, 0.12)'};
  color: ${({ $status }) => ($status === 'ELITE' ? '#ff8994' : '#f5a7ad')};
`;

const StatusDot = styled.span`
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 9999px;
  background: currentColor;
`;
