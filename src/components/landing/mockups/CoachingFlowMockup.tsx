import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Check, ChevronDown } from 'lucide-react';
import {
  Avatar,
  CountBadge,
  GhostButton,
  LinkButton,
  MOCK,
  Meta,
  Name,
  Panel,
  PanelTitle,
  Pill,
  PrimaryButton,
  Row,
  Sub,
  WebBody,
  WebFrame,
  WebTitle,
  WebTopBar,
} from './mockupStyles';

type Step = 'request' | 'rejected' | 'assign' | 'train';
type Period = 'WEEK' | 'BIWEEK' | 'MONTH' | 'TRIMESTER' | 'CUSTOM';

const PERIODS: Period[] = ['WEEK', 'BIWEEK', 'MONTH', 'TRIMESTER', 'CUSTOM'];
const WEEKS: Record<Period, number> = { WEEK: 1, BIWEEK: 2, MONTH: 4, TRIMESTER: 12, CUSTOM: 3 };
const CLIENT = 'Sarah Miller';

/** Mirrors the real flow: client request on `ClientsPage`, the library "Assign" dialog, then the client's weekly copy. */
export function CoachingFlowMockup() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('request');
  const [period, setPeriod] = useState<Period>('MONTH');
  const routine = t('landing.mock.routineName');
  const stepIndex = step === 'assign' ? 1 : step === 'train' ? 2 : 0;

  return (
    <WebFrame data-testid="coaching-flow-mockup">
      <WebTopBar>
        <WebTitle>{t('nav.clients')}</WebTitle>
        <Steps>
          {[t('landing.mock.stepRequest'), t('landing.mock.stepAssign'), t('landing.mock.stepTrain')].map(
            (label, i) => (
              <StepChip key={label} $state={i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'todo'}>
                {i < stepIndex ? <Check size={10} strokeWidth={3} /> : i + 1} {label}
              </StepChip>
            ),
          )}
        </Steps>
      </WebTopBar>
      <WebBody>
        {(step === 'request' || step === 'rejected') && (
          <Panel>
            <PanelTitle>
              {t('contracts.pending')}
              <CountBadge>{step === 'request' ? 1 : 0}</CountBadge>
            </PanelTitle>
            {step === 'request' ? (
              <Row>
                <Avatar>SM</Avatar>
                <Meta>
                  <Name>{CLIENT}</Name>
                  <Sub>{t('landing.mock.requestedBy')}</Sub>
                </Meta>
                <Pill>{t('workouts.periods.MONTH')}</Pill>
                <GhostButton type="button" onClick={() => setStep('rejected')}>
                  {t('contracts.reject')}
                </GhostButton>
                <PrimaryButton type="button" onClick={() => setStep('assign')}>
                  {t('contracts.accept')}
                </PrimaryButton>
              </Row>
            ) : (
              <Empty>
                {t('contracts.noPending')}{' '}
                <LinkButton type="button" onClick={() => setStep('request')}>
                  {t('landing.mock.restart')}
                </LinkButton>
              </Empty>
            )}
          </Panel>
        )}

        {step === 'assign' && (
          <Dialog role="group" aria-label={t('landing.mock.assignTitle', { name: routine })}>
            <DialogTitle>{t('landing.mock.assignTitle', { name: routine })}</DialogTitle>
            <Field>
              <FieldLabel>{t('landing.mock.client')}</FieldLabel>
              <FakeSelect>
                {CLIENT} <ChevronDown size={12} />
              </FakeSelect>
            </Field>
            <Field>
              <FieldLabel>{t('workouts.period')}</FieldLabel>
              <PeriodRow>
                {PERIODS.map((p) => (
                  <PeriodButton
                    key={p}
                    type="button"
                    aria-pressed={p === period}
                    $active={p === period}
                    onClick={() => setPeriod(p)}
                  >
                    {t(`workouts.periods.${p}`)}
                  </PeriodButton>
                ))}
              </PeriodRow>
            </Field>
            <DialogActions>
              <GhostButton type="button" onClick={() => setStep('request')}>
                {t('common.cancel')}
              </GhostButton>
              <PrimaryButton type="button" onClick={() => setStep('train')}>
                {t('landing.mock.confirm')}
              </PrimaryButton>
            </DialogActions>
          </Dialog>
        )}

        {step === 'train' && (
          <Panel>
            <PanelTitle>{t('contracts.currentPlan')}</PanelTitle>
            <Row>
              <Avatar>SM</Avatar>
              <Meta>
                <Name>{routine}</Name>
                <Sub>{CLIENT}</Sub>
              </Meta>
              <Pill>{t(`workouts.periods.${period}`)}</Pill>
            </Row>
            <WeekGrid>
              {Array.from({ length: Math.min(WEEKS[period], 4) }, (_, i) => (
                <WeekTag key={i} $state={i === 0 ? 'done' : i === 1 ? 'active' : 'todo'}>
                  <strong>{t('landing.mock.weekN', { n: i + 1 })}</strong>
                  <span>
                    {i === 0
                      ? t('landing.mock.done')
                      : i === 1
                        ? t('landing.mock.inProgress')
                        : t('landing.mock.upcoming')}
                  </span>
                </WeekTag>
              ))}
            </WeekGrid>
            {WEEKS[period] > 4 && <Sub>+{WEEKS[period] - 4}</Sub>}
            <Footer>
              <LinkButton type="button" onClick={() => setStep('request')}>
                {t('landing.mock.restart')}
              </LinkButton>
            </Footer>
          </Panel>
        )}
      </WebBody>
    </WebFrame>
  );
}

const Steps = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const StepChip = styled.span<{ $state: 'done' | 'active' | 'todo' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  color: ${({ $state }) => ($state === 'todo' ? MOCK.faint : $state === 'done' ? MOCK.green : '#fff')};
  background: ${({ $state }) =>
    $state === 'active' ? MOCK.red : $state === 'done' ? 'rgba(52,211,153,0.12)' : 'transparent'};
  border: 1px solid
    ${({ $state }) => ($state === 'todo' ? 'rgba(255,255,255,0.1)' : 'transparent')};
`;

const Empty = styled.div`
  font-size: 0.72rem;
  color: ${MOCK.muted};
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.9rem;
  background: ${MOCK.card};
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const DialogTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${MOCK.white};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FieldLabel = styled.span`
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${MOCK.muted};
`;

const FakeSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.65rem;
  border-radius: 0.55rem;
  background: ${MOCK.screen};
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  font-weight: 700;
  color: ${MOCK.white};
`;

const PeriodRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const PeriodButton = styled.button<{ $active: boolean }>`
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? MOCK.red : 'rgba(255,255,255,0.1)')};
  background: ${({ $active }) => ($active ? 'rgba(239,35,60,0.16)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : MOCK.muted)};
  font-size: 0.66rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr));
  gap: 0.35rem;
  margin-top: 0.5rem;
`;

const WeekTag = styled.div<{ $state: 'done' | 'active' | 'todo' }>`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.6rem;
  background: ${MOCK.screen};
  border: 1px solid
    ${({ $state }) =>
      $state === 'done' ? 'rgba(52,211,153,0.4)' : $state === 'active' ? 'rgba(239,35,60,0.5)' : 'rgba(255,255,255,0.06)'};
  strong {
    font-size: 0.7rem;
    color: ${MOCK.white};
  }
  span {
    font-size: 0.6rem;
    font-weight: 700;
    color: ${({ $state }) => ($state === 'done' ? MOCK.green : $state === 'active' ? MOCK.pink : MOCK.faint)};
  }
`;

const Footer = styled.div`
  margin-top: 0.6rem;
  text-align: right;
`;
