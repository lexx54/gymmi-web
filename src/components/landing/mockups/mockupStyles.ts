import styled, { css } from 'styled-components';

/** Colors copied from the real web (`Sidebar`, gym pages) and mobile (`theme/kinetic.ts`) apps. */
export const MOCK = {
  screen: '#101225',
  card: '#1b1c2b',
  cardLow: '#181a2e',
  cardHigh: '#313349',
  sidebar: '#0f1220',
  red: '#ef233c',
  coral: '#ff4f5e',
  pink: '#ffb3b1',
  text: '#e0e0fc',
  white: '#f7f7ff',
  muted: '#94a3b8',
  faint: '#7c84aa',
  green: '#34d399',
  amber: '#f7c873',
  sky: '#38bdf8',
  gold: '#fbbf24',
} as const;

/** Picks the Spanish or English variant of demo data. */
export const pickLang = (language: string, value: { en: string; es: string }) =>
  language.startsWith('es') ? value.es : value.en;

export const PhoneFrame = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  padding: 1.1rem 0.9rem 1rem;
  border-radius: 2.25rem;
  border: 6px solid #23263d;
  background: ${MOCK.screen};
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.7);
  color: ${MOCK.white};
  font-family: Inter, system-ui, sans-serif;
  user-select: none;
`;

export const WebFrame = styled.div`
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #141830;
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.7);
  color: ${MOCK.text};
  font-family: Inter, system-ui, sans-serif;
`;

export const WebTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: ${MOCK.sidebar};
`;

export const WebTitle = styled.span`
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: ${MOCK.white};
`;

export const WebBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem 1.1rem 1.15rem;
`;

export const Panel = styled.div`
  border-radius: 0.85rem;
  background: ${MOCK.cardLow};
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.85rem;
`;

export const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: ${MOCK.white};
`;

export const CountBadge = styled.span`
  min-width: 1.25rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: ${MOCK.red};
  color: #fff;
  font-size: 0.65rem;
  text-align: center;
`;

export const Pill = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $color }) => $color ?? MOCK.pink};
  background: ${({ $color }) => `${$color ?? MOCK.pink}1f`};
  border: 1px solid ${({ $color }) => `${$color ?? MOCK.pink}40`};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0;
  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const Avatar = styled.span<{ $color?: string }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: ${({ $color }) => $color ?? MOCK.cardHigh};
  color: ${MOCK.white};
  font-size: 0.7rem;
  font-weight: 800;
`;

export const Meta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

export const Name = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${MOCK.white};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Sub = styled.span`
  font-size: 0.68rem;
  color: ${MOCK.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const buttonBase = css`
  border: none;
  border-radius: 0.55rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease, filter 0.15s ease;
  &:hover {
    filter: brightness(1.12);
  }
  &:active {
    transform: scale(0.97);
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${MOCK.red};
  color: #fff;
`;

export const GhostButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: ${MOCK.muted};
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const LinkButton = styled.button`
  ${buttonBase};
  padding: 0;
  background: none;
  color: ${MOCK.pink};
  font-weight: 700;
`;

export const ProgressTrack = styled.div`
  height: 0.45rem;
  border-radius: 999px;
  background: ${MOCK.cardHigh};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number; $color?: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $color }) => $color ?? MOCK.red};
  border-radius: inherit;
  transition: width 0.4s ease;
`;
