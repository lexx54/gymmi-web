import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from './client';
import {
  assignWorkout,
  createWorkout,
  fetchMyWorkoutAssignment,
  fetchRoutineSessions,
  fetchWorkouts,
  selfAssignWorkout,
  shareWorkout,
} from './workouts';

vi.mock('./client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

const get = apiClient.get as ReturnType<typeof vi.fn>;
const post = apiClient.post as ReturnType<typeof vi.fn>;
const put = apiClient.put as ReturnType<typeof vi.fn>;
const routineId = '11111111-1111-4111-8111-111111111111';
const write = {
  name: 'Push day',
  days: [{
    weekday: 1,
    exercises: [{
      exerciseId: '22222222-2222-4222-8222-222222222222',
      supersetColor: null,
      sets: [{ weight: 80, reps: 10, restSeconds: 90, rpe: 8 }],
    }],
  }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('workout API', () => {
  it('uses the routine collection contract', async () => {
    get.mockResolvedValue({ data: [] });
    post.mockResolvedValue({ data: { id: routineId, ...write } });

    await expect(fetchWorkouts()).resolves.toEqual([]);
    await createWorkout(write);

    expect(get).toHaveBeenCalledWith('/workouts');
    expect(post).toHaveBeenCalledWith('/workouts', write);
  });

  it('uses share and role assignment contracts', async () => {
    put.mockResolvedValue({ data: [] });
    post.mockResolvedValue({ data: { id: 'assignment' } });
    get.mockResolvedValue({ data: null });

    await shareWorkout(routineId, ['33333333-3333-4333-8333-333333333333']);
    await assignWorkout(routineId, { clientId: 'client', period: 'MONTH' });
    await selfAssignWorkout(routineId, { period: 'CUSTOM', customEndDate: '2026-12-31' });
    await expect(fetchMyWorkoutAssignment()).resolves.toBeNull();

    expect(put).toHaveBeenCalledWith(`/workouts/${routineId}/shares`, {
      trainerIds: ['33333333-3333-4333-8333-333333333333'],
    });
    expect(post).toHaveBeenCalledWith(`/workouts/${routineId}/assignments`, {
      clientId: 'client',
      period: 'MONTH',
    });
    expect(post).toHaveBeenCalledWith('/workouts/assignments/me', {
      routineId,
      period: 'CUSTOM',
      customEndDate: '2026-12-31',
    });
    expect(get).toHaveBeenCalledWith('/workouts/assignments/me');
  });

  it('fetches trainer assignment sessions for a fork', async () => {
    get.mockResolvedValue({ data: [] });
    await fetchRoutineSessions(routineId);
    expect(get).toHaveBeenCalledWith(`/workouts/${routineId}/sessions`);
  });
});
