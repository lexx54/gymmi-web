import styled from 'styled-components';

export const SettingsPageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

export const SettingsMain = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2.5rem;
  position: relative;
  overflow-y: auto;
`;

export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
`;

export const SettingsPageTitle = styled.h1`
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f5f6ff;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

export const CardSurface = styled.section`
  border-radius: 1.4rem;
  border: 1px solid rgba(126, 136, 175, 0.14);
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  padding: 1.5rem 1.6rem;
`;

export const SectionLabel = styled.p`
  margin: 0 0 0.4rem;
  color: #9096b6;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 600;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #f5f6ff;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
