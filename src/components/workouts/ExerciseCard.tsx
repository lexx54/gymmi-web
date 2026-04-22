import { GripVertical, PlusSquare, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { SetRow } from './SetRow';
import type { RoutineExercise, SetField } from './types';

type ExerciseCardProps = {
  exercise: RoutineExercise;
  position: number;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onUpdateSet: (setId: string, field: SetField, value: number) => void;
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
}: ExerciseCardProps) {
  const positionLabel = position.toString().padStart(2, '0');

  return (
    <Card>
      <CardHeader>
        <HeaderLeft>
          <PositionChip>{positionLabel}</PositionChip>
          <HeaderText>
            <Title>{exercise.name}</Title>
            <Target>Target: {exercise.target}</Target>
          </HeaderText>
        </HeaderLeft>
        <HeaderActions>
          <IconButton type="button" aria-label="Reorder exercise">
            <GripVertical size={16} />
          </IconButton>
          <IconButton type="button" aria-label="Remove exercise" onClick={onRemoveExercise} $danger>
            <Trash2 size={16} />
          </IconButton>
        </HeaderActions>
      </CardHeader>

      <CardBody>
        <SetsTable>
          <thead>
            <tr>
              <Th>Set</Th>
              <Th>Weight (kg)</Th>
              <Th>Reps</Th>
              <Th>Rest</Th>
              <Th>RPE</Th>
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
              />
            ))}
          </tbody>
        </SetsTable>

        <AddSetButton type="button" onClick={onAddSet}>
          <PlusSquare size={14} />
          Add Set
        </AddSetButton>
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

const SetsTable = styled.table`
  width: 100%;
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
