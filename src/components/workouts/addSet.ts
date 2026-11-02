import type { SetEntry } from './types';

export const DEFAULT_SET = { weight: 0, reps: 10, restSeconds: 60, rpe: 7 };

/** Mirrors gymmi-api `MAX_SETS_PER_EXERCISE`. */
export const MAX_SETS_PER_EXERCISE = 6;

/** Extra quick-add buttons shown next to "Add set". */
export const SET_BATCH_SIZES = [2, 3, 4] as const;

/**
 * Appends `count` copies of the last set (or the defaults when there is none),
 * without going past MAX_SETS_PER_EXERCISE.
 */
export function appendSets(
  sets: SetEntry[],
  count: number,
  makeId: () => string,
): SetEntry[] {
  const room = Math.max(0, MAX_SETS_PER_EXERCISE - sets.length);
  const last = sets.at(-1);
  const template = {
    weight: last?.weight ?? DEFAULT_SET.weight,
    reps: last?.reps ?? DEFAULT_SET.reps,
    restSeconds: last?.restSeconds ?? DEFAULT_SET.restSeconds,
    rpe: last?.rpe ?? DEFAULT_SET.rpe,
  };
  return [
    ...sets,
    ...Array.from({ length: Math.min(count, room) }, () => ({ id: makeId(), ...template })),
  ];
}

type GroupableExercise = {
  id: string;
  supersetColor: string | null;
};

/**
 * True when an add-set action on `source` should also apply to `exercise`.
 * Ungrouped exercises only affect themselves; a shared color updates the whole group.
 */
export function isInSupersetAddGroup(
  exercise: GroupableExercise,
  source: GroupableExercise,
): boolean {
  if (exercise.id === source.id) return true;
  return Boolean(source.supersetColor && exercise.supersetColor === source.supersetColor);
}
