import { ArrowDown, ArrowUp, PlusSquare, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SetRow } from './SetRow';
import { SUPERSET_COLORS, type SupersetColor } from '../../services/api/workouts';
import type { RoutineExercise, SetField } from './types';

type ExerciseCardProps = {
  exercise: RoutineExercise;
  position: number;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onUpdateSet: (setId: string, field: SetField, value: number) => void;
  onMove: (direction: -1 | 1) => void;
  onSupersetChange: (color: SupersetColor | null) => void;
  readOnly?: boolean;
};

/**
 * One exercise block in the routine builder. Includes its sets and add-set action.
 */
export function ExerciseCard({
  exercise,
  position,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  onUpdateSet,
  onMove,
  onSupersetChange,
  readOnly,
}: ExerciseCardProps) {
  const { t } = useTranslation();
  const positionLabel = position.toString().padStart(2, '0');

  return (
    <Card>
      <CardHeader>
        <HeaderLeft>
          <PositionChip>{positionLabel}</PositionChip>
          <HeaderText>
            <Title>{exercise.name}</Title>
            <Target>{t('workouts.target', { target: exercise.target })}</Target>
          </HeaderText>
        </HeaderLeft>
        <HeaderActions>
          {!readOnly && <SupersetSelect
            value={exercise.supersetColor ?? ''}
            onChange={(event) => onSupersetChange((event.target.value || null) as SupersetColor | null)}
            aria-label={t('workouts.supersetGroup')}
            $color={exercise.supersetColor}
          >
            <option value="">{t('workouts.noSuperset')}</option>
            {SUPERSET_COLORS.map((color, index) => (
              <option key={color} value={color}>{t('workouts.supersetNumber', { number: index + 1 })}</option>
            ))}
          </SupersetSelect>}
          {!readOnly && <IconButton type="button" aria-label={t('workouts.moveExerciseUp')} onClick={() => onMove(-1)}>
            <ArrowUp size={16} />
          </IconButton>}
          {!readOnly && <IconButton type="button" aria-label={t('workouts.moveExerciseDown')} onClick={() => onMove(1)}>
            <ArrowDown size={16} />
          </IconButton>}
          {!readOnly && <IconButton type="button" aria-label={t('workouts.removeExercise')} onClick={onRemoveExercise} $danger>
            <Trash2 size={16} />
          </IconButton>}
        </HeaderActions>
      </CardHeader>

      <CardBody>
        <TableScroll><SetsTable>
          <thead>
            <tr>
              <Th>{t('workouts.set')}</Th>
              <Th>{t('workouts.weight')}</Th>
              <Th>{t('workouts.reps')}</Th>
              <Th>{t('workouts.rest')}</Th>
              <Th>{t('workouts.rpe')}</Th>
              <Th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                index={index}
                set={set}
                onRemove={() => onRemoveSet(set.id)}
                onChange={(field, value) => onUpdateSet(set.id, field, value)}
                readOnly={readOnly}
              />
            ))}
          </tbody>
        </SetsTable></TableScroll>

        {!readOnly && <AddSetButton type="button" onClick={onAddSet}>
          <PlusSquare size={14} />
          {t('workouts.addSet')}
        </AddSetButton>}
      </CardBody>
    </Card>
  );
}

const Card = styled.article`
  background-color: #1c1e32;
  border-radius: 1.4rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #313349;
  padding: 1.1rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

const PositionChip = styled.span`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  background-color: #36384d;
  color: #ffb3b1;
  display: grid;
  place-items: center;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-style: italic;
  font-weight: 800;
  font-size: 0.9rem;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Title = styled.h3`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  color: #e0e0fc;
`;

const Target = styled.p`
  margin: 0;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SupersetSelect = styled.select<{ $color: SupersetColor | null }>`
  max-width: 7.5rem;
  border: 1px solid ${({ $color }) => $color ?? 'rgba(231, 189, 187, 0.25)'};
  border-radius: 999px;
  padding: 0.35rem 0.55rem;
  background: #26283d;
  color: #e0e0fc;
  font-size: 0.68rem;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: ${({ $danger }) => ($danger ? '#ffb4ab' : '#e7bdbb')};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ $danger }) => ($danger ? 'rgba(147, 0, 10, 0.25)' : '#26283d')};
  }
`;

const CardBody = styled.div`
  padding: 1.6rem 1.6rem 1.5rem;
`;

const TableScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const SetsTable = styled.table`
  width: 100%;
  min-width: 31rem;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  padding-bottom: 0.9rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.6rem;
  font-weight: 700;
`;

const AddSetButton = styled.button`
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: none;
  background: transparent;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
  transition: transform 150ms ease;

  &:hover {
    transform: translateX(2px);
  }
`;
