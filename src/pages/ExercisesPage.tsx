import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ExerciseCatalogCard } from '../components/exercises/ExerciseCatalogCard';
import { ExerciseDetailModal } from '../components/exercises/ExerciseDetailModal';
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
import {
  resolveLocalizedText,
  type Exercise,
} from '../services/api/exercises';

const EXERCISES_PER_PAGE = 10;

/**
 * Returns unique catalog values in case-insensitive alphabetical order.
 */
function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: 'base' }),
  );
}

function toExerciseSummary(
  exercise: Exercise,
  language?: string,
): ExerciseSummary {
  return {
    id: exercise.id,
    name: exercise.name,
    targetMuscle: resolveLocalizedText(exercise.targetMuscle, language),
    equipment: resolveLocalizedText(exercise.equipment, language),
    difficulty: exercise.difficulty as ExerciseSummary['difficulty'],
    tags: exercise.tags,
  };
}

/**
 * Exercises catalog list page. Entry point to the builder.
 */
export default function ExercisesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [page, setPage] = useState(1);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const { data: exercises, isLoading, isError } = useExercises();
  const bulkCsvMutation = useUploadExerciseBulkCsv();

  const catalog = useMemo(
    () =>
      (exercises ?? []).map((exercise) =>
        toExerciseSummary(exercise, i18n.resolvedLanguage ?? i18n.language),
      ),
    [exercises, i18n.language, i18n.resolvedLanguage],
  );

  const filterOptions = useMemo(
    () => ({
      difficulties: uniqueSorted(catalog.map((exercise) => exercise.difficulty)),
      targetMuscles: uniqueSorted(catalog.map((exercise) => exercise.targetMuscle)),
      equipments: uniqueSorted(catalog.map((exercise) => exercise.equipment)),
    }),
    [catalog],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalog.filter((exercise) => {
      const matchesSearch =
        !query ||
        [exercise.name, exercise.targetMuscle, exercise.equipment, ...exercise.tags]
          .join(' ')
          .toLowerCase()
          .includes(query);
      return (
        matchesSearch &&
        (!difficulty || exercise.difficulty === difficulty) &&
        (!targetMuscle || exercise.targetMuscle === targetMuscle) &&
        (!equipment || exercise.equipment === equipment)
      );
    });
  }, [catalog, difficulty, equipment, search, targetMuscle]);

  useEffect(() => {
    setPage(1);
  }, [difficulty, equipment, search, targetMuscle]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / EXERCISES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * EXERCISES_PER_PAGE;
  const visible = filtered.slice(pageStart, pageStart + EXERCISES_PER_PAGE);
  const hasFilters = Boolean(search || difficulty || targetMuscle || equipment);

  const clearFilters = () => {
    setSearch('');
    setDifficulty('');
    setTargetMuscle('');
    setEquipment('');
    setPage(1);
  };

  const showGrid = !isLoading && !isError && visible.length > 0;
  const selectedExercise =
    exercises?.find((exercise) => exercise.id === selectedExerciseId) ?? null;

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

          <FilterPanel aria-label={t('exercises.catalogFilters')}>
            <SearchField
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('exercises.filterPlaceholder')}
              aria-label={t('exercises.filterLabel')}
            />
            <FilterSelect
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              aria-label={t('exercises.filterByLevel')}
            >
              <option value="">{t('exercises.allLevels')}</option>
              {filterOptions.difficulties.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={targetMuscle}
              onChange={(event) => setTargetMuscle(event.target.value)}
              aria-label={t('exercises.filterByTargetMuscle')}
            >
              <option value="">{t('exercises.allTargetMuscles')}</option>
              {filterOptions.targetMuscles.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={equipment}
              onChange={(event) => setEquipment(event.target.value)}
              aria-label={t('exercises.filterByEquipment')}
            >
              <option value="">{t('exercises.allEquipment')}</option>
              {filterOptions.equipments.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </FilterSelect>
            {hasFilters ? (
              <ClearFilters type="button" onClick={clearFilters}>
                {t('exercises.clearFilters')}
              </ClearFilters>
            ) : null}
          </FilterPanel>

          {!isLoading && !isError && catalog.length > 0 ? (
            <ResultCount aria-live="polite">
              {filtered.length > 0
                ? t('exercises.showingResults', {
                    from: pageStart + 1,
                    to: pageStart + visible.length,
                    total: filtered.length,
                  })
                : t('exercises.noMatchingExercises')}
            </ResultCount>
          ) : null}

          {showGrid ? (
            <>
              <Grid>
                {visible.map((exercise) => (
                  <ExerciseCatalogCard
                    key={exercise.id}
                    exercise={exercise}
                    onSelect={setSelectedExerciseId}
                  />
                ))}
              </Grid>
              {totalPages > 1 ? (
                <Pagination aria-label={t('exercises.pagination')}>
                  <PageButton
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                  >
                    <ChevronLeft size={16} aria-hidden />
                    {t('exercises.previous')}
                  </PageButton>
                  <PageStatus>
                    {t('exercises.pageOf', { page: currentPage, total: totalPages })}
                  </PageStatus>
                  <PageButton
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  >
                    {t('exercises.next')}
                    <ChevronRight size={16} aria-hidden />
                  </PageButton>
                </Pagination>
              ) : null}
            </>
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
              onClearSearch={clearFilters}
            />
          )}
        </ExercisesContent>
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExerciseId(null)}
        />
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
  min-width: 0;
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
  font-size: clamp(1.75rem, 7vw, 2.4rem);
  font-weight: 800;
  line-height: 1.1;
  overflow-wrap: break-word;
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

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

  @media (max-width: 640px) {
    flex: 1 1 100%;
    padding: 0.85rem 1rem;
    letter-spacing: 0.12em;
  }
`;

const SecondaryButton = styled(CreateButton)`
  background: #1c1e32;
  color: #ffdad6;
  box-shadow: none;
`;

const SearchField = styled.input`
  width: 100%;
  min-width: 0;
  background-color: #181a2e;
  border: 1px solid transparent;
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
    border-color: #ffb3b1;
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

const FilterPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(13rem, 1.5fr) repeat(3, minmax(9rem, 1fr)) auto;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: 9999px;
  background-color: #181a2e;
  color: #e0e0fc;
  padding: 0.85rem 2.25rem 0.85rem 1.1rem;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #ffb3b1;
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

const ClearFilters = styled.button`
  border: 0;
  background: transparent;
  color: #ffb3b1;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: underline;
  white-space: nowrap;
`;

const ResultCount = styled.p`
  margin: -0.35rem 0 0;
  color: #e7bdbb;
  font-size: 0.8rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
  gap: 1.25rem;
`;

const Pagination = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 640px) {
    gap: 0.6rem;
  }
`;

const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #313349;
  border-radius: 9999px;
  background: #181a2e;
  color: #ffdad6;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0.65rem 1rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const PageStatus = styled.span`
  color: #e7bdbb;
  font-size: 0.8rem;
  font-weight: 700;
`;
