import { ArrowDown, ArrowUp, MessageSquareText, PlusSquare, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MAX_SETS_PER_EXERCISE, SET_BATCH_SIZES } from './addSet';
import { SetRow } from './SetRow';
import {
  MAX_EXERCISE_NOTES_LENGTH,
  SUPERSET_COLORS,
  type SupersetColor,
} from '../../services/api/workouts';
import type { RoutineExercise, SetField } from './types';

type ExerciseCardProps = {
  exercise: RoutineExercise;
  position: number;
  /** Adds `count` copies of the last set. */
  onAddSets: (count: number) => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onUpdateSet: (setId: string, field: SetField, value: number) => void;
  onMove: (direction: -1 | 1) => void;
  onSupersetChange: (color: SupersetColor | null) => void;
  /** Updates the exercise's coaching note (e.g. trainer cues for an assigned client). */
  onNotesChange: (notes: string) => void;
  readOnly?: boolean;
};

/**
 * One exercise block in the routine builder. Includes its sets and add-set action.
 */
export function ExerciseCard({
  exercise,
  position,
  onAddSets,
  onRemoveSet,
  onRemoveExercise,
  onUpdateSet,
  onMove,
  onSupersetChange,
  onNotesChange,
  readOnly,
}: ExerciseCardProps) {
  const { t } = useTranslation();
  const positionLabel = position.toString().padStart(2, '0');
  const notesId = `exercise-notes-${exercise.id}`;
  const trimmedNotes = exercise.notes.trim();
  const showRir = exercise.sets.some((set) => set.rir !== undefined && set.rir !== null);
  const supersetNumber = exercise.supersetColor
    ? SUPERSET_COLORS.indexOf(exercise.supersetColor) + 1
    : 0;

  return (
    <Card>
      {exercise.supersetColor && supersetNumber > 0 && (
        <SupersetTab
          $color={exercise.supersetColor}
          title={t('workouts.supersetNumber', { number: supersetNumber })}
        >
          <SupersetTabNumber>{supersetNumber}</SupersetTabNumber>
          <SupersetTabLabel>{t('workouts.supersetTag')}</SupersetTabLabel>
        </SupersetTab>
      )}
      <CardContent>
        <CardHeader>
          <HeaderLeft>
            <PositionChip>{positionLabel}</PositionChip>
            <HeaderText>
              <Title>{exercise.name}</Title>
              <Target>{t('workouts.target', { target: exercise.target })}</Target>
            </HeaderText>
          </HeaderLeft>
          {!readOnly && <HeaderActions>
            <SupersetSelect
              value={exercise.supersetColor ?? ''}
              onChange={(event) => onSupersetChange((event.target.value || null) as SupersetColor | null)}
              aria-label={t('workouts.supersetGroup')}
              $color={exercise.supersetColor}
            >
              <option value="">{t('workouts.noSuperset')}</option>
              {SUPERSET_COLORS.map((color, index) => (
                <option key={color} value={color}>{t('workouts.supersetNumber', { number: index + 1 })}</option>
              ))}
            </SupersetSelect>
            <IconButton type="button" aria-label={t('workouts.moveExerciseUp')} onClick={() => onMove(-1)}>
              <ArrowUp size={16} />
            </IconButton>
            <IconButton type="button" aria-label={t('workouts.moveExerciseDown')} onClick={() => onMove(1)}>
              <ArrowDown size={16} />
            </IconButton>
            <IconButton type="button" aria-label={t('workouts.removeExercise')} onClick={onRemoveExercise} $danger>
              <Trash2 size={16} />
            </IconButton>
          </HeaderActions>}
        </CardHeader>

        <CardBody>
          {readOnly ? (
            trimmedNotes && (
              <NotesBlock aria-label={t('workouts.exerciseNotes')}>
                <MessageSquareText size={14} aria-hidden />
                <NotesText>{trimmedNotes}</NotesText>
              </NotesBlock>
            )
          ) : (
            <NotesField>
              <NotesLabel htmlFor={notesId}>
                <MessageSquareText size={12} aria-hidden />
                {t('workouts.exerciseNotes')}
              </NotesLabel>
              <NotesInput
                id={notesId}
                rows={2}
                value={exercise.notes}
                maxLength={MAX_EXERCISE_NOTES_LENGTH}
                placeholder={t('workouts.exerciseNotesPlaceholder')}
                onChange={(event) => onNotesChange(event.target.value)}
              />
            </NotesField>
          )}
          <TableScroll><SetsTable $readOnly={readOnly}>
            <thead>
              <tr>
                <Th>{t('workouts.set')}</Th>
                <Th>{t('workouts.weight')}</Th>
                <Th>{t('workouts.reps')}</Th>
                <Th>{t('workouts.rest')}</Th>
                {showRir && <Th>{t('workouts.rir')}</Th>}
                {!readOnly && <Th aria-hidden />}
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
                  showRir={showRir}
                />
              ))}
            </tbody>
          </SetsTable></TableScroll>

          {!readOnly && (
            <AddSetRow>
              <AddSetButton
                type="button"
                onClick={() => onAddSets(1)}
                disabled={exercise.sets.length >= MAX_SETS_PER_EXERCISE}
              >
                <PlusSquare size={14} />
                {t('workouts.addSet')}
              </AddSetButton>
              {SET_BATCH_SIZES.map((count) => (
                <AddSetButton
                  key={count}
                  type="button"
                  onClick={() => onAddSets(count)}
                  disabled={exercise.sets.length + count > MAX_SETS_PER_EXERCISE}
                  aria-label={t('workouts.addSetsCount', { count })}
                >
                  ×{count}
                </AddSetButton>
              ))}
              {exercise.sets.length >= MAX_SETS_PER_EXERCISE ? (
                <SetLimitNote>{t('workouts.maxSets', { max: MAX_SETS_PER_EXERCISE })}</SetLimitNote>
              ) : null}
            </AddSetRow>
          )}
        </CardBody>
      </CardContent>
    </Card>
  );
}

const Card = styled.article`
  background-color: #1c1e32;
  border-radius: 1.4rem;
  overflow: hidden;
  display: flex;
  align-items: stretch;
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SupersetTab = styled.div<{ $color: SupersetColor }>`
  flex: 0 0 1.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.9rem 0;
  background: ${({ $color }) => $color};
  color: #14121f;
`;

const SupersetTabNumber = styled.span`
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-style: italic;
  font-weight: 900;
  font-size: 1rem;
  line-height: 1;
`;

const SupersetTabLabel = styled.span`
  writing-mode: vertical-rl;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.55rem;
  font-weight: 800;
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

const NotesBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
  padding: 0.8rem 1rem;
  border-left: 3px solid #ffb3b1;
  border-radius: 0.6rem;
  background: #26283d;
  color: #ffb3b1;
`;

const NotesText = styled.p`
  margin: 0;
  color: #e0e0fc;
  font-size: 0.85rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const NotesField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.2rem;
`;

const NotesLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.6rem;
  font-weight: 700;
`;

const NotesInput = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 2.8rem;
  border: 1px solid rgba(231, 189, 187, 0.25);
  border-radius: 0.7rem;
  padding: 0.6rem 0.8rem;
  background: #26283d;
  color: #e0e0fc;
  font: inherit;
  font-size: 0.85rem;

  &::placeholder {
    color: rgba(231, 189, 187, 0.55);
  }

  &:focus-visible {
    outline: 2px solid #ffb3b1;
    outline-offset: 1px;
  }
`;

const TableScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const SetsTable = styled.table<{ $readOnly?: boolean }>`
  width: 100%;
  min-width: ${({ $readOnly }) => ($readOnly ? '0' : '31rem')};
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

const AddSetRow = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.4rem;
`;

const SetLimitNote = styled.span`
  color: #e7bdbb;
  opacity: 0.7;
  font-size: 0.65rem;
  font-weight: 700;
`;

const AddSetButton = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateX(2px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;
