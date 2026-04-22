import { Save } from 'lucide-react';
import styled from 'styled-components';

type RoutineToolbarProps = {
  title: string;
  onTitleChange: (value: string) => void;
  durationLabel: string;
  intensityLabel: string;
};

/**
 * Top toolbar of the routine builder. Editable routine title with meta + actions.
 */
export function RoutineToolbar({
  title,
  onTitleChange,
  durationLabel,
  intensityLabel,
}: RoutineToolbarProps) {
  return (
    <Container>
      <TitleBlock>
        <TitleInput
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          aria-label="Routine title"
        />
        <Meta>
          Duration Est: {durationLabel} • Intensity: {intensityLabel}
        </Meta>
      </TitleBlock>
      <Actions>
        <SecondaryButton type="button">
          <Save size={16} />
          Save Draft
        </SecondaryButton>
        <PrimaryButton type="button">Finish Routine</PrimaryButton>
      </Actions>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

const TitleInput = styled.input`
  background: transparent;
  border: none;
  padding: 0;
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

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 0.65rem;
  background-color: #26283d;
  color: #e0e0fc;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: #313349;
  }
`;

const PrimaryButton = styled.button`
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
`;
