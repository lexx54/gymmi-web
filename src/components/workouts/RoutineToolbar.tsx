import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type RoutineToolbarProps = {
  title: string;
  onTitleChange: (value: string) => void;
  durationLabel: string;
  intensityLabel: string;
  onSave: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
};

/**
 * Top toolbar of the routine builder. Editable routine title with meta + actions.
 */
export function RoutineToolbar({
  title,
  onTitleChange,
  durationLabel,
  intensityLabel,
  onSave,
  isSaving,
  readOnly,
}: RoutineToolbarProps) {
  const { t } = useTranslation();

  return (
    <Container>
      <TitleBlock>
        <TitleInput
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={t('workouts.routineTitlePlaceholder')}
          aria-label={t('workouts.routineTitle')}
          disabled={readOnly}
        />
        <Meta>{t('workouts.durationEst', { duration: durationLabel, intensity: intensityLabel })}</Meta>
      </TitleBlock>
      {!readOnly && <Actions>
        <PrimaryButton type="button" onClick={onSave} disabled={isSaving}>
          <Save size={16} />
          {isSaving ? t('common.saving') : t('workouts.saveRoutine')}
        </PrimaryButton>
      </Actions>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

const TitleInput = styled.input`
  background: #181a2e;
  border: 1px solid rgba(231, 189, 187, 0.15);
  border-radius: 0.85rem;
  padding: 0.5rem 0.85rem;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-style: italic;
  font-weight: 800;
  font-size: 1.55rem;
  color: #e0e0fc;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  outline: none;
  width: 100%;
  max-width: 28rem;
  transition: border-color 150ms ease;

  &::placeholder {
    color: rgba(231, 189, 187, 0.7);
    font-weight: 700;
    text-transform: none;
  }

  &:hover:not(:disabled) {
    border-color: rgba(231, 189, 187, 0.3);
  }

  &:focus {
    border-color: #ffb3b1;
  }

  &:disabled {
    background: transparent;
    border-color: transparent;
    padding-left: 0;
    padding-right: 0;
  }
`;

const Meta = styled.p`
  margin: 0;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.85rem;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #5b000d;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 32px -10px rgba(255, 83, 90, 0.45);
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;
