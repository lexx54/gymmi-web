import { ArrowRight, CalendarDays, Dumbbell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMyWorkoutAssignment } from '../../hooks/useWorkouts';

/**
 * Shows the client's single active workout assignment.
 */
export function ActiveWorkoutCard({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation();
  const { data: assignment } = useMyWorkoutAssignment(enabled);
  if (!enabled || !assignment?.routine) return null;

  const firstWeek = assignment.routine.days.find(
    (day) => day.weekStartDate,
  )?.weekStartDate;
  const displayDays = firstWeek
    ? assignment.routine.days.filter(
        (day) => day.weekStartDate === firstWeek,
      )
    : assignment.routine.days;
  const exerciseCount = displayDays.reduce(
    (count, day) => count + day.exercises.length,
    0,
  );

  return (
    <Card>
      <Icon><Dumbbell size={22} /></Icon>
      <Copy>
        <Eyebrow>{t('workouts.activeAssignment')}</Eyebrow>
        <Title>{assignment.routine.name}</Title>
        <Meta>
          <CalendarDays size={14} />
          {t('workouts.assignmentDates', { start: assignment.startDate, end: assignment.endDate })}
          <span>·</span>
          {t('workouts.exerciseCount', { count: exerciseCount })}
        </Meta>
      </Copy>
      <OpenLink to={`/workout/${assignment.routineId}`} aria-label={t('workouts.openAssigned')}>
        <ArrowRight size={18} />
      </OpenLink>
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 83, 90, 0.75);
  border-radius: 1.15rem;
  padding: 1rem 1.15rem;
  background: linear-gradient(110deg, rgba(255,83,90,.18), #171b34 45%);
`;
const Icon = styled.span`display: grid; flex: 0 0 2.8rem; height: 2.8rem; place-items: center; border-radius: .8rem; background: #ff535a; color: #260006;`;
const Copy = styled.div`min-width: 0; flex: 1;`;
const Eyebrow = styled.p`margin: 0; color: #ffb3b1; font-size: .65rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase;`;
const Title = styled.h2`overflow: hidden; margin: .2rem 0; color: #fff; font-size: 1.1rem; text-overflow: ellipsis; white-space: nowrap;`;
const Meta = styled.p`display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; margin: 0; color: #e7bdbb; font-size: .72rem;`;
const OpenLink = styled(Link)`display: grid; flex: 0 0 2.5rem; height: 2.5rem; place-items: center; border-radius: 50%; background: #313349; color: #ffb3b1;`;
