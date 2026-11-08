import { Check } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AuthBrandPanel, BRAND_RED, BrandHeadline } from './AuthBrandPanel';

export type SignupRole = 'Client' | 'Trainer' | 'Gym';

type SignupBrandPanelProps = {
  role: SignupRole;
  /** 1-based index of the step the form is on. */
  step: number;
};

type StepDef = { title: string; hint: string };

/** Mirrors the step order in SignupPage for each role. */
const STEP_KEYS: Record<SignupRole, Array<'account' | 'body' | 'coaching' | 'facility' | 'confirmation'>> = {
  Client: ['account', 'body', 'confirmation'],
  Trainer: ['account', 'body', 'coaching', 'confirmation'],
  Gym: ['account', 'facility', 'confirmation'],
};

const STEP_TITLE_KEYS = {
  account: 'auth.stepAccount',
  body: 'auth.stepBody',
  coaching: 'auth.stepCoaching',
  facility: 'auth.stepFacility',
  confirmation: 'auth.stepConfirmation',
} as const;

/**
 * Signup left panel: a role-specific pitch above a stepper that shows where
 * the user is in the signup flow. Both update when the role or step changes.
 */
export function SignupBrandPanel({ role, step }: SignupBrandPanelProps) {
  const { t } = useTranslation();
  const steps: StepDef[] = STEP_KEYS[role].map((key) => ({
    title: t(STEP_TITLE_KEYS[key]),
    hint: t(`auth.signupPanel.stepHints.${key}`),
  }));
  const base = `auth.signupPanel.roles.${role}`;

  return (
    <AuthBrandPanel width="42%">
      {/* key re-mounts the pitch so it fades in when the role changes */}
      <Pitch key={role} data-testid="signup-panel-pitch">
        <Chip>{t(`${base}.chip`)}</Chip>
        <Headline>
          {t(`${base}.headline`)} <em>{t(`${base}.headlineAccent`)}</em>
        </Headline>
      </Pitch>

      <Stepper aria-label={t('auth.signupPanel.stepsLabel')}>
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < step ? 'done' : n === step ? 'current' : 'todo';
          return (
            <StepItem key={s.title} $state={state} aria-current={state === 'current' ? 'step' : undefined}>
              <Marker $state={state} aria-hidden="true">
                <span>{state === 'done' ? <Check size={14} strokeWidth={3} /> : n}</span>
              </Marker>
              <div>
                <StepTitle $state={state}>{s.title}</StepTitle>
                <StepHint>{s.hint}</StepHint>
              </div>
            </StepItem>
          );
        })}
      </Stepper>
    </AuthBrandPanel>
  );
}

type StepState = 'done' | 'current' | 'todo';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
`;

const Pitch = styled.div`
  display: grid;
  gap: 1rem;
  animation: ${fadeIn} 0.25s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Chip = styled.span`
  justify-self: start;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(239, 35, 60, 0.15);
  color: #ff7486;
`;

const Headline = styled(BrandHeadline)`
  font-size: clamp(2rem, 3vw, 2.625rem);
`;

const Stepper = styled.ol`
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: grid;
`;

const StepItem = styled.li<{ $state: StepState }>`
  position: relative;
  display: grid;
  grid-template-columns: 2.25rem 1fr;
  gap: 1rem;
  align-items: start;
  padding-bottom: 1.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  /* connector line between markers */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: calc(1.125rem - 1px);
    top: 2.5rem;
    bottom: 0.25rem;
    width: 2px;
    border-radius: 2px;
    background-color: ${({ $state }) => ($state === 'done' ? BRAND_RED : 'rgba(255, 255, 255, 0.15)')};
  }
`;

const Marker = styled.div<{ $state: StepState }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  display: grid;
  place-items: center;
  transform: rotate(-10deg);
  font-size: 0.875rem;
  font-weight: 700;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  border: 1.5px solid
    ${({ $state }) => ($state === 'todo' ? 'rgba(255, 255, 255, 0.25)' : BRAND_RED)};
  background-color: ${({ $state }) =>
    $state === 'current' ? BRAND_RED : $state === 'done' ? 'rgba(239, 35, 60, 0.15)' : 'transparent'};
  color: ${({ $state }) => ($state === 'current' ? '#ffffff' : $state === 'done' ? '#ff7486' : '#c8cede')};

  > span {
    display: flex;
    transform: rotate(10deg);
  }
`;

const StepTitle = styled.div<{ $state: StepState }>`
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ $state }) => ($state === 'todo' ? '#c8cede' : '#ffffff')};
`;

const StepHint = styled.div`
  font-size: 0.875rem;
  color: #8d99ae;
  margin-top: 0.125rem;
`;
