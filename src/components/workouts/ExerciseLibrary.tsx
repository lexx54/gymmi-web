import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import styled from 'styled-components';
import { ExerciseLibraryItem } from './ExerciseLibraryItem';
import type { LibraryExercise } from './types';

type ExerciseLibraryProps = {
  exercises: LibraryExercise[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: (exercise: LibraryExercise) => void;
  addedExerciseIds: string[];
  readOnly?: boolean;
};

/**
 * Card listing the exercise library with category tabs and a scrollable list.
 */
export function ExerciseLibrary({
  exercises,
  activeCategory,
  onCategoryChange,
  totalCount,
  search,
  onSearchChange,
  onAdd,
  addedExerciseIds,
  readOnly,
}: ExerciseLibraryProps) {
  const { t } = useTranslation();
  const categories = ['All', ...new Set(exercises.map((exercise) => exercise.category).filter(Boolean))];
  const normalizedSearch = search.trim().toLowerCase();
  const visible = exercises.filter(
    (exercise) =>
      (activeCategory === 'All' || exercise.category === activeCategory) &&
      (!normalizedSearch ||
        `${exercise.name} ${exercise.category} ${exercise.modality}`.toLowerCase().includes(normalizedSearch)),
  );

  return (
    <Container>
      <Header>
        <Title>{t('workouts.exerciseLibrary')}</Title>
        <CountPill>{t('workouts.count', { count: totalCount })}</CountPill>
      </Header>

      <SearchField>
        <Search size={16} aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('workouts.searchExercises')}
          aria-label={t('workouts.searchExercises')}
        />
      </SearchField>

      <Tabs role="tablist" aria-label={t('workouts.exerciseCategories')}>
        {categories.map((category) => (
          <Tab
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            $active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category === 'All' ? t('workouts.categories.all') : category}
          </Tab>
        ))}
      </Tabs>

      <List>
        {visible.map((exercise) => (
          <ExerciseLibraryItem
            key={exercise.id}
            exercise={exercise}
            onAdd={() => onAdd(exercise)}
            disabled={readOnly || addedExerciseIds.includes(exercise.id)}
          />
        ))}
        {!visible.length && <Empty>{t('workouts.noExercisesFound')}</Empty>}
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
  align-items: center;
  gap: 0.4rem;
  overflow-x: auto;
  flex-shrink: 0;
  padding: 0.2rem 0 0.45rem;
`;

const SearchField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: #101225;
  color: #e7bdbb;

  input {
    min-width: 0;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #e0e0fc;
  }
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

const Empty = styled.p`
  margin: 1rem 0;
  color: #e7bdbb;
  text-align: center;
`;
