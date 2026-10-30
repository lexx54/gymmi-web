import { describe, it, expect } from 'vitest';
import { canDeleteExercise, canEditExercise } from './exercisePermissions';

const admin = { id: 'admin-1', role: { name: 'Admin' } };
const trainer = { id: 'trainer-1', role: { name: 'Trainer' } };
const gym = { id: 'gym-user-1', role: { name: 'Gym' } };

const catalog = { ownerId: null, gymId: null };
const trainersOwn = { ownerId: 'trainer-1', gymId: null };
const gymsOwn = { ownerId: 'gym-user-1', gymId: 'gym-1' };

describe('exercise permissions', () => {
  it('lets admins edit only catalog exercises but delete any', () => {
    expect(canEditExercise(admin, catalog)).toBe(true);
    expect(canEditExercise(admin, trainersOwn)).toBe(false);
    expect(canDeleteExercise(admin, trainersOwn)).toBe(true);
  });

  it('lets owners edit and delete their own exercises', () => {
    expect(canEditExercise(trainer, trainersOwn)).toBe(true);
    expect(canDeleteExercise(trainer, trainersOwn)).toBe(true);
    expect(canEditExercise(gym, gymsOwn)).toBe(true);
    expect(canDeleteExercise(gym, gymsOwn)).toBe(true);
  });

  it('blocks everyone else, including gyms on the catalog', () => {
    expect(canEditExercise(gym, catalog)).toBe(false);
    expect(canDeleteExercise(gym, catalog)).toBe(false);
    expect(canEditExercise(trainer, gymsOwn)).toBe(false);
    expect(canDeleteExercise(trainer, gymsOwn)).toBe(false);
    expect(canEditExercise(null, trainersOwn)).toBe(false);
  });
});
