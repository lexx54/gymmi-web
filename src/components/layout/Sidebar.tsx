import { LayoutDashboard, Dumbbell, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

type SidebarProps = {
  username: string;
};

interface SidebarItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', to: '/dashboard', icon: Dumbbell },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/dashboard', icon: Settings },
];

/**
 * Displays the main dashboard navigation sidebar.
 */
export function Sidebar({ username }: SidebarProps) {
  return (
    <SidebarAside>
      <SidebarBrand>KINETIC</SidebarBrand>
      <ProfileCard>
        <Avatar />
        <ProfileText>
          <Username>{username.toUpperCase().slice(0, 6)}</Username>
          <EliteStatus>ELITE STATUS</EliteStatus>
          <Streak>7 DAY STREAK</Streak>
        </ProfileText>
      </ProfileCard>
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
  width: 15.5rem;
  flex-shrink: 0;
  border-right: 1px solid #181d33;
  background-color: #0f1220;
  padding: 2rem 1.25rem;
  color: #e2e8f0;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const SidebarBrand = styled.p`
  font-size: 2rem;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.03em;
  color: #ef233c;
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.4rem;
`;

const Avatar = styled.div`
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.7rem;
  background: linear-gradient(180deg, #2c3357 0%, #1b203d 100%);
  border: 1px solid #303a63;
`;

const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Username = styled.p`
  margin: 0;
  color: #f7f7ff;
  font-size: 1.05rem;
  font-weight: 700;
`;

const EliteStatus = styled.p`
  margin: 0;
  color: #c0c5e4;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Streak = styled.p`
  margin: 0;
  color: #f49aa6;
  font-size: 0.58rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  font-weight: 700;
`;

const SidebarNav = styled.nav`
  margin-top: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.8rem;
  padding: 0.92rem 0.9rem;
  font-size: 1.3rem;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
  color: #cfd4ef;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: #1b2138;
    color: #ffffff;
  }

  &.active {
    background: linear-gradient(180deg, #ff9da8 0%, #ef233c 100%);
    color: #2a0911;
    font-weight: 700;
  }
`;
