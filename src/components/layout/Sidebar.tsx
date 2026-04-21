import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useAuth } from '../../context/AuthContext';

const sidebarAvatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVhTZTQVSKL8LO2LXVza3rOWI7d5QrS29HjJpE-J5w17WQHW1HJ3-xbA-c9j40-hv7dnzcTxXpYuUZ1hdBQ9fkDj_Y-nPHeH_Yczg5bD5iHw-L8ubpwa4OMSkn6dZqYT58i0Shkorlkreq94ag75Ju5HUCYeeSpmvFSVBFxnTYrh-GBc9uEDx2nxj70GQBih76MQj5mIGyYZLMtcTW6yb19Q5HZizrMRRviUl85SWUi2lVTZD1JCZpRZgO-Qgvkzw7UpCjNToFFUM';

type LucideSvgIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

interface SidebarLinkConfig {
  to: string;
  label: string;
  icon: LucideSvgIcon;
}

const navLinks: SidebarLinkConfig[] = [
  { to: '/dashboard', label: 'DASHBOARD', icon: LayoutGrid },
  { to: '/workouts', label: 'WORKOUTS', icon: Dumbbell },
  { to: '/analytics', label: 'ANALYTICS', icon: BarChart3 },
  { to: '/settings', label: 'SETTINGS', icon: Settings },
];

/**
 * Persistent left rail (large screens only). Hosts the KINETIC wordmark,
 * the athlete identity block, primary navigation, and a sign-out control.
 */
export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = (user?.username ?? 'Athlete').toUpperCase();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-10 w-72 bg-surface-container-low z-50">
      <div className="px-8">
        <h1 className="text-3xl font-black text-kinetic-red mb-12 font-headline italic tracking-tighter">
          KINETIC
        </h1>

        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest">
            <img
              alt=""
              className="w-full h-full object-cover"
              src={sidebarAvatarUrl}
            />
          </div>
          <div>
            <p className="font-headline font-bold text-primary tracking-tight">
              {displayName}
            </p>
            <p className="text-[10px] font-label font-bold text-on-surface-variant/60 tracking-[0.1em] uppercase">
              ELITE STATUS
            </p>
            <p className="text-[9px] text-primary font-bold mt-0.5 tracking-[0.1em]">
              7 DAY STREAK
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-container text-background font-bold rounded-r-full py-4 px-8 flex items-center gap-4 transition-all'
                  : 'text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white'
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={isActive ? 'size-6 shrink-0 text-background' : 'size-6 shrink-0'}
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden
                  />
                  <span className="font-headline tracking-tight">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-auto mx-8 mb-2 text-on-surface-variant/60 py-3 px-4 flex items-center gap-3 hover:text-on-surface-variant hover:translate-x-1 transition-all rounded-lg"
      >
        <LogOut className="size-5 shrink-0" strokeWidth={2} aria-hidden />
        <span className="font-label text-xs uppercase tracking-[0.1em]">Sign Out</span>
      </button>
    </aside>
  );
}
