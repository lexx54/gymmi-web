import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dumbbell, Plus } from 'lucide-react';
import { MOCK, Panel, Pill, Sub, WebBody, WebFrame, WebTitle, WebTopBar, pickLang } from './mockupStyles';

type Label = { en: string; es: string };
type DemoExercise = { name: Label; sets: { weight: number; reps: number; rest: number; rpe: number }[]; superset?: string };

const set = (weight: number, reps: number, rest: number, rpe: number) => ({ weight, reps, rest, rpe });

/** Weekday index uses `workouts.weekdays` keys (0 = Sunday). Monday-first order like the real builder. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

const PLAN: Record<number, DemoExercise[]> = {
  1: [
    { name: { en: 'Barbell Bench Press', es: 'Press de banca con barra' }, sets: [set(80, 8, 120, 7), set(80, 8, 120, 8), set(82.5, 6, 150, 8.5)] },
    { name: { en: 'Overhead Barbell Press', es: 'Press militar con barra' }, sets: [set(45, 8, 90, 8), set(45, 8, 90, 8)] },
    { name: { en: 'Triceps Rope Pushdown', es: 'Extensión de tríceps en polea' }, sets: [set(25, 12, 60, 8), set(25, 12, 60, 9)], superset: '#a855f7' },
    { name: { en: 'Dumbbell Lateral Raise', es: 'Elevaciones laterales con mancuernas' }, sets: [set(10, 15, 60, 8), set(10, 15, 60, 9)], superset: '#a855f7' },
  ],
  3: [
    { name: { en: 'Barbell Back Squat', es: 'Sentadilla trasera con barra' }, sets: [set(100, 6, 180, 7.5), set(100, 6, 180, 8), set(105, 5, 180, 8.5)] },
    { name: { en: 'Romanian Deadlift', es: 'Peso muerto rumano' }, sets: [set(90, 8, 120, 8), set(90, 8, 120, 8)] },
  ],
  5: [
    { name: { en: 'Lat Pulldown', es: 'Jalón al pecho' }, sets: [set(60, 10, 90, 8), set(60, 10, 90, 8.5)], superset: '#38bdf8' },
    { name: { en: 'Seated Cable Row', es: 'Remo sentado en polea' }, sets: [set(55, 10, 90, 8), set(55, 10, 90, 8.5)], superset: '#38bdf8' },
  ],
};

const LIBRARY: DemoExercise[] = [
  { name: { en: 'Incline Dumbbell Press', es: 'Press inclinado con mancuernas' }, sets: [set(28, 10, 90, 8), set(28, 10, 90, 8)] },
  { name: { en: 'Face Pull', es: 'Face pull en polea' }, sets: [set(20, 15, 60, 7), set(20, 15, 60, 8)] },
  { name: { en: 'Leg Press', es: 'Prensa de piernas' }, sets: [set(160, 10, 120, 8), set(160, 10, 120, 8)] },
];

/** Mirrors the web `WorkoutsPage` builder: Mon–Sun tabs, set table per exercise, add from the library. */
export function RoutineBuilderMockup() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [day, setDay] = useState(1);
  const [added, setAdded] = useState<Record<number, DemoExercise[]>>({});

  const exercises = [...(PLAN[day] ?? []), ...(added[day] ?? [])];
  const [first, ...rest] = exercises;
  const minutes = exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, x) => s + 1 + x.rest / 60, 0),
    0,
  );
  const isAdded = (ex: DemoExercise) => exercises.some((e) => e.name.en === ex.name.en);

  return (
    <WebFrame data-testid="routine-builder-mockup">
      <WebTopBar>
        <WebTitle>{t('workouts.builderTitle')}</WebTitle>
        <Pill $color={MOCK.green}>{t('landing.mock.editable')}</Pill>
      </WebTopBar>
      <WebBody>
        <div>
          <RoutineName>{t('landing.mock.routineName')}</RoutineName>
          <Sub>{t('landing.mock.durationEst', { minutes: Math.round(minutes) })}</Sub>
        </div>

        <DayTabs role="tablist" aria-label={t('landing.mock.routineName')}>
          {WEEK_ORDER.map((d) => {
            const hasWork = (PLAN[d]?.length ?? 0) + (added[d]?.length ?? 0) > 0;
            return (
              <DayTab key={d} type="button" $active={d === day} onClick={() => setDay(d)}>
                {t(`workouts.weekdays.${d}`)}
                <DayDot $visible={hasWork} />
              </DayTab>
            );
          })}
        </DayTabs>

        {first ? (
          <>
            <Panel>
              <ExerciseHead>
                <Dumbbell size={14} color={MOCK.coral} />
                <strong>1. {pickLang(lang, first.name)}</strong>
              </ExerciseHead>
              <SetTable>
                <thead>
                  <tr>
                    <th>{t('landing.mock.colSet')}</th>
                    <th>{t('landing.mock.weightKg')}</th>
                    <th>{t('landing.mock.colReps')}</th>
                    <th>{t('landing.mock.restSec')}</th>
                    <th>RPE</th>
                  </tr>
                </thead>
                <tbody>
                  {first.sets.map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><Cell>{s.weight}</Cell></td>
                      <td><Cell>{s.reps}</Cell></td>
                      <td><Cell>{s.rest}s</Cell></td>
                      <td><Cell>{s.rpe}</Cell></td>
                    </tr>
                  ))}
                </tbody>
              </SetTable>
              <AddSet>
                <Plus size={12} /> {t('landing.mock.addSet')}
              </AddSet>
            </Panel>
            {rest.map((ex, i) => (
              <CollapsedRow key={ex.name.en} $superset={ex.superset}>
                <span>
                  {i + 2}. {pickLang(lang, ex.name)}
                </span>
                <RowMeta>
                  {ex.superset && <Pill $color={ex.superset}>{t('landing.mock.superset')}</Pill>}
                  <Sub>{t('landing.mock.setsCount', { count: ex.sets.length })}</Sub>
                </RowMeta>
              </CollapsedRow>
            ))}
          </>
        ) : (
          <RestDay>{t('landing.mock.restDay')}</RestDay>
        )}

        <div>
          <LibraryLabel>{t('landing.mock.addFromLibrary')}</LibraryLabel>
          <LibraryRow>
            {LIBRARY.map((ex) => (
              <LibraryChip
                key={ex.name.en}
                type="button"
                disabled={isAdded(ex)}
                onClick={() =>
                  setAdded((prev) => ({ ...prev, [day]: [...(prev[day] ?? []), ex] }))
                }
              >
                <Plus size={11} /> {pickLang(lang, ex.name)}
              </LibraryChip>
            ))}
          </LibraryRow>
        </div>
      </WebBody>
    </WebFrame>
  );
}

const RoutineName = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${MOCK.white};
  margin-bottom: 0.15rem;
`;

const DayTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const DayTab = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 0.4rem 0 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ $active }) => ($active ? MOCK.red : MOCK.cardLow)};
  color: ${({ $active }) => ($active ? '#fff' : MOCK.muted)};
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
`;

const DayDot = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: 50%;
  bottom: 0.18rem;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 999px;
  transform: translateX(-50%);
  background: currentColor;
  opacity: ${({ $visible }) => ($visible ? 0.9 : 0)};
`;

const ExerciseHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: ${MOCK.white};
`;

const SetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.72rem;
  th {
    padding-bottom: 0.3rem;
    font-size: 0.56rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${MOCK.muted};
  }
  th,
  td {
    text-align: center;
    padding: 0.15rem 0.1rem;
  }
  td:first-child {
    color: ${MOCK.muted};
    font-weight: 700;
  }
`;

const Cell = styled.span`
  display: inline-block;
  width: 100%;
  max-width: 3.4rem;
  padding: 0.18rem 0;
  border-radius: 0.35rem;
  background: ${MOCK.screen};
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: ${MOCK.white};
  font-weight: 700;
`;

const AddSet = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.66rem;
  font-weight: 800;
  color: ${MOCK.pink};
`;

const CollapsedRow = styled.div<{ $superset?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.7rem;
  background: ${MOCK.cardLow};
  border-left: 3px solid ${({ $superset }) => $superset ?? 'transparent'};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${MOCK.white};
`;

const RowMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
`;

const RestDay = styled.div`
  padding: 1.5rem;
  border-radius: 0.8rem;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  text-align: center;
  font-size: 0.75rem;
  color: ${MOCK.muted};
`;

const LibraryLabel = styled.div`
  margin-bottom: 0.4rem;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${MOCK.muted};
`;

const LibraryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const LibraryChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: ${MOCK.text};
  font-size: 0.66rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
