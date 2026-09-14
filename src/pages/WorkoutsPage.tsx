import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { ExerciseCard } from '../components/workouts/ExerciseCard';
import { ExerciseLibrary } from '../components/workouts/ExerciseLibrary';
import { RoutineDropzone } from '../components/workouts/RoutineDropzone';
import { RoutineToolbar } from '../components/workouts/RoutineToolbar';
import {
  LibraryPane,
  RoutinePane,
  WorkoutsBuilderGrid,
  WorkoutsMain,
  WorkoutsPageShell,
} from '../components/workouts/WorkoutsShell';
import { WorkoutsHeader } from '../components/workouts/WorkoutsHeader';
import type { LibraryExercise, RoutineExercise, SetField } from '../components/workouts/types';
import { useAuth } from '../context/AuthContext';
import { useExercises } from '../hooks/useExercises';
import { useCreateWorkout, useUpdateWorkout, useWorkout } from '../hooks/useWorkouts';
import { resolveLocalizedText } from '../services/api/exercises';
import type {
  SupersetColor,
  WorkoutDayWrite,
  WorkoutRoutine,
  WorkoutRoutineWrite,
} from '../services/api/workouts';

type BuilderDay = {
  weekday: number;
  exercises: RoutineExercise[];
};

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
let localId = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${localId += 1}`;

function routineToDays(routine: WorkoutRoutine): BuilderDay[] {
  return routine.days.map((day) => ({
    weekday: day.weekday,
    exercises: day.exercises.map((item) => ({
      id: item.id,
      exerciseId: item.exerciseId,
      name: item.exercise.name,
      target: resolveLocalizedText(item.exercise.targetMuscle),
      supersetColor: item.supersetColor,
      sets: item.sets.map((set) => ({
        id: set.id,
        weight: set.weight,
        reps: set.reps,
        restSeconds: set.restSeconds,
        rpe: set.rpe,
      })),
    })),
  }));
}

function toWriteDays(days: BuilderDay[]): WorkoutDayWrite[] {
  return days
    .filter((day) => day.exercises.length > 0)
    .map((day) => ({
      weekday: day.weekday,
      exercises: day.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        supersetColor: exercise.supersetColor,
        sets: exercise.sets.map(({ weight, reps, restSeconds, rpe }) => ({
          weight,
          reps,
          restSeconds,
          rpe,
        })),
      })),
    }));
}

/**
 * Creates, edits, or displays a persisted workout routine.
 */
export default function WorkoutsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: exercises = [], isLoading: exercisesLoading } = useExercises();
  const { data: persistedRoutine, isLoading: routineLoading } = useWorkout(id);
  const createMutation = useCreateWorkout();
  const updateMutation = useUpdateWorkout();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<BuilderDay[]>([]);
  const [activeWeekday, setActiveWeekday] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const requestedEdit = !id || location.pathname.endsWith('/edit');
  const isOwner = !persistedRoutine || persistedRoutine.createdById === user?.id;
  const readOnly = Boolean(id) && (!requestedEdit || !isOwner);

  useEffect(() => {
    if (!persistedRoutine) return;
    const nextDays = routineToDays(persistedRoutine);
    queueMicrotask(() => {
      setTitle(persistedRoutine.name);
      setDescription(persistedRoutine.description ?? '');
      setDays(nextDays);
      setActiveWeekday(nextDays[0]?.weekday ?? 1);
    });
  }, [persistedRoutine]);

  const libraryExercises = useMemo<LibraryExercise[]>(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        category: resolveLocalizedText(exercise.targetMuscle, i18n.language) || t('workouts.uncategorized'),
        modality: exercise.movementType || resolveLocalizedText(exercise.equipment, i18n.language),
      })),
    [exercises, i18n.language, t],
  );
  const activeDay = days.find((day) => day.weekday === activeWeekday);
  const routine = activeDay?.exercises ?? [];

  const updateActiveExercises = useCallback(
    (updater: (current: RoutineExercise[]) => RoutineExercise[]) => {
      setDays((current) => {
        const exists = current.some((day) => day.weekday === activeWeekday);
        if (!exists) return [...current, { weekday: activeWeekday, exercises: updater([]) }];
        return current.map((day) =>
          day.weekday === activeWeekday ? { ...day, exercises: updater(day.exercises) } : day,
        );
      });
    },
    [activeWeekday],
  );

  const handleAddExercise = useCallback(
    (exercise: LibraryExercise) => {
      updateActiveExercises((current) => [
        ...current,
        {
          id: nextId('exercise'),
          exerciseId: exercise.id,
          name: exercise.name,
          target: exercise.category,
          supersetColor: null,
          sets: [{ id: nextId('set'), weight: 0, reps: 10, restSeconds: 60, rpe: 7 }],
        },
      ]);
    },
    [updateActiveExercises],
  );

  const handleAddSet = useCallback(
    (exerciseId: string) => {
      updateActiveExercises((current) =>
        current.map((exercise) => {
          if (exercise.id !== exerciseId) return exercise;
          const previous = exercise.sets.at(-1);
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: nextId('set'),
                weight: previous?.weight ?? 0,
                reps: previous?.reps ?? 10,
                restSeconds: previous?.restSeconds ?? 60,
                rpe: previous?.rpe ?? 7,
              },
            ],
          };
        }),
      );
    },
    [updateActiveExercises],
  );

  const updateExercise = useCallback(
    (exerciseId: string, updater: (exercise: RoutineExercise) => RoutineExercise) => {
      updateActiveExercises((current) =>
        current.map((exercise) => (exercise.id === exerciseId ? updater(exercise) : exercise)),
      );
    },
    [updateActiveExercises],
  );

  const handleMove = useCallback(
    (exerciseId: string, direction: -1 | 1) => {
      updateActiveExercises((current) => {
        const from = current.findIndex((exercise) => exercise.id === exerciseId);
        const to = from + direction;
        if (from < 0 || to < 0 || to >= current.length) return current;
        const next = [...current];
        [next[from], next[to]] = [next[to], next[from]];
        return next;
      });
    },
    [updateActiveExercises],
  );

  const validate = (params: WorkoutRoutineWrite) => {
    if (!params.name.trim()) return t('workouts.validation.name');
    if (!params.days.length) return t('workouts.validation.day');
    for (const day of params.days) {
      if (day.exercises.some((exercise) => !exercise.sets.length)) return t('workouts.validation.set');
      const colors = day.exercises.reduce<Record<string, number>>((counts, exercise) => {
        if (exercise.supersetColor) counts[exercise.supersetColor] = (counts[exercise.supersetColor] ?? 0) + 1;
        return counts;
      }, {});
      if (Object.values(colors).some((count) => count < 2)) return t('workouts.validation.superset');
      if (day.exercises.some((exercise) => exercise.sets.some((set) =>
        set.weight < 0 || set.reps < 0 || set.restSeconds < 0 || set.rpe < 0 || set.rpe > 10))) {
        return t('workouts.validation.values');
      }
    }
    return null;
  };

  const handleSave = async () => {
    const params: WorkoutRoutineWrite = {
      name: title.trim(),
      description: description.trim() || null,
      days: toWriteDays(days),
    };
    const error = validate(params);
    if (error) {
      toast.error(error);
      return;
    }
    try {
      const saved = id
        ? await updateMutation.mutateAsync({ id, params })
        : await createMutation.mutateAsync(params);
      toast.success(t(id ? 'workouts.updated' : 'workouts.created'));
      navigate(`/workout/${saved.id}`);
    } catch {
      toast.error(t('workouts.saveFailed'));
    }
  };

  const loading = exercisesLoading || (Boolean(id) && routineLoading);
  const dayLabel = (weekday: number) => t(`workouts.weekdays.${weekday}`);

  return (
    <WorkoutsPageShell>
      <Sidebar username={user?.username ?? 'Alex'} />
      <WorkoutsMain>
        <WorkoutsHeader />
        <WorkoutsBuilderGrid>
          {!readOnly && <LibraryPane>
            <ExerciseLibrary
              exercises={libraryExercises}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              totalCount={libraryExercises.length}
              search={search}
              onSearchChange={setSearch}
              onAdd={handleAddExercise}
              addedExerciseIds={routine.map((exercise) => exercise.exerciseId)}
            />
          </LibraryPane>}

          <RoutinePane>
            {loading ? <Status>{t('common.loading')}</Status> : <>
              <RoutineToolbar
                title={title}
                onTitleChange={setTitle}
                durationLabel={t('workouts.dayCount', { count: days.filter((day) => day.exercises.length).length })}
                intensityLabel={readOnly ? t('workouts.readOnly') : t('workouts.editable')}
                onSave={handleSave}
                isSaving={createMutation.isPending || updateMutation.isPending}
                readOnly={readOnly}
              />
              <Description
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t('workouts.descriptionPlaceholder')}
                aria-label={t('workouts.description')}
                disabled={readOnly}
              />
              <WeekdayTabs aria-label={t('workouts.trainingDays')}>
                {WEEKDAYS.map((weekday) => {
                  const count = days.find((day) => day.weekday === weekday)?.exercises.length ?? 0;
                  return (
                    <WeekdayButton
                      key={weekday}
                      type="button"
                      $active={activeWeekday === weekday}
                      onClick={() => setActiveWeekday(weekday)}
                    >
                      {dayLabel(weekday)}{count ? ` · ${count}` : ''}
                    </WeekdayButton>
                  );
                })}
              </WeekdayTabs>
              {routine.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  position={index + 1}
                  onAddSet={() => handleAddSet(exercise.id)}
                  onRemoveSet={(setId) => updateExercise(exercise.id, (item) => ({
                    ...item,
                    sets: item.sets.filter((set) => set.id !== setId),
                  }))}
                  onRemoveExercise={() => updateActiveExercises((current) =>
                    current.filter((item) => item.id !== exercise.id))}
                  onUpdateSet={(setId, field: SetField, value) => updateExercise(exercise.id, (item) => ({
                    ...item,
                    sets: item.sets.map((set) => set.id === setId ? { ...set, [field]: value } : set),
                  }))}
                  onMove={(direction) => handleMove(exercise.id, direction)}
                  onSupersetChange={(color: SupersetColor | null) => updateExercise(
                    exercise.id,
                    (item) => ({ ...item, supersetColor: color }),
                  )}
                  readOnly={readOnly}
                />
              ))}
              {!routine.length && <RoutineDropzone />}
            </>}
          </RoutinePane>
        </WorkoutsBuilderGrid>
      </WorkoutsMain>
    </WorkoutsPageShell>
  );
}

const Description = styled.textarea`
  width: 100%;
  min-height: 4rem;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid rgba(231, 189, 187, 0.15);
  border-radius: 0.85rem;
  padding: 0.85rem;
  background: #181a2e;
  color: #e0e0fc;
`;

const WeekdayTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const WeekdayButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 0.85rem;
  background: ${({ $active }) => $active ? '#ffb3b1' : '#1c1e32'};
  color: ${({ $active }) => $active ? '#680011' : '#e7bdbb'};
  font-weight: 800;
  cursor: pointer;
`;

const Status = styled.p`
  margin: 3rem 0;
  color: #e7bdbb;
  text-align: center;
`;
