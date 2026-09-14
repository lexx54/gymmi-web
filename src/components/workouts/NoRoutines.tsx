import { CalendarDays, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Can } from '../Can';

export type NoRoutinesVariant = 'loading' | 'error' | 'empty' | 'no-results';

type NoRoutinesProps = {
  variant: NoRoutinesVariant;
  onCreateRoutine?: () => void;
  onClearFilters?: () => void;
};

const COPY: Record<NoRoutinesVariant, { titleKey: string; descriptionKey: string }> = {
  loading: {
    titleKey: 'workouts.loadingTitle',
    descriptionKey: 'workouts.loadingDescription',
  },
  error: {
    titleKey: 'workouts.loadErrorTitle',
    descriptionKey: 'workouts.errorDescription',
  },
  empty: {
    titleKey: 'workouts.emptyTitle',
    descriptionKey: 'workouts.emptyDescription',
  },
  'no-results': {
    titleKey: 'workouts.emptySearchTitle',
    descriptionKey: 'workouts.noResultsDescription',
  },
};

/**
 * Empty and status states for the routine library grid.
 */
export function NoRoutines({
  variant,
  onCreateRoutine,
  onClearFilters,
}: NoRoutinesProps) {
  const { t } = useTranslation();
  const { titleKey, descriptionKey } = COPY[variant];

  return (
    <Root role="status" aria-live="polite">
      {variant === 'empty' ? (
        <IconWrap aria-hidden="true">
          <CalendarDays size={32} strokeWidth={1.75} />
        </IconWrap>
      ) : null}
      <Eyebrow>{variant === 'loading' ? t('workouts.libraryTitle') : t('nav.workouts')}</Eyebrow>
      <Title>{t(titleKey)}</Title>
      <Description>{t(descriptionKey)}</Description>
      {variant === 'empty' ? (
        <Can resource="workouts" action="CREATE">
          <Actions>
            <PrimaryButton type="button" onClick={onCreateRoutine}>
              <Plus size={16} />
              {t('workouts.createRoutine')}
            </PrimaryButton>
          </Actions>
        </Can>
      ) : null}
      {variant === 'no-results' ? (
        <SecondaryButton type="button" onClick={onClearFilters}>
          {t('workouts.clearFilters')}
        </SecondaryButton>
      ) : null}
    </Root>
  );
}

const Root = styled.section`
  margin: 2.5rem auto 0;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1rem;
  background-color: #181a2e;
  color: #ffb3b1;
  margin-bottom: 0.35rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.68rem;
  font-weight: 700;
`;

const Title = styled.h3`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #e0e0fc;
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1.15;
`;

const Description = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.92rem;
  line-height: 1.55;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.6rem;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-shadow: 0 18px 40px -14px rgba(255, 83, 90, 0.55);
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: #1c1e32;
  color: #ffdad6;
  box-shadow: none;
`;
