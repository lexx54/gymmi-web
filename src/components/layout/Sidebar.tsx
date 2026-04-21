import { LayoutDashboard, Dumbbell, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface SidebarItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', to: '/dashboard', icon: Dumbbell },
  { label: 'Analytics', to: '/dashboard', icon: BarChart3 },
  { label: 'Settings', to: '/dashboard', icon: Settings },
];

/**
 * Displays the main dashboard navigation sidebar.
 */
export function Sidebar() {
  return (
    <SidebarAside>
      <SidebarBrand>GYMMI</SidebarBrand>
      <SidebarNav aria-label="Dashboard navigation">
        <NavList>
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <NavItemLink to={item.to} end>
                  <Icon size={16} aria-hidden />
                  <span>{item.label}</span>
                </NavItemLink>
              </li>
            );
          })}
        </NavList>
      </SidebarNav>
    </SidebarAside>
  );
}

const SidebarAside = styled.aside`
  display: none;
  width: 16rem;
  flex-shrink: 0;
  border-right: 1px solid #1f2937;
  background-color: #0f1220;
  padding: 1.5rem;
  color: #e2e8f0;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const SidebarBrand = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #ffffff;
`;

const SidebarNav = styled.nav`
  margin-top: 2.5rem;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: #cbd5e1;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: #1e293b;
    color: #ffffff;
  }

  &.active {
    background-color: #ef233c;
    color: #ffffff;
  }
`;
