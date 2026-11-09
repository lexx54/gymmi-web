import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Check, ChevronLeft, HeartPulse, Hourglass, Square } from 'lucide-react';
import { MOCK, PhoneFrame, Pill, pickLang } from './mockupStyles';

const REST_SECONDS = 90;
const EXERCISE = { en: 'Barbell Bench Press', es: 'Press de banca con barra' };
const SETS = [
  { weight: 80, reps: 8, rpe: 7 },
  { weight: 80, reps: 8, rpe: 8 },
  { weight: 82.5, reps: 6, rpe: 8.5 },
  { weight: 82.5, reps: 6, rpe: 9 },
];
/** The demo day has 3 exercises; this card is the first one. */
const TOTAL_EXERCISES = 3;

const formatClock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/** Mirrors the mobile `ActiveWorkoutScreen`: double-tap logs a set and starts the rest countdown. */
export function ActiveSessionMockup() {
  const { t, i18n } = useTranslation();
  const [doneSets, setDoneSets] = useState(2);
  const [rest, setRest] = useState(0);

  useEffect(() => {
    if (rest <= 0) return undefined;
    const id = window.setTimeout(() => setRest((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [rest]);

  const allDone = doneSets === SETS.length;
  const logSet = () => {
    if (allDone) {
      setDoneSets(0);
      setRest(0);
      return;
    }
    setDoneSets((n) => n + 1);
    setRest(REST_SECONDS);
  };

  // Progress over the whole day: exercise 1 counts by its sets, the others are still pending.
  const percent = Math.round((doneSets / SETS.length / TOTAL_EXERCISES) * 100);

  return (
    <PhoneFrame data-testid="hero-active-session">
      <Header>
        <RoundIcon>
          <ChevronLeft size={16} />
        </RoundIcon>
        <HeaderText>
          <Eyebrow>{t('landing.mock.sessionLabel')}</Eyebrow>
          <Title>{t('landing.mock.activeWorkout')}</Title>
        </HeaderText>
        <StopIcon aria-hidden>
          <Square size={12} fill="#fff" />
        </StopIcon>
      </Header>

      <Hero>
        <HeroIcon>
          <HeartPulse size={22} color={MOCK.coral} />
        </HeroIcon>
        <HeroText>
          <HeroName>{pickLang(i18n.language, EXERCISE)}</HeroName>
          <HeroSub>{t('landing.mock.chest')}</HeroSub>
        </HeroText>
        {rest > 0 && (
          <RestBadge>
            <Hourglass size={13} />
            <strong>{formatClock(rest)}</strong>
            <SkipChip type="button" onClick={() => setRest(0)}>
              {t('landing.mock.skipRest')}
            </SkipChip>
          </RestBadge>
        )}
      </Hero>

      <ProgressRow>
        <span>{t('landing.mock.exerciseOf', { current: 1, total: TOTAL_EXERCISES })}</span>
        <Pill $color={MOCK.coral}>{percent}%</Pill>
      </ProgressRow>
      <Segments>
        {Array.from({ length: TOTAL_EXERCISES }, (_, i) => (
          <Segment key={i} $state={i === 0 ? (allDone ? 'done' : 'active') : 'upcoming'} />
        ))}
      </Segments>

      <ExerciseCard
        onDoubleClick={logSet}
        role="button"
        tabIndex={0}
        aria-label={t('landing.mock.doubleTapHint')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logSet();
          }
        }}
      >
        <CardTop>
          <Pill $color={allDone ? MOCK.green : MOCK.coral}>
            {allDone ? t('landing.mock.done') : t('landing.mock.inProgress')}
          </Pill>
          <Category>{t('landing.mock.chest')}</Category>
        </CardTop>
        <CardTitle>1. {pickLang(i18n.language, EXERCISE)}</CardTitle>

        <SetTable>
          <thead>
            <tr>
              <th>{t('landing.mock.colSet')}</th>
              <th>{t('landing.mock.colWeight')}</th>
              <th>{t('landing.mock.colReps')}</th>
              <th>RPE</th>
              <th>{t('landing.mock.done')}</th>
            </tr>
          </thead>
          <tbody>
            {SETS.map((set, i) => {
              const state = i < doneSets ? 'done' : i === doneSets ? 'active' : 'pending';
              return (
                <SetRow key={i} $state={state}>
                  <td>
                    {state === 'active' && <ActiveDot />}
                    {i + 1}
                  </td>
                  <td>
                    <Value $boxed={state === 'active'}>{set.weight}</Value>
                  </td>
                  <td>
                    <Value $boxed={state === 'active'}>{set.reps}</Value>
                  </td>
                  <td>
                    <Value $boxed={state === 'active'}>{set.rpe}</Value>
                  </td>
                  <td>
                    {state === 'pending' ? (
                      <PendingDot />
                    ) : (
                      <Check size={15} color={state === 'done' ? MOCK.green : '#fff'} strokeWidth={3} />
                    )}
                  </td>
                </SetRow>
              );
            })}
          </tbody>
        </SetTable>

        <CardFooter>
          <span>
            {allDone
              ? t('landing.mock.allSetsDone')
              : t('landing.mock.setInProgress', { current: doneSets + 1, total: SETS.length })}
          </span>
          <span>{t('landing.mock.swipeToChange')}</span>
        </CardFooter>
      </ExerciseCard>

      <Hint>{t('landing.mock.doubleTapHint')}</Hint>
    </PhoneFrame>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
`;

const RoundIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: ${MOCK.card};
  color: ${MOCK.white};
`;

const StopIcon = styled(RoundIcon)`
  background: ${MOCK.coral};
`;

const HeaderText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Eyebrow = styled.span`
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${MOCK.pink};
`;

const Title = styled.span`
  font-size: 1.05rem;
  font-weight: 800;
`;

const Hero = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem;
  border-radius: 1.1rem;
  background: linear-gradient(135deg, #2a1d33 0%, ${MOCK.card} 70%);
  margin-bottom: 0.85rem;
`;

const HeroIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.8rem;
  background: rgba(255, 79, 94, 0.14);
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const HeroName = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
`;

const HeroSub = styled.span`
  font-size: 0.7rem;
  color: ${MOCK.pink};
`;

const RestBadge = styled.div`
  position: absolute;
  top: -0.6rem;
  right: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.3rem 0.25rem 0.55rem;
  border-radius: 999px;
  background: ${MOCK.coral};
  color: #fff;
  font-size: 0.72rem;
  box-shadow: 0 6px 16px rgba(255, 79, 94, 0.35);
`;

const SkipChip = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.12rem 0.45rem;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  cursor: pointer;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;

const Segments = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.85rem;
`;

const Segment = styled.span<{ $state: 'done' | 'active' | 'upcoming' }>`
  flex: 1;
  height: 0.3rem;
  border-radius: 999px;
  background: ${({ $state }) =>
    $state === 'done' ? MOCK.green : $state === 'active' ? MOCK.coral : MOCK.cardHigh};
`;

const ExerciseCard = styled.div`
  padding: 0.85rem;
  border-radius: 1.1rem;
  background: ${MOCK.card};
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  outline: none;
  &:focus-visible {
    box-shadow: 0 0 0 2px ${MOCK.coral};
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Category = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${MOCK.muted};
`;

const CardTitle = styled.div`
  margin: 0.5rem 0 0.6rem;
  font-size: 0.95rem;
  font-weight: 800;
`;

const SetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  th {
    padding-bottom: 0.35rem;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${MOCK.muted};
  }
  th,
  td {
    text-align: center;
  }
`;

const SetRow = styled.tr<{ $state: 'done' | 'active' | 'pending' }>`
  color: ${({ $state }) => ($state === 'pending' ? MOCK.muted : MOCK.white)};
  opacity: ${({ $state }) => ($state === 'done' ? 0.75 : 1)};
  td {
    padding: 0.28rem 0;
    font-weight: 700;
  }
`;

const ActiveDot = styled.span`
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 0.3rem;
  border-radius: 999px;
  background: ${MOCK.coral};
  vertical-align: middle;
`;

const Value = styled.span<{ $boxed: boolean }>`
  display: inline-block;
  min-width: 2.4rem;
  padding: 0.15rem 0.3rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ $boxed }) => ($boxed ? 'rgba(255,79,94,0.6)' : 'transparent')};
  background: ${({ $boxed }) => ($boxed ? 'rgba(255,79,94,0.08)' : 'transparent')};
`;

const PendingDot = styled.span`
  display: inline-block;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: ${MOCK.cardHigh};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.6rem;
  font-size: 0.62rem;
  color: ${MOCK.muted};
`;

const Hint = styled.p`
  margin: 0.7rem 0 0;
  text-align: center;
  font-size: 0.65rem;
  color: ${MOCK.faint};
`;
