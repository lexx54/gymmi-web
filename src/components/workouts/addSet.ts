export const DEFAULT_SET = { weight: 0, reps: 10, restSeconds: 60, rpe: 7 };

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
