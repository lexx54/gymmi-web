export type ActivationTier = 'primary' | 'secondary' | 'stabilizers';

export type ExerciseBodyActivations = {
  primary: string;
  secondary: string;
  stabilizers: string;
};

/** Resolves a catalog muscle to its highest-priority activation tier. */
export function getActivationTier(
  muscle: string,
  activations: ExerciseBodyActivations,
): ActivationTier | undefined {
  const normalized = muscle.trim().toLowerCase();
  if (activations.primary.trim().toLowerCase() === normalized) return 'primary';
  if (activations.secondary.trim().toLowerCase() === normalized) return 'secondary';
  if (activations.stabilizers.trim().toLowerCase() === normalized) return 'stabilizers';
  return undefined;
}
