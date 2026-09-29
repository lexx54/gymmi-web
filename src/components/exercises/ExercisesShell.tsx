import styled from 'styled-components';

/**
 * Outer page shell matching the standardized layout shell.
 */
export const ExercisesPageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

/**
 * Vertical main column with standardized 1.4rem 2rem 2.5rem padding.
 */
export const ExercisesMain = styled.main`
  flex: 1;
  min-width: 0;
  padding: 1.4rem 2rem 2.5rem;
  position: relative;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

/**
 * Standardized content area below the TopBar.
 */
export const ExercisesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
  width: 100%;
  min-width: 0;
`;
