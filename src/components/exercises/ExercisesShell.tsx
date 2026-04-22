import styled from 'styled-components';

/**
 * Outer page shell for the exercises routes. Holds the sidebar + main column.
 */
export const ExercisesPageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #101225;
  color: #e0e0fc;
`;

/**
 * Vertical main column for exercises pages (sits right of the sidebar).
 */
export const ExercisesMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

/**
 * Centered content area below the sticky header.
 */
export const ExercisesContent = styled.div`
  padding: 2.25rem 2.5rem 3rem;
  max-width: 80rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;
