import styled from 'styled-components';

/**
 * Footer bar with system state message and save/discard action buttons.
 */
export function SettingsFooter() {
  return (
    <FooterBar>
      <SystemState>System state: All local changes encrypted.</SystemState>
      <Actions>
        <DiscardButton type="button">DISCARD CHANGES</DiscardButton>
        <SaveButton type="button">SAVE CONFIGURATION</SaveButton>
      </Actions>
    </FooterBar>
  );
}

const FooterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SystemState = styled.span`
  color: #9096b6;
  font-size: 0.75rem;
  font-style: italic;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DiscardButton = styled.button`
  padding: 0.7rem 1.4rem;
  border-radius: 0.6rem;
  border: none;
  background: transparent;
  color: #9096b6;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: #f5f6ff;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.6rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #1a0a0c;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.9;
  }
`;
