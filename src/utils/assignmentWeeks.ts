/** Monday (YYYY-MM-DD, UTC) of the week containing `isoDate`. */
export function utcMonday(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

/** Sunday (YYYY-MM-DD, UTC) of the week starting on `weekStart`. */
export function utcWeekEnd(weekStart: string): string {
  const date = new Date(`${weekStart}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 6);
  return date.toISOString().slice(0, 10);
}

/** Mondays overlapping an assignment `[startDate, endDate]` window. */
export function assignmentWeekStarts(startDate: string, endDate: string): string[] {
  const weeks: string[] = [];
  let cursor = utcMonday(startDate);
  const last = utcMonday(endDate);
  while (cursor <= last) {
    weeks.push(cursor);
    const date = new Date(`${cursor}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + 7);
    cursor = date.toISOString().slice(0, 10);
  }
  return weeks;
}

/** Picks the current UTC Monday when it falls in `weeks`, otherwise the first week. */
export function defaultAssignmentWeek(
  weeks: string[],
  today = new Date().toISOString().slice(0, 10),
): string {
  if (!weeks.length) return '';
  const current = utcMonday(today);
  return weeks.includes(current) ? current : weeks[0];
}

export function sessionForDay<T extends { weekday: number; weekStartDate: string }>(
  sessions: T[],
  weekStart: string,
  weekday: number,
): T | undefined {
  return sessions.find(
    (session) => session.weekStartDate === weekStart && session.weekday === weekday,
  );
}
