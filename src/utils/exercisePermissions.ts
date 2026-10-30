import { isCatalogExercise, type Exercise } from '../services/api/exercises';

type Viewer = { id: string; role?: { name: string } | null } | null | undefined;
type OwnedExercise = Pick<Exercise, 'ownerId' | 'gymId'>;

const isAdmin = (user: Viewer) => user?.role?.name === 'Admin';
const isOwner = (user: Viewer, exercise: OwnedExercise) =>
  Boolean(user && exercise.ownerId && exercise.ownerId === user.id);

/**
 * Mirrors the API: Admins edit only the shared catalog; everyone else edits
 * only the custom exercises they created.
 */
export function canEditExercise(user: Viewer, exercise: OwnedExercise): boolean {
  return isAdmin(user) ? isCatalogExercise(exercise) : isOwner(user, exercise);
}

/** Admins may delete any exercise; everyone else only their own. */
export function canDeleteExercise(user: Viewer, exercise: OwnedExercise): boolean {
  return isAdmin(user) || isOwner(user, exercise);
}
