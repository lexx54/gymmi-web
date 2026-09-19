import { Check, Pause } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { EntitlementGraceWarning } from '../components/entitlements/EntitlementGraceWarning';
import { PlusUpsellModal } from '../components/entitlements/PlusUpsellModal';
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
import { DEFAULT_SET, isInSupersetAddGroup } from '../components/workouts/addSet';
import { useAuth } from '../context/AuthContext';
import { useExercises } from '../hooks/useExercises';
import {
  hasAnyEntitlementCapability,
  hasEntitlementCapability,
  useEntitlements,
} from '../hooks/usePermissions';
import { useCreateWorkout, useRoutineSessions, useUpdateWorkout, useWorkout } from '../hooks/useWorkouts';
import { resolveLocalizedText } from '../services/api/exercises';
import { getApiErrorDetails, getApiErrorMessage, type ApiErrorDetails } from '../services/api/errors';
import type {
  SupersetColor,
  WorkoutDayWrite,
  WorkoutRoutine,
  WorkoutRoutineWrite,
} from '../services/api/workouts';
import {
  assignmentWeekStarts,
  defaultAssignmentWeek,
  sessionForDay,
  utcWeekEnd,
} from '../utils/assignmentWeeks';

type BuilderDay = {
  weekday: number;
  weekStartDate: string | null;
  exercises: RoutineExercise[];
};

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
let localId = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${localId += 1}`;

function routineToDays(routine: WorkoutRoutine): BuilderDay[] {
  return routine.days.map((day) => ({
    weekday: day.weekday,
    weekStartDate: day.weekStartDate ?? null,
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
      weekStartDate: day.weekStartDate,
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
  const { data: entitlements } = useEntitlements();
  const { data: persistedRoutine, isLoading: routineLoading } = useWorkout(id);
  const createMutation = useCreateWorkout();
  const updateMutation = useUpdateWorkout();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<BuilderDay[]>([]);
  const [activeWeekday, setActiveWeekday] = useState(1);
  const [activeWeekStart, setActiveWeekStart] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [upsell, setUpsell] = useState<{ details?: ApiErrorDetails; message?: string } | null>(null);

  const requestedEdit = !id || location.pathname.endsWith('/edit');
  const isOwner = !persistedRoutine || persistedRoutine.createdById === user?.id;
  const assignment = persistedRoutine?.assignment ?? null;
  const assignmentFork = Boolean(persistedRoutine?.forkedFromId || assignment);
  const entitlementAllowsEdit = id
    ? assignmentFork
      ? hasEntitlementCapability(entitlements?.capabilities, 'canEditAssignmentFork')
      : hasAnyEntitlementCapability(entitlements?.capabilities, ['canEditOwnedTemplate', 'canEditTemplate']) &&
        !(user?.role.name === 'Client' && entitlements?.isCoveredClient)
    : !entitlements?.isCoveredClient &&
      hasAnyEntitlementCapability(entitlements?.capabilities, ['canCreateTemplate', 'canSelfBuild']);
  const readOnly = (Boolean(id) && (!requestedEdit || !isOwner)) || !entitlementAllowsEdit;
  const hasAssignmentWeeks = Boolean(assignment);
  const showWeeks = hasAssignmentWeeks && user?.role?.name !== 'Client';
  const weeks = useMemo(
    () =>
      assignment
        ? assignmentWeekStarts(assignment.startDate, assignment.endDate)
        : [],
    [assignment],
  );
  const { data: routineSessions = [] } = useRoutineSessions(id, showWeeks);

  useEffect(() => {
    if (requestedEdit && entitlements && !entitlementAllowsEdit) {
      queueMicrotask(() => {
        if (entitlements.isCoveredClient) toast.error(t('entitlements.coveredClient'));
        else setUpsell({
          message: t(id
            ? 'entitlements.editTemplate'
            : user?.role.name === 'Trainer'
              ? 'entitlements.trainerTemplateLimit'
              : 'entitlements.clientTemplateLimit'),
        });
      });
    }
  }, [entitlementAllowsEdit, entitlements, id, requestedEdit, t, user?.role.name]);

  useEffect(() => {
    if (!weeks.length) {
      return;
    }
    queueMicrotask(() => {
      setActiveWeekStart((current) =>
        weeks.includes(current) ? current : defaultAssignmentWeek(weeks),
      );
    });
  }, [weeks]);

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
  const activeDay = days.find(
    (day) =>
      day.weekday === activeWeekday &&
      day.weekStartDate === (hasAssignmentWeeks ? activeWeekStart : null),
  );
  const routine = activeDay?.exercises ?? [];
  const activeSession = sessionForDay(routineSessions, activeWeekStart, activeWeekday);
  const dayLocked = Boolean(activeSession);
  const dayReadOnly = readOnly || dayLocked;

  const updateActiveExercises = useCallback(
    (updater: (current: RoutineExercise[]) => RoutineExercise[]) => {
      setDays((current) => {
        const weekStartDate = hasAssignmentWeeks ? activeWeekStart : null;
        const exists = current.some(
          (day) =>
            day.weekday === activeWeekday &&
            day.weekStartDate === weekStartDate,
        );
        if (!exists) {
          return [
            ...current,
            { weekday: activeWeekday, weekStartDate, exercises: updater([]) },
          ];
        }
        return current.map((day) =>
          day.weekday === activeWeekday && day.weekStartDate === weekStartDate
            ? { ...day, exercises: updater(day.exercises) }
            : day,
        );
      });
    },
    [activeWeekStart, activeWeekday, hasAssignmentWeeks],
  );

  const handleAddExercise = useCallback(
    (exercise: LibraryExercise) => {
      if (dayLocked) return;
      updateActiveExercises((current) => [
        ...current,
        {
          id: nextId('exercise'),
          exerciseId: exercise.id,
          name: exercise.name,
          target: exercise.category,
          supersetColor: null,
          sets: [{ id: nextId('set'), ...DEFAULT_SET }],
        },
      ]);
    },
    [dayLocked, updateActiveExercises],
  );

  const handleAddSet = useCallback(
    (exerciseId: string, repeatLast = false) => {
      updateActiveExercises((current) => {
        const source = current.find((exercise) => exercise.id === exerciseId);
        if (!source) return current;
        return current.map((exercise) => {
          if (!isInSupersetAddGroup(exercise, source)) return exercise;
          const previous = repeatLast ? exercise.sets.at(-1) : undefined;
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: nextId('set'),
                weight: previous?.weight ?? DEFAULT_SET.weight,
                reps: previous?.reps ?? DEFAULT_SET.reps,
                restSeconds: previous?.restSeconds ?? DEFAULT_SET.restSeconds,
                rpe: previous?.rpe ?? DEFAULT_SET.rpe,
              },
            ],
          };
        });
      });
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
    } catch (error) {
      const details = getApiErrorDetails(error);
      if (details?.code === 'PLAN_LIMIT') setUpsell({ details });
      else toast.error(getApiErrorMessage(error, t('workouts.saveFailed')));
    }
  };

  const loading = exercisesLoading || (Boolean(id) && routineLoading);
  const dayLabel = (weekday: number) => t(`workouts.weekdays.${weekday}`);
  const visibleWeekdays = dayReadOnly
    ? WEEKDAYS.filter((weekday) =>
        days.some(
          (day) =>
            day.weekday === weekday &&
            day.weekStartDate ===
              (hasAssignmentWeeks ? activeWeekStart : null) &&
            day.exercises.length > 0,
        ))
    : WEEKDAYS;

  return (
    <WorkoutsPageShell>
      <Sidebar username={user?.username ?? 'Alex'} />
      <WorkoutsMain>
        <WorkoutsHeader />
        <EntitlementGraceWarning />
        <WorkoutsBuilderGrid $singleColumn={readOnly || dayLocked}>
          {!readOnly && !dayLocked && <LibraryPane>
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
                durationLabel={t('workouts.dayCount', {
                  count: days.filter(
                    (day) =>
                      day.weekStartDate ===
                        (hasAssignmentWeeks ? activeWeekStart : null) &&
                      day.exercises.length,
                  ).length,
                })}
                intensityLabel={readOnly || dayLocked ? t('workouts.readOnly') : t('workouts.editable')}
                onSave={handleSave}
                isSaving={createMutation.isPending || updateMutation.isPending}
                readOnly={readOnly}
              />
              {readOnly ? (
                description.trim() ? <DescriptionText>{description}</DescriptionText> : null
              ) : (
                <Description
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t('workouts.descriptionPlaceholder')}
                  aria-label={t('workouts.description')}
                />
              )}
              {showWeeks && weeks.length ? (
                <WeekdayTabs aria-label={t('workouts.assignmentWeeks')}>
                  {weeks.map((weekStart, index) => (
                    <WeekdayButton
                      key={weekStart}
                      type="button"
                      $active={activeWeekStart === weekStart}
                      onClick={() => setActiveWeekStart(weekStart)}
                    >
                      {t('workouts.weekTag', { number: index + 1 })}
                      <WeekRange>
                        {t('workouts.weekRange', {
                          start: weekStart,
                          end: utcWeekEnd(weekStart),
                        })}
                      </WeekRange>
                    </WeekdayButton>
                  ))}
                </WeekdayTabs>
              ) : null}
              <WeekdayTabs aria-label={t('workouts.trainingDays')}>
                {visibleWeekdays.map((weekday) => {
                  const count =
                    days.find(
                      (day) =>
                        day.weekday === weekday &&
                        day.weekStartDate ===
                          (hasAssignmentWeeks ? activeWeekStart : null),
                    )?.exercises.length ?? 0;
                  const logged = sessionForDay(routineSessions, activeWeekStart, weekday);
                  const statusLabel = logged
                    ? t(
                        logged.status === 'INCOMPLETE'
                          ? 'workouts.dayIncomplete'
                          : 'workouts.dayDone',
                      )
                    : count
                      ? String(count)
                      : '';
                  return (
                    <WeekdayButton
                      key={weekday}
                      type="button"
                      $active={activeWeekday === weekday}
                      aria-label={statusLabel ? `${dayLabel(weekday)} · ${statusLabel}` : dayLabel(weekday)}
                      onClick={() => setActiveWeekday(weekday)}
                    >
                      <ChipInner>
                        {dayLabel(weekday)}
                        {logged?.status === 'COMPLETED' ? <Check size={13} aria-hidden /> : null}
                        {logged?.status === 'INCOMPLETE' ? <Pause size={13} aria-hidden /> : null}
                        {!logged && count ? ` · ${count}` : null}
                      </ChipInner>
                    </WeekdayButton>
                  );
                })}
              </WeekdayTabs>
              {dayLocked && activeSession?.status === 'INCOMPLETE' && activeSession.stopReason ? (
                <DescriptionText>
                  {t('workouts.stopReasonLabel')}: {activeSession.stopReason}
                </DescriptionText>
              ) : null}
              {routine.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  position={index + 1}
                  onAddSet={() => handleAddSet(exercise.id)}
                  onAddSetFromLast={() => handleAddSet(exercise.id, true)}
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
                  readOnly={dayReadOnly}
                />
              ))}
              {!routine.length && (dayReadOnly
                ? <Status>{t('workouts.emptyDay')}</Status>
                : <RoutineDropzone />)}
            </>}
          </RoutinePane>
        </WorkoutsBuilderGrid>
      </WorkoutsMain>
      <PlusUpsellModal
        isOpen={Boolean(upsell)}
        details={upsell?.details}
        resource="templates"
        message={upsell?.message}
        onClose={() => setUpsell(null)}
      />
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

const DescriptionText = styled.p`
  margin: 0;
  max-width: 48rem;
  color: #e7bdbb;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const WeekdayTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const WeekdayButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 0.85rem;
  background: ${({ $active }) => $active ? '#ffb3b1' : '#1c1e32'};
  color: ${({ $active }) => $active ? '#680011' : '#e7bdbb'};
  font-weight: 800;
  cursor: pointer;
`;

const ChipInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const WeekRange = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.8;
`;

const Status = styled.p`
  margin: 3rem 0;
  color: #e7bdbb;
  text-align: center;
`;
