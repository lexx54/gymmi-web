import styled from 'styled-components';
import { ExerciseLibraryItem } from './ExerciseLibraryItem';
import type { Category, LibraryExercise } from './types';

const CATEGORIES: Category[] = ['All', 'Chest', 'Back', 'Legs', 'Core'];

type ExerciseLibraryProps = {
  exercises: LibraryExercise[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  totalCount: number;
};

/**
 * Card listing the exercise library with category tabs and a scrollable list.
 */
export function ExerciseLibrary({
  exercises,
  activeCategory,
  onCategoryChange,
  totalCount,
}: ExerciseLibraryProps) {
  const visible =
    activeCategory === 'All'
      ? exercises
      : exercises.filter((exercise) => exercise.category === activeCategory);

  return (
    <Container>
      <Header>
        <Title>Exercise Library</Title>
        <CountPill>{totalCount} Exercises</CountPill>
      </Header>

      <Tabs role="tablist" aria-label="Exercise categories">
        {CATEGORIES.map((category) => (
          <Tab
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            $active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Tab>
        ))}
      </Tabs>

      <List>
        {visible.map((exercise) => (
          <ExerciseLibraryItem key={exercise.id} exercise={exercise} />
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.h2`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #e0e0fc;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const CountPill = styled.span`
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  background-color: #313349;
  color: #ffb3b1;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  white-space: nowrap;
  padding: 0.35rem 0.95rem;
  border: none;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
  background-color: ${({ $active }) => ($active ? '#ffb3b1' : '#1c1e32')};
  color: ${({ $active }) => ($active ? '#680011' : '#e7bdbb')};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#ffb3b1' : '#26283d')};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  overflow-y: auto;
  padding-right: 0.25rem;
`;
