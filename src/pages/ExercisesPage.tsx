import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ExerciseCatalogCard } from '../components/exercises/ExerciseCatalogCard';
import { ExercisesHeader } from '../components/exercises/ExercisesHeader';
import {
  ExercisesContent,
  ExercisesMain,
  ExercisesPageShell,
} from '../components/exercises/ExercisesShell';
import type { ExerciseSummary } from '../components/exercises/types';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

const CATALOG: ExerciseSummary[] = [
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    targetMuscle: 'Quads',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    tags: ['Strength', 'Unilateral'],
  },
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    targetMuscle: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    tags: ['Compound', 'Upper Body'],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    targetMuscle: 'Hamstrings',
    equipment: 'Barbell',
    difficulty: 'Elite',
    tags: ['Hinge', 'Posterior'],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    targetMuscle: 'Back',
    equipment: 'Cable Machine',
    difficulty: 'Novice',
    tags: ['Pull', 'Back Day'],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    targetMuscle: 'Shoulders',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    tags: ['Press', 'Power'],
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    targetMuscle: 'Hamstrings',
    equipment: 'Kettlebell',
    difficulty: 'Intermediate',
    tags: ['Explosive', 'Conditioning'],
  },
];

/**
 * Exercises catalog list page. Entry point to the builder.
 */
export default function ExercisesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';
  const [search, setSearch] = useState('');

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return CATALOG;
    return CATALOG.filter((exercise) =>
      [exercise.name, exercise.targetMuscle, exercise.equipment, ...exercise.tags]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title="Exercises" />
        <ExercisesContent>
          <HeaderRow>
            <Copy>
              <Eyebrow>Catalog</Eyebrow>
              <Title>Design your movement catalog</Title>
              <Subtitle>
                Build, curate, and refine every exercise your athletes will meet in the field.
              </Subtitle>
            </Copy>
            <CreateButton type="button" onClick={() => navigate('/exercises/new')}>
              <Plus size={16} />
              Create Exercise
            </CreateButton>
          </HeaderRow>

          <SearchField
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter exercises by name, muscle, or tag..."
            aria-label="Filter exercises"
          />

          <Grid>
            {visible.map((exercise) => (
              <ExerciseCatalogCard key={exercise.id} exercise={exercise} />
            ))}
          </Grid>

          {visible.length === 0 ? <EmptyState>No exercises match that filter.</EmptyState> : null}
        </ExercisesContent>
      </ExercisesMain>
    </ExercisesPageShell>
  );
}

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: space-between;
  align-items: flex-start;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const Copy = styled.div`
  max-width: 34rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.7rem;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #e0e0fc;
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.6rem;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-shadow: 0 18px 40px -14px rgba(255, 83, 90, 0.55);
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const SearchField = styled.input`
  width: 100%;
  max-width: 28rem;
  background-color: #181a2e;
  border: none;
  border-radius: 9999px;
  padding: 0.85rem 1.25rem;
  color: #e0e0fc;
  font-size: 0.9rem;
  outline: none;
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: rgba(173, 136, 134, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 1.25rem;
`;

const EmptyState = styled.p`
  margin: 2rem 0 0;
  color: #e7bdbb;
  font-size: 0.9rem;
  text-align: center;
`;
