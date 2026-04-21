import { Play } from 'lucide-react';
import styled from 'styled-components';

/**
 * Floating primary action for starting a workout.
 */
export function StartWorkoutButton() {
  return (
    <Button type="button">
      <Play size={14} fill="currentColor" />
      Start Workout
    </Button>
  );
}

const Button = styled.button`
  position: absolute;
  right: 2.5rem;
  bottom: 2.4rem;
  border: none;
  border-radius: 1rem;
  background: linear-gradient(180deg, #ff97a2 0%, #ef233c 100%);
  color: #22070f;
  font-size: 1.05rem;
  text-transform: uppercase;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 1rem 1.35rem;
  cursor: pointer;
  box-shadow: 0 14px 32px rgba(239, 35, 60, 0.35);
`;
