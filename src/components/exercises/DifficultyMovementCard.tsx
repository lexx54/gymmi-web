import styled from 'styled-components';
import type { Difficulty, MovementType } from './types';

const DIFFICULTIES: Difficulty[] = ['Novice', 'Intermediate', 'Elite'];
const MOVEMENT_TYPES: MovementType[] = ['Compound', 'Isolation'];

type DifficultyMovementCardProps = {
  difficulty: Difficulty;
  movementType: MovementType | null;
  onDifficultyChange: (value: Difficulty) => void;
  onMovementTypeChange: (value: MovementType) => void;
};

/**
 * Combined difficulty level segmented selector + movement type radio group.
 */
export function DifficultyMovementCard({
  difficulty,
  movementType,
  onDifficultyChange,
  onMovementTypeChange,
}: DifficultyMovementCardProps) {
  return (
    <Card>
      <Field>
        <FieldLabel>Difficulty Level</FieldLabel>
        <SegmentedRow role="radiogroup" aria-label="Difficulty">
          {DIFFICULTIES.map((level) => (
            <SegmentButton
              key={level}
              type="button"
              role="radio"
              aria-checked={difficulty === level}
              $active={difficulty === level}
              onClick={() => onDifficultyChange(level)}
            >
              {level}
            </SegmentButton>
          ))}
        </SegmentedRow>
      </Field>
      <Field>
        <FieldLabel>Movement Type</FieldLabel>
        <MovementGrid>
          {MOVEMENT_TYPES.map((type) => (
            <MovementOption key={type} $active={movementType === type}>
              <HiddenRadio
                type="radio"
                name="movement-type"
                value={type}
                checked={movementType === type}
                onChange={() => onMovementTypeChange(type)}
              />
              <OptionDot $active={movementType === type} aria-hidden />
              <span>{type}</span>
            </MovementOption>
          ))}
        </MovementGrid>
      </Field>
    </Card>
  );
}

const Card = styled.section`
  background-color: #1c1e32;
  border-radius: 0.85rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldLabel = styled.span`
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const SegmentedRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  border-radius: 0.55rem;
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  border: none;
  padding: 0.85rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? '#ff535a' : '#26283d')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#e0e0fc')};
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#ff535a' : '#313349')};
  }
`;

const MovementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

const MovementOption = styled.label<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-radius: 0.55rem;
  background-color: ${({ $active }) => ($active ? '#313349' : '#26283d')};
  color: #e0e0fc;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: #313349;
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const OptionDot = styled.span<{ $active: boolean }>`
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 9999px;
  border: 2px solid ${({ $active }) => ($active ? '#ffb3b1' : '#5d3f3e')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 9999px;
    background-color: ${({ $active }) => ($active ? '#ffb3b1' : 'transparent')};
  }
`;
