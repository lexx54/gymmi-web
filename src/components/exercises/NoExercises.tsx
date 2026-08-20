import { Dumbbell, Plus, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Can } from '../Can';

export type NoExercisesVariant = 'loading' | 'error' | 'empty' | 'no-results';

type NoExercisesProps = {
  variant: NoExercisesVariant;
  onCreateExercise?: () => void;
  onBulkUpload?: () => void;
  onClearSearch?: () => void;
};

const COPY: Record<NoExercisesVariant, { titleKey: string; descriptionKey: string }> = {
  loading: {
    titleKey: 'exercises.loadingTitle',
    descriptionKey: 'exercises.loadingDescription',
  },
  error: {
    titleKey: 'exercises.loadErrorTitle',
    descriptionKey: 'exercises.errorDescription',
  },
  empty: {
    titleKey: 'exercises.emptyTitle',
    descriptionKey: 'exercises.emptyDescription',
  },
  'no-results': {
    titleKey: 'exercises.emptySearchTitle',
    descriptionKey: 'exercises.noResultsDescription',
  },
};

/**
 * Empty and status states for the exercises catalog grid.
 */
export function NoExercises({
  variant,
  onCreateExercise,
  onBulkUpload,
  onClearSearch,
}: NoExercisesProps) {
  const { t } = useTranslation();
  const { titleKey, descriptionKey } = COPY[variant];

  return (
    <Root role="status" aria-live="polite">
      {variant === 'empty' ? (
        <IconWrap aria-hidden="true">
          <Dumbbell size={32} strokeWidth={1.75} />
        </IconWrap>
      ) : null}
      <Eyebrow>{variant === 'loading' ? t('exercises.catalog') : t('nav.exercises')}</Eyebrow>
      <Title>{t(titleKey)}</Title>
      <Description>{t(descriptionKey)}</Description>
      {variant === 'empty' ? (
        <Can resource="exercises" action="CREATE">
          <Actions>
            <PrimaryButton type="button" onClick={onCreateExercise}>
              <Plus size={16} />
              {t('exercises.createExercise')}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={onBulkUpload}>
              <Upload size={16} />
              {t('exercises.bulkCsv')}
            </SecondaryButton>
          </Actions>
        </Can>
      ) : null}
      {variant === 'no-results' ? (
        <SecondaryButton type="button" onClick={onClearSearch}>
          {t('exercises.clearSearch')}
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
