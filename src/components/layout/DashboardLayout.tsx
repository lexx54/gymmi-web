import styled from 'styled-components';
import { Sidebar } from './Sidebar';

/**
 * Renders the dashboard shell with a left sidebar and blank content panel.
 */
export function DashboardLayout() {
  return (
    <LayoutShell>
      <Sidebar />
      <MainPanel />
    </LayoutShell>
  );
}

const LayoutShell = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0b1020;
  color: #ffffff;
`;

const MainPanel = styled.main`
  flex: 1;
`;
