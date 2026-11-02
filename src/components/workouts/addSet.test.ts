import { describe, expect, it } from 'vitest';
import { appendSets, isInSupersetAddGroup, MAX_SETS_PER_EXERCISE } from './addSet';

describe('isInSupersetAddGroup', () => {
  const red = { id: 'a', supersetColor: '#ff535a' };
  const redPartner = { id: 'b', supersetColor: '#ff535a' };
  const blue = { id: 'c', supersetColor: '#55c2ff' };
  const solo = { id: 'd', supersetColor: null };

  it('always includes the source exercise', () => {
    expect(isInSupersetAddGroup(solo, solo)).toBe(true);
    expect(isInSupersetAddGroup(red, red)).toBe(true);
  });

  it('includes partners that share the source superset color', () => {
    expect(isInSupersetAddGroup(redPartner, red)).toBe(true);
  });

  it('excludes other colors and ungrouped exercises', () => {
    expect(isInSupersetAddGroup(blue, red)).toBe(false);
    expect(isInSupersetAddGroup(solo, red)).toBe(false);
    expect(isInSupersetAddGroup(red, solo)).toBe(false);
  });
});

describe('appendSets', () => {
  let id = 0;
  const makeId = () => `new-${++id}`;
  const set = { id: 'a', weight: 80, reps: 8, restSeconds: 90, rpe: 8 };

  it('copies the last set for each added set', () => {
    const result = appendSets([set], 3, makeId);

    expect(result).toHaveLength(4);
    expect(result.slice(1)).toEqual([
      expect.objectContaining({ weight: 80, reps: 8, restSeconds: 90, rpe: 8 }),
      expect.objectContaining({ weight: 80, reps: 8, restSeconds: 90, rpe: 8 }),
      expect.objectContaining({ weight: 80, reps: 8, restSeconds: 90, rpe: 8 }),
    ]);
    expect(new Set(result.map((entry) => entry.id)).size).toBe(4);
  });

  it('uses the defaults when there is no set yet', () => {
    expect(appendSets([], 1, makeId)[0]).toMatchObject({ weight: 0, reps: 10, restSeconds: 60, rpe: 7 });
  });

  it('never goes past the maximum', () => {
    const five = Array.from({ length: 5 }, (_, index) => ({ ...set, id: `s-${index}` }));

    expect(appendSets(five, 4, makeId)).toHaveLength(MAX_SETS_PER_EXERCISE);
    expect(appendSets(appendSets(five, 1, makeId), 2, makeId)).toHaveLength(MAX_SETS_PER_EXERCISE);
  });
});
