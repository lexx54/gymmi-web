import { LayoutDashboard, Dumbbell, BarChart3, NotebookPen, Settings, LogOut, Shield, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

type SidebarProps = {
  username: string;
};

interface SidebarItem {
  labelKey: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const sidebarItems: SidebarItem[] = [
  { labelKey: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.workouts', to: '/workout', icon: Dumbbell },
  { labelKey: 'nav.exercises', to: '/exercises', icon: NotebookPen },
  { labelKey: 'nav.analytics', to: '/analytics', icon: BarChart3 },
  { labelKey: 'nav.settings', to: '/settings', icon: Settings },
];

/**
 * Displays the main dashboard navigation sidebar.
 */
const adminItems: SidebarItem[] = [
  { labelKey: 'nav.permissions', to: '/admin/permissions', icon: Shield },
  { labelKey: 'nav.users', to: '/admin/users', icon: Users },
];

export function Sidebar({ username }: SidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAdmin = user?.role?.name === 'Admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <SidebarAside>
      <SidebarBrand>KINETIC</SidebarBrand>
      <ProfileCard>
        <Avatar />
        <ProfileText>
          <Username>{username.toUpperCase().slice(0, 6)}</Username>
          <EliteStatus>{user?.role?.name?.toUpperCase() ?? t('common.member')}</EliteStatus>
          <Streak>{t('nav.streak')}</Streak>
        </ProfileText>
      </ProfileCard>
      <SidebarNav aria-label={t('nav.dashboardNavigation')}>
        <NavList>
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.labelKey}>
                <NavItemLink to={item.to} end>
                  <Icon size={16} aria-hidden />
                  <span>{t(item.labelKey)}</span>
                </NavItemLink>
              </li>
            );
          })}
        </NavList>
        {isAdmin && (
          <>
            <AdminDivider />
            <AdminLabel>{t('common.admin')}</AdminLabel>
            <NavList>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.labelKey}>
                    <NavItemLink to={item.to} end>
                      <Icon size={16} aria-hidden />
                      <span>{t(item.labelKey)}</span>
                    </NavItemLink>
                  </li>
                );
              })}
            </NavList>
          </>
        )}
      </SidebarNav>
      <SignOutButton type="button" onClick={handleSignOut}>
        <LogOut size={16} aria-hidden />
        <span>{t('nav.signOut')}</span>
      </SignOutButton>
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

const AdminDivider = styled.hr`
  border: none;
  border-top: 1px solid #262840;
  margin: 1.25rem 0 0.5rem;
`;

const AdminLabel = styled.p`
  margin: 0 0 0.5rem;
  padding-left: 0.9rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.58rem;
  font-weight: 700;
`;

const SignOutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  border: none;
  border-radius: 0.8rem;
  padding: 0.92rem 0.9rem;
  font-size: 1.3rem;
  font-weight: 500;
  text-transform: uppercase;
  background: transparent;
  color: #cfd4ef;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: rgba(239, 35, 60, 0.12);
    color: #ff535a;
  }
`;
