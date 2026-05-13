import styled from 'styled-components';
import { Can } from '../Can';

type BuilderPageHeaderProps = {
  onDiscard: () => void;
  onPublish: () => void;
};

/**
 * Asymmetric page header for the exercise builder:
 * editorial headline on the left, primary actions on the right.
 */
export function BuilderPageHeader({ onDiscard, onPublish }: BuilderPageHeaderProps) {
  return (
    <HeaderRoot>
      <Copy>
        <Eyebrow>New Entry</Eyebrow>
        <Headline>
          Define Your <Accent>Kinetic</Accent> Edge
        </Headline>
      </Copy>
      <Actions>
        <SecondaryButton type="button" onClick={onDiscard}>
          Discard Draft
        </SecondaryButton>
        <Can resource="exercises" action="CREATE">
          <PrimaryButton type="button" onClick={onPublish}>
            Publish Exercise
          </PrimaryButton>
        </Can>
      </Actions>
    </HeaderRoot>
  );
}

const HeaderRoot = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  gap: 1.5rem;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const Copy = styled.div`
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Eyebrow = styled.span`
  display: block;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.72rem;
  font-weight: 700;
`;

const Headline = styled.h2`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-weight: 800;
  font-size: 3rem;
  line-height: 1.05;
  color: #e0e0fc;
`;

const Accent = styled.em`
  color: #ff535a;
  font-style: italic;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const SecondaryButton = styled.button`
  padding: 0.95rem 1.75rem;
  border: none;
  border-radius: 0.65rem;
  background-color: #181a2e;
  color: #e7bdbb;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: #1c1e32;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.95rem 2.25rem;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-shadow: 0 22px 48px -14px rgba(255, 83, 90, 0.55);
  transition: transform 150ms ease;

  &:hover {
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;
