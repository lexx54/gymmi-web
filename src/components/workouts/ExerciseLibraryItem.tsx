import { PlusCircle } from 'lucide-react';
import styled from 'styled-components';
import type { LibraryExercise } from './types';

type ExerciseLibraryItemProps = {
  exercise: LibraryExercise;
  onAdd: () => void;
  disabled?: boolean;
};

/**
 * Single exercise row inside the exercise library list.
 */
export function ExerciseLibraryItem({ exercise, onAdd, disabled }: ExerciseLibraryItemProps) {
  return (
    <Row type="button" onClick={onAdd} disabled={disabled} aria-label={`Add ${exercise.name}`}>
      <Thumb>
        {exercise.imageUrl ? <img src={exercise.imageUrl} alt="" /> : <PlusCircle size={22} />}
      </Thumb>
      <Body>
        <Name>{exercise.name}</Name>
        <Meta>
          {exercise.modality} • {exercise.category}
        </Meta>
      </Body>
      <AddIcon aria-hidden>
        <PlusCircle size={18} />
      </AddIcon>
    </Row>
  );
}

const Row = styled.button`
  width: 100%;
  border: 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem;
  border-radius: 0.85rem;
  background-color: #1c1e32;
  cursor: pointer;
  transition: background-color 150ms ease, transform 100ms ease;

  &:hover {
    background-color: #26283d;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const Thumb = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.6rem;
  overflow: hidden;
  background-color: #313349;
  flex-shrink: 0;
  color: #ffb3b1;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Name = styled.h3`
  margin: 0;
  color: #e0e0fc;
  font-weight: 700;
  font-size: 0.92rem;
`;

const Meta = styled.p`
  margin: 0;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const AddIcon = styled.span`
  color: #ffb3b1;
  opacity: 0;
  transition: opacity 150ms ease;
  display: grid;
  place-items: center;

  ${Row}:hover & {
    opacity: 1;
  }
`;
