import { X } from 'lucide-react';
import styled from 'styled-components';
import type { SetEntry, SetField } from './types';

type SetRowProps = {
  index: number;
  set: SetEntry;
  onChange: (field: SetField, value: number) => void;
  onRemove: () => void;
};

/**
 * Editable set row inside an ExerciseCard. Updates flow back through `onChange`.
 */
export function SetRow({ index, set, onChange, onRemove }: SetRowProps) {
  return (
    <Row>
      <Cell>
        <SetChip>{index + 1}</SetChip>
      </Cell>
      <Cell>
        <NumberInput
          type="number"
          value={set.weight}
          onChange={(event) => onChange('weight', Number(event.target.value))}
          aria-label={`Set ${index + 1} weight`}
          $width="5rem"
        />
      </Cell>
      <Cell>
        <NumberInput
          type="number"
          value={set.reps}
          onChange={(event) => onChange('reps', Number(event.target.value))}
          aria-label={`Set ${index + 1} reps`}
          $width="4rem"
        />
      </Cell>
      <Cell>
        <RestText>{set.rest}</RestText>
      </Cell>
      <Cell>
        <NumberInput
          type="number"
          value={set.rpe}
          onChange={(event) => onChange('rpe', Number(event.target.value))}
          aria-label={`Set ${index + 1} RPE`}
          $width="4rem"
        />
      </Cell>
      <RemoveCell>
        <RemoveButton type="button" aria-label={`Remove set ${index + 1}`} onClick={onRemove}>
          <X size={14} />
        </RemoveButton>
      </RemoveCell>
    </Row>
  );
}

const Row = styled.tr`
  &:hover button[aria-label^='Remove set'] {
    opacity: 1;
  }
`;

const Cell = styled.td`
  padding: 0.55rem 0;
`;

const RemoveCell = styled.td`
  padding: 0.55rem 0;
  text-align: right;
`;

const SetChip = styled.span`
  width: 1.6rem;
  height: 1.6rem;
  display: inline-grid;
  place-items: center;
  background-color: #181a2e;
  color: #ffb3b1;
  border-radius: 0.4rem;
  font-size: 0.7rem;
  font-weight: 800;
`;

const NumberInput = styled.input<{ $width: string }>`
  width: ${({ $width }) => $width};
  padding: 0.45rem 0.65rem;
  border-radius: 0.55rem;
  border: none;
  background-color: #181a2e;
  color: #e0e0fc;
  font-size: 0.85rem;
  outline: none;
  transition: box-shadow 150ms ease;

  &:focus {
    box-shadow: 0 0 0 1px #ffb3b1;
  }
`;

const RestText = styled.span`
  color: #e7bdbb;
  font-size: 0.8rem;
  font-weight: 700;
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #e7bdbb;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 150ms ease, color 150ms ease;
  padding: 0.25rem;

  &:hover {
    color: #ffb4ab;
  }
`;
