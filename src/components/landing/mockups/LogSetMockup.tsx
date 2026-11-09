import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Bell, Check, Minus, Plus } from 'lucide-react';
import { MOCK, PhoneFrame, PrimaryButton, pickLang } from './mockupStyles';

const EXERCISE = { en: 'Barbell Back Squat', es: 'Sentadilla trasera con barra' };

/** Mirrors the mobile custom-mode "Log Set" modal and the "Rest Complete!" alert. */
export function LogSetMockup() {
  const { t, i18n } = useTranslation();
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(6);
  const [logged, setLogged] = useState<{ weight: number; reps: number }[]>([
    { weight: 100, reps: 6 },
  ]);
  const [restDone, setRestDone] = useState(false);

  const logSet = () => {
    setLogged((prev) => [...prev, { weight, reps }].slice(-4));
    setRestDone(true);
  };

  return (
    <PhoneFrame data-testid="log-set-mockup">
      <Eyebrow>{t('landing.mock.customWorkout')}</Eyebrow>
      <ExerciseName>{pickLang(i18n.language, EXERCISE)}</ExerciseName>

      <LoggedList>
        {logged.map((s, i) => (
          <LoggedRow key={i}>
            <span>
              {t('landing.mock.colSet')} {i + 1}
            </span>
            <span>
              {s.weight} kg × {s.reps}
            </span>
            <Check size={13} color={MOCK.green} strokeWidth={3} />
          </LoggedRow>
        ))}
      </LoggedList>

      {restDone ? (
        <Sheet>
          <BellIcon>
            <Bell size={18} color={MOCK.gold} />
          </BellIcon>
          <SheetTitle>{t('landing.mock.restCompleteTitle')}</SheetTitle>
          <SheetText>{t('landing.mock.restCompleteBody')}</SheetText>
          <PrimaryButton type="button" onClick={() => setRestDone(false)}>
            {t('landing.mock.continueWorkout')}
          </PrimaryButton>
        </Sheet>
      ) : (
        <Sheet>
          <SheetTitle>{t('landing.mock.logSet')}</SheetTitle>
          <Stepper
            label={t('landing.mock.weightKg')}
            value={weight}
            step={2.5}
            onChange={setWeight}
          />
          <Stepper label={t('landing.mock.colReps')} value={reps} step={1} onChange={setReps} />
          <PrimaryButton type="button" onClick={logSet}>
            {t('landing.mock.logSet')}
          </PrimaryButton>
        </Sheet>
      )}
    </PhoneFrame>
  );
}

function Stepper({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <StepperRow>
      <span>{label}</span>
      <StepperControls>
        <StepButton type="button" aria-label={`${label} -`} onClick={() => onChange(Math.max(step, value - step))}>
          <Minus size={12} />
        </StepButton>
        <strong>{value}</strong>
        <StepButton type="button" aria-label={`${label} +`} onClick={() => onChange(value + step)}>
          <Plus size={12} />
        </StepButton>
      </StepperControls>
    </StepperRow>
  );
}

const Eyebrow = styled.span`
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${MOCK.pink};
`;

const ExerciseName = styled.div`
  margin: 0.2rem 0 0.75rem;
  font-size: 1rem;
  font-weight: 800;
`;

const LoggedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.85rem;
`;

const LoggedRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  padding: 0.45rem 0.7rem;
  border-radius: 0.65rem;
  background: ${MOCK.card};
  font-size: 0.72rem;
  font-weight: 700;
  color: ${MOCK.text};
`;

const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.6rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: ${MOCK.card};
  border: 1px solid rgba(255, 255, 255, 0.07);
  text-align: center;
`;

const BellIcon = styled.span`
  align-self: center;
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.14);
`;

const SheetTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
`;

const SheetText = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: ${MOCK.muted};
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.6rem;
  border-radius: 0.65rem;
  background: ${MOCK.screen};
  font-size: 0.72rem;
  font-weight: 700;
  color: ${MOCK.muted};
`;

const StepperControls = styled.span`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${MOCK.white};
  strong {
    min-width: 2.2rem;
    font-size: 0.85rem;
  }
`;

const StepButton = styled.button`
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 999px;
  background: ${MOCK.cardHigh};
  color: #fff;
  cursor: pointer;
`;
