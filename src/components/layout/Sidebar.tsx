import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const avatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVhTZTQVSKL8LO2LXVza3rOWI7d5QrS29HjJpE-J5w17WQHW1HJ3-xbA-c9j40-hv7dnzcTxXpYuUZ1hdBQ9fkDj_Y-nPHeH_Yczg5bD5iHw-L8ubpwa4OMSkn6dZqYT58i0Shkorlkreq94ag75Ju5HUCYeeSpmvFSVBFxnTYrh-GBc9uEDx2nxj70GQBih76MQj5mIGyYZLMtcTW6yb19Q5HZizrMRRviUl85SWUi2lVTZD1JCZpRZgO-Qgvkzw7UpCjNToFFUM';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = (user?.username ?? 'Athlete').toUpperCase();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-gradient-to-r from-primary to-primary-container text-background font-bold rounded-r-full py-4 px-8 flex items-center gap-4 transition-all'
      : 'text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white';

  const iconClass = (isActive: boolean) =>
    isActive ? 'size-6 shrink-0 text-background' : 'size-6 shrink-0';

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-10 w-72 bg-surface-container-low border-r border-outline-variant/15 z-50">
      <div className="px-8">
        <h1 className="text-3xl font-black text-[#ef233c] mb-12 font-headline italic tracking-tighter">
          KINETIC
        </h1>
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest">
            <img
              alt=""
              className="w-full h-full object-cover"
              src={avatarUrl}
            />
          </div>
          <div>
            <p className="font-headline font-bold text-primary tracking-tight">
              {displayName}
            </p>
            <p className="text-[10px] font-label font-bold text-on-surface-variant/60 tracking-[0.1em] uppercase">
              ELITE STATUS
            </p>
            <p className="text-[9px] text-primary font-bold mt-0.5">7 DAY STREAK</p>
          </div>
        </div>
        <nav className="space-y-2">
          <NavLink to="/dashboard" className={linkClass} end>
            {({ isActive }) => (
              <>
                <LayoutGrid className={iconClass(isActive)} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                <span className="font-headline tracking-tight">DASHBOARD</span>
              </>
            )}
          </NavLink>
          <a
            className="text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white"
            href="#"
          >
            <Dumbbell className="size-6 shrink-0" />
            <span className="font-headline tracking-tight">WORKOUTS</span>
          </a>
          <a
            className="text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white"
            href="#"
          >
            <BarChart3 className="size-6 shrink-0" />
            <span className="font-headline tracking-tight">ANALYTICS</span>
          </a>
          <a
            className="text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white"
            href="#"
          >
            <Settings className="size-6 shrink-0" />
            <span className="font-headline tracking-tight">SETTINGS</span>
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left text-on-surface-variant py-4 px-8 flex items-center gap-4 hover:translate-x-2 transition-transform hover:text-white"
          >
            <LogOut className="size-6 shrink-0" />
            <span className="font-headline tracking-tight">SIGN OUT</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
