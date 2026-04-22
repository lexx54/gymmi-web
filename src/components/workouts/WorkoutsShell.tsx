import styled from 'styled-components';

/**
 * Outer page shell for the workouts route. Holds the sidebar + main column.
 */
export const WorkoutsPageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #101225;
  color: #e0e0fc;
`;

/**
 * Vertical main column for the workouts builder.
 */
export const WorkoutsMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

/**
 * Two-column workspace area beneath the page header.
 */
export const WorkoutsBuilderGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2rem 2.5rem;
`;

/**
 * Left pane container (exercise library card surface).
 */
export const LibraryPane = styled.section`
  background-color: #181a2e;
  border-radius: 1rem;
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  min-height: 0;
`;

/**
 * Right pane container (active routine builder column).
 */
export const RoutinePane = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`;
