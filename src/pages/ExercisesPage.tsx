import { useMemo, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ExerciseCatalogCard } from '../components/exercises/ExerciseCatalogCard';
import { ExerciseBulkCsvModal } from '../components/exercises/ExerciseBulkCsvModal';
import { NoExercises } from '../components/exercises/NoExercises';
import { ExercisesHeader } from '../components/exercises/ExercisesHeader';
import {
  ExercisesContent,
  ExercisesMain,
  ExercisesPageShell,
} from '../components/exercises/ExercisesShell';
import type { ExerciseSummary } from '../components/exercises/types';
import { Can } from '../components/Can';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useExercises, useUploadExerciseBulkCsv } from '../hooks/useExercises';
import type { Exercise } from '../services/api/exercises';

function toExerciseSummary(exercise: Exercise): ExerciseSummary {
  return {
    id: exercise.id,
    name: exercise.name,
    targetMuscle: exercise.targetMuscle,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty as ExerciseSummary['difficulty'],
    tags: exercise.tags,
  };
}

/**
 * Exercises catalog list page. Entry point to the builder.
 */
export default function ExercisesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';
  const [search, setSearch] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const { data: exercises, isLoading, isError } = useExercises();
  const bulkCsvMutation = useUploadExerciseBulkCsv();

  const catalog = useMemo(
    () => (exercises ?? []).map(toExerciseSummary),
    [exercises],
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return catalog;
    return catalog.filter((exercise) =>
      [exercise.name, exercise.targetMuscle, exercise.equipment, ...exercise.tags]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [catalog, search]);

  const showGrid = !isLoading && !isError && visible.length > 0;

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title={t('nav.exercises')} />
        <ExercisesContent>
          <HeaderRow>
            <Copy>
              <Eyebrow>{t('exercises.catalog')}</Eyebrow>
              <Title>{t('exercises.catalogTitle')}</Title>
              <Subtitle>{t('exercises.catalogSubtitle')}</Subtitle>
            </Copy>
            <Can resource="exercises" action="CREATE">
              <ActionGroup>
                <SecondaryButton type="button" onClick={() => setIsBulkModalOpen(true)}>
                  <Upload size={16} />
                  {t('exercises.bulkCsv')}
                </SecondaryButton>
                <CreateButton type="button" onClick={() => navigate('/exercises/new')}>
                  <Plus size={16} />
                  {t('exercises.createExercise')}
                </CreateButton>
              </ActionGroup>
            </Can>
          </HeaderRow>

          <SearchField
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('exercises.filterPlaceholder')}
            aria-label={t('exercises.filterLabel')}
          />

          {showGrid ? (
            <Grid>
              {visible.map((exercise) => (
                <ExerciseCatalogCard key={exercise.id} exercise={exercise} />
              ))}
            </Grid>
          ) : (
            <NoExercises
              variant={
                isLoading
                  ? 'loading'
                  : isError
                    ? 'error'
                    : catalog.length === 0
                      ? 'empty'
                      : 'no-results'
              }
              onCreateExercise={() => navigate('/exercises/new')}
              onBulkUpload={() => setIsBulkModalOpen(true)}
              onClearSearch={() => setSearch('')}
            />
          )}
        </ExercisesContent>
        <ExerciseBulkCsvModal
          isOpen={isBulkModalOpen}
          isUploading={bulkCsvMutation.isPending}
          result={bulkCsvMutation.data}
          onClose={() => {
            setIsBulkModalOpen(false);
            bulkCsvMutation.reset();
          }}
          onUpload={(file) =>
            bulkCsvMutation.mutate(file, {
              onSuccess: (result) => {
                toast.success(t('exercises.createdCsv', { count: result.created }));
              },
              onError: () => {
                toast.error(t('exercises.csvFailed'));
              },
            })
          }
        />
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

const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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

const SecondaryButton = styled(CreateButton)`
  background: #1c1e32;
  color: #ffdad6;
  box-shadow: none;
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
