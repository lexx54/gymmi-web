import { Settings } from 'lucide-react';
import styled from 'styled-components';
import { CardSurface, SectionTitle } from './SettingsShell';

/**
 * Data management and connected services section with last sync indicator.
 */
export function DataManagementCard() {
  return (
    <Wrapper>
      <HeaderRow>
        <SectionTitle>
          <Settings size={18} color="#ffb3b1" /> Data Management &amp; Connected
          Services
        </SectionTitle>
        <SyncBadge>LAST SYNC: 2M AGO</SyncBadge>
      </HeaderRow>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SyncBadge = styled.span`
  padding: 0.35rem 0.85rem;
  border-radius: 0.4rem;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff535a;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;
