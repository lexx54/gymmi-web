import { describe, expect, it } from 'vitest';
import {
  assignmentWeekStarts,
  defaultAssignmentWeek,
  sessionForDay,
  utcMonday,
  utcWeekEnd,
} from './assignmentWeeks';

describe('assignmentWeeks', () => {
  it('lists overlapping Mondays for a two-week assignment', () => {
    expect(utcMonday('2026-09-18')).toBe('2026-09-14');
    expect(utcWeekEnd('2026-09-14')).toBe('2026-09-20');
    expect(assignmentWeekStarts('2026-09-18', '2026-10-02')).toEqual([
      '2026-09-14',
      '2026-09-21',
      '2026-09-28',
    ]);
  });

  it('defaults to the current week when it is inside the window', () => {
    const weeks = assignmentWeekStarts('2026-09-18', '2026-10-02');
    expect(defaultAssignmentWeek(weeks, '2026-09-24')).toBe('2026-09-21');
    expect(defaultAssignmentWeek(weeks, '2026-08-01')).toBe('2026-09-14');
  });

  it('locks only the logged weekday for that calendar week', () => {
    const sessions = [
      { weekday: 1, weekStartDate: '2026-09-14' },
    ];
    expect(sessionForDay(sessions, '2026-09-14', 1)).toBeTruthy();
    expect(sessionForDay(sessions, '2026-09-21', 1)).toBeUndefined();
    expect(sessionForDay(sessions, '2026-09-14', 2)).toBeUndefined();
  });
});
