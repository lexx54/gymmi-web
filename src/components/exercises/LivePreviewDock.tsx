import { Eye, Monitor, Smartphone } from 'lucide-react';
import styled from 'styled-components';

/**
 * Floating glass dock that summarizes the live preview state.
 */
export function LivePreviewDock() {
  return (
    <Dock aria-label="Live preview controls">
      <StatusCluster>
        <EyeBadge>
          <Eye size={18} />
        </EyeBadge>
        <StatusText>
          <Title>Live Preview</Title>
          <Subtitle>Last saved: Just now</Subtitle>
        </StatusText>
      </StatusCluster>
      <Divider aria-hidden />
      <ViewportButton type="button" aria-label="Preview on mobile">
        <Smartphone size={18} />
      </ViewportButton>
      <ViewportButton type="button" aria-label="Preview on desktop">
        <Monitor size={18} />
      </ViewportButton>
    </Dock>
  );
}

const Dock = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.85rem 1rem;
  background-color: rgba(49, 51, 73, 0.6);
  backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  box-shadow: 0 18px 40px -14px rgba(10, 12, 32, 0.45);
`;

const StatusCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EyeBadge = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.55rem;
  background-color: #26283d;
  color: #ffb3b1;
  display: grid;
  place-items: center;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const Title = styled.p`
  margin: 0;
  color: #e0e0fc;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.68rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.62rem;
`;

const Divider = styled.span`
  width: 1px;
  height: 2.25rem;
  background-color: rgba(93, 63, 62, 0.3);
`;

const ViewportButton = styled.button`
  border: none;
  background: transparent;
  color: #e7bdbb;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: #ffb3b1;
  }
`;
