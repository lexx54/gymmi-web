import { Play } from 'lucide-react';
import styled from 'styled-components';

/**
 * Floating round play button for starting the routine.
 */
export function StartFab() {
  return (
    <Fab type="button" aria-label="Start routine">
      <Play size={22} fill="currentColor" />
    </Fab>
  );
}

const Fab = styled.button`
  position: fixed;
  bottom: 2.25rem;
  right: 2.25rem;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #5b000d;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 22px 48px -12px rgba(255, 83, 90, 0.55);
  transition: transform 150ms ease;
  z-index: 50;

  &:hover {
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.92);
  }
`;
